import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import StatusBadge from '../../components/StatusBadge';
import { Clock, Search, CheckCircle2, XCircle, RefreshCw, PackageCheck, AlertCircle } from 'lucide-react';

export default function ReservationsAdmin() {
  const { user, isAdmin, isStaff } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState('');

  const loadData = () => {
    const saved = JSON.parse(localStorage.getItem('kmutnb_reservations') || '[]');
    setReservations(saved);
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStatus = (id, newStatus) => {
    const now = new Date().toISOString();
    const updated = reservations.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: newStatus,
          picked_up_at: newStatus === 'picked_up' ? now : r.picked_up_at
        };
      }
      return r;
    });
    setReservations(updated);
    localStorage.setItem('kmutnb_reservations', JSON.stringify(updated));

    const statusText = newStatus === 'picked_up' ? 'รับสินค้าแล้ว' : newStatus === 'cancelled' ? 'ยกเลิกรายการ' : newStatus;
    setMsg(`อัปเดตสถานะการจองเป็น "${statusText}" เรียบร้อยแล้ว`);
    setTimeout(() => setMsg(''), 4000);
  };

  // Filter based on role & search query
  const filtered = reservations.filter(r => {
    // If staff, filter by location_id
    if (isStaff && user?.location_id) {
      if (String(r.location_id) !== String(user.location_id)) return false;
    }

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.reservation_code?.toLowerCase().includes(q) ||
      r.student_id?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-700" />
            จัดการรายการจองสินค้า (Reservation Management)
          </h1>
          <p className="text-xs text-gray-500">
            {isStaff 
              ? `รายการจองเฉพาะจุดจำหน่าย: ${user?.location_name}` 
              : 'รายการจองรวมทุกจุดจำหน่ายในมหาวิทยาลัย'}
          </p>
        </div>
        <button
          onClick={loadData}
          className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0"
        >
          <RefreshCw className="w-4 h-4" /> รีเฟรชข้อมูล
        </button>
      </div>

      {msg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาจากรหัสจอง (RES-...) หรือ รหัสนักศึกษา..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b">
              <th className="p-4">รหัสการจอง & ผู้จอง</th>
              <th className="p-4">สินค้า & จำนวน</th>
              <th className="p-4">จุดรับสินค้า</th>
              <th className="p-4">เวลาจอง & หมดอายุ (4 ชม.)</th>
              <th className="p-4">สถานะ</th>
              <th className="p-4 text-right">ดำเนินการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {filtered.length > 0 ? (
              filtered.map((r) => {
                const isExpired = new Date(r.expires_at) < new Date() && r.status === 'reserved';
                const currentStatus = isExpired ? 'expired' : r.status;

                return (
                  <tr key={r.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4">
                      <strong className="block text-red-900 font-mono text-sm">{r.reservation_code}</strong>
                      <span className="text-[11px] text-gray-500">รหัสนักศึกษา: {r.student_id}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-gray-900 block">{r.product_name || `สินค้า #${r.product_id}`}</span>
                      <span className="text-gray-500">{r.quantity} ชิ้น</span>
                    </td>
                    <td className="p-4 text-gray-700 font-medium">{r.location_name}</td>
                    <td className="p-4 text-[11px] text-gray-500 space-y-0.5">
                      <div>จองเมื่อ: {new Date(r.reserved_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.</div>
                      <div className="font-semibold text-amber-800">
                        หมดอายุ: {new Date(r.expires_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                      </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={currentStatus} />
                    </td>
                    <td className="p-4 text-right space-x-1">
                      {currentStatus === 'reserved' && (
                        <>
                          <button
                            onClick={() => updateStatus(r.id, 'picked_up')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] transition-colors shadow-2xs"
                          >
                            ยืนยันการรับสินค้า
                          </button>
                          <button
                            onClick={() => updateStatus(r.id, 'cancelled')}
                            className="px-2.5 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg text-[11px] transition-colors"
                          >
                            ยกเลิก
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">
                  ไม่พบรายการจองสินค้า
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
