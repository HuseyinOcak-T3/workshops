from django.db import models
#burasıı
# Create your models here.
from django.db import models


class ResponsiblePerson(models.Model):
    name = models.CharField(max_length=120)
    title = models.CharField(max_length=120, blank=True)
    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    image = models.URLField(blank=True)

    def __str__(self):
        return self.name


class Workshop(models.Model):
    STATUS = (("active", "active"), ("inactive", "inactive"))

    name = models.CharField(max_length=200)
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    type = models.CharField(max_length=120, blank=True)
    status = models.CharField(max_length=10, choices=STATUS, default="active")

    region = models.CharField(max_length=120, blank=True)
    city = models.CharField(max_length=120, blank=True)
    district = models.CharField(max_length=120, blank=True)

    establishmentDate = models.DateField(null=True, blank=True)
    lastMaintenanceDate = models.DateField(null=True, blank=True)

    capacity = models.IntegerField(default=0)
    currentScholarCount = models.IntegerField(default=0)
    attendanceRate = models.IntegerField(default=0)

    responsiblePerson = models.ForeignKey(
        ResponsiblePerson,
        on_delete=models.SET_NULL,
        null=True,
        related_name="workshops",
    )

class EquipmentRequest(models.Model):
    workshop = models.ForeignKey(Workshop, on_delete=models.CASCADE)
    name = models.CharField(max_length=120)
    quantity = models.IntegerField()
    priority = models.CharField(max_length=20, default="normal")
    reason = models.TextField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class MaintenanceRequest(models.Model):
    workshop = models.ForeignKey(Workshop, on_delete=models.CASCADE)
    # İstersen Equipment tablosu yoksa FK’sız string de tutabilirdik; ama şimdilik basit bırakalım:
    equipment_name = models.CharField(max_length=120, blank=True)
    issue = models.TextField()
    priority = models.CharField(max_length=20, default="normal")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)



    def __str__(self):
        return self.name
