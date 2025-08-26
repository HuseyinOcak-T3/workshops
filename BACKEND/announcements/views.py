from django.db import models
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Announcement, AnnouncementRead, AnnouncementArchive, AnnouncementPermission
from .serializers import (
    AnnouncementSerializer, AnnouncementReadSerializer, AnnouncementArchiveSerializer, AnnouncementPermissionSerializer
)
from .permissions import get_user_announcement_perms, get_visible_ateliers_for
from rest_framework.exceptions import PermissionDenied
from customuser.models import Atelier

class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.select_related("user", "commission").prefetch_related("ateliers", "reads").all()
    serializer_class = AnnouncementSerializer

    def get_queryset(self):
        user = self.request.user
        perms = get_user_announcement_perms(user)
        if not perms["can_view"]:
            return Announcement.objects.none()

        if user.is_superuser or user.is_staff:
            return self.queryset.distinct()
        own_ateliers = getattr(user, "ateliers", None)
        if callable(own_ateliers):
            own_ateliers = own_ateliers.all()
        visible_ids = get_visible_ateliers_for(user, own_ateliers_qs=own_ateliers)

        # Kullanıcılar, kendi atölyelerine atanmış veya hiçbir atölyeye atanmamış (genel) duyuruları görür.
        return self.queryset.filter(
            models.Q(ateliers__in=list(visible_ids)) | models.Q(ateliers__isnull=True)
        ).distinct()

    def perform_create(self, serializer):
        user = self.request.user
        perms = get_user_announcement_perms(user)
        if not perms["can_create"]:
            raise PermissionDenied("Duyuru ekleme yetkiniz yok.")
        serializer.save(user=user)

    def perform_update(self, serializer):
        user = self.request.user
        perms = get_user_announcement_perms(user)
        if not perms["can_update"]:
            raise PermissionDenied("Duyuru düzenleme yetkiniz yok.")
        if "is_active" in serializer.validated_data and not perms["can_archive"]:
            raise PermissionDenied("Duyuru arşivleme/aktifleştirme yetkiniz yok.")
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        user = self.request.user
        perms = get_user_announcement_perms(user)
        if not perms.get("can_archive"):
            raise PermissionDenied("Duyuru silme/arşivleme yetkiniz yok.")

        instance = self.get_object()
        instance.is_active = False
        instance.is_archived = True
        instance.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['get'])
    def read_status(self, request, pk=None):
        announcement = self.get_object()
        target_ateliers = announcement.ateliers.all()

        if not target_ateliers.exists():
            target_ateliers = Atelier.objects.filter(is_active=True)

        read_entries = AnnouncementRead.objects.filter(
            announcement=announcement,
            is_read=True
        ).select_related('user').values('user_id', 'read_at')

        users_who_read = {entry['user_id']: entry['read_at'] for entry in read_entries}

        response_data = []
        for atelier in target_ateliers.select_related('responsible', 'city'):
            is_read = atelier.responsible_id in users_who_read
            response_data.append({
                'id': atelier.id,
                'name': f"{atelier.city.name} - {atelier.name}",
                'region': atelier.city.name,
                'read': is_read,
                'read_date': users_who_read.get(atelier.responsible_id) if is_read else None
            })

        return Response(response_data)

    @action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        ann = self.get_object()
        read, _ = AnnouncementRead.objects.update_or_create(
            announcement=ann, user=request.user,
            defaults={"is_read": True}
        )
        return Response(AnnouncementReadSerializer(read).data)

    @action(detail=True, methods=["post"])
    def mark_archived(self, request, pk=None):
        ann = self.get_object()
        arch, _ = AnnouncementArchive.objects.update_or_create(
            announcement=ann, user=request.user,
            defaults={"is_archived": True}
        )
        return Response(AnnouncementArchiveSerializer(arch).data)

class AnnouncementPermissionViewSet(viewsets.ModelViewSet):
    queryset = AnnouncementPermission.objects.select_related('role').all()
    serializer_class = AnnouncementPermissionSerializer
    permission_classes = [permissions.IsAdminUser]