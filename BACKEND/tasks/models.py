from django.conf import settings
from django.db import models

class Task(models.Model):
    STATUS_PENDING = "pending"
    STATUS_IN_PROGRESS = "in_progress"
    STATUS_DONE = "done"
    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_IN_PROGRESS, "In Progress"),
        (STATUS_DONE, "Done"),
    ]

    PRIORITY_LOW = 1
    PRIORITY_MED = 2
    PRIORITY_HIGH = 3
    PRIORITY_CHOICES = [
        (PRIORITY_LOW, "Low"),
        (PRIORITY_MED, "Medium"),
        (PRIORITY_HIGH, "High"),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING
    )
    priority = models.IntegerField(choices=PRIORITY_CHOICES, default=PRIORITY_MED)
    due_date = models.DateField(null=True, blank=True)
    commission = models.ForeignKey(
        "customuser.Commission",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="tasks",
    )
    atelier = models.ManyToManyField(
        "customuser.Atelier", related_name="tasks", blank=True, through="tasks.TaskAtelier"
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_tasks",
    )

    completed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="completed_tasks",
    )
    completed_at = models.DateTimeField(null=True, blank=True)

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


class TaskAtelier(models.Model):
    task = models.ForeignKey("tasks.Task", on_delete=models.CASCADE, related_name="assignments")
    atelier = models.ForeignKey("customuser.Atelier", on_delete=models.CASCADE, related_name="task_assignments")

    status = models.CharField(max_length=20, choices=Task.STATUS_CHOICES, default=Task.STATUS_PENDING)
    completed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL,
        related_name="atelier_completed_tasks"
    )
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("task", "atelier")

    def __str__(self):
        return f"{self.task_id} @ {self.atelier_id} -> {self.status}"



class TaskRolePermission(models.Model):
    role = models.ForeignKey(
        "customuser.Role", on_delete=models.CASCADE, related_name="task_permissions"
    )
    can_view = models.BooleanField(default=True)
    can_create = models.BooleanField(default=False)
    can_update = models.BooleanField(default=False)
    can_archive = models.BooleanField(default=False)

    def __str__(self) -> str:
        role_name = getattr(self.role, "name", self.role_id)
        return f"{role_name} perms"