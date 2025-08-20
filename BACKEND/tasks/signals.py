from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.apps import apps
from django.db import connection
from django.db.utils import ProgrammingError, OperationalError

@receiver(post_migrate)
def seed_commissions(sender, **kwargs):
    if sender.label != 'tasks':
        return

    try:
        tables = connection.introspection.table_names()
    except Exception:
        return
    if 'tasks_commission' not in tables:
        return

    Commission = apps.get_model('tasks', 'Commission')
    try:
        for name in ['Eğitim', 'İdari', 'Teknik']:
            Commission.objects.get_or_create(name=name, defaults={'is_active': True})
    except (ProgrammingError, OperationalError):
        return