from django.db.models import Q
from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Task, TaskRolePermission
from .serializers import (
    TaskSerializer,
    TaskRolePermissionSerializer,
    TaskCreateUpdateSerializer,
)
from customuser.serializers import CommissionSerializer
from .permission import role_perms as _role_perms, TaskAccessPermission
from customuser.models import Atelier, Commission


class TaskViewSet(viewsets.ModelViewSet):
    queryset = (
        Task.objects.select_related("commission", "created_by", "completed_by")
        .prefetch_related("atelier", "assignments__atelier")
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
            filt |= Q(assignments__atelier_id=user_atelier_id)

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
        if "atelier" in p:
            ids = [x for x in p["atelier"].split(",") if x.isdigit()]
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
        methods=["patch"],
        url_path="status",
        permission_classes=[permissions.IsAuthenticated],
    )
    def update_status(self, request, pk=None):
        task = self.get_object()
        u = request.user
        user_atelier_id = getattr(u, "atelier_id", None)
        if not user_atelier_id:
            return Response({"detail": "Atölye bilgisi bulunamadı."}, status=403)

        try:
            ta = task.assignments.get(atelier_id=user_atelier_id)
        except Exception:
            return Response({"detail": "Bu görevin durumunu güncelleme yetkiniz yok."}, status=403)

        new_status = (request.data or {}).get("status")
        if not new_status:
            return Response({"detail": "status zorunludur."}, status=400)

        if getattr(Task, "STATUS_CHOICES", None):
            allowed = {k for k, _ in Task.STATUS_CHOICES}
            if new_status not in allowed:
                return Response(
                    {"detail": f"Geçersiz status. İzin verilenler: {sorted(list(allowed))}"},
                    status=400,
                )

        ta.status = new_status
        if str(new_status).lower() in {"done", "completed", "tamamlandi", "tamamlandı"}:
            ta.completed_by = u
            ta.completed_at = timezone.now()
        ta.save()

        others_pending = task.assignments.exclude(
            status__in=["done", "completed", "tamamlandi", "tamamlandı"]
        ).exists()
        if not others_pending:
            task.status = new_status
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
