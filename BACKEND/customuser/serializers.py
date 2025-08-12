from typing import Any

from django.contrib.auth import get_user_model
from django.contrib.auth import password_validation
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import CustomUser, Title, City, Atelier

User = get_user_model()


# -----------------------------
# Auth
# -----------------------------
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """E-posta + şifre ile giriş, yanıta kullanıcı özeti ekler."""

    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                "non_field_errors": ["Bu e‑posta ile kullanıcı bulunamadı."]
            })

        if not user.check_password(password):
            raise serializers.ValidationError({
                "non_field_errors": ["Hatalı şifre."]
            })

        # SimpleJWT username beklediği için ekle
        attrs["username"] = user.username
        data = super().validate(attrs)
        data["user"] = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": getattr(user, "role", None),
            "permission_level": getattr(user, "permission_level", None),
            "title": user.title.name if getattr(user, "title", None) else None,
        }
        return data


# -----------------------------
# Referans serializer'lar
# -----------------------------
class TitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Title
        fields = ["id", "name"]


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ["id", "name"]


class AtelierSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)
    city_id = serializers.PrimaryKeyRelatedField(
        source="city", queryset=City.objects.all(), write_only=True
    )

    class Meta:
        model = Atelier
        fields = ["id", "name", "city", "city_id"]


# -----------------------------
# Kullanıcı profil
# -----------------------------
class UserProfileSerializer(serializers.ModelSerializer):
    title = TitleSerializer(read_only=True)
    title_id = serializers.PrimaryKeyRelatedField(
        source="title", queryset=Title.objects.all(), write_only=True,
        required=False, allow_null=True
    )

    atelier_city = CitySerializer(read_only=True)
    atelier_city_id = serializers.PrimaryKeyRelatedField(
        source="atelier_city", queryset=City.objects.all(), write_only=True,
        required=False, allow_null=True
    )

    atelier = AtelierSerializer(read_only=True)
    atelier_id = serializers.PrimaryKeyRelatedField(
        source="atelier", queryset=Atelier.objects.all(), write_only=True,
        required=False, allow_null=True
    )

    class Meta:
        model = CustomUser
        fields = [
            "id", "username", "first_name", "last_name", "email",
            "tc_no", "role", "permission_level",
            "title", "title_id", "phone", "birth_date", "profile_picture",
            "bio", "expertise",
            "atelier_city", "atelier_city_id", "atelier", "atelier_id",
            "city", "country",
            "is_online", "last_active", "unread_notifications",
            "last_login", "date_joined",
        ]
        read_only_fields = [
            "id", "permission_level", "last_login", "date_joined",
            "username", "role", "email"
        ]

    def validate_tc_no(self, value: str | None) -> str | None:
        if value in (None, ""):
            return value
        if not (isinstance(value, str) and value.isdigit() and len(value) == 11):
            raise serializers.ValidationError("T.C. Kimlik No 11 haneli olmalıdır.")
        return value

    def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
        atelier = attrs.get("atelier")
        atelier_city = attrs.get("atelier_city")
        if atelier and atelier_city and atelier.city_id != atelier_city.id:
            raise serializers.ValidationError({
                "atelier_id": "Seçilen atölye, seçili şehir ile eşleşmiyor.",
                "atelier_city_id": "Seçilen şehir, atölyenin şehri ile eşleşmiyor.",
            })
        return attrs


CustomUserSerializer = UserProfileSerializer


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError("Yeni şifreler eşleşmiyor.")
        password_validation.validate_password(attrs["new_password"])
        return attrs
