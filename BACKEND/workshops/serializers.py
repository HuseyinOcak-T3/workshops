from rest_framework import serializers
from .models import Workshop, ResponsiblePerson
from .models import EquipmentRequest, MaintenanceRequest

class ResponsiblePersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResponsiblePerson
        fields = ("id","name","title","phone","email","image")

class WorkshopDetailSerializer(serializers.ModelSerializer):
    responsiblePerson = ResponsiblePersonSerializer()
    class Meta:
        model = Workshop
        fields = (
            "id","name","address","phone","email","type","status",
            "region","city","district","establishmentDate","lastMaintenanceDate",
            "capacity","currentScholarCount","attendanceRate","responsiblePerson",
        )

class EquipmentRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentRequest
        fields = ("id", "workshop", "name", "quantity", "priority", "reason", "notes", "created_at")

class MaintenanceRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceRequest
        fields = ("id", "workshop", "equipment_name", "issue", "priority", "notes", "created_at")
