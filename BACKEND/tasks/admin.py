from django.contrib import admin
from .models import Task, Commission, TaskRolePermission, AtelierViewPermission


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'status', 'priority', 'active', 'commission', 'created_by', 'created_at')
    list_filter = ('status', 'priority', 'active', 'commission')
    search_fields = ('title', 'description')
    autocomplete_fields = ('commission', 'created_by', 'ateliers')
    filter_horizontal = ('ateliers',)


@admin.register(Commission)
class CommissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name',)


@admin.register(TaskRolePermission)
class TaskRolePermissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'role', 'can_view', 'can_create', 'can_update', 'can_archive')
    list_filter = ('can_view', 'can_create', 'can_update', 'can_archive')
    autocomplete_fields = ('role',)


@admin.register(AtelierViewPermission)
class AtelierViewPermissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'atelier')
    search_fields = ('user__email', 'atelier__name')
    autocomplete_fields = ('user', 'atelier')
    
    