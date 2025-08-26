#burası 
from django.urls import path
from .views import (
    WorkshopDetailView,
    EquipmentRequestCreateView,
    MaintenanceRequestCreateView,
    EquipmentRequestListView,
    MaintenanceRequestListView,
)

urlpatterns = [
    path("workshops/<int:pk>", WorkshopDetailView.as_view()),
    path("equipment-requests", EquipmentRequestCreateView.as_view()),
    path("equipment-requests/list", EquipmentRequestListView.as_view()),

    path("maintenance-requests", MaintenanceRequestCreateView.as_view()),
    path("maintenance-requests/list", MaintenanceRequestListView.as_view()),

    ]

