import React, { useState, useEffect } from 'react';
import { Search, Clock, UserCheck, MapPin, Loader2 } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { reservationService } from '../services/api';

export default function ReservationStatus() {
  const [searchInput, setSearchInput] = useState('');
  const [reservations, setReservations] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check initial search or local storage
    const saved = JSON.parse(localStorage.getItem('kmutnb_reservations') || '[]');
    setReservations(saved);
  }, []);

  const fetchFromApi = async (query = '') => {
    setLoading(true);
    setSearched(true);
    try {
      const isCode = query.toUpperCase().startsWith('RES-');
      const params = isCode ? { code: query } : { student_id: query };
      const data = await reservationService.getAll(params);
      if (Array.isArray(data) && data.length > 0) {
        setReservations(data);
      } else {
        // Fallback to local storage if API returns empty
        const saved = JSON.parse(localStorage.getItem('kmutnb_reservations') || '[]');
        const filteredLocal = saved.filter(r => 
          !query || 
          r.student_id?.toLowerCase().includes(query.toLowerCase()) || 
          r.reservation_code?.toLowerCase().includes(query.toLowerCase())
        );
        setReservations(filteredLocal);
      }
    } catch (err) {
      console.warn("Failed to fetch reservations from API, fallback to localStorage", err);
      const saved = JSON.parse(localStorage.getItem('kmutnb_reservations') || '[]');
      const filteredLocal = saved.filter(r => 
        !query || 
        r.student_id?.toLowerCase().includes(query.toLowerCase()) || 
        r.reservation_code?.toLowerCase().includes(query.toLowerCase())
      );
      setReservations(filteredLocal);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchFromApi(searchInput.trim());
    } else {
      const saved = JSON.parse(localStorage.getItem('kmutnb_reservations') || '[]');
      setReservations(saved);
      setSearched(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center justify-center gap-2">
          <Clock className="w-7 h-7 text-red-700" />
          ตรวจสอบสถานะและประวัติการจองสินค้า
        </h1>
        <p className="text-xs text-gray-500 max-w-lg mx-auto">
          กรอกรหัสนักศึกษา/รหัสบุคลากร หรือรหัสการจอง (Reservation Code) เพื่อดูรายการจองและกำหนดเวลารับสินค้า
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex gap-3">
        <div className="relative flex-1">
          <UserCheck className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="ระบุรหัสนักศึกษา (เช่น 6604062630000) หรือ รหัสจอง (เช่น RES-2026...)"
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-600 focus:bg-white focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          ค้นหาข้อมูล
        </button>
      </form>

      {/* Results List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-gray-500 flex justify-center items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-red-700" />
            กำลังค้นหาข้อมูลการจอง...
          </div>
        ) : reservations.length > 0 ? (
          reservations.map((item) => {
            const isExpired = new Date(item.expires_at) < new Date() && item.status === 'reserved';
            const currentStatus = isExpired ? 'expired' : item.status;

            return (
              <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-all space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-xs text-gray-400 font-medium block">รหัสการจอง</span>
                    <span className="text-base font-black text-red-900 font-mono tracking-wider">
                      {item.reservation_code}
                    </span>
                  </div>
                  <StatusBadge status={currentStatus} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 block font-medium">รหัสนักศึกษา/ผู้จอง</span>
                    <span className="font-semibold text-gray-800">{item.student_id}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">รายการสินค้า</span>
                    <span className="font-semibold text-gray-800">{item.product_name || `สินค้า #${item.product}`}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">จำนวนที่จอง</span>
                    <span className="font-semibold text-gray-800">{item.quantity} ชิ้น</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">จุดรับสินค้า</span>
                    <span className="font-semibold text-red-800 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {item.location_name || item.location}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl flex flex-wrap justify-between items-center text-[11px] text-gray-500">
                  <span>เวลาจอง: {item.reserved_at ? new Date(item.reserved_at).toLocaleString('th-TH') : '-'}</span>
                  <span className="font-semibold text-amber-800">
                    หมดอายุภายใน: {item.expires_at ? new Date(item.expires_at).toLocaleString('th-TH') : '-'}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-3">
            <Clock className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-gray-800">
              {searched ? 'ไม่พบประวัติการจองตามข้อมูลที่ระบุ' : 'ยังไม่มีรายการจองสินค้า'}
            </h3>
            <p className="text-xs text-gray-500">
              เมื่อท่านทำรายการจองสินค้าแล้ว ข้อมูลรายการจองและเวลาหมดอายุจะแสดงที่หน้านี้
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
