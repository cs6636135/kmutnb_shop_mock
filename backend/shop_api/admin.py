from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Category, Location, Product, ProductLocation, Reservation

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('KMUTNB Shop Role Info', {'fields': ('role', 'location')}),
    )
    list_display = ['username', 'email', 'role', 'location', 'is_staff']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'description']

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'building', 'floor', 'room']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price', 'reservable', 'created_at']
    list_filter = ['category', 'reservable']

@admin.register(ProductLocation)
class ProductLocationAdmin(admin.ModelAdmin):
    list_display = ['product', 'location', 'stock']

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['reservation_code', 'student_id', 'product', 'location', 'quantity', 'status', 'expires_at']
    list_filter = ['status', 'location']
    search_fields = ['reservation_code', 'student_id']
