from rest_framework.permissions import BasePermission, SAFE_METHODS
from customuser.models import Role
from .models import TaskRolePermission


def user_roles(user):
    if hasattr(user, "roles"):
        return list(user.roles.all())
    if getattr(user, "role_id", None):
        try:
            return [Role.objects.get(pk=user.role_id)]
        except Role.DoesNotExist:
            return []
    return []


def role_perms(user):
    roles = user_roles(user)
    qs = TaskRolePermission.objects.filter(role__in=roles)
    return {
        "can_view": qs.filter(can_view=True).exists(),
        "can_create": qs.filter(can_create=True).exists(),
        "can_update": qs.filter(can_update=True).exists(),
        "can_archive": qs.filter(can_archive=True).exists(),
    }


class TaskAccessPermission(BasePermission):
    message = "Görev işlemi için yetkiniz yok."

    def has_permission(self, request, view):
        method = request.method.upper()
        if method in SAFE_METHODS:
            return True

        perms = role_perms(request.user)
        if method == "POST":
            return perms.get("can_create", False)
        if method in ("PUT", "PATCH"):
            return perms.get("can_update", False)
        if method == "DELETE":
            return perms.get("can_archive", False)
        return False