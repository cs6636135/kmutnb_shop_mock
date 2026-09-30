import React from 'react';
import { Search, Filter, MapPin, Tag } from 'lucide-react';

export default function SearchBar({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory, 
  selectedLocation, 
  setSelectedLocation,
  categories = [],
  locations = []
}) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-8 space-y-3 md:space-y-0 md:flex md:items-center md:gap-4">
      {/* Input text search */}
      <div className="relative flex-1">
        <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ค้นหาชื่อสินค้า เช่น เสื้อช็อป, หนังสือ, เข็มวิทยะ..."
          className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
        />
      </div>

      {/* Filter Category */}
      <div className="relative w-full md:w-56">
        <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white text-gray-700 transition-all appearance-none cursor-pointer"
        >
          <option value="">ทุกหมวดหมู่สินค้า</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Filter Location */}
      <div className="relative w-full md:w-64">
        <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white text-gray-700 transition-all appearance-none cursor-pointer"
        >
          <option value="">ทุกสถานที่จำหน่าย</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>{loc.name} ({loc.building})</option>
          ))}
        </select>
      </div>
    </div>
  );
}
