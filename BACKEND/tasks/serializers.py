from rest_framework import serializers
from .models import Task, Commission, TaskRolePermission, AtelierViewPermission
from customuser.models import Atelier


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


class CommissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commission
        fields = ['id', 'name', 'is_active']


class TaskSerializer(serializers.ModelSerializer):
    ateliers = serializers.PrimaryKeyRelatedField(
        queryset=Atelier.objects.all(), many=True, required=False
    )
    commission_name = serializers.CharField(source='commission.name', read_only=True)
    created_by_full_name = serializers.CharField(source='created_by.get_full_name', read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'status', 'priority', 'due_date',
            'ateliers',
            'commission', 'commission_name',
            'active', 'send_notification', 'send_email',
            'created_by', 'created_by_full_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = (
            'id', 'created_by', 'created_at', 'updated_at',
            'commission_name', 'active'
        )
        
class TaskCreateUpdateSerializer(StrictFieldsMixin, serializers.ModelSerializer):
    ateliers = serializers.PrimaryKeyRelatedField(
        queryset=Atelier.objects.all(), many=True, required=True
    )

    class Meta:
        model = Task
        fields = (
            'title', 'description', 'status', 'priority', 'due_date',
            'ateliers', 'commission', 'send_notification', 'send_email',
        )
        extra_kwargs = {
            'commission': {'required': False, 'allow_null': True},
        }

    def create(self, validated_data):
        ateliers = validated_data.pop('ateliers', [])
        task = Task.objects.create(**validated_data)
        if ateliers:
            task.ateliers.set(ateliers)
        return task

    def update(self, instance, validated_data):
        ateliers = validated_data.pop('ateliers', None)
        instance = super().update(instance, validated_data)
        if ateliers is not None:
            instance.ateliers.set(ateliers)
        return instance


class TaskRolePermissionSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source='role.name', read_only=True)

    class Meta:
        model = TaskRolePermission
        fields = ['id', 'role', 'role_name', 'can_view', 'can_create', 'can_update', 'can_archive']


class AtelierViewPermissionSerializer(serializers.ModelSerializer):
    user_full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    atelier_name = serializers.CharField(source='atelier.name', read_only=True)

    class Meta:
        model = AtelierViewPermission
        fields = ['id', 'user', 'user_full_name', 'atelier', 'atelier_name']
 