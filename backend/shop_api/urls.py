from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    login_view, CategoryViewSet, LocationViewSet, 
    ProductViewSet, ProductLocationViewSet, ReservationViewSet, 
    check_expired_reservations, dashboard_stats
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'products', ProductViewSet)
router.register(r'stocks', ProductLocationViewSet)
router.register(r'reservations', ReservationViewSet)

urlpatterns = [
    path('auth/login/', login_view, name='login'),
    path('reservations/check-expired/', check_expired_reservations, name='check-expired'),
    path('dashboard/stats/', dashboard_stats, name='dashboard-stats'),
    path('', include(router.urls)),
]
