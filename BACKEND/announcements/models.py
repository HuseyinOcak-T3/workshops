from django.db import models
from django.urls import reverse
from django.utils.text import slugify
from django.utils import timezone
from django.conf import settings
from ckeditor.fields import RichTextField

TURKISH_MAP = str.maketrans("çğıöşüÇĞİÖŞÜ", "cgiosuCGIOSU")


class AnnouncementPermission(models.Model):
    role = models.ForeignKey('customuser.Role', on_delete=models.CASCADE, related_name='announcements_permissions', verbose_name="Rol")
    can_view = models.BooleanField(default=True, verbose_name="Görüntüleyebilir")
    can_create = models.BooleanField(default=False, verbose_name="Oluşturabilir")
    can_update = models.BooleanField(default=False, verbose_name="Güncelleyebilir")
    can_archive = models.BooleanField(default=False, verbose_name="Arşivleyebilir/Silebilir")
    can_view_stats = models.BooleanField(default=False, verbose_name="İstatistikleri Görüntüleyebilir")

    class Meta:
        verbose_name = "Duyuru İzin Kuralı"
        verbose_name_plural = "Duyuru İzin Kuralları"
        constraints = [
            models.UniqueConstraint(fields=['role'], name='uq_announcement_permission_role')
        ]

    def __str__(self) -> str:
        return f'{self.role} İzinleri'


class ExtraAtelierAccess(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="extra_atelier_accesses", verbose_name="Kullanıcı"
    )
    ateliers = models.ManyToManyField(
        "customuser.Atelier", related_name="extra_access_users", verbose_name="Yetkili Olduğu Ek Atölyeler"
    )
    is_active = models.BooleanField(default=True, verbose_name="Aktif")
    note = models.CharField(max_length=200, blank=True, null=True, verbose_name="Not")
    created_at = models.DateTimeField(default=timezone.now, verbose_name="Oluşturulma Zamanı")
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="+", verbose_name="Oluşturan", editable=False
    )

    class Meta:
        verbose_name = "Ek Atölye Yetkisi"
        verbose_name_plural = "Ek Atölye Yetkileri"
        indexes = [models.Index(fields=["user", "is_active"])]

    def __str__(self):
        return f"{self.user} için {self.ateliers.count()} ek atölye yetkisi"


class AnnouncementManager(models.Manager):
    def active(self):
        return self.get_queryset().filter(is_active=True, is_archived=False)

    def archived(self):
        return self.get_queryset().filter(is_archived=True)

class Announcement(models.Model):
    class Priority(models.TextChoices):
        LOW = "low", "Düşük"
        MEDIUM = "medium", "Orta"
        HIGH = "high", "Yüksek"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="announcements",
        on_delete=models.PROTECT,
        verbose_name="Oluşturan",
        editable=True,
        blank=True,
        null=True,
    )

    title = models.CharField(max_length=125, verbose_name="Başlık")
    text = RichTextField(verbose_name="Metin")

    ateliers = models.ManyToManyField(
        "customuser.Atelier",
        related_name="announcements",
        blank=True,
        verbose_name="Atölyeler",
    )
    commission = models.ForeignKey(
        'customuser.Commission',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="announcements",
        verbose_name="Komisyon",
    )

    is_active = models.BooleanField(default=True, verbose_name="Aktif mi?")
    is_archived = models.BooleanField(default=False, verbose_name="Arşivlendi mi?")
    priority = models.CharField(
        max_length=10,
        choices=Priority.choices,
        default=Priority.MEDIUM,
        verbose_name="Öncelik",
    )

    private_note_title = models.CharField(
        max_length=150, blank=True, null=True, verbose_name="Özel Not Başlığı"
    )
    private_note_body = models.TextField(
        blank=True, null=True, verbose_name="Özel Not İçeriği"
    )

    publication_date = models.DateTimeField(
        verbose_name="Yayınlanma Tarihi", default=timezone.now, blank=True, null=True
    )
    created_at = models.DateTimeField(
        verbose_name="Oluşturulma Zamanı", auto_now_add=True, editable=False
    )
    updated_at = models.DateTimeField(
        verbose_name="Güncellenme Zamanı", auto_now=True, blank=True, null=True
    )
    slug = models.SlugField(unique=True, editable=True, max_length=130, verbose_name="URL Uzantısı")

    objects = AnnouncementManager()

    class Meta:
        verbose_name = "Duyuru"
        verbose_name_plural = "Duyurular"
        ordering = ['publication_date']
        permissions = (
            ("deactivate_announcement", "Duyuruyu pasife alma izni"),
        )

        indexes = [
            models.Index(fields=['publication_date']),
        ]

    def __str__(self):
        return self.title

    def get_unique_slug(self):
        base = (self.title or "duyuru").translate(TURKISH_MAP)
        slug_base = slugify(base)
        max_len = self._meta.get_field("slug").max_length
        unique_slug = slug_base[: max_len - 5] or "duyuru"
        counter = 1
        while Announcement.objects.filter(slug=unique_slug).exclude(pk=self.pk).exists():
            unique_slug = f"{slug_base}-{counter}"[:max_len]
            counter += 1
        return unique_slug

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self.get_unique_slug()
        super().save(*args, **kwargs)


class AnnouncementRead(models.Model):
    announcement = models.ForeignKey(
        Announcement, on_delete=models.CASCADE, related_name="reads", verbose_name="Duyuru"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="announcement_reads", verbose_name="Kullanıcı"
    )
    is_read = models.BooleanField(default=True, verbose_name="Okundu mu?")
    read_at = models.DateTimeField(default=timezone.now, verbose_name="Okunma Zamanı")

    class Meta:
        verbose_name = "Duyuru Okunma Kaydı"
        verbose_name_plural = "Duyuru Okunma Kayıtları"
        ordering = ['-read_at']
        constraints = [
            models.UniqueConstraint(
                fields=["announcement", "user"], name="uniq_read_ann_user"
            )
        ]
        indexes = [
            models.Index(fields=["user", "announcement"]),
            models.Index(fields=["announcement", "is_read"]),
        ]

    def __str__(self):
        status = 'okundu' if self.is_read else 'okunmadı'
        return f"{self.user} - {self.announcement.title} - {status}"
