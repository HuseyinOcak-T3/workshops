from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from customuser.views import (
    CustomUserViewSet, UserProfileView, ChangePasswordView, TitleViewSet, CityViewSet, AtelierViewSet, CustomTokenObtainPairView,
    HeardAboutUsOptionViewSet, InstitutionTypeOptionViewSet, SchoolTypeOptionViewSet
)

from tasks.views import (
    TaskViewSet,
    CommissionViewSet,
    TaskRolePermissionViewSet,
    AtelierViewPermissionViewSet,
)


router = routers.DefaultRouter()
router.register(r'users', CustomUserViewSet, basename='user')
router.register(r'titles', TitleViewSet, basename='title')
router.register(r'cities', CityViewSet, basename='city')
router.register(r'ateliers', AtelierViewSet, basename='atelier')
router.register(r"heard-about-us-options", HeardAboutUsOptionViewSet, basename="heardaboutusoption")
router.register(r"institution-type-options", InstitutionTypeOptionViewSet, basename="institutiontypeoption")
router.register(r"school-type-options", SchoolTypeOptionViewSet, basename="schooltypeoption")

router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'commissions', CommissionViewSet, basename='commission')  
router.register(r'task-role-perms', TaskRolePermissionViewSet, basename='taskroleperm')  
router.register(r'atelier-view-perms', AtelierViewPermissionViewSet, basename='atelierviewperm')  


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include([
        path('', include(router.urls)),
        path('profile/', UserProfileView.as_view(), name='profile'),
        path('password/change/', ChangePasswordView.as_view(), name='password-change'),
        path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    ])),
]