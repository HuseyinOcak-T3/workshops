from django.db import models
from django.db.models import Count
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from .pagination import AnnouncementPagination
from .models import Announcement, AnnouncementRead, AnnouncementPermission
from .serializers import (
    AnnouncementSerializer, AnnouncementReadSerializer, AnnouncementPermissionSerializer
)
from .permissions import get_user_announcement_perms, get_visible_ateliers_for
from rest_framework.exceptions import PermissionDenied
from customuser.models import Atelier

class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.select_related("user", "commission").prefetch_related("ateliers", "reads").annotate(
        read_count=Count('reads', distinct=True),
        total_ateliers=Count('ateliers', distinct=True)
    )
    serializer_class = AnnouncementSerializer

    pagination_class = AnnouncementPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['title', 'text']
    filterset_fields = ['commission', 'is_archived', 'is_active']

    def get_queryset(self):
        user = self.request.user
        perms = get_user_announcement_perms(user)
        if not perms["can_view"]:
            return Announcement.objects.none()

        visible_ids = get_visible_ateliers_for(user)

        return self.queryset.filter(
            models.Q(ateliers__in=list(visible_ids))
        ).distinct().order_by('-publication_date')

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
            announcement=ann, user=request.user
        )
        return Response(AnnouncementReadSerializer(read).data)


class AnnouncementPermissionViewSet(viewsets.ModelViewSet):
    queryset = AnnouncementPermission.objects.select_related('role').all()
    serializer_class = AnnouncementPermissionSerializer
    permission_classes = [permissions.IsAdminUser]