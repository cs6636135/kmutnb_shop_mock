import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kmutnb_backend.settings')
django.setup()

from shop_api.models import User, Category, Location, Product, ProductLocation, Reservation

def seed():
    print("Seeding KMUTNB Shop initial database data...")

    # 1. Create Locations
    loc1, _ = Location.objects.get_or_create(
        id=1,
        defaults={
            'name': 'ร้านค้าสวัสดิการ',
            'building': 'อาคาร 40',
            'floor': 'ชั้น 1',
            'room': '101',
            'description': 'จำหน่ายสินค้าทั่วไปและอุปกรณ์นักศึกษา'
        }
    )
    loc2, _ = Location.objects.get_or_create(
        id=2,
        defaults={
            'name': 'ศูนย์หนังสือ คณะวิศวกรรมศาสตร์',
            'building': 'อาคาร 81',
            'floor': 'ชั้น 2',
            'room': '204',
            'description': 'จำหน่ายตำราวิศวะและเครื่องมือเฉพาะทาง'
        }
    )
    loc3, _ = Location.objects.get_or_create(
        id=3,
        defaults={
            'name': 'ร้านค้าสหกรณ์',
            'building': 'อาคารอธิการบดี',
            'floor': 'ชั้น 1',
            'room': 'โถงกลาง',
            'description': 'ของที่ระลึกมหาวิทยาลัยและชุดนักศึกษา'
        }
    )

    # 2. Create Users (Admin & Staff)
    if not User.objects.filter(username='admin').exists():
        admin = User.objects.create_superuser('admin', 'admin@kmutnb.ac.th', 'admin123')
        admin.role = 'Admin'
        admin.save()
        print("Created Admin user: admin / admin123")

    if not User.objects.filter(username='staff1').exists():
        staff1 = User.objects.create_user('staff1', 'staff1@kmutnb.ac.th', 'staff123')
        staff1.role = 'Staff'
        staff1.location = loc1
        staff1.save()
        print("Created Staff user: staff1 / staff123 (อาคาร 40)")

    if not User.objects.filter(username='staff2').exists():
        staff2 = User.objects.create_user('staff2', 'staff2@kmutnb.ac.th', 'staff123')
        staff2.role = 'Staff'
        staff2.location = loc2
        staff2.save()
        print("Created Staff user: staff2 / staff123 (อาคาร 81)")

    # 3. Create Categories
    c1, _ = Category.objects.get_or_create(id=1, defaults={'name': 'หนังสือเรียน', 'description': 'ตำราเรียนและเอกสารประกอบการสอนทุกคณะ'})
    c2, _ = Category.objects.get_or_create(id=2, defaults={'name': 'เครื่องแบบนักศึกษา', 'description': 'เสื้อช็อป เสื้อนักศึกษา เนกไท และสายเข็มขัด'})
    c3, _ = Category.objects.get_or_create(id=3, defaults={'name': 'เครื่องประดับ & ของที่ระลึก', 'description': 'เข็มไท เข็มติดเสื้อ ตราประจำมหาวิทยาลัย'})
    c4, _ = Category.objects.get_or_create(id=4, defaults={'name': 'เครื่องเขียน', 'description': 'สมุด ปากกา อุปกรณ์การเรียนและงานเขียนแบบ'})

    # 4. Create Products
    p1, _ = Product.objects.get_or_create(
        id=1,
        defaults={
            'category': c1,
            'name': 'หนังสือ Data Structure & Algorithms',
            'price': 350.00,
            'description': 'ตำราเรียนวิชาโครงสร้างข้อมูลและอัลกอริทึม สำหรับนักศึกษาภาควิชาคอมพิวเตอร์',
            'image_url': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
            'reservable': True
        }
    )
    p2, _ = Product.objects.get_or_create(
        id=2,
        defaults={
            'category': c2,
            'name': 'เสื้อช็อปนักศึกษา KMUTNB (สีกรม)',
            'price': 450.00,
            'description': 'เสื้อช็อปปฏิบัติการ ตัดเย็บจากผ้าเวสปอยท์อย่างดี ปักโลโก้มหาวิทยาลัย',
            'image_url': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
            'reservable': True
        }
    )
    p3, _ = Product.objects.get_or_create(
        id=3,
        defaults={
            'category': c3,
            'name': 'เข็มวิทยะ KMUTNB พระวิษณุกรรม',
            'price': 120.00,
            'description': 'เข็มติดปกเสื้อช็อป/ชุดนักศึกษา ตราพระวิษณุกรรม โลหะชุบทองอย่างดี',
            'image_url': 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500',
            'reservable': True
        }
    )
    p4, _ = Product.objects.get_or_create(
        id=4,
        defaults={
            'category': c4,
            'name': 'สมุดโน้ตตรากราฟ KMUTNB (ปกแข็ง)',
            'price': 45.00,
            'description': 'สมุดโน้ต 100 แผ่น กระดาษถนอมสายตา ตราสัญลักษณ์ KMUTNB',
            'image_url': 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500',
            'reservable': False
        }
    )

    # 5. Product Stock per Location
    ProductLocation.objects.get_or_create(product=p1, location=loc1, defaults={'stock': 10})
    ProductLocation.objects.get_or_create(product=p1, location=loc2, defaults={'stock': 5})
    ProductLocation.objects.get_or_create(product=p2, location=loc1, defaults={'stock': 15})
    ProductLocation.objects.get_or_create(product=p2, location=loc3, defaults={'stock': 8})
    ProductLocation.objects.get_or_create(product=p3, location=loc1, defaults={'stock': 25})
    ProductLocation.objects.get_or_create(product=p3, location=loc2, defaults={'stock': 20})
    ProductLocation.objects.get_or_create(product=p4, location=loc1, defaults={'stock': 50})
    ProductLocation.objects.get_or_create(product=p4, location=loc3, defaults={'stock': 30})

    print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed()
