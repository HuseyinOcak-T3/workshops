from django.db.models import Q
from django.utils import timezone 
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Task, TaskRolePermission, AtelierViewPermission
from .serializers import (
    TaskSerializer,
    TaskRolePermissionSerializer,
    AtelierViewPermissionSerializer,
    TaskCreateUpdateSerializer,
)

from customuser.serializers import CommissionSerializer
from .permission import role_perms as _role_perms, TaskAccessPermission
from customuser.models import Atelier, Commission

class TaskViewSet(viewsets.ModelViewSet):
    queryset = (
        Task.objects.select_related("commission", "created_by", "completed_by")
        .prefetch_related("ateliers")
        .all()
    )
    permission_classes = [permissions.IsAuthenticated, TaskAccessPermission]

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return TaskCreateUpdateSerializer
        return TaskSerializer

    def get_queryset(self):
        u = self.request.user
        perms = _role_perms(u)
        qs = super().get_queryset().filter(active=True)

        filt = Q(created_by=u)

        user_atelier_id = getattr(u, "atelier_id", None)
        if user_atelier_id:
            filt |= Q(ateliers__id=user_atelier_id)

        extra_ids = list(
            AtelierViewPermission.objects.filter(user=u).values_list("atelier_id", flat=True)
        )
        if extra_ids:
            filt |= Q(ateliers__id__in=extra_ids)

        if not perms.get("can_view", False):
            qs = qs.filter(created_by=u)
        else:
            qs = qs.filter(filt)

        p = self.request.query_params
        if "status" in p:
            qs = qs.filter(status=p["status"])
        if "priority" in p:
            qs = qs.filter(priority=p["priority"])
        if "commission" in p:
            qs = qs.filter(commission_id=p["commission"])
        if "ateliers" in p:
            ids = [x for x in p["ateliers"].split(",") if x.isdigit()]
            if ids:
                qs = qs.filter(ateliers__id__in=ids)
        q = p.get("q")
        if q:
            qs = qs.filter(Q(title__icontains=q) | Q(description__icontains=q))

        return qs.order_by("-created_at").distinct()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        task = serializer.save(created_by=request.user)
        read_serializer = TaskSerializer(task, context={"request": request})
        return Response(read_serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        task = serializer.save()
        read_serializer = TaskSerializer(task, context={"request": request})
        return Response(read_serializer.data)

    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()
        obj.active = False
        obj.save(update_fields=["active"])
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(
        detail=True,
        methods=["post"],
        url_path="complete",
        permission_classes=[permissions.IsAuthenticated],
    )
    def complete(self, request, pk=None):
        task = self.get_object()
        u = request.user
        allowed = (task.created_by_id == u.id)

        user_atelier_id = getattr(u, "atelier_id", None)
        if not allowed and user_atelier_id:
            allowed = task.ateliers.filter(id=user_atelier_id).exists()

        if not allowed:
            extra_ok = AtelierViewPermission.objects.filter(
                user=u, atelier__in=task.ateliers.all()
            ).exists()
            if extra_ok:
                allowed = True

        if not allowed:
            return Response({"detail": "Bu görevi tamamlama yetkiniz yok."}, status=403)

        if str(task.status).lower() in ("done", "completed", "tamamlandi", "tamamlandı"):
            ser = TaskSerializer(task, context={"request": request})
            return Response(ser.data, status=200)

        task.status = "done"
        task.completed_by = u
        task.completed_at = timezone.now()
        task.save(update_fields=["status", "completed_by", "completed_at", "updated_at"])

        ser = TaskSerializer(task, context={"request": request})
        return Response(ser.data, status=200)

class CommissionViewSet(viewsets.ModelViewSet):
    queryset = Commission.objects.all().order_by("name")
    serializer_class = CommissionSerializer
    permission_classes = [permissions.IsAdminUser]

class TaskRolePermissionViewSet(viewsets.ModelViewSet):
    queryset = TaskRolePermission.objects.select_related("role").all()
    serializer_class = TaskRolePermissionSerializer
    permission_classes = [permissions.IsAdminUser]

class AtelierViewPermissionViewSet(viewsets.ModelViewSet):
    queryset = AtelierViewPermission.objects.select_related("user", "atelier").all()
    serializer_class = AtelierViewPermissionSerializer
    permission_classes = [permissions.IsAdminUser]
