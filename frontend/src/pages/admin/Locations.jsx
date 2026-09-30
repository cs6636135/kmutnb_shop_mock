import React, { useState } from 'react';
import { initialMockLocations } from '../../services/api';
import { MapPin, Building, Plus, Trash2, DoorOpen, Layers } from 'lucide-react';

export default function LocationsAdmin() {
  const [locations, setLocations] = useState(initialMockLocations);
  const [name, setName] = useState('');
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newLoc = {
      id: Date.now(),
      name,
      building,
      floor,
      room,
      description
    };
    setLocations([...locations, newLoc]);
    setName('');
    setBuilding('');
    setFloor('');
    setRoom('');
    setDescription('');
  };

  const handleDelete = (id) => {
    if (confirm('ลบจุดจำหน่ายนี้?')) {
      setLocations(locations.filter(l => l.id !== id));
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="border-b pb-4">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-700" />
          จัดการสถานที่จำหน่าย (Locations Management)
        </h1>
        <p className="text-xs text-gray-500">จัดการรายชื่อจุดจำหน่าย อาคาร ชั้น และรายละเอียด</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form Add */}
        <form onSubmit={handleAdd} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3 h-fit">
          <h3 className="font-bold text-sm text-gray-900 border-b pb-2">เพิ่มสถานที่จำหน่ายใหม่</h3>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">ชื่อสถานที่จำหน่าย *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น ศูนย์หนังสือคณะวิทยาศาสตร์"
              className="w-full p-2.5 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">อาคาร</label>
              <input
                type="text"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                placeholder="อาคาร 78"
                className="w-full p-2.5 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">ชั้น</label>
              <input
                type="text"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                placeholder="ชั้น 1"
                className="w-full p-2.5 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">ห้อง / บริเวณ</label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="ห้อง 102"
              className="w-full p-2.5 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">คำอธิบาย</label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> เพิ่มสถานที่
          </button>
        </form>

        {/* List */}
        <div className="md:col-span-2 space-y-3">
          {locations.map((loc) => (
            <div key={loc.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-red-700" />
                  <h4 className="font-bold text-sm text-gray-900">{loc.name}</h4>
                </div>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>อาคาร: <strong>{loc.building}</strong></span>
                  <span>ชั้น: <strong>{loc.floor}</strong></span>
                  <span>ห้อง: <strong>{loc.room}</strong></span>
                </div>
                <p className="text-xs text-gray-400">{loc.description}</p>
              </div>

              <button
                onClick={() => handleDelete(loc.id)}
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
