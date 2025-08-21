from django.db import models
from django.conf import settings
from customuser.models import Commission, Atelier

User = settings.AUTH_USER_MODEL


class Task(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        TODO = 'todo', 'To Do'
        IN_PROGRESS = 'in_progress', 'In Progress'
        DONE = 'done', 'Done'

    class Priority(models.IntegerChoices):
        LOW = 1, 'Low'
        MEDIUM = 2, 'Medium'
        HIGH = 3, 'High'

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    priority = models.IntegerField(choices=Priority.choices, default=Priority.MEDIUM)
    due_date = models.DateField(null=True, blank=True)

    ateliers = models.ManyToManyField(Atelier, blank=True, related_name='tasks')

    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tasks')
    commission = models.ForeignKey(Commission, null=True, blank=True, on_delete=models.SET_NULL, related_name='tasks')

    active = models.BooleanField(default=True) 
    send_notification = models.BooleanField(default=False)
    send_email = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Görev"
        verbose_name_plural = "Görevler"


    def __str__(self) -> str:
        return self.title


class TaskRolePermission(models.Model):
    role = models.ForeignKey('customuser.Role', on_delete=models.CASCADE, related_name='task_permissions')
    can_view = models.BooleanField(default=True)
    can_create = models.BooleanField(default=False)
    can_update = models.BooleanField(default=False)
    can_archive = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Görev İzin Kuralı"
        verbose_name_plural = "Görev İzin Kuralları"
        constraints = [
            models.UniqueConstraint(fields=['role'], name='uq_task_role_permission_role')
        ]

    def __str__(self) -> str:
        return f'{self.role} perms'
