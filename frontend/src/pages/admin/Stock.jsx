import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { initialMockProducts, initialMockLocations } from '../../services/api';
import { Layers, Save, Building, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function StockAdmin() {
  const { user, isAdmin, isStaff } = useAuth();
  const [products, setProducts] = useState(initialMockProducts);

  // Selected Location: If Staff, locked to user.location_id
  const [selectedLocId, setSelectedLocId] = useState(
    isStaff && user?.location_id ? String(user.location_id) : '1'
  );

  const [message, setMessage] = useState('');

  const currentLocObj = initialMockLocations.find(l => String(l.id) === String(selectedLocId));

  const handleStockChange = (productId, newStock) => {
    const stockVal = Math.max(0, parseInt(newStock) || 0);

    setProducts(products.map(p => {
      if (p.id === productId) {
        const updatedLocations = p.locations.map(loc => {
          if (String(loc.location_id) === String(selectedLocId)) {
            return { ...loc, stock: stockVal };
          }
          return loc;
        });

        // If location wasn't attached yet, add it
        const exists = updatedLocations.some(l => String(l.location_id) === String(selectedLocId));
        if (!exists) {
          updatedLocations.push({
            location_id: Number(selectedLocId),
            location_name: currentLocObj ? `${currentLocObj.name} ${currentLocObj.building}` : 'จุดจำหน่าย',
            stock: stockVal
          });
        }

        return { ...p, locations: updatedLocations };
      }
      return p;
    }));
  };

  const handleSaveAll = () => {
    setMessage('บันทึกการปรับปรุง Stock ลงฐานข้อมูลเรียบร้อยแล้ว');
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-red-700" />
            จัดการจำนวน Stock ตามจุดจำหน่าย (Workflow 5)
          </h1>
          <p className="text-xs text-gray-500">
            {isStaff 
              ? `คุณกำลังจัดการ Stock สำหรับ: ${user?.location_name} (สิทธิ์จำกัดเฉพาะสาขาตนเอง)` 
              : 'Admin สามารถเลือกสถานที่จำหน่ายเพื่อปรับ Stock ได้ทุกสาขา'}
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0"
        >
          <Save className="w-4 h-4" /> บันทึก Stock ทั้งหมด
        </button>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Location Selector (Disabled for Staff) */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
        <Building className="w-5 h-5 text-red-700" />
        <div className="flex-1">
          <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
            สถานที่จำหน่ายที่ต้องการจัดการ
          </label>
          <select
            value={selectedLocId}
            onChange={(e) => setSelectedLocId(e.target.value)}
            disabled={isStaff}
            className={`w-full max-w-md p-2.5 bg-gray-50 border rounded-xl text-xs font-bold text-gray-800 focus:ring-2 focus:ring-red-600 focus:outline-none ${
              isStaff ? 'opacity-80 cursor-not-allowed bg-gray-100' : ''
            }`}
          >
            {initialMockLocations.map(l => (
              <option key={l.id} value={l.id}>{l.name} - {l.building} ({l.floor})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b">
              <th className="p-4">รายการสินค้า</th>
              <th className="p-4">หมวดหมู่</th>
              <th className="p-4">ราคา</th>
              <th className="p-4">จำนวน Stock ปัจจุบัน (ชิ้น)</th>
              <th className="p-4 text-right">สถานะ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {products.map((p) => {
              const locStockObj = p.locations.find(l => String(l.location_id) === String(selectedLocId));
              const currentStock = locStockObj ? locStockObj.stock : 0;

              return (
                <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-4 font-bold text-gray-900">
                    {p.name}
                  </td>
                  <td className="p-4 text-gray-500">{p.category_name}</td>
                  <td className="p-4 text-red-800 font-bold">฿{Number(p.price).toFixed(2)}</td>
                  <td className="p-4">
                    <input
                      type="number"
                      min="0"
                      value={currentStock}
                      onChange={(e) => handleStockChange(p.id, e.target.value)}
                      className="w-24 p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-center focus:ring-2 focus:ring-red-600 focus:bg-white focus:outline-none"
                    />
                  </td>
                  <td className="p-4 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      currentStock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {currentStock > 0 ? 'มีสินค้าพร้อมขาย' : 'สินค้าหมด'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
