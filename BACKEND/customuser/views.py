from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import CustomUser, Title, City, Atelier, HeardAboutUsOption, InstitutionTypeOption, SchoolCategoryOption, SchoolTypeOption
from .serializers import (
    CustomUserSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer,
    CustomTokenObtainPairSerializer,
    TitleSerializer,
    CitySerializer,
    AtelierSerializer,
    HeardAboutUsOptionSerializer, InstitutionTypeOptionSerializer,
    SchoolCategoryOptionSerializer, SchoolTypeOptionSerializer,
)

User = get_user_model()

# Yetki kontrolü (permission_level: 1 en yüksek, 8 en düşük)
class IsAdminLikeOrSelf(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        # admin-benzeri kullanıcı her şeye erişebilir
        if getattr(request.user, "permission_level", 8) <= 2:
            return True
        # değilse sadece kendi kaydı
        return obj == request.user


class IsAdminLike(permissions.BasePermission):
    """is_staff yerine modeldeki permission_level'e göre yetki kontrolü."""
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "permission_level", 8) <= 2
        )


class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = CustomUserSerializer
    permission_classes = [IsAdminLikeOrSelf]

    def get_queryset(self):
        user = self.request.user
        base = User.objects.select_related(
            "role", "title", "atelier_city", "atelier",
            "heard_about_us", "current_institution_type",
            "school_category", "school_type",
        ).order_by("-date_joined")
        if getattr(user, "permission_level", 8) <= 2:
            return base
        return base.filter(id=user.id)

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        ser = UserProfileSerializer(request.user, context={"request": request})
        return Response(ser.data)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not user.check_password(serializer.validated_data["current_password"]):
            return Response({"detail": "Mevcut şifre yanlış."}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(serializer.validated_data["new_password"])
        user.save()
        return Response({"detail": "Şifre başarıyla güncellendi."})


# --- Referans viewset'ler ---
class TitleViewSet(viewsets.ModelViewSet):
    queryset = Title.objects.filter(is_active=True).order_by("name")
    serializer_class = TitleSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticated()]
        # create/update/delete için admin-benzeri kontrol
        return [permissions.IsAuthenticated(), IsAdminLike()]


class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all().order_by("name")
    serializer_class = CitySerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsAdminLike()]


class AtelierViewSet(viewsets.ModelViewSet):
    queryset = Atelier.objects.select_related("city").all()
    serializer_class = AtelierSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsAdminLike()]

    def get_queryset(self):
        qs = super().get_queryset()
        city_id = self.request.query_params.get("city")
        if city_id:
            qs = qs.filter(city_id=city_id)
        return qs.order_by("name")

class HeardAboutUsOptionViewSet(viewsets.ModelViewSet):
    queryset = HeardAboutUsOption.objects.filter(is_active=True).order_by("name")
    serializer_class = HeardAboutUsOptionSerializer
    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsAdminLike()]

class InstitutionTypeOptionViewSet(viewsets.ModelViewSet):
    queryset = InstitutionTypeOption.objects.filter(is_active=True).order_by("name")
    serializer_class = InstitutionTypeOptionSerializer
    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsAdminLike()]

class SchoolCategoryOptionViewSet(viewsets.ModelViewSet):
    queryset = SchoolCategoryOption.objects.filter(is_active=True).order_by("name")
    serializer_class = SchoolCategoryOptionSerializer
    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsAdminLike()]

class SchoolTypeOptionViewSet(viewsets.ModelViewSet):
    queryset = SchoolTypeOption.objects.filter(is_active=True).order_by("name")
    serializer_class = SchoolTypeOptionSerializer
    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsAdminLike()]