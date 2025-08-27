from django.contrib import admin
from .models import Task, TaskRolePermission, TaskAtelier

class TaskAtelierInline(admin.TabularInline):
    model = TaskAtelier
    extra = 0
    autocomplete_fields = ("atelier",)
    readonly_fields = ("completed_by", "completed_at")

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "status", "priority", "active", "commission", "created_by", "created_at")
    list_filter = ("status", "priority", "active", "commission", "created_by")
    search_fields = ("title", "description")
    autocomplete_fields = ("commission",)
    exclude = ("created_by",)
    readonly_fields = ("created_at", "updated_at")
    inlines = [TaskAtelierInline]

@admin.register(TaskRolePermission)
class TaskRolePermissionAdmin(admin.ModelAdmin):
    list_display = ("id", "role", "can_view", "can_create", "can_update", "can_archive")
    list_filter = ("can_view", "can_create", "can_update", "can_archive")
    search_fields = ("role__name",)