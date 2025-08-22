from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from customuser.views import (
    CustomUserViewSet, UserProfileView, ChangePasswordView, TitleViewSet, CityViewSet, AtelierViewSet, CustomTokenObtainPairView,
    HeardAboutUsOptionViewSet, InstitutionTypeOptionViewSet, SchoolTypeOptionViewSet, CommissionViewSet
)

from announcements.views import AnnouncementViewSet, AnnouncementPermissionViewSet

from tasks.views import TaskViewSet, TaskRolePermissionViewSet


router = routers.DefaultRouter()
router.register(r'users', CustomUserViewSet, basename='user')
router.register(r'titles', TitleViewSet, basename='title')
router.register(r'cities', CityViewSet, basename='city')
router.register(r'ateliers', AtelierViewSet, basename='atelier')
router.register(r"heard-about-us-options", HeardAboutUsOptionViewSet, basename="heardaboutusoption")
router.register(r"institution-type-options", InstitutionTypeOptionViewSet, basename="institutiontypeoption")
router.register(r"school-type-options", SchoolTypeOptionViewSet, basename="schooltypeoption")
router.register(r'commissions', CommissionViewSet, basename='commission')

router.register(r'tasks', TaskViewSet, basename='task')
# router.register(r'task-role-perms', TaskRolePermissionViewSet, basename='taskroleperm')
router.register(r'announcements', AnnouncementViewSet, basename='announcement')
# router.register(r'announcement-role-perms', AnnouncementPermissionViewSet, basename='announcementroleperm')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include([
        path('', include(router.urls)),
        path('profile/', UserProfileView.as_view(), name='profile'),
        path('password/change/', ChangePasswordView.as_view(), name='password-change'),
        path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    ])),
]