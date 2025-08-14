# customuser/signals.py
from django.db import transaction
from django.db.models.signals import post_migrate
from django.dispatch import receiver

from .models import (
    Role,
    HeardAboutUsOption,
    InstitutionTypeOption,
    SchoolCategoryOption,
    SchoolTypeOption,
    StatusOption
)

DEFAULT_ROLES = [
    {"code": "superadmin", "name": "Süper Yönetici", "level": 1},
    {"code": "admin", "name": "Yönetici", "level": 2},
    {"code": "commission", "name": "Komisyon", "level": 3},
    {"code": "provincial_responsible", "name": "İl Sorumlusu", "level": 4},
    {"code": "workshop_responsible", "name": "Atölye Sorumlusu", "level": 5},
    {"code": "instructor", "name": "Eğitmen", "level": 6},
    {"code": "mentor", "name": "Mentör", "level": 7},
    {"code": "scholar_em", "name": "Bursiyer (E&M)", "level": 8},
    {"code": "scholar_sengeleceksin", "name": "Bursiyer (Sen Geleceksin)", "level": 9},
    {"code": "scholar_yy", "name": "Bursiyer (Yükselen Yıldız)", "level": 10},
    {"code": "student", "name": "Öğrenci", "level": 11},
    {"code": "student_parent", "name": "Öğrenci Velisi", "level": 12},
]

DEFAULT_OPTIONS = {
    "heard_about_us": [
        "Sosyal Medya",
        "Arkadaş / Öneri",
        "Okul / Öğretmen",
        "Etkinlik / Seminer",
        "Web Sitesi",
        "Diğer",
    ],
    "institution_type": [
        "Okul",
        "Üniversite",
        "STK",
        "Kamu Kurumu",
        "Özel Sektör",
        "Diğer",
    ],
    "school_category": [
        "İlkokul",
        "Ortaokul",
        "Lise",
        "Üniversite",
    ],
    "school_type": [
        "Devlet",
        "Özel",
        "Vakıf",
    ],
}

DEFAULT_STATUS_OPTIONS = [
    "Aktif",
    "Pasif",
    "İzinli",
    "Mazaretli",
    "Devam Etmiyor",
]

def ensure_default_roles():
    """Role tablolarını tohumlar/günceller."""
    with transaction.atomic():
        for item in DEFAULT_ROLES:
            Role.objects.update_or_create(
                code=item["code"],
                defaults={
                    "name": item["name"],
                    "level": item["level"],
                    "is_builtin": True,
                    "is_active": True,
                },
            )

def ensure_default_options():
    """Opsiyon tablolarını tohumlar/günceller."""
    with transaction.atomic():
        for name in DEFAULT_OPTIONS["heard_about_us"]:
            HeardAboutUsOption.objects.update_or_create(
                name=name, defaults={"is_builtin": True, "is_active": True}
            )
        for name in DEFAULT_OPTIONS["institution_type"]:
            InstitutionTypeOption.objects.update_or_create(
                name=name, defaults={"is_builtin": True, "is_active": True}
            )
        for name in DEFAULT_OPTIONS["school_category"]:
            SchoolCategoryOption.objects.update_or_create(
                name=name, defaults={"is_builtin": True, "is_active": True}
            )
        for name in DEFAULT_OPTIONS["school_type"]:
            SchoolTypeOption.objects.update_or_create(
                name=name, defaults={"is_builtin": True, "is_active": True}
            )

def ensure_default_status_options():
    with transaction.atomic():
        for name in DEFAULT_STATUS_OPTIONS:
            StatusOption.objects.update_or_create(
                name=name, defaults={"is_builtin": True, "is_active": True}
            )

@receiver(post_migrate, dispatch_uid="customuser_seed_defaults_post_migrate")
def seed_defaults_after_migrate(sender, app_config, **kwargs):
    if getattr(app_config, "name", None) != "customuser":
        return
    ensure_default_roles()
    ensure_default_options()
    ensure_default_status_options()
