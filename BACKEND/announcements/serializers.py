from rest_framework import serializers
from .models import (
    Announcement, AnnouncementPermission, ExtraAtelierAccess,
    AnnouncementRead
)
from customuser.serializers import UserMiniSerializer, AtelierMiniSerializer
from customuser.models import Atelier, Commission

class CommissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commission
        fields = ["id", "name"]


class AnnouncementSerializer(serializers.ModelSerializer):
    user = UserMiniSerializer(read_only=True)
    commission = CommissionSerializer(read_only=True)
    commission_id = serializers.PrimaryKeyRelatedField(
        queryset=Commission.objects.all(), source="commission", write_only=True
    )

    ateliers = AtelierMiniSerializer(read_only=True, many=True)
    atelier_ids = serializers.PrimaryKeyRelatedField(
        source = "ateliers", queryset = Atelier.objects.all(), write_only = True, many = True, required = False
    )
    read_count = serializers.IntegerField(read_only=True)
    total_count = serializers.SerializerMethodField()

    class Meta:
        model = Announcement
        fields = [
            "id", "title", "text", "priority",
            "is_active", "is_archived",
            "private_note_title", "private_note_body",
            "publication_date", "created_at", "updated_at",
            "user", "commission", "commission_id", "slug",
            "ateliers", "atelier_ids",
            "read_count", "total_count",
        ]
        read_only_fields = ["slug", "created_at", "updated_at", "user"]

    def get_total_count(self, obj):
        if hasattr(obj, 'total_ateliers') and obj.total_ateliers > 0:
            return obj.total_ateliers
        return Atelier.objects.filter(is_active=True).count()


class AnnouncementPermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnnouncementPermission
        fields = "__all__"


class ExtraAtelierAccessSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtraAtelierAccess
        fields = "__all__"


class AnnouncementReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnnouncementRead
        fields = "__all__"
