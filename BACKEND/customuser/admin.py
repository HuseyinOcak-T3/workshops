from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.safestring import mark_safe

from .models import CustomUser, Title, City, Atelier


@admin.register(Title)
class TitleAdmin(admin.ModelAdmin):
    list_display = ("name", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name",)
    ordering = ("name",)


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
    ordering = ("name",)


@admin.register(Atelier)
class AtelierAdmin(admin.ModelAdmin):
    list_display = ("name", "city", "is_active")
    list_filter = ("is_active", "city")
    search_fields = ("name", "city__name")
    ordering = ("city__name", "name")


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser

    # Liste görünümü
    list_display = (
        "thumb", "email", "username",
        "first_name", "last_name",
        "role", "permission_level",
        "title", "atelier_city", "atelier",
        "phone", "city", "country",
        "is_online", "unread_notifications",
        "is_staff", "is_active",
        "last_login", "date_joined",
    )
    list_filter = (
        "role", "permission_level",
        "title", "atelier_city", "atelier",
        "is_staff", "is_active", "is_superuser",
        "is_online",
        "city", "country",
        "date_joined", "last_login",
    )
    search_fields = (
        "email", "username",
        "first_name", "last_name",
        "phone", "tc_no",
        "city", "country",
    )
    ordering = ("-date_joined",)
    list_select_related = ("title", "atelier_city", "atelier")

    readonly_fields = ("thumb", "last_login", "date_joined", "last_active", "unread_notifications")

    fieldsets = (
        (None, {"fields": ("email", "username", "password")}),
        ("Kişisel Bilgiler", {
            "fields": (
                "first_name", "last_name",
                "role", "permission_level", "title",
                "tc_no", "phone", "birth_date",
                "profile_picture", "thumb",
                "bio", "expertise",
                "city", "country",
                "atelier_city", "atelier",
                "is_online", "last_active", "unread_notifications",
            )
        }),
        ("İzinler", {"fields": ("is_staff", "is_active", "is_superuser", "groups", "user_permissions")}),
        ("Önemli Tarihler", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "username", "password1", "password2", "role", "is_staff", "is_active")
        }),
    )

    def thumb(self, obj):
        if obj.profile_picture:
            return mark_safe(
                f'<img src="{obj.profile_picture.url}" style="height:40px;width:40px;object-fit:cover;border-radius:4px;" />'
            )
        return "—"
    thumb.short_description = "Foto"
