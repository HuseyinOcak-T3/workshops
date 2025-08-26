# BACKEND/tasks/permissions.py

from .models import TaskRolePermission
from customuser.models import Role

def get_user_task_perms(user):
    perms = {
        'can_view': False,
        'can_create': False,
        'can_update': False,
        'can_archive': False,
    }
    if not user.is_authenticated:
        return perms
    if getattr(user, "is_superuser", False):
        return {key: True for key in perms}

    # --- GÜNCELLENEN KISIM ---
    user_role = getattr(user, "role", None)
    if not user_role:
        return perms

    try:
        permission = TaskRolePermission.objects.get(role=user_role)
        perms['can_view'] = permission.can_view
        perms['can_create'] = permission.can_create
        perms['can_update'] = permission.can_update
        perms['can_archive'] = permission.can_archive
    except TaskRolePermission.DoesNotExist:
        pass

    return perms