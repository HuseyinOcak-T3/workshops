from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.http import HttpResponseForbidden
from .models import Announcement, AnnouncementRead, AnnouncementArchive, AnnouncementPermission
from .serializers import (
    AnnouncementSerializer, AnnouncementReadSerializer, AnnouncementArchiveSerializer, AnnouncementPermissionSerializer
)
from .permissions import get_user_announcement_perms, get_visible_ateliers_for
from rest_framework.exceptions import PermissionDenied

class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.select_related("user", "commission").prefetch_related("ateliers").all()
    serializer_class = AnnouncementSerializer

    def get_queryset(self):
        user = self.request.user
        perms = get_user_announcement_perms(user)
        if not perms["can_view"]:
            return Announcement.objects.none()

        # kendi atölyeleri + ek yetki
        own_ateliers = getattr(user, "ateliers", None)
        if callable(own_ateliers):
            own_ateliers = own_ateliers.all()
        visible_ids = get_visible_ateliers_for(user, own_ateliers_qs=own_ateliers)
        qs = self.queryset.filter(ateliers__in=visible_ids).distinct()
        return qs

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
        if "is_active" in getattr(serializer, "validated_data", {}) and not perms["can_archive"]:
            raise PermissionDenied("Duyuru pasife alma/aktife alma yetkiniz yok.")
        serializer.save()

    def perform_destroy(self, instance):
        user = self.request.user
        perms = get_user_announcement_perms(user)
        if not perms["can_archive"]:
            raise PermissionDenied("Duyuru pasife alma yetkiniz yok.")
        instance.is_active = False
        instance.save()

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