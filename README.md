# KMUTNB Shop - ระบบค้นหาและจองสินค้าภายในมหาวิทยาลัย

โครงสร้างโปรเจคถูกสร้างและออกแบบอย่างครบถ้วนตามข้อกำหนดในเอกสารข้อเสนอโครงงาน (KMUTNB Shop)

---

## 📁 โครงสร้างโฟลเดอร์โปรเจค (Project Structure)

```text
kmutnb-shop/
├── README.md
├── frontend/                     # ระบบส่วนหน้าพัฒนาด้วย React + Vite + Tailwind CSS
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── public/
│   │   └── images/
│   └── src/
│       ├── main.jsx
│       ├── App.jsx               # Navigation Router & Layout
│       ├── components/           # Reusable Components
│       │   ├── Navbar.jsx        # แถบเมนูด้านบนและสถานะ Login
│       │   ├── ProductCard.jsx   # การ์ดแสดงสินค้าและ Stock แต่ละสาขา
│       │   ├── SearchBar.jsx     # กล่องค้นหาและตัวกรองหมวดหมู่/สถานที่
│       │   ├── LocationCard.jsx  # การ์ดแสดงสถานที่จำหน่าย อาคาร/ชั้น
│       │   ├── ReservationForm.jsx # แบบฟอร์มการจองสินค้า 4 ชั่วโมง
│       │   └── StatusBadge.jsx   # ป้ายสถานะการจอง (RESERVED, PICKED_UP, EXPIRED, CANCELLED)
│       ├── pages/                # หน้าสำหรับผู้ใช้งานนักศึกษา/บุคลากร (Customer)
│       │   ├── Home.jsx          # หน้าแรก Banner ค้นหา และสินค้าไฮไลต์
│       │   ├── Products.jsx      # หน้ารายการสินค้าทั้งหมด
│       │   ├── ProductDetail.jsx # หน้าแสดงรายละเอียดสินค้า Stock และฟอร์มจอง
│       │   ├── Reservation.jsx   # หน้าทำรายการจอง
│       │   └── ReservationStatus.jsx # หน้าตรวจสอบสถานะและประวัติด้วยรหัสนักศึกษา/รหัสจอง
│       ├── pages/admin/          # หน้าสำหรับ Admin และ Staff
│       │   ├── Login.jsx         # หน้าเข้าสู่ระบบผู้ดูแล/เจ้าหน้าที่
│       │   ├── Dashboard.jsx     # Dashboard ภาพรวมระบบและภาพรวมสาขา
│       │   ├── Products.jsx      # หน้าจัดการสินค้า (เพิ่ม/แก้ไข/ลบ/สิทธิ์จอง)
│       │   ├── Categories.jsx    # หน้าจัดการหมวดหมู่สินค้า
│       │   ├── Locations.jsx     # หน้าจัดการจุดจำหน่าย/อาคาร/ชั้น
│       │   ├── Stock.jsx         # หน้าจัดการ Stock ตามจุดจำหน่าย (Workflow 5)
│       │   └── Reservations.jsx  # หน้าจัดการรายการจอง (ยืนยันรับสินค้า/ยกเลิก)
│       ├── services/
│       │   └── api.js            # API Service Axios & Fallback Mock Data
│       ├── hooks/
│       │   └── useAuth.js        # Auth Context Management (Admin vs Staff)
│       └── styles/
│           └── style.css         # Tailwind & Custom Styling
│
└── backend/                      # ระบบส่วนหลังพัฒนาด้วย Django + Django REST Framework
    ├── manage.py
    ├── seed_data.py              # สคริปต์ลงข้อมูลเริ่มต้น (Admin, Staff, Products, Stock)
    ├── db.sqlite3                # ฐานข้อมูล SQLite ที่พร้อมใช้งาน
    ├── requirements.txt
    ├── kmutnb_backend/           # Django Core Settings
    │   ├── settings.py
    │   └── urls.py
    └── shop_api/                 # REST API Application
        ├── models.py             # User, Category, Product, Location, ProductLocation, Reservation
        ├── serializers.py        # Serializer + Stock Deduction + Auto Expire Logic
        ├── views.py              # API ViewSets & Dashboard Stats
        ├── permissions.py        # Admin vs Staff Permission Logic (จำกัดตาม Location)
        ├── urls.py
        └── management/
            └── commands/
                └── check_expired.py # คำสั่งเช็กการหมดอายุ 4 ชั่วโมงและคืน Stock อัตโนมัติ
```

---

## 🔐 ข้อมูลเข้าสู่ระบบทดสอบ (Demo Accounts)

| สิทธิ์การใช้งาน (Role) | Username | Password | ขอบเขตหน้าที่ (Scope & Location) |
| :--- | :--- | :--- | :--- |
| **Admin (ผู้ดูแลระบบ)** | `admin` | `admin123` | จัดการข้อมูลได้ทุกส่วน ทั้งสินค้า หมวดหมู่ สถานที่ Stock ทุกสาขา และดู Dashboard ภาพรวม |
| **Staff (เจ้าหน้าที่)** | `staff1` | `staff123` | จัดการ Stock และยืนยันรายการจองเฉพาะ **ร้านค้าสวัสดิการ อาคาร 40 ชั้น 1** |
| **Staff (เจ้าหน้าที่)** | `staff2` | `staff123` | จัดการ Stock และยืนยันรายการจองเฉพาะ **ศูนย์หนังสือวิศวกรรมศาสตร์ อาคาร 81 ชั้น 2** |

---

## ⚡ วิธีการรันโปรเจค (How to Run)

### 1. รันระบบ Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
เว็บแอปพลิเคชันจะเปิดที่: `http://localhost:3000`

### 2. รันระบบ Backend (Django REST Framework)
```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```
ระบบ Backend API จะทำงานที่: `http://127.0.0.1:8000/api/`

---

## 🛠️ ระบบการทำงานหลัก (Key Business Workflows)

1. **การค้นหาและจองสินค้า (Customer Workflow)**
   - ค้นหาสินค้าจากชื่อ หมวดหมู่ หรือสถานที่จำหน่าย
   - ตรวจสอบจำนวน Stock คงเหลือในแต่ละจุดจำหน่าย
   - กรอกรหัสนักศึกษา/บุคลากร เลือกจำนวน และจุดรับสินค้า
   - ระบบสร้างรหัสการจอง (`RES-YYYYMMDD-XXXX`) และตัด Stock ทันที
   - กำหนดเวลาหมดอายุ **4 ชั่วโมง**

2. **การรับสินค้าหน้าร้าน (Pickup Workflow)**
   - ผู้จองนำรหัสการจองหรือรหัสนักศึกษาไปที่จุดจำหน่าย
   - เจ้าหน้าที่ (Staff) ค้นหารายการจอง และกด **"ยืนยันการรับสินค้า"** (เปลี่ยนสถานะเป็น `PICKED_UP`)
   - ชำระเงินหน้าร้าน

3. **การหมดอายุและการคืน Stock (Auto Expire Workflow)**
   - หากพ้นกำหนด 4 ชั่วโมง และผู้จองยังไม่ได้มารับสินค้า ระบบหรือคำสั่ง `python manage.py check_expired` จะเปลี่ยนสถานะเป็น `EXPIRED` และคืน Stock กลับเข้าสถานที่จำหน่ายโดยอัตโนมัติ

4. **การควบคุมสิทธิ์ตามจุดจำหน่าย (Role & Authorization)**
   - Admin จัดการข้อมูลหลักทุกส่วนของระบบ
   - Staff จัดการข้อมูล Stock และรายการจองเฉพาะสถานที่ตนเองที่ได้รับมอบหมาย (`location_id`)
"# kmutnb_shop_mock" 
