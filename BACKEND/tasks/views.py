from django.db.models import Q
from rest_framework import viewsets, permissions, status, response
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied 

from .models import Task, TaskRolePermission, AtelierViewPermission
from .serializers import (
    TaskSerializer, TaskCreateUpdateSerializer,  
    TaskRolePermissionSerializer, AtelierViewPermissionSerializer
)
from customuser.models import Role, Atelier, Commission
from customuser.serializers import CommissionSerializer


def _user_roles(user):
    if hasattr(user, 'roles'):
        return list(user.roles.all())
    if getattr(user, 'role_id', None):
        try:
            return [Role.objects.get(pk=user.role_id)]
        except Role.DoesNotExist:
            return []
    return []


def _role_perms(user):
    roles = _user_roles(user)
    qs = TaskRolePermission.objects.filter(role__in=roles)
    return {
        'can_view': qs.filter(can_view=True).exists(),
        'can_create': qs.filter(can_create=True).exists(),
        'can_update': qs.filter(can_update=True).exists(),
        'can_archive': qs.filter(can_archive=True).exists(),
    }


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.select_related('commission', 'created_by').prefetch_related('ateliers')
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return TaskCreateUpdateSerializer
        return TaskSerializer

    def get_queryset(self):
        u = self.request.user
        perms = _role_perms(u)
        qs = super().get_queryset().filter(active=True)

        filt = Q(created_by=u)

        user_atelier_id = getattr(u, 'atelier_id', None)
        if user_atelier_id:
            filt |= Q(ateliers__id=user_atelier_id)

        extra_ids = list(AtelierViewPermission.objects.filter(user=u).values_list('atelier_id', flat=True))
        if extra_ids:
            filt |= Q(ateliers__id__in=extra_ids)

        if not perms.get('can_view', False):
            qs = qs.filter(created_by=u)
        else:
            qs = qs.filter(filt)

        p = self.request.query_params
        if 'status' in p:
            qs = qs.filter(status=p['status'])
        if 'priority' in p:
            qs = qs.filter(priority=p['priority'])
        if 'commission' in p:
            qs = qs.filter(commission_id=p['commission'])
        if 'ateliers' in p:
            ids = [x for x in p['ateliers'].split(',') if x.isdigit()]
            if ids:
                qs = qs.filter(ateliers__id__in=ids)
        q = p.get('q')
        if q:
            qs = qs.filter(Q(title__icontains=q) | Q(description__icontains=q))

        return qs.order_by('-created_at').distinct()

    def perform_create(self, serializer):
        perms = _role_perms(self.request.user)
        if not perms.get('can_create', False):
            raise PermissionDenied('Görev oluşturma yetkiniz yok.')  
        serializer.save(created_by=self.request.user)


    def update(self, request, *args, **kwargs):
        perms = _role_perms(request.user)
        if not perms.get('can_update', False):
            raise PermissionDenied('Görev güncelleme yetkiniz yok.')
        if 'active' in request.data and not perms.get('can_archive', False):
            raise PermissionDenied('Görevi pasife alma/aktifleştirme yetkiniz yok.')
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        perms = _role_perms(request.user)
        if not perms.get('can_update', False):
            raise PermissionDenied('Görev güncelleme yetkiniz yok.')
        if 'active' in request.data and not perms.get('can_archive', False):
            raise PermissionDenied('Görevi pasife alma/aktifleştirme yetkiniz yok.')
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if not _role_perms(request.user).get('can_archive', False):
            raise PermissionDenied('Görev pasife alma yetkiniz yok.')
        obj = self.get_object()
        if obj.active:
            obj.active = False
            obj.save(update_fields=['active'])
        return response.Response(status=status.HTTP_204_NO_CONTENT)


class TaskRolePermissionViewSet(viewsets.ModelViewSet):
    queryset = TaskRolePermission.objects.select_related('role').all()
    serializer_class = TaskRolePermissionSerializer
    permission_classes = [permissions.IsAdminUser]


class AtelierViewPermissionViewSet(viewsets.ModelViewSet):
    queryset = AtelierViewPermission.objects.select_related('user', 'atelier').all()
    serializer_class = AtelierViewPermissionSerializer
    permission_classes = [permissions.IsAdminUser]
