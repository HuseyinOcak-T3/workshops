from django.db.models import Q
from rest_framework import viewsets, permissions, decorators, response, status
from .models import Task
from .serializers import TaskSerializer
from customuser.models import Atelier

class IsCreatorOrAssignee(permissions.BasePermission):
    def has_object_permission(self, request, view, obj: Task):
        u = request.user
        if u.is_superuser or u.is_staff or getattr(u, "permission_level", 99) <= 2:
            return True
        if obj.created_by_id == u.id or obj.assigned_to_id == u.id:
            return True
        user_atelier_id = getattr(u, 'atelier_id', None)
        if user_atelier_id and obj.ateliers.filter(id=user_atelier_id).exists():
            return True
        if obj.for_all_ateliers:
            return True
        return False

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.select_related('assigned_to','created_by').prefetch_related('ateliers')
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsCreatorOrAssignee]

    def get_queryset(self):
        qs = super().get_queryset()
        u = self.request.user
        admin = u.is_superuser or u.is_staff or getattr(u, "permission_level", 99) <= 2
        if not admin:
            filt = Q(created_by=u) | Q(assigned_to=u) | Q(for_all_ateliers=True)
            user_atelier_id = getattr(u, 'atelier_id', None)
            if user_atelier_id:
                filt |= Q(ateliers__id=user_atelier_id)
            qs = qs.filter(filt).distinct()
        return self._apply_filters(qs)

    def _apply_filters(self, qs):
        p = self.request.query_params
        if 'status' in p: qs = qs.filter(status=p['status'])
        if 'assigned_to' in p: qs = qs.filter(assigned_to_id=p['assigned_to'])
        if 'ateliers' in p:
            ids = [i for i in p['ateliers'].split(',') if i.isdigit()]
            if ids: qs = qs.filter(ateliers__id__in=ids)
        if p.get('for_all_ateliers') in ('1','true','True'):
            qs = qs.filter(for_all_ateliers=True)
        q = p.get('q')
        if q: qs = qs.filter(Q(title__icontains=q) | Q(description__icontains=q))
        return qs.order_by('-created_at').distinct()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @decorators.action(detail=True, methods=['post'], url_path='assign-ateliers')
    def assign_ateliers(self, request, pk=None):
        ids = request.data.get('atelier_ids') or []
        mode = (request.data.get('mode') or 'replace').lower()
        task = self.get_object()
        qs = Atelier.objects.filter(id__in=ids)

        if mode == 'replace':
            task.ateliers.set(qs)
        elif mode == 'add':
            task.ateliers.add(*qs)
        elif mode == 'remove':
            task.ateliers.remove(*qs)
        else:
            return response.Response({'detail':'invalid mode'}, status=status.HTTP_400_BAD_REQUEST)

        if 'for_all_ateliers' in request.data:
            task.for_all_ateliers = bool(request.data.get('for_all_ateliers'))
            task.save(update_fields=['for_all_ateliers'])

        return response.Response(self.get_serializer(task).data)

    @decorators.action(detail=True, methods=['post'], url_path='assign-all-ateliers')
    def assign_all_ateliers(self, request, pk=None):
        task = self.get_object()
        val = bool(request.data.get('value', True))
        task.for_all_ateliers = val
        task.save(update_fields=['for_all_ateliers'])
        return response.Response(self.get_serializer(task).data)
