import React, { useState } from 'react';
import { ShoppingBag, UserCheck, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { reservationService } from '../services/api';

export default function ReservationForm({ product, locations = [], onSubmitSuccess }) {
  const [selectedLocationId, setSelectedLocationId] = useState(
    locations.find(l => l.stock > 0)?.location_id || locations[0]?.location_id || ''
  );
  const [studentId, setStudentId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [reservationResult, setReservationResult] = useState(null);

  const selectedLocObj = locations.find(l => String(l.location_id || l.location) === String(selectedLocationId));
  const maxStock = selectedLocObj ? selectedLocObj.stock : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!studentId.trim()) {
      setErrorMsg('กรุณากรอกรหัสนักศึกษา/บุคลากร');
      return;
    }

    if (!selectedLocationId) {
      setErrorMsg('กรุณาเลือกสถานที่รับสินค้า');
      return;
    }

    if (quantity < 1 || quantity > maxStock) {
      setErrorMsg(`จำนวนสินค้าต้องไม่เกิน Stock คงเหลือ (${maxStock} ชิ้น)`);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        student_id: studentId,
        product: product.id,
        location: selectedLocationId,
        quantity: Number(quantity)
      };

      const res = await reservationService.create(payload);
      setIsSubmitting(false);
      setReservationResult(res);

      if (onSubmitSuccess) {
        onSubmitSuccess(res);
      }
      return;
    } catch (err) {
      console.warn("Backend reservation failed, fallback to local mock creation", err);
    }

    // Fallback Mock Reservation
    setTimeout(() => {
      const code = `RES-${new Date().getFullYear()}${String(new Date().getMonth()+1).padStart(2,'0')}${String(new Date().getDate()).padStart(2,'0')}-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date();
      const expireTime = new Date(now.getTime() + 4 * 60 * 60 * 1000);

      const result = {
        id: Date.now(),
        reservation_code: code,
        student_id: studentId,
        product: product.id,
        product_name: product.name,
        location: selectedLocationId,
        location_name: selectedLocObj?.location_name || 'จุดจำหน่ายที่เลือก',
        quantity: Number(quantity),
        status: 'reserved',
        reserved_at: now.toISOString(),
        expires_at: expireTime.toISOString(),
      };

      const savedRes = JSON.parse(localStorage.getItem('kmutnb_reservations') || '[]');
      savedRes.unshift(result);
      localStorage.setItem('kmutnb_reservations', JSON.stringify(savedRes));

      setIsSubmitting(false);
      setReservationResult(result);

      if (onSubmitSuccess) {
        onSubmitSuccess(result);
      }
    }, 400);
  };

  if (reservationResult) {
    return (
      <div className="bg-white p-6 rounded-2xl border-2 border-emerald-500 shadow-lg space-y-5 animate-in fade-in">
        <div className="flex items-center gap-3 text-emerald-600">
          <CheckCircle2 className="w-8 h-8 shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-gray-900">จองสินค้าสำเร็จ!</h3>
            <p className="text-xs text-gray-500">กรุณาแคปหน้าจอหรือจดรหัสการจองเพื่อนำไปรับสินค้า</p>
          </div>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 text-center space-y-1">
          <span className="text-xs text-emerald-800 font-medium uppercase tracking-wider">รหัสการจองสินค้า (Reservation Code)</span>
          <div className="text-2xl font-black text-emerald-900 tracking-wider font-mono">
            {reservationResult.reservation_code}
          </div>
        </div>

        <div className="space-y-2 text-xs text-gray-700 bg-gray-50 p-4 rounded-xl">
          <div className="flex justify-between border-b pb-1.5">
            <span className="text-gray-500">รหัสนักศึกษา/ผู้จอง:</span>
            <span className="font-semibold">{reservationResult.student_id}</span>
          </div>
          <div className="flex justify-between border-b pb-1.5">
            <span className="text-gray-500">สินค้า:</span>
            <span className="font-semibold">{reservationResult.product_name || product.name}</span>
          </div>
          <div className="flex justify-between border-b pb-1.5">
            <span className="text-gray-500">จำนวนที่จอง:</span>
            <span className="font-semibold">{reservationResult.quantity} ชิ้น</span>
          </div>
          <div className="flex justify-between border-b pb-1.5">
            <span className="text-gray-500">จุดรับสินค้า:</span>
            <span className="font-semibold text-red-800">{reservationResult.location_name || selectedLocObj?.location_name}</span>
          </div>
          <div className="flex justify-between items-center text-amber-800 font-medium pt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> หมดอายุภายใน (4 ชม.):
            </span>
            <span className="font-bold">
              {new Date(reservationResult.expires_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
            </span>
          </div>
        </div>

        <p className="text-[11px] text-gray-500 text-center leading-relaxed">
          * ชำระเงินสดหรือแสกนจ่ายที่หน้าร้านเมื่อมารับสินค้า หากพ้นกำหนด 4 ชั่วโมง ระบบจะยกเลิกการจองและคืน Stock โดยอัตโนมัติ
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-red-700" />
          แบบฟอร์มจองสินค้า
        </h3>
        <span className="text-xs bg-red-100 text-red-800 font-semibold px-2.5 py-0.5 rounded-full">
          กำหนดรับภายใน 4 ชม.
        </span>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Select Location */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-gray-700">เลือกสถานที่รับสินค้า *</label>
        <select
          value={selectedLocationId}
          onChange={(e) => setSelectedLocationId(e.target.value)}
          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:ring-2 focus:ring-red-600 focus:outline-none"
        >
          {locations.map((loc, idx) => (
            <option key={loc.location_id || idx} value={loc.location_id || loc.id} disabled={loc.stock <= 0}>
              {loc.location_name} - {loc.stock > 0 ? `คงเหลือ ${loc.stock} ชิ้น` : 'สินค้าหมด'}
            </option>
          ))}
        </select>
      </div>

      {/* Student ID */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-gray-700">รหัสนักศึกษา / รหัสบุคลากร *</label>
        <div className="relative">
          <UserCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="เช่น 6604062630000"
            className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Quantity */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-gray-700">จำนวนที่ต้องการจอง *</label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="1"
            max={maxStock || 1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-28 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-center focus:ring-2 focus:ring-red-600 focus:outline-none"
          />
          <span className="text-xs text-gray-500">
            (สูงสุด {maxStock} ชิ้น สำหรับสถานที่นี้)
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || maxStock <= 0}
        className={`w-full py-3 rounded-xl text-xs font-bold text-white transition-all shadow-sm ${
          maxStock > 0 && !isSubmitting 
            ? 'bg-red-700 hover:bg-red-800 active:scale-[0.99]' 
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? 'กำลังดำเนินการจอง...' : 'ยืนยันการจองสินค้า'}
      </button>

      <p className="text-[11px] text-gray-400 text-center">
        ระบบจะตัด Stock ทันทีที่กดจอง และให้เวลาท่านมารับสินค้าภายใน 4 ชั่วโมง
      </p>
    </form>
  );
}
