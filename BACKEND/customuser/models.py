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
    address = models.CharField("Konum", max_length=250, blank=True, null=True)
    phone = models.CharField("Telefon", max_length=15, blank=True, null=True, unique=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    description = models.TextField("Açıklama", blank=True, null=True)
    responsible = models.ForeignKey(
        "customuser.CustomUser",
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="responsible_ateliers",
        verbose_name="Sorumlu",
        limit_choices_to={"role__code": "workshop_responsible"},
    )
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

class Role(models.Model):
    code = models.SlugField("Kod", max_length=50, unique=True,
                            help_text="Örn: superadmin, admin, instructor, student")
    name = models.CharField("Ad", max_length=100)
    level = models.PositiveSmallIntegerField("Seviye", help_text="1=En yüksek, 99=En düşük")
    is_builtin = models.BooleanField("Yerleşik", default=False)
    is_active = models.BooleanField("Aktif", default=True)

    class Meta:
        verbose_name = "Rol"
        verbose_name_plural = "Roller"
        ordering = ["level", "name"]

    def __str__(self):
        return f"{self.name} (lvl {self.level})"

class Gender(models.TextChoices):
    MALE = "male", "Erkek"
    FEMALE = "female", "Kadın"
    NA = "na", "Belirtmek İstemiyorum"


class EducationLevel(models.TextChoices):
    PRIMARY = "primary", "İlkokul"
    MIDDLE = "middle", "Ortaokul"
    HIGH = "high", "Lise"
    ASSOC = "associate", "Ön Lisans"
    BACHELOR = "bachelor", "Lisans"
    MASTER = "master", "Yüksek Lisans"
    PHD = "phd", "Doktora"
    OTHER = "other", "Diğer"

# === Opsiyon modelleri ===
class HeardAboutUsOption(models.Model):
    name = models.CharField("Ad", max_length=120, unique=True)
    is_builtin = models.BooleanField("Yerleşik", default=False)
    is_active = models.BooleanField("Aktif", default=True)

    class Meta:
        verbose_name = "Kaynak (Bizden Nasıl Haberdar)"
        verbose_name_plural = "Kaynaklar (Bizden Nasıl Haberdar)"
        ordering = ["name"]

    def __str__(self): return self.name


class InstitutionTypeOption(models.Model):
    name = models.CharField("Ad", max_length=120, unique=True)
    is_builtin = models.BooleanField("Yerleşik", default=False)
    is_active = models.BooleanField("Aktif", default=True)

    class Meta:
        verbose_name = "Kurum Tipi"
        verbose_name_plural = "Kurum Tipleri"
        ordering = ["name"]

    def __str__(self): return self.name


class SchoolCategoryOption(models.Model):
    name = models.CharField("Ad", max_length=120, unique=True)
    is_builtin = models.BooleanField("Yerleşik", default=False)
    is_active = models.BooleanField("Aktif", default=True)

    class Meta:
        verbose_name = "Okul Türü (Kategori)"
        verbose_name_plural = "Okul Türleri (Kategori)"
        ordering = ["name"]

    def __str__(self): return self.name


class SchoolTypeOption(models.Model):
    name = models.CharField("Ad", max_length=120, unique=True)
    is_builtin = models.BooleanField("Yerleşik", default=False)
    is_active = models.BooleanField("Aktif", default=True)

    class Meta:
        verbose_name = "Okul Tipi"
        verbose_name_plural = "Okul Tipleri"
        ordering = ["name"]

    def __str__(self): return self.name

class StatusOption(models.Model):
    name = models.CharField("Ad", max_length=50, unique=True)
    is_builtin = models.BooleanField("Yerleşik", default=False)
    is_active = models.BooleanField("Aktif", default=True)

    class Meta:
        verbose_name = "Aktiflik Durumu"
        verbose_name_plural = "Aktiflik Durumları"
        ordering = ["name"]

    def __str__(self): return self.name

class StudentParent(models.Model):
    student = models.ForeignKey(
        "customuser.CustomUser",
        on_delete=models.CASCADE,
        related_name="parent_links",
        verbose_name="Öğrenci",
        limit_choices_to={"role__code": "student"},
    )
    parents = models.ManyToManyField(
        "customuser.CustomUser",
        related_name="ward_links",
        verbose_name="Veliler",
        limit_choices_to={"role__code": "student_parent"},
        blank=True,
    )

    class Meta:
        verbose_name = "Öğrenci - Veli İlişkisi"
        verbose_name_plural = "Öğrenci - Veli İlişkileri"
        constraints = [
            models.UniqueConstraint(fields=["student"], name="unique_student_in_parent_link")
        ]

    def __str__(self):
        return f"{self.student} velileri"

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)

    permission_level = models.PositiveSmallIntegerField(
        default=99, help_text="1=En yüksek yetki"
    )

    role = models.ForeignKey(
        Role,
        on_delete=models.PROTECT,
        null=True, blank=True,
        related_name="users",
        verbose_name="Rol",
    )
    status = models.ForeignKey(
        "customuser.StatusOption",
        on_delete=models.SET_NULL, null=True, blank=True,
        verbose_name="Aktiflik Durumu",
    )

    first_name = models.CharField("Ad", max_length=150, blank=True)
    last_name = models.CharField("Soyad", max_length=150, blank=True)

    title = models.ForeignKey(Title, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Ünvan")

    phone = models.CharField("Telefon", max_length=20, blank=True, null=True, unique=True)

    tc_no = models.CharField(
        "T.C. Kimlik No", max_length=11, blank=True, null=True, unique=True,
        help_text="11 hane, opsiyonel",
        validators=[RegexValidator(r"^\d{11}$", message="T.C. Kimlik No 11 haneli olmalıdır.")],
    )
    gender = models.CharField("Cinsiyet", max_length=10, choices=Gender.choices, blank=True, null=True)

    birth_date = models.DateField("Doğum Tarihi", blank=True, null=True)
    profile_picture = models.ImageField(upload_to=user_profile_upload_path, blank=True, null=True, verbose_name="Profil Foto")

    bio = models.TextField("Hakkında", blank=True, null=True)
    expertise = models.TextField("Uzmanlıklar", blank=True, null=True, help_text="Virgülle ayırın")

    address = models.TextField("Adres", blank=True, null=True)
    district = models.CharField("İlçe", max_length=100, blank=True, null=True)

    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)

    nationality = models.CharField("Uyruk", max_length=100, blank=True, null=True)
    passport_number = models.CharField(
        "Pasaport Numarası", max_length=20, blank=True, null=True,
        help_text="Sadece harf/rakam",
        validators=[
            RegexValidator(r"^[A-Za-z0-9]{5,20}$", message="Pasaport numarası 5-20 karakter, harf/rakam olmalıdır.")],
    )

    atelier_city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Atölye Şehri")
    atelier = models.ForeignKey(Atelier, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Atölye")

    education_level = models.CharField("Eğitim Seviyesi", max_length=20, choices=EducationLevel.choices, blank=True,
                                       null=True)
    school_name = models.CharField("Okul", max_length=200, blank=True, null=True)
    faculty_institute = models.CharField("Fakülte / Enstitü", max_length=200, blank=True, null=True)
    department = models.CharField("Bölüm", max_length=200, blank=True, null=True)
    classroom = models.CharField("Sınıf", max_length=50, blank=True, null=True, help_text="Örn: 10, 3. sınıf, 1. sınıf")
    expected_graduation_date = models.DateField("Beklenen Mezuniyet Tarihi", blank=True, null=True)
    is_graduate = models.BooleanField(
        "Mezunum",
        default=False,
        help_text="Mezun seviyesindeysen, en son tamamlanan eğitim bilgilerini beyan et."
    )

    last_completed_education_level = models.CharField(
        "En Son Tamamlanan Eğitim Seviyesi", max_length=20, choices=EducationLevel.choices, blank=True, null=True
    )
    last_completed_school = models.CharField("En Son Tamamlanan Okul", max_length=200, blank=True, null=True)
    last_completed_faculty_institute = models.CharField("En Son Tamamlanan Fakülte / Enstitü", max_length=200,
                                                        blank=True, null=True)
    last_completed_department = models.CharField("En Son Tamamlanan Bölüm", max_length=200, blank=True, null=True)
    last_completed_graduation_date = models.DateField("En Son Tamamlanan Mezuniyet Tarihi", blank=True, null=True)

    has_disability = models.BooleanField("Engeli Var Mı?", default=False)
    disability_description = models.TextField("Engel Açıklaması", blank=True, null=True)

    heard_about_us = models.ForeignKey(
        "customuser.HeardAboutUsOption",
        on_delete=models.SET_NULL, null=True, blank=True,
        verbose_name="Bizden Nasıl Haberdar Oldunuz?"
    )
    current_institution_type = models.ForeignKey(
        "customuser.InstitutionTypeOption",
        on_delete=models.SET_NULL, null=True, blank=True,
        verbose_name="İçerisinde Bulunduğunuz Kurum Tipi"
    )
    school_category = models.ForeignKey(
        "customuser.SchoolCategoryOption",
        on_delete=models.SET_NULL, null=True, blank=True,
        verbose_name="Okul Türü"
    )
    school_type = models.ForeignKey(
        "customuser.SchoolTypeOption",
        on_delete=models.SET_NULL, null=True, blank=True,
        verbose_name="Okul Tipi"
    )
    profession = models.CharField("Meslek", max_length=120, blank=True, null=True)
    current_institution_name = models.CharField("İçerisinde Bulunduğunuz Kurum Adı", max_length=200, blank=True,
                                                null=True)
    continuing_institution = models.CharField("Devam Ettiği Kurum", max_length=200, blank=True, null=True)


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

        if self.has_disability and not (self.disability_description or "").strip():
            raise ValidationError({"disability_description": _("Engel açıklaması zorunludur.")})

        if self.is_graduate:
            if not any([
                self.last_completed_education_level,
                self.last_completed_school,
                self.last_completed_faculty_institute,
                self.last_completed_department,
                self.last_completed_graduation_date,
            ]):
                raise ValidationError({
                    "is_graduate": _("Mezun olarak işaretlendi. En az bir 'En Son Tamamlanan ...' alanı doldurulmalıdır.")
                })


    def save(self, *args, **kwargs):
        if self.role is None:
            from .models import Role
            self.role = Role.objects.filter(code="student", is_active=True).first()
        if self.role and self.permission_level != self.role.level:
            self.permission_level = self.role.level

        if self.atelier and not self.atelier_city_id:
            self.atelier_city = self.atelier.city
        super().save(*args, **kwargs)

    def __str__(self):
        label = f"{self.first_name} {self.last_name}".strip() or self.username
        t = self.title.name if self.title else (self.role.name if self.role else "Rol yok")
        return f"{label} — {t}"

    @property
    def is_admin_like(self):
        return self.permission_level <= 2
