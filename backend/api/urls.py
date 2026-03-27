from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClienteViewSet, MockupViewSet

router = DefaultRouter()
router.register(r'clientes', ClienteViewSet)
router.register(r'mockups', MockupViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
