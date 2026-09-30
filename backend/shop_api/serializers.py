import uuid
import datetime
from django.utils import timezone
from rest_framework import serializers
from .models import User, Category, Location, Product, ProductLocation, Reservation

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    location_name = serializers.CharField(source='location.name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'location', 'location_name', 'created_at']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ProductLocationSerializer(serializers.ModelSerializer):
    location_name = serializers.CharField(source='location.name', read_only=True)
    building = serializers.CharField(source='location.building', read_only=True)

    class Meta:
        model = ProductLocation
        fields = ['id', 'product', 'location', 'location_name', 'building', 'stock']


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    locations = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'category_name', 'name', 
            'description', 'price', 'image_url', 
            'reservable', 'created_at', 'locations'
        ]

    def get_locations(self, obj):
        pls = obj.product_locations.all()
        return [
            {
                'location_id': pl.location.id,
                'location_name': f"{pl.location.name} ({pl.location.building})",
                'stock': pl.stock
            }
            for pl in pls
        ]


class ReservationSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)

    class Meta:
        model = Reservation
        fields = [
            'id', 'reservation_code', 'student_id', 
            'product', 'product_name', 'location', 'location_name', 
            'quantity', 'status', 'reserved_at', 'expires_at', 'picked_up_at'
        ]
        read_only_fields = ['reservation_code', 'reserved_at', 'expires_at', 'picked_up_at']

    def create(self, validated_data):
        product = validated_data['product']
        location = validated_data['location']
        quantity = validated_data['quantity']

        if not product.reservable:
            raise serializers.ValidationError({"product": "สินค้านี้ไม่เปิดให้จองล่วงหน้า"})

        # Check stock in ProductLocation
        try:
            pl = ProductLocation.objects.get(product=product, location=location)
            if pl.stock < quantity:
                raise serializers.ValidationError({"quantity": f"Stock คงเหลือไม่เพียงพอ (คงเหลือ {pl.stock} ชิ้น)"})
            
            # Deduct stock
            pl.stock -= quantity
            pl.save()
        except ProductLocation.DoesNotExist:
            raise serializers.ValidationError({"location": "ไม่พบข้อมูล Stock สินค้านี้ในสถานที่จำหน่ายที่เลือก"})

        # Generate reservation code (e.g., RES-20260930-1234)
        now = timezone.now()
        code = f"RES-{now.strftime('%Y%m%d')}-{uuid.uuid4().hex[:4].upper()}"
        expires = now + datetime.timedelta(hours=4)

        reservation = Reservation.objects.create(
            reservation_code=code,
            student_id=validated_data['student_id'],
            product=product,
            location=location,
            quantity=quantity,
            status='reserved',
            expires_at=expires
        )
        return reservation
