from django.utils import timezone
from rest_framework import viewsets, status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

from .models import User, Category, Location, Product, ProductLocation, Reservation
from .serializers import (
    UserSerializer, CategorySerializer, LocationSerializer, 
    ProductSerializer, ProductLocationSerializer, ReservationSerializer
)
from .permissions import IsAdminUser, IsStaffOrAdmin


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        })
    return Response({'message': 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'}, status=status.HTTP_400_BAD_REQUEST)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().prefetch_related('product_locations')
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]


class ProductLocationViewSet(viewsets.ModelViewSet):
    queryset = ProductLocation.objects.all().select_related('product', 'location')
    serializer_class = ProductLocationSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsStaffOrAdmin()]

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()
        # If Staff, restrict to assigned location
        if user.is_authenticated and user.role == 'Staff' and user.location:
            return qs.filter(location=user.location)
        return qs


class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all().select_related('product', 'location').order_by('-reserved_at')
    serializer_class = ReservationSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        if self.action == 'list' and (self.request.query_params.get('student_id') or self.request.query_params.get('code')):
            return [AllowAny()]
        return [IsStaffOrAdmin()]

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()
        
        # Public search check via query params
        student_id = self.request.query_params.get('student_id')
        code = self.request.query_params.get('code')
        if student_id:
            return qs.filter(student_id__icontains=student_id)
        if code:
            return qs.filter(reservation_code__icontains=code)

        # Staff restrictions
        if user.is_authenticated and user.role == 'Staff' and user.location:
            return qs.filter(location=user.location)
        return qs

    def perform_update(self, serializer):
        instance = serializer.save()
        # If status changed to cancelled or expired, refund stock
        if instance.status in ['cancelled', 'expired']:
            try:
                pl = ProductLocation.objects.get(product=instance.product, location=instance.location)
                pl.stock += instance.quantity
                pl.save()
            except ProductLocation.DoesNotExist:
                pass


@api_view(['POST'])
@permission_classes([AllowAny])
def check_expired_reservations(request):
    """
    Workflow 3 & FR13, FR14: Auto mark expired reservations and return stock
    """
    now = timezone.now()
    expired_items = Reservation.objects.filter(status='reserved', expires_at__lt=now)
    count = 0
    for res in expired_items:
        res.status = 'expired'
        res.save()
        try:
            pl = ProductLocation.objects.get(product=res.product, location=res.location)
            pl.stock += res.quantity
            pl.save()
        except ProductLocation.DoesNotExist:
            pass
        count += 1

    return Response({
        'message': f'ตรวจสอบรายการหมดอายุเรียบร้อยแล้ว (อัปเดตและคืน Stock {count} รายการ)',
        'expired_count': count
    })


@api_view(['GET'])
@permission_classes([IsStaffOrAdmin])
def dashboard_stats(request):
    user = request.user
    if user.role == 'Staff' and user.location:
        res_qs = Reservation.objects.filter(location=user.location)
        total_products = ProductLocation.objects.filter(location=user.location).count()
    else:
        res_qs = Reservation.objects.all()
        total_products = Product.objects.count()

    return Response({
        'total_products': total_products,
        'active_reservations': res_qs.filter(status='reserved').count(),
        'picked_up_reservations': res_qs.filter(status='picked_up').count(),
        'expired_reservations': res_qs.filter(status='expired').count(),
        'total_locations': Location.objects.count()
    })
