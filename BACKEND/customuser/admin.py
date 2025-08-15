from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.safestring import mark_safe
from django.utils.html import format_html, format_html_join
from django.urls import reverse
from django.utils.html import format_html, format_html_join
from django.urls import reverse

from .models import CustomUser, Title, City, Atelier, Role, HeardAboutUsOption, InstitutionTypeOption, SchoolTypeOption, StatusOption, StudentParent, NationalityOption

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "level", "is_builtin", "is_active")
    list_filter = ("is_builtin", "is_active")
    search_fields = ("name", "code")
    ordering = ("level", "name")
    readonly_fields = ("is_builtin",)

    def has_delete_permission(self, request, obj=None):
        if obj and obj.is_builtin:
            return False
        return super().has_delete_permission(request, obj)

@admin.register(HeardAboutUsOption)
class HeardAboutUsOptionAdmin(admin.ModelAdmin):
    list_display = ("name", "is_builtin", "is_active")
    list_filter = ("is_builtin", "is_active")
    search_fields = ("name",)
    readonly_fields = ("is_builtin",)
    def has_delete_permission(self, request, obj=None):
        if obj and obj.is_builtin: return False
        return super().has_delete_permission(request, obj)

@admin.register(InstitutionTypeOption)
class InstitutionTypeOptionAdmin(admin.ModelAdmin):
    list_display = ("name", "is_builtin", "is_active")
    list_filter = ("is_builtin", "is_active")
    search_fields = ("name",)
    readonly_fields = ("is_builtin",)
    def has_delete_permission(self, request, obj=None):
        if obj and obj.is_builtin: return False
        return super().has_delete_permission(request, obj)

@admin.register(NationalityOption)
class NationalityOptionAdmin(admin.ModelAdmin):
    list_display = ("name", "is_builtin", "is_active")
    list_filter = ("is_builtin", "is_active")
    search_fields = ("name",)
    readonly_fields = ("is_builtin",)
    def has_delete_permission(self, request, obj=None):
        if obj and obj.is_builtin: return False
        return super().has_delete_permission(request, obj)

@admin.register(SchoolTypeOption)
class SchoolTypeOptionAdmin(admin.ModelAdmin):
    list_display = ("name", "is_builtin", "is_active")
    list_filter = ("is_builtin", "is_active")
    search_fields = ("name",)
    readonly_fields = ("is_builtin",)
    def has_delete_permission(self, request, obj=None):
        if obj and obj.is_builtin: return False
        return super().has_delete_permission(request, obj)

@admin.register(StatusOption)
class StatusOptionAdmin(admin.ModelAdmin):
    list_display = ("name", "is_builtin", "is_active")
    list_filter = ("is_builtin", "is_active")
    search_fields = ("name",)
    readonly_fields = ("is_builtin",)
    def has_delete_permission(self, request, obj=None):
        if obj and obj.is_builtin:
            return False
        return super().has_delete_permission(request, obj)

@admin.register(StudentParent)
class StudentParentAdmin(admin.ModelAdmin):
    list_display = ("student_full_name", "student_email_link", "get_parents_links")
    search_fields = (
        "student__first_name", "student__last_name", "student__email",
        "parents__first_name", "parents__last_name", "parents__email"
    )
    filter_horizontal = ("parents",)
    autocomplete_fields = ["student", "parents"]

    @admin.display(description="Öğrenci")
    def student_full_name(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}"

    @admin.display(description="Öğrenci E-posta")
    def student_email_link(self, obj):
        if obj.student:
            url = reverse("admin:customuser_customuser_change", args=[obj.student.id])
            return format_html('<a href="{}">{}</a>', url, obj.student.email)
        return "-"

    @admin.display(description="Veliler")
    def get_parents_links(self, obj):
        parents = obj.parents.all()
        if parents.exists():
            return format_html_join(
                ', ',
                '<a href="{}">{}</a>',
                (
                    (
                        reverse("admin:customuser_customuser_change", args=[p.id]),
                        f"{p.first_name} {p.last_name}"
                    )
                    for p in parents
                )
            )
        return "-"

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
    list_display = ("name", "city", "responsible", "is_active")
    list_filter = ("is_active", "city")
    search_fields = ("name", "city__name", "responsible__first_name",
                     "responsible__last_name", "responsible__email")
    ordering = ("city__name", "name")

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser

    list_display = (
        "email", "username",
        "first_name", "last_name",
        "role", "permission_level",
        "title", "atelier_city", "atelier",
        "city", "country", "district", "nationality",
        "education_level", "is_graduate", "has_disability",
        "heard_about_us", "current_institution_type",
        "school_type",
        "is_online", "unread_notifications",
        "is_staff", "is_active",
        "last_login", "date_joined", "status",
    )
    list_filter = (
        "role", "permission_level",
        "title", "atelier_city", "atelier",
        "is_staff", "is_active", "is_superuser",
        "is_online",
        "gender", "education_level", "last_completed_education_level",
        "is_graduate", "has_disability",
        "heard_about_us", "current_institution_type",
        "school_type",
        "city", "country",
        "date_joined", "last_login",
    )
    search_fields = (
        "email", "username",
        "first_name", "last_name",
        "phone", "tc_no",
        "city", "country", "district",
        "nationality", "passport_number",
        "school_name", "faculty_institute", "department",
        "profession", "current_institution_name", "continuing_institution",
    )
    ordering = ("-date_joined",)
    list_select_related = (
        "title", "atelier_city", "atelier",
        "role", "heard_about_us", "current_institution_type",
        "school_type",
    )

    readonly_fields = ("last_login", "date_joined", "last_active", "unread_notifications", "permission_level")

    fieldsets = (
        (None, {"fields": ("email", "username", "password", "role", "permission_level", "status")}),
        ("Kişisel Bilgiler", {
            "fields": (
                "first_name", "last_name",
                "gender", "nationality", "phone", "title",
                "tc_no", "passport_number", "birth_date",
                "profile_picture",
                "bio", "expertise",
            )
        }),
        ("Adres", {
            "fields": (
                 "country", "city", "district", "address",
            )
        }),
        ("Atölye", {"fields": ("atelier_city", "atelier")}),
        ("Eğitim (Şu anki)", {
            "fields": (
                "education_level", "school_name", "faculty_institute",
                "department", "classroom", "expected_graduation_date",
                "is_graduate",
            )
        }),
        ("Eğitim (En Son Tamamlanan)", {
            "fields": (
                "last_completed_education_level", "last_completed_school",
                "last_completed_faculty_institute", "last_completed_department",
                "last_completed_graduation_date",
            )
        }),
        ("Erişilebilirlik", {"fields": ("has_disability", "disability_description")}),
        ("Kurum / Çevre", {
            "fields": (
                "heard_about_us", "current_institution_type",
                "school_type",
                "profession", "current_institution_name", "continuing_institution",
            )
        }),
        ("İzinler", {"fields": ("is_staff", "is_active", "is_superuser", "groups", "user_permissions")}),
        ("Önemli Tarihler", {"fields": ("last_login", "date_joined", "is_online", "last_active", "unread_notifications")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "username", "password1", "password2", "role", "is_staff", "is_active", "status")
        }),
    )
