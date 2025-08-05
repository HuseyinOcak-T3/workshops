from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from customuser.views import CustomUserViewSet, CustomTokenObtainPairView, UserProfileView, ChangePasswordView


router = DefaultRouter()
router.register(r'users', CustomUserViewSet, basename='user')

urlpatterns = [
    path("admin/", admin.site.urls),

    # API endpointleri
    path("api/", include(router.urls)),
    path("api/profile/", UserProfileView.as_view(), name="user-profile"),
    path("api/change-password/", ChangePasswordView.as_view(), name="change-password"),

    # JWT auth
    path("api/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]