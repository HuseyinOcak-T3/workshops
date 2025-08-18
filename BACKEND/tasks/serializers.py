from rest_framework import serializers
from .models import Task
from customuser.models import Atelier

class TaskSerializer(serializers.ModelSerializer):
    ateliers = serializers.PrimaryKeyRelatedField(
        queryset=Atelier.objects.all(), many=True, required=False
    )

    ateliers_names = serializers.SerializerMethodField()
    assignment_display = serializers.SerializerMethodField()
    assigned_to_full_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True)
    created_by_full_name  = serializers.CharField(source='created_by.get_full_name', read_only=True)

    class Meta:
        model = Task
        fields = [
            'id','title','description','status','priority','due_date',
            'assigned_to','assigned_to_full_name','created_by','created_by_full_name',
            'ateliers','ateliers_names','for_all_ateliers','assignment_display',
            'created_at','updated_at'
        ]
        read_only_fields = ('id','created_by','created_at','updated_at')

    def get_ateliers_names(self, obj):
        return [str(a) for a in obj.ateliers.all()]

    def get_assignment_display(self, obj):
        if obj.assigned_to:
            return obj.assigned_to.get_full_name() or obj.assigned_to.email
        if obj.for_all_ateliers:
            return "Tüm Atölyeler"
        names = [str(a) for a in obj.ateliers.all()]
        return " / ".join(names) if names else None

    def create(self, validated_data):
        ats = validated_data.pop('ateliers', [])
        task = super().create(validated_data)
        if ats: task.ateliers.set(ats)
        return task

    def update(self, instance, validated_data):
        ats = validated_data.pop('ateliers', None)
        task = super().update(instance, validated_data)
        if ats is not None:
            task.ateliers.set(ats)
        return task
