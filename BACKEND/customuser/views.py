from rest_framework import viewsets, permissions, generics, status
from django.contrib.auth import get_user_model
from .serializers import CustomUserSerializer, UserProfileSerializer, ChangePasswordSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import CustomUser
from rest_framework.response import Response

User = get_user_model()

class IsSuperUserOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.user.role == "superuser":
            return True
        if request.user.role == "admin" and view.action in ["list", "retrieve"]:
            return True
        return obj == request.user

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsSuperUserOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.role == "superuser":
            return User.objects.all()
        elif user.role == "admin":
            return User.objects.exclude(role="superuser")
        return User.objects.filter(id=user.id)

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        response = super().post(request, *args, **kwargs)

        user = serializer.user  # Doğru yöntem bu

        response.data['user'] = {
            "username": user.username,
            "email": user.email,
            "role": user.role,
        }
        return response

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

        if serializer.is_valid():
            if not user.check_password(serializer.validated_data["current_password"]):
                return Response({"detail": "Mevcut şifre yanlış."}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.validated_data["new_password"])
            user.save()
            return Response({"detail": "Şifre başarıyla güncellendi."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

