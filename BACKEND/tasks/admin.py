from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id','title','status','priority','for_all_ateliers','assigned_to','due_date','created_by','created_at')
    list_filter  = ('status','priority','for_all_ateliers','due_date','created_at','ateliers')
    search_fields = ('title','description','assigned_to__email','created_by__email')
    filter_horizontal = ('ateliers',) 