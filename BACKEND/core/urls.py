from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from customuser.views import (
    CustomUserViewSet,
    UserProfileView,
    ChangePasswordView,
    TitleViewSet, CityViewSet, AtelierViewSet,
    CustomTokenObtainPairView,
)

router = routers.DefaultRouter()
router.register(r'users', CustomUserViewSet, basename='user')
router.register(r'titles', TitleViewSet, basename='title')
router.register(r'cities', CityViewSet, basename='city')
router.register(r'ateliers', AtelierViewSet, basename='atelier')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include([
        path('', include(router.urls)),
        path('profile/', UserProfileView.as_view(), name='profile'),
        path('password/change/', ChangePasswordView.as_view(), name='password-change'),
        path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    ])),
]
