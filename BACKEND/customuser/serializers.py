from typing import Any

from django.contrib.auth import get_user_model
from django.contrib.auth import password_validation
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import (
    CustomUser, Title, City, Atelier, Role,
    HeardAboutUsOption, InstitutionTypeOption,
    SchoolTypeOption, StatusOption, StudentParent, NationalityOption, Commission
)
from announcements.permissions import get_user_announcement_perms
from tasks.permissions import get_user_task_perms

User = get_user_model()


def get_all_user_permissions(user):
    announcement_perms = get_user_announcement_perms(user)
    task_perms = get_user_task_perms(user)

    all_permissions = {}
    for key, value in announcement_perms.items():
        all_permissions[f"announcements_{key}"] = value

    for key, value in task_perms.items():
        all_permissions[f"tasks_{key}"] = value

    return all_permissions


class CommissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commission
        fields = ['id', 'name', 'is_active']

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ["code", "name", "level"]

class StatusOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusOption
        fields = ["id", "name", "is_active", "is_builtin"]

class HeardAboutUsOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeardAboutUsOption
        fields = ["id", "name", "is_active", "is_builtin"]

class InstitutionTypeOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstitutionTypeOption
        fields = ["id", "name", "is_active", "is_builtin"]

class NationalityOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NationalityOption
        fields = ["id", "name", "is_active", "is_builtin"]

class SchoolTypeOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolTypeOption
        fields = ["id", "name", "is_active", "is_builtin"]

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

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

        attrs["username"] = user.username
        data = super().validate(attrs)
        all_permissions = get_all_user_permissions(user)

        data["user"] = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": {
                "code": user.role.code,
                "name": user.role.name,
                "level": user.role.level,
            } if user.role else None,
            "profile_picture": user.profile_picture.url if user.profile_picture else None,
            "permissions": all_permissions,
        }
        return data


class TitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Title
        fields = ["id", "name"]


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ["id", "name"]

class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email"]

class AtelierMiniSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)
    class Meta:
        model = Atelier
        fields = ["id", "name", "city"]

class AtelierSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)
    city_id = serializers.PrimaryKeyRelatedField(
        source="city", queryset=City.objects.all(), write_only=True
    )
    responsible = UserMiniSerializer(read_only=True)
    responsible_id = serializers.PrimaryKeyRelatedField(
        source="responsible",
        queryset=User.objects.filter(role__code="workshop_responsible"),
        write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Atelier
        fields = ["id", "name", "city", "city_id", "responsible_id", "responsible"]


class UserHeaderSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            'id', 'first_name', 'last_name', 'username', 'profile_picture', 'role',
            'permissions'
        ]

    def get_permissions(self, obj):
        return get_all_user_permissions(obj)


class UserProfileSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)
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
    atelier = AtelierMiniSerializer(read_only=True)
    atelier_id = serializers.PrimaryKeyRelatedField(
        source="atelier", queryset=Atelier.objects.all(), write_only=True,
        required=False, allow_null=True
    )
    status = StatusOptionSerializer(read_only=True)
    status_id = serializers.PrimaryKeyRelatedField(
        source="status",
        queryset=StatusOption.objects.all(),
        write_only=True, required=False, allow_null=True
    )

    heard_about_us = HeardAboutUsOptionSerializer(read_only=True)
    heard_about_us_id = serializers.PrimaryKeyRelatedField(
        source="heard_about_us", queryset=HeardAboutUsOption.objects.all(),
        write_only=True, required=False, allow_null=True
    )

    current_institution_type = InstitutionTypeOptionSerializer(read_only=True)
    current_institution_type_id = serializers.PrimaryKeyRelatedField(
        source="current_institution_type", queryset=InstitutionTypeOption.objects.all(),
        write_only=True, required=False, allow_null=True
    )

    nationality = NationalityOptionSerializer(read_only=True)
    nationality_id = serializers.PrimaryKeyRelatedField(
        source="nationality", queryset=NationalityOption.objects.all(),
        write_only=True, required=False, allow_null=True
    )

    school_type = SchoolTypeOptionSerializer(read_only=True)
    school_type_id = serializers.PrimaryKeyRelatedField(
        source="school_type", queryset=SchoolTypeOption.objects.all(),
        write_only=True, required=False, allow_null=True
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
            "address", "district", "nationality", "nationality_id", "passport_number", "gender",
            "education_level", "school_name", "faculty_institute", "department",
            "classroom", "expected_graduation_date", "is_graduate",
            "last_completed_education_level", "last_completed_school",
            "last_completed_faculty_institute", "last_completed_department",
            "last_completed_graduation_date",
            "has_disability", "disability_description",
            "heard_about_us", "heard_about_us_id",
            "current_institution_type", "current_institution_type_id",
            "school_type", "school_type_id", "status", "status_id",
            "profession", "current_institution_name", "continuing_institution",
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


class StudentParentSerializer(serializers.ModelSerializer):
    student = UserProfileSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        source="student",
        queryset=User.objects.filter(role__code="student"),
        write_only=True
    )
    parents = UserProfileSerializer(many=True, read_only=True)
    parent_ids = serializers.PrimaryKeyRelatedField(
        source="parents",
        queryset=User.objects.filter(role__code="student_parent"),
        write_only=True, many=True, required=False
    )

    class Meta:
        model = StudentParent
        fields = ["id", "student", "student_id", "parents", "parent_ids"]
