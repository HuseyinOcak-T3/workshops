from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

def user_profile_upload_path(instance, filename):
    return f"profile_pics/{instance.username}/{filename}"

class CustomUser(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "admin", _("Admin")
        SUPERUSER = "superuser", _("Superuser")
        USER = "user", _("User")
        INSTRUCTOR = "instructor", _("Instructor")
        MEMBER = "member", _("Member")




    role = models.CharField(
        _("Rol"),
        max_length=20,
        choices=Role.choices,
        default=Role.USER
    )

    phone = models.CharField(max_length=20, blank=True, null=True, unique=True)
    birth_date = models.DateField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to=user_profile_upload_path, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(unique=True)
    atelier_name = models.CharField(max_length=150, blank=True, null=True)
    atelier_city = models.CharField(max_length=100, blank=True, null=True)
    google_sheet_id = models.CharField(max_length=255, blank=True, null=True)
    is_online = models.BooleanField(default=False)
    last_active = models.DateTimeField(blank=True, null=True)
    unread_notifications = models.PositiveIntegerField(default=0)
    linkedin = models.URLField(blank=True, null=True)
    github = models.URLField(blank=True, null=True)
    twitter = models.URLField(blank=True, null=True)
    expertise = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.username} - {self.role}"
