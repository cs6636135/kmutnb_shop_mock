import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ShoppingBag, Tag, MapPin, Layers, Clock, CheckCircle2, ShieldCheck, Users, ArrowUpRight } from 'lucide-react';
import { initialMockProducts, initialMockCategories, initialMockLocations } from '../../services/api';

export default function Dashboard() {
  const { user, isAdmin, isStaff } = useAuth();

  const totalProducts = initialMockProducts.length;
  const totalCategories = initialMockCategories.length;
  const totalLocations = initialMockLocations.length;

  const savedReservations = JSON.parse(localStorage.getItem('kmutnb_reservations') || '[]');
  
  // Filter for Staff location if Staff
  const filteredReservations = isStaff && user?.location_id
    ? savedReservations.filter(r => String(r.location_id) === String(user.location_id))
    : savedReservations;

  const activeReservations = filteredReservations.filter(r => r.status === 'reserved');
  const pickedUpReservations = filteredReservations.filter(r => r.status === 'picked_up');

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-900 to-red-800 text-white p-6 md:p-8 rounded-3xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            {isAdmin ? 'สิทธิ์ผู้ดูแลระบบ (Admin Access)' : `สิทธิ์พนักงานประจำสาขา (Staff Access)`}
          </div>
          <h1 className="text-2xl font-bold">ยินดีต้อนรับ, {user?.name || user?.username}</h1>
          <p className="text-xs text-red-100">
            {isAdmin 
              ? 'คุณสามารถจัดการข้อมูลสินค้า หมวดหมู่ จุดจำหน่าย และตรวจสอบ Dashboard ภาพรวมทุกสาขาได้' 
              : `สาขาที่รับผิดชอบ: ${user?.location_name}`}
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/admin/reservations"
            className="px-4 py-2.5 bg-white text-red-900 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4" />
            จัดการรายการจอง
          </Link>
          {isAdmin && (
            <Link
              to="/admin/products"
              className="px-4 py-2.5 bg-red-950/60 hover:bg-red-950 text-white border border-red-700/50 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              จัดการสินค้า
            </Link>
          )}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-xs font-semibold">สินค้าทั้งหมด</span>
            <ShoppingBag className="w-5 h-5 text-red-700" />
          </div>
          <div className="text-2xl font-black text-gray-900">{totalProducts}</div>
          <p className="text-[11px] text-gray-400">รายการในระบบ</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-xs font-semibold">รายการจองรอรับ</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700">{activeReservations.length}</div>
          <p className="text-[11px] text-gray-400">อยู่ระหว่างกำหนดเวลา 4 ชม.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-xs font-semibold">รับสินค้าสำเร็จ</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{pickedUpReservations.length}</div>
          <p className="text-[11px] text-gray-400">ชำระและรับหน้าร้านแล้ว</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-xs font-semibold">จุดจำหน่าย</span>
            <MapPin className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">{totalLocations}</div>
          <p className="text-[11px] text-gray-400">สาขา/อาคาร</p>
        </div>
      </div>

      {/* Navigation Quick Grid for Admin/Staff */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-gray-900">เมนูการจัดการระบบ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link
            to="/admin/reservations"
            className="p-5 bg-white rounded-2xl border border-gray-200 hover:border-red-600 hover:shadow-md transition-all group flex items-start justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900 group-hover:text-red-700">จัดการรายการจอง</h3>
              <p className="text-xs text-gray-500">ตรวจสอบรหัสจอง ตัด Stock เปลี่ยนสถานะการรับสินค้า</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-red-700 transition-colors" />
          </Link>

          <Link
            to="/admin/stock"
            className="p-5 bg-white rounded-2xl border border-gray-200 hover:border-red-600 hover:shadow-md transition-all group flex items-start justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900 group-hover:text-red-700">จัดการ Stock สินค้า</h3>
              <p className="text-xs text-gray-500">
                {isAdmin ? 'ปรับเปลี่ยนจำนวน Stock ทุกสาขา' : `ปรับ Stock สำหรับสาขาของคุณ (${user?.location_name})`}
              </p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-red-700 transition-colors" />
          </Link>

          {isAdmin && (
            <>
              <Link
                to="/admin/products"
                className="p-5 bg-white rounded-2xl border border-gray-200 hover:border-red-600 hover:shadow-md transition-all group flex items-start justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-red-700">จัดการสินค้า</h3>
                  <p className="text-xs text-gray-500">เพิ่ม แก้ไข ลบรายการสินค้า และสิทธิ์การจอง</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-red-700 transition-colors" />
              </Link>

              <Link
                to="/admin/categories"
                className="p-5 bg-white rounded-2xl border border-gray-200 hover:border-red-600 hover:shadow-md transition-all group flex items-start justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    <Tag className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-red-700">จัดการหมวดหมู่</h3>
                  <p className="text-xs text-gray-500">เพิ่ม แก้ไข ลบหมวดหมู่สินค้าในระบบ</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-red-700 transition-colors" />
              </Link>

              <Link
                to="/admin/locations"
                className="p-5 bg-white rounded-2xl border border-gray-200 hover:border-red-600 hover:shadow-md transition-all group flex items-start justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-red-700">จัดการสถานที่จำหน่าย</h3>
                  <p className="text-xs text-gray-500">จัดการรายชื่อจุดจำหน่าย อาคาร ชั้น และรายละเอียด</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-red-700 transition-colors" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
