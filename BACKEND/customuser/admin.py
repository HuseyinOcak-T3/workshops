from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.safestring import mark_safe
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("username", "email", "role", "atelier_name", "is_staff")
    list_filter = ("role", "is_staff", "is_superuser")
    search_fields = ("username", "email", "atelier_name")
    ordering = ("email",)

    readonly_fields = ("role_info_note",)

    fieldsets = UserAdmin.fieldsets + (
        ("Rol Açıklamaları", {
            "fields": ("role_info_note",)
        }),
        ("Ek Alanlar", {
            "fields": (
                "role", "phone", "birth_date", "profile_picture", "bio",
                "address", "city", "country", "expertise",
                "atelier_name", "atelier_city", "google_sheet_id",
                "is_online", "last_active", "unread_notifications",
                "linkedin", "github", "twitter",
            )
        }),
    )

    def role_info_note(self, obj):
        return mark_safe("""
        <div style="padding:8px; background:#f0f8ff; border:1px solid #ccc; border-radius:4px;">
            <strong>Rol Açıklamaları:</strong><br>
            <ul>
                <li><b>Admin</b>: Yönetici</li>
                <li><b>Superuser</b>: Komisyon Çalışanı</li>                
                <li><b>User</b>: Atölye Sorumlusu</li>               
                <li><b>Instructor</b>: Eğitmen</li>                
                <li><b>Member</b>: Bursiyer</li>
            </ul>
        </div>
        """)

    role_info_note.short_description = "Rol Bilgilendirmesi"

admin.site.register(CustomUser, CustomUserAdmin)
