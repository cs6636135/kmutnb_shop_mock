import React, { useState } from 'react';
import { initialMockCategories } from '../../services/api';
import { Tag, Plus, Edit, Trash2 } from 'lucide-react';

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState(initialMockCategories);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newCat = {
      id: Date.now(),
      name,
      description
    };
    setCategories([...categories, newCat]);
    setName('');
    setDescription('');
  };

  const handleDelete = (id) => {
    if (confirm('ลบหมวดหมู่นี้?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="border-b pb-4">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Tag className="w-5 h-5 text-red-700" />
          จัดการหมวดหมู่สินค้า (Categories Management)
        </h1>
        <p className="text-xs text-gray-500">เพิ่ม แก้ไข และลบหมวดหมู่สินค้าในระบบ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form Add */}
        <form onSubmit={handleAdd} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3 h-fit">
          <h3 className="font-bold text-sm text-gray-900 border-b pb-2">เพิ่มหมวดหมู่ใหม่</h3>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">ชื่อหมวดหมู่ *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น อุปกรณ์เขียนแบบ"
              className="w-full p-2.5 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">รายละเอียด</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="คำอธิบายสั้นๆ..."
              className="w-full p-2.5 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> เพิ่มหมวดหมู่
          </button>
        </form>

        {/* List */}
        <div className="md:col-span-2 space-y-3">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-gray-900">{cat.name}</h4>
                <p className="text-xs text-gray-500">{cat.description}</p>
              </div>
              <button
                onClick={() => handleDelete(cat.id)}
                className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
