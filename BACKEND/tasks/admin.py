from django.contrib import admin
from .models import Task,  TaskRolePermission, AtelierViewPermission

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "status", "priority", "active", "commission", "created_by", "created_at")
    list_filter = ("status", "priority", "active", "commission", "created_by")
    search_fields = ("title", "description")
    filter_horizontal = ("ateliers",)
    autocomplete_fields = ("commission",)
    exclude = ("created_by",)
    readonly_fields = ("created_at", "updated_at")

    def save_model(self, request, obj, form, change):
        if not obj.created_by_id:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

@admin.register(TaskRolePermission)
class TaskRolePermissionAdmin(admin.ModelAdmin):
    list_display = ("id", "role", "can_view", "can_create", "can_update", "can_archive")
    list_filter = ("can_view", "can_create", "can_update", "can_archive")
    search_fields = ("role__name",)

@admin.register(AtelierViewPermission)
class AtelierViewPermissionAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "atelier")
    search_fields = ("user__first_name", "user__last_name", "user__email", "atelier__name")
   