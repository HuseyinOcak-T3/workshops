from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Commission(models.Model):
    name = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.name


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

    ateliers = models.ManyToManyField('customuser.Atelier', blank=True, related_name='tasks')

    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tasks')
    commission = models.ForeignKey(Commission, null=True, blank=True, on_delete=models.SET_NULL, related_name='tasks')

    active = models.BooleanField(default=True) 
    send_notification = models.BooleanField(default=False)
    send_email = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.title


class TaskRolePermission(models.Model):
    role = models.ForeignKey('customuser.Role', on_delete=models.CASCADE, related_name='task_permissions')
    can_view = models.BooleanField(default=True)
    can_create = models.BooleanField(default=False)
    can_update = models.BooleanField(default=False)
    can_archive = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['role'], name='uq_task_role_permission_role')
        ]

    def __str__(self) -> str:
        return f'{self.role} perms'


class AtelierViewPermission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='extra_atelier_perms')
    atelier = models.ForeignKey('customuser.Atelier', on_delete=models.CASCADE, related_name='user_view_perms')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'atelier'], name='uq_avp_user_atelier')
        ]
        indexes = [models.Index(fields=['user', 'atelier'])]

    def __str__(self) -> str:
        return f'{self.user_id}->{self.atelier_id}'
