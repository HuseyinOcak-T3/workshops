from django.shortcuts import render
# Create your views here.
#burası 
from rest_framework import generics, permissions
from .models import Workshop
from .serializers import WorkshopDetailSerializer

class WorkshopDetailView(generics.RetrieveAPIView):
    queryset = Workshop.objects.all()
    serializer_class = WorkshopDetailSerializer
    permission_classes = [permissions.AllowAny] 
     # geliştirme için açık
from .models import EquipmentRequest, MaintenanceRequest
from .serializers import EquipmentRequestSerializer, MaintenanceRequestSerializer

class EquipmentRequestCreateView(generics.CreateAPIView):
    queryset = EquipmentRequest.objects.all()
    serializer_class = EquipmentRequestSerializer
    permission_classes = [permissions.AllowAny]  # geliştirme için

class MaintenanceRequestCreateView(generics.CreateAPIView):
    queryset = MaintenanceRequest.objects.all()
    serializer_class = MaintenanceRequestSerializer
    permission_classes = [permissions.AllowAny]  # geliştirme için

class EquipmentRequestListView(generics.ListAPIView):
    serializer_class = EquipmentRequestSerializer
    def get_queryset(self):
        qs = EquipmentRequest.objects.all().order_by("-created_at")
        wid = self.request.query_params.get("workshop")
        return qs.filter(workshop_id=wid) if wid else qs

class MaintenanceRequestListView(generics.ListAPIView):
    serializer_class = MaintenanceRequestSerializer
    def get_queryset(self):
        qs = MaintenanceRequest.objects.all().order_by("-created_at")
        wid = self.request.query_params.get("workshop")
        return qs.filter(workshop_id=wid) if wid else qs
