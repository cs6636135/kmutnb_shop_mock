import React, { useState } from 'react';
import { initialMockProducts, initialMockCategories } from '../../services/api';
import { ShoppingBag, Plus, Edit, Trash2, CheckCircle, XCircle, Search } from 'lucide-react';

export default function ProductsAdmin() {
  const [products, setProducts] = useState(initialMockProducts);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('1');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [reservable, setReservable] = useState(true);

  const handleOpenAdd = () => {
    setEditProduct(null);
    setName('');
    setCategoryId('1');
    setPrice('');
    setDescription('');
    setReservable(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditProduct(p);
    setName(p.name);
    setCategoryId(String(p.category_id));
    setPrice(String(p.price));
    setDescription(p.description);
    setReservable(p.reservable);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('คุณต้องการลบสินค้านี้ใช่หรือไม่?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const catObj = initialMockCategories.find(c => String(c.id) === String(categoryId));

    if (editProduct) {
      setProducts(products.map(p => p.id === editProduct.id ? {
        ...p,
        name,
        category_id: Number(categoryId),
        category_name: catObj ? catObj.name : 'ทั่วไป',
        price: parseFloat(price) || 0,
        description,
        reservable
      } : p));
    } else {
      const newP = {
        id: Date.now(),
        name,
        category_id: Number(categoryId),
        category_name: catObj ? catObj.name : 'ทั่วไป',
        price: parseFloat(price) || 0,
        description,
        image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
        reservable,
        created_at: new Date().toISOString(),
        locations: [
          { location_id: 1, location_name: 'ร้านค้าสวัสดิการ อาคาร 40 ชั้น 1', stock: 10 }
        ]
      };
      setProducts([newP, ...products]);
    }
    setIsModalOpen(false);
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-red-700" />
            จัดการรายการสินค้า (Admin Product Management)
          </h1>
          <p className="text-xs text-gray-500">เพิ่ม แก้ไข ลบรายการสินค้า และสิทธิ์การจอง</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> เพิ่มสินค้าใหม่
        </button>
      </div>

      {/* Filter */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาชื่อสินค้า..."
          className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b">
              <th className="p-4">รูป & ชื่อสินค้า</th>
              <th className="p-4">หมวดหมู่</th>
              <th className="p-4">ราคา</th>
              <th className="p-4">การรองรับการจอง</th>
              <th className="p-4 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <img src={p.image_url} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0" />
                  <div>
                    <strong className="block text-gray-900 font-semibold">{p.name}</strong>
                    <span className="text-[11px] text-gray-400 line-clamp-1">{p.description}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-gray-100 text-gray-700">
                    {p.category_name}
                  </span>
                </td>
                <td className="p-4 font-bold text-red-800">
                  ฿{Number(p.price).toFixed(2)}
                </td>
                <td className="p-4">
                  {p.reservable ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> รองรับการจอง
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600 inline-flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> ซื้อหน้าร้านเท่านั้น
                    </span>
                  )}
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-xl animate-in zoom-in-95">
            <h3 className="font-bold text-base text-gray-900 border-b pb-3">
              {editProduct ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่'}
            </h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">ชื่อสินค้า *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">หมวดหมู่ *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                  >
                    {initialMockCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">ราคา (บาท) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">รายละเอียดสินค้า</label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="reservable"
                  checked={reservable}
                  onChange={(e) => setReservable(e.target.checked)}
                  className="rounded text-red-700 focus:ring-red-600 w-4 h-4"
                />
                <label htmlFor="reservable" className="text-xs font-semibold text-gray-800 cursor-pointer">
                  เปิดให้จองล่วงหน้าผ่านระบบ (Reservable)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-700 hover:bg-red-800"
                >
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
