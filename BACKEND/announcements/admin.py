from django.contrib import admin
from .models import (
    Announcement, AnnouncementPermission, ExtraAtelierAccess,
    AnnouncementRead
)

class AnnouncementReadInline(admin.TabularInline):
    model = AnnouncementRead
    extra = 0
    readonly_fields = ('user', 'read_at', 'is_read')
    can_delete = False
    verbose_name = "Okunma Kaydı"
    verbose_name_plural = "Okunma Kayıtları"

    def has_add_permission(self, request, obj=None):
        return False




@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'commission',
        'is_active',
        'is_archived',
        'priority',
        'publication_date',
        'user',
        'target_atelier_count'
    )
    list_filter = ('is_active', 'is_archived', 'priority', 'commission')
    search_fields = ('title', 'text', 'user__username', 'user__first_name', 'user__last_name')
    readonly_fields = ('user', 'created_at', 'updated_at')

    fieldsets = (
        (None, {
            'fields': ('title', 'text', 'commission')
        }),
        ('Durum ve Öncelik', {
            'fields': ('is_active', 'is_archived', 'priority', 'publication_date')
        }),
        ('Hedef Kitle', {
            'fields': ('ateliers',),
        }),
        ('Özel Notlar (Yalnızca Yetkililer İçin)', {
            'fields': ('private_note_title', 'private_note_body'),
        }),
        ('Sistem Bilgileri', {
            'fields': ('user', 'slug', 'created_at', 'updated_at'),
        }),
    )

    filter_horizontal = ('ateliers',)
    inlines = [AnnouncementReadInline]

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return self.readonly_fields
        return self.readonly_fields + ('slug',)

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.user = request.user
        super().save_model(request, obj, form, change)

    @admin.display(description='Hedef Atölye Sayısı')
    def target_atelier_count(self, obj):
        count = obj.ateliers.count()
        return count if count > 0 else "Tümü"


@admin.register(AnnouncementPermission)
class AnnouncementPermissionAdmin(admin.ModelAdmin):
    list_display = ('role', 'can_view', 'can_create', 'can_update', 'can_archive', 'can_view_stats')
    list_filter = ('role',)
    search_fields = ('role__name',)


@admin.register(ExtraAtelierAccess)
class ExtraAtelierAccessAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_active', 'note', 'created_at', 'created_by')
    list_filter = ('is_active',)
    search_fields = ('user__username', 'user__first_name', 'note')
    filter_horizontal = ('ateliers',)
    readonly_fields = ('created_at', 'created_by')

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(AnnouncementRead)
class AnnouncementReadAdmin(admin.ModelAdmin):
    list_display = ('announcement', 'user', 'is_read', 'read_at')
    list_filter = ('is_read', 'announcement__title')
    search_fields = ('announcement__title', 'user__username')
    readonly_fields = ('announcement', 'user', 'read_at', 'is_read')

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

