from .models import AnnouncementPermission, ExtraAtelierAccess

def get_user_announcement_perms(user):
    perms = dict(can_view=False, can_create=False, can_update=False, can_archive=False)
    if not user.is_authenticated:
        return perms
    if getattr(user, "is_superuser", False):
        return dict(can_view=True, can_create=True, can_update=True, can_archive=True)

    if hasattr(user, "roles"):
            role_ids = list(user.roles.values_list("id", flat=True))
    elif getattr(user, "role_id", None):  # FK
        role_ids = [user.role_id]
    else:
        role_ids = []
    qs = AnnouncementPermission.objects.filter(role_id__in=role_ids).distinct()
    for p in qs:
        perms["can_view"] = perms["can_view"] or p.can_view
        perms["can_create"] = perms["can_create"] or p.can_create
        perms["can_update"] = perms["can_update"] or p.can_update
        perms["can_archive"] = perms["can_archive"] or p.can_archive
    return perms


def get_visible_ateliers_for(user, own_ateliers_qs=None):

    ids = set()

    if own_ateliers_qs is not None:
        ids.update(own_ateliers_qs.values_list("id", flat=True))

    if getattr(user, "atelier_id", None):
               ids.add(user.atelier_id)
    extra = ExtraAtelierAccess.objects.filter(user=user, is_active=True).values_list("ateliers__id", flat=True)
    ids.update([i for i in extra if i is not None])
    return ids
