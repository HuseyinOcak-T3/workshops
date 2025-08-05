from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import CustomUser
from django.contrib.auth import password_validation
User = get_user_model()

from django.contrib.auth.hashers import make_password

User = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    password2 = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            "id", "username", "email", "first_name", "last_name",
            "phone", "bio", "expertise", "role",
            "password", "password2"
        ]
        read_only_fields = ["id", "role"]

    def validate(self, attrs):
        password = attrs.get("password")
        password2 = attrs.get("password2")
        if password or password2:
            if password != password2:
                raise serializers.ValidationError("Şifreler uyuşmuyor.")
        return attrs

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        validated_data.pop("password2", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.password = make_password(password)

        instance.save()
        return instance



class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "id", "username", "first_name", "last_name", "email", "role",
            "phone", "birth_date", "profile_picture", "bio",
            "address", "city", "country", "expertise",
            "atelier_name", "atelier_city", "google_sheet_id",
            "is_online", "last_active", "unread_notifications",
            "linkedin", "github", "twitter",
            "date_joined", "last_login"
        ]
        read_only_fields = ["id", "date_joined", "last_login", "username", "role", "email"]

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError("Yeni şifreler eşleşmiyor.")
        password_validation.validate_password(attrs["new_password"])
        return attrs
