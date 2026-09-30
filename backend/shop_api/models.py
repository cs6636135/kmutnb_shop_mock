from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import datetime

class Location(models.Model):
    name = models.CharField(max_length=150, verbose_name="ชื่อจุดจำหน่าย")
    building = models.CharField(max_length=100, verbose_name="อาคาร/ชื่ออาคาร")
    floor = models.CharField(max_length=30, verbose_name="ชั้น")
    room = models.CharField(max_length=100, verbose_name="ห้องหรือบริเวณ")
    description = models.TextField(blank=True, null=True, verbose_name="รายละเอียดสถานที่")

    class Meta:
        db_table = 'locations'
        verbose_name = 'สถานที่จำหน่าย'
        verbose_name_plural = 'สถานที่จำหน่าย'

    def __str__(self):
        return f"{self.name} ({self.building})"


class User(AbstractUser):
    ROLE_CHOICES = (
        ('Admin', 'Admin (ผู้ดูแลระบบ)'),
        ('Staff', 'Staff (พนักงานประจำสถานที่)'),
    )
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default='Staff', verbose_name="สิทธิ์ผู้ใช้งาน")
    location = models.ForeignKey(
        Location, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='staff_members',
        verbose_name="สถานที่รับผิดชอบ ( null = Admin )"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="วันที่สร้างบัญชี")

    class Meta:
        db_table = 'users'
        verbose_name = 'ผู้ใช้งาน'
        verbose_name_plural = 'ผู้ใช้งาน'

    def __str__(self):
        return f"{self.username} [{self.role}]"


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="ชื่อหมวดหมู่")
    description = models.TextField(blank=True, null=True, verbose_name="รายละเอียดหมวดหมู่")

    class Meta:
        db_table = 'categories'
        verbose_name = 'หมวดหมู่สินค้า'
        verbose_name_plural = 'หมวดหมู่สินค้า'

    def __str__(self):
        return self.name


class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products', verbose_name="หมวดหมู่")
    name = models.CharField(max_length=150, verbose_name="ชื่อสินค้า")
    description = models.TextField(blank=True, null=True, verbose_name="รายละเอียดสินค้า")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="ราคาสินค้า")
    image_url = models.CharField(max_length=255, blank=True, null=True, verbose_name="URL รูปภาพสินค้า")
    reservable = models.BooleanField(default=True, verbose_name="รองรับการจองหรือไม่ (1=ได้, 0=ไม่ได้)")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="วันที่เพิ่มสินค้า")

    class Meta:
        db_table = 'products'
        verbose_name = 'สินค้า'
        verbose_name_plural = 'สินค้า'

    def __str__(self):
        return self.name


class ProductLocation(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_locations')
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='product_locations')
    stock = models.IntegerField(default=0, verbose_name="จำนวนสินค้าคงเหลือ")

    class Meta:
        db_table = 'product_locations'
        unique_together = ('product', 'location')
        verbose_name = 'Stock สินค้าตามจุดจำหน่าย'
        verbose_name_plural = 'Stock สินค้าตามจุดจำหน่าย'

    def __str__(self):
        return f"{self.product.name} @ {self.location.name}: Stock={self.stock}"


class Reservation(models.Model):
    STATUS_CHOICES = (
        ('reserved', 'จองแล้ว (Reserved)'),
        ('picked_up', 'รับสินค้าแล้ว (Picked Up)'),
        ('expired', 'หมดอายุ (Expired)'),
        ('cancelled', 'ยกเลิก (Cancelled)'),
    )

    reservation_code = models.CharField(max_length=30, unique=True, verbose_name="รหัสการจอง")
    student_id = models.CharField(max_length=20, verbose_name="รหัสนักศึกษา/บุคลากร")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reservations')
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='reservations')
    quantity = models.IntegerField(default=1, verbose_name="จำนวนที่จอง")
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='reserved', verbose_name="สถานะการจอง")
    reserved_at = models.DateTimeField(auto_now_add=True, verbose_name="เวลาที่จอง")
    expires_at = models.DateTimeField(verbose_name="เวลาหมดอายุ (4 ชม.)")
    picked_up_at = models.DateTimeField(null=True, blank=True, verbose_name="เวลารับสินค้า")

    class Meta:
        db_table = 'reservations'
        verbose_name = 'รายการจองสินค้า'
        verbose_name_plural = 'รายการจองสินค้า'

    def save(self, *args, **kwargs):
        if not self.expires_at and self.reserved_at:
            self.expires_at = self.reserved_at + datetime.timedelta(hours=4)
        elif not self.expires_at:
            self.expires_at = timezone.now() + datetime.timedelta(hours=4)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.reservation_code} ({self.student_id}) - {self.status}"
