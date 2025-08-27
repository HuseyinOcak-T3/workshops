from .models import AnnouncementPermission, ExtraAtelierAccess
from customuser.models import Atelier

def get_user_announcement_perms(user):
    perms = dict(can_view=False, can_create=False, can_update=False, can_archive=False, can_view_stats=False)
    if not user.is_authenticated:
        return perms

    user_role = getattr(user, "role", None)
    if not user_role:
        return perms

    try:
        permission = AnnouncementPermission.objects.get(role=user_role)
        perms["can_view"] = permission.can_view
        perms["can_create"] = permission.can_create
        perms["can_update"] = permission.can_update
        perms["can_archive"] = permission.can_archive
        perms["can_view_stats"] = permission.can_view_stats
    except AnnouncementPermission.DoesNotExist:
        pass

    return perms


def get_visible_ateliers_for(user, own_ateliers_qs=None):

    ids = set()

    responsible_for_qs = Atelier.objects.filter(responsible=user, is_active=True)
    ids.update(responsible_for_qs.values_list("id", flat=True))

    extra_access_ids = ExtraAtelierAccess.objects.filter(user=user, is_active=True).values_list("ateliers__id", flat=True)
    ids.update(i for i in extra_access_ids if i is not None)

    return ids
