from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from api.views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from django.conf import settings
from django.conf.urls.static import static

router = routers.DefaultRouter()
router.register(r'api/users', UserViewSet, basename='users')
router.register(r'api/products', ProductViewSet, basename='products')
router.register(r'api/prod_images', ProductImageViewSet, basename='prod_images')
router.register(r'api/orders', OrderViewSet, basename='orders')
router.register(r'api/orderlines', OrderlineViewSet, basename='orderlines')

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/check_token_validity/', CheckTokenValidity.as_view(), name='check_token_validity')
]

urlpatterns += router.urls

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
