from rest_framework import serializers
from .models import Task, TaskRolePermission, TaskAtelier
from customuser.models import Atelier, Commission


class StrictFieldsMixin:
    def validate(self, attrs):
        incoming = set(getattr(self, "initial_data", {}).keys())
        allowed = set(self.fields.keys())
        extra = incoming - allowed
        if extra:
            raise serializers.ValidationError(
                {k: "This field is not allowed." for k in sorted(extra)}
            )
        return super().validate(attrs)


class TaskAtelierSerializer(serializers.ModelSerializer):
    atelier_name = serializers.CharField(source="atelier.name", read_only=True)
    completed_by_full_name = serializers.CharField(source="completed_by.get_full_name", read_only=True)

    class Meta:
        model = TaskAtelier
        fields = ["atelier", "atelier_name", "status", "completed_by", "completed_by_full_name", "completed_at"]
        read_only_fields = ["completed_by", "completed_by_full_name", "completed_at"]

class TaskSerializer(serializers.ModelSerializer):
    atelier = serializers.PrimaryKeyRelatedField(
        queryset=Atelier.objects.all(), many=True, required=False
    )
    commission = serializers.PrimaryKeyRelatedField(
        queryset=Commission.objects.all(), required=False, allow_null=True
    )
    commission_name = serializers.CharField(source="commission.name", read_only=True)
    created_by_full_name = serializers.CharField(source="created_by.get_full_name", read_only=True)

    completed_by = serializers.PrimaryKeyRelatedField(read_only=True)
    completed_by_full_name = serializers.CharField(source="completed_by.get_full_name", read_only=True)
    completed_at = serializers.DateTimeField(read_only=True)
    assignments = TaskAtelierSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = [
            "id", "title", "description", "status", "priority", "due_date",
            "atelier",
            "commission", "commission_name",
            "active", "send_notification", "send_email",
            "created_by", "created_by_full_name",
            "completed_by", "completed_by_full_name", "completed_at",
            "created_at", "updated_at", "assignments"
        ]
        read_only_fields = (
            "id", "created_by", "created_at", "updated_at",
            "commission_name", "active",
            "completed_by", "completed_by_full_name", "completed_at", "assignments",
        )

class TaskCreateUpdateSerializer(StrictFieldsMixin, serializers.ModelSerializer):
    atelier = serializers.PrimaryKeyRelatedField(
        queryset=Atelier.objects.all(), many=True, required=True
    )
    commission = serializers.PrimaryKeyRelatedField(
        queryset=Commission.objects.all(), required=False, allow_null=True
    )

    class Meta:
        model = Task
        fields = (
            "title", "description", "status", "priority", "due_date",
            "atelier", "commission", "send_notification", "send_email",
        )

    def create(self, validated_data):
        atelier = validated_data.pop("atelier", [])
        task = Task.objects.create(**validated_data)
        if atelier:
            task.atelier.set(atelier)
            for a in atelier:
                TaskAtelier.objects.get_or_create(task=task, atelier=a, defaults={"status": task.status})
        return task

    def update(self, instance, validated_data):
        atelier = validated_data.pop("atelier", None)
        instance = super().update(instance, validated_data)
        if atelier is not None:
            instance.atelier.set(atelier)
            existing = set(instance.assignments.values_list("atelier_id", flat=True))
            incoming = set([a.id for a in atelier])
            for aid in (incoming - existing):
                TaskAtelier.objects.get_or_create(task=instance, atelier_id=aid, defaults={"status": instance.status})
            for aid in (existing - incoming):
                TaskAtelier.objects.filter(task=instance, atelier_id=aid).delete()
        return instance


class TaskAtelierSerializer(serializers.ModelSerializer):
    atelier_name = serializers.CharField(source="atelier.name", read_only=True)
    completed_by_full_name = serializers.CharField(source="completed_by.get_full_name", read_only=True)

    class Meta:
        model = TaskAtelier
        fields = ["atelier", "atelier_name", "status", "completed_by", "completed_by_full_name", "completed_at"]
        read_only_fields = ["completed_by", "completed_by_full_name", "completed_at"]


class TaskRolePermissionSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source="role.name", read_only=True)

    class Meta:
        model = TaskRolePermission
        fields = ["id", "role", "role_name", "can_view", "can_create", "can_update", "can_archive"]