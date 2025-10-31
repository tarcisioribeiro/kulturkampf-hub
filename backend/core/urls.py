from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import WriterProfileViewSet, PostViewSet, MetricViewSet
from .auth_views import register, get_user, logout

router = DefaultRouter()
router.register(r'perfis', WriterProfileViewSet, basename='perfil')
router.register(r'postagens', PostViewSet, basename='postagem')
router.register(r'metricas', MetricViewSet, basename='metrica')

urlpatterns = [
    path('', include(router.urls)),
    # Authentication endpoints
    path('auth/register/', register, name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/user/', get_user, name='get_user'),
    path('auth/logout/', logout, name='logout'),
]
