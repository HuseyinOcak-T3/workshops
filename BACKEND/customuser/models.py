from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.db import models
from django.utils.translation import gettext_lazy as _

class Title(models.Model):
    name = models.CharField("Ünvan", max_length=120, unique=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Ünvan"
        verbose_name_plural = "Ünvanlar"
        ordering = ["name"]

    def __str__(self):
        return self.name

class City(models.Model):
    name = models.CharField("Şehir", max_length=100, unique=True)

    class Meta:
        verbose_name = "Şehir"
        verbose_name_plural = "Şehirler"
        ordering = ["name"]

    def __str__(self):
        return self.name

class Atelier(models.Model):
    name = models.CharField("Atölye Adı", max_length=150)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="ateliers")
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Atölye"
        verbose_name_plural = "Atölyeler"
        unique_together = ("name", "city")
        ordering = ["city__name", "name"]

    def __str__(self):
        return f"{self.name} — {self.city.name}"

def user_profile_upload_path(instance, filename):
    return f"profile_pics/{instance.username}/{filename}"

ROLE_LEVELS = {
    "superadmin": 1,
    "admin": 2,
    "commission": 3,
    "il_koordinatoru": 4,
    "workshop_responsible": 5,
    "instructor": 6,
    "mentor": 7,
    "student": 8,
}
ROLE_CHOICES = [(k, k.replace("_", " ").title()) for k in ROLE_LEVELS.keys()]


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)

    permission_level = models.PositiveSmallIntegerField(
        default=8, help_text="8=En düşük, 1=En yüksek yetki"
    )

    role = models.CharField("Rol", max_length=32, choices=ROLE_CHOICES, default="student")

    first_name = models.CharField("Ad", max_length=150, blank=True)
    last_name = models.CharField("Soyad", max_length=150, blank=True)

    title = models.ForeignKey(Title, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Ünvan")

    phone = models.CharField("Telefon", max_length=20, blank=True, null=True, unique=True)

    tc_no = models.CharField(
        "T.C. Kimlik No", max_length=11, blank=True, null=True, unique=True,
        help_text="11 hane, opsiyonel",
        validators=[RegexValidator(r"^\d{11}$", message="T.C. Kimlik No 11 haneli olmalıdır.")],
    )

    birth_date = models.DateField("Doğum Tarihi", blank=True, null=True)
    profile_picture = models.ImageField(upload_to=user_profile_upload_path, blank=True, null=True, verbose_name="Profil Foto")

    bio = models.TextField("Hakkında", blank=True, null=True)
    expertise = models.TextField("Uzmanlıklar", blank=True, null=True, help_text="Virgülle ayırın")

    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)

    atelier_city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Atölye Şehri")
    atelier = models.ForeignKey(Atelier, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Atölye")

    is_online = models.BooleanField(default=False)
    last_active = models.DateTimeField(blank=True, null=True)
    unread_notifications = models.PositiveIntegerField(default=0)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def clean(self):
        super().clean()
        if self.atelier and self.atelier_city and self.atelier.city_id != self.atelier_city_id:
            raise ValidationError({
                "atelier": _("Seçilen atölye, seçili şehir ile eşleşmiyor."),
                "atelier_city": _("Seçilen şehir, atölyenin şehri ile eşleşmiyor."),
            })

    def save(self, *args, **kwargs):
        mapped = ROLE_LEVELS.get(self.role)
        if mapped and self.permission_level != mapped:
            self.permission_level = mapped
        if self.atelier and not self.atelier_city_id:
            self.atelier_city = self.atelier.city
        super().save(*args, **kwargs)

    def __str__(self):
        label = f"{self.first_name} {self.last_name}".strip() or self.username
        t = self.title.name if self.title else self.get_role_display()
        return f"{label} — {t}"

    @property
    def is_admin_like(self):
        return self.permission_level <= 2
