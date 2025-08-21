from django.contrib import admin
from django.conf import settings
from django.utils import timezone
from .models import Announcement, AnnouncementRead, AnnouncementArchive, AnnouncementPermission, ExtraAtelierAccess
from customuser.models import Commission
from django.urls import reverse
from django.utils.html import format_html, format_html_join

@admin.register(AnnouncementPermission)
class AnnouncementPermissionAdmin(admin.ModelAdmin):
    list_display = ("id", "role", "can_view", "can_create", "can_update", "can_archive")
    list_filter = ("can_view", "can_create", "can_update", "can_archive", "role")
    autocomplete_fields = ("role",)


@admin.register(ExtraAtelierAccess)
class ExtraAtelierAccessAdmin(admin.ModelAdmin):
    list_display = ("user_name_with_role", "user_email_link", "is_active", "created_at", "created_by_link")
    list_filter = ("is_active",)
    filter_horizontal = ("ateliers",)

    search_fields = (
        "user__username", "user__first_name", "user__last_name", "user__email",
        "created_by__username", "created_by__first_name", "created_by__last_name", "created_by__email",
    )
    autocomplete_fields = ("user",)
    readonly_fields = ("created_by",)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # performans: user ve rol'ünü tek sorguda çek
        return qs.select_related("user", "created_by").prefetch_related("user__role")

    @admin.display(description="Kullanıcı / Rol", ordering="user__last_name")
    def user_name_with_role(self, obj):
        if not obj.user:
            return "-"
        full = f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username or obj.user.email
        role = getattr(obj.user, "role", None)
        role_label = getattr(role, "name", None) or getattr(role, "code", None) or "-"
        return f"{full} - {role_label}"

    @admin.display(description="Kullanıcı E-posta")
    def user_email_link(self, obj):
        if obj.user:
            url = reverse("admin:customuser_customuser_change", args=[obj.user_id])
            label = obj.user.email or obj.user.username
            return format_html('<a href="{}">{}</a>', url, label)
        return "-"

    @admin.display(description="Oluşturan")
    def created_by_link(self, obj):
        if obj.created_by_id:
            url = reverse("admin:customuser_customuser_change", args=[obj.created_by_id])
            label = (obj.created_by.get_full_name() or obj.created_by.username or obj.created_by.email)
            return format_html('<a href="{}">{}</a>', url, label)
        return "-"

    def save_model(self, request, obj, form, change):
        if not obj.pk and not obj.created_by:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


class AnnouncementReadInline(admin.TabularInline):
    model = AnnouncementRead
    extra = 0
    readonly_fields = ("read_at",)
    autocomplete_fields = ("user",)
    can_delete = True


class AnnouncementArchiveInline(admin.TabularInline):
    model = AnnouncementArchive
    extra = 0
    readonly_fields = ("archived_at",)
    autocomplete_fields = ("user",)
    can_delete = True


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "commission",
        "priority",
        "is_active",
        "is_archived",
        "publication_date",
        "created_at",
        "updated_at",
        "user",
    )
    list_filter = (
        "commission",
        "priority",
        "is_active",
        "is_archived",
        "ateliers",
    )
    search_fields = ("title", "text", "private_note_title", "private_note_body")
    filter_horizontal = ("ateliers",)
    date_hierarchy = "publication_date"
    inlines = [AnnouncementReadInline, AnnouncementArchiveInline]

    fieldsets = (
        ("Temel Bilgiler", {
            "fields": ("title", "text", "priority")
        }),
        ("İlişkiler", {
            "fields": ("ateliers", "commission")
        }),
        ("Durum (Global)", {
            "fields": ("is_active", "is_archived")
        }),
        ("Özel Not", {
            "fields": ("private_note_title", "private_note_body")
        }),
        ("Tarihler", {
            "fields": ("publication_date", "created_at", "updated_at")
        }),
        ("URL ve Sahiplik", {
            "fields": ("slug", "user")
        }),
    )

    readonly_fields = ("slug", "updated_at")

    def save_model(self, request, obj, form, change):
        if not obj.user_id:
            obj.user = request.user
        if not obj.publication_date:
            obj.publication_date = timezone.now()
        if not obj.created_at:
            obj.created_at = timezone.now()
        super().save_model(request, obj, form, change)


@admin.register(AnnouncementRead)
class AnnouncementReadAdmin(admin.ModelAdmin):
    list_display = ("announcement", "user", "is_read", "read_at")
    list_filter = ("is_read", "announcement")
    search_fields = (
        "announcement__title",
        "user__username",
        "user__first_name",
        "user__last_name",
        "user__email",
    )
    autocomplete_fields = ("announcement", "user")
    date_hierarchy = "read_at"


@admin.register(AnnouncementArchive)
class AnnouncementArchiveAdmin(admin.ModelAdmin):
    list_display = ("announcement", "user", "is_archived", "archived_at")
    list_filter = ("is_archived", "announcement")
    search_fields = (
        "announcement__title",
        "user__username",
        "user__first_name",
        "user__last_name",
        "user__email",
    )
    autocomplete_fields = ("announcement", "user")
    date_hierarchy = "archived_at"
