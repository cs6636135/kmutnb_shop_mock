import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, MapPin, Clock, Sparkles, Store, BookOpen, Shirt, Award, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LocationCard from '../components/LocationCard';
import SearchBar from '../components/SearchBar';
import { productService, categoryService, locationService, initialMockProducts, initialMockCategories, initialMockLocations } from '../services/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [prodData, catData, locData] = await Promise.all([
          productService.getAll(),
          categoryService.getAll(),
          locationService.getAll()
        ]);
        setProducts(Array.isArray(prodData) ? prodData : initialMockProducts);
        setCategories(Array.isArray(catData) ? catData : initialMockCategories);
        setLocations(Array.isArray(locData) ? locData : initialMockLocations);
      } catch (err) {
        console.warn("Failed to fetch data from API, fallback to mock data", err);
        setProducts(initialMockProducts);
        setCategories(initialMockCategories);
        setLocations(initialMockLocations);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || String(p.category_id || p.category) === String(selectedCategory);
    const matchesLocation = !selectedLocation || (p.locations || p.product_locations || []).some(l => String(l.location_id || l.location) === String(selectedLocation));
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-900 via-red-800 to-amber-700 text-white p-8 md:p-12 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-amber-200">
            <Sparkles className="w-3.5 h-3.5" /> KMUTNB Shop Platform 2026
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            ค้นหาและจองสินค้า <br />
            <span className="text-amber-300">ภายในมหาวิทยาลัย</span>
          </h1>
          <p className="text-red-100 text-sm md:text-base leading-relaxed">
            เช็ก Stock คงเหลือและราคาจริงของหนังสือเรียน เครื่องแบบนักศึกษา และของที่ระลึก
            แยกตามจุดจำหน่าย พร้อมระบบจองล่วงหน้า 4 ชั่วโมง รับสินค้าและชำระเงินที่หน้าร้านได้สะดวกรวดเร็ว
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/products"
              className="px-6 py-3 rounded-xl bg-white text-red-900 font-bold text-sm hover:bg-amber-100 transition-all shadow-md flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              ดูรายการสินค้าทั้งหมด
            </Link>
            <Link
              to="/reservation-status"
              className="px-6 py-3 rounded-xl bg-red-950/50 hover:bg-red-950 text-white font-semibold text-sm transition-all border border-red-700/50 backdrop-blur-md flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              เช็กสถานะการจอง
            </Link>
          </div>
        </div>
        
        {/* Background Decorative Circles */}
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Categories Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-red-700" />
            หมวดหมู่สินค้ายอดนิยม
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === String(cat.id) ? '' : String(cat.id))}
              className={`p-4 rounded-2xl border text-left transition-all group ${
                String(selectedCategory) === String(cat.id)
                  ? 'border-red-600 bg-red-50 text-red-900 shadow-sm ring-2 ring-red-600/20'
                  : 'border-gray-200 bg-white text-gray-800 hover:border-red-300 hover:shadow-xs'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
                {cat.id === 1 && <BookOpen className="w-5 h-5" />}
                {cat.id === 2 && <Shirt className="w-5 h-5" />}
                {cat.id === 3 && <Award className="w-5 h-5" />}
                {cat.id === 4 && <Store className="w-5 h-5" />}
                {cat.id > 4 && <Store className="w-5 h-5" />}
              </div>
              <h3 className="font-bold text-sm text-gray-900 group-hover:text-red-700">{cat.name}</h3>
              <p className="text-xs text-gray-500 line-clamp-1 mt-1">{cat.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Search & Filter section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">ค้นหาและกรองสินค้า</h2>
            <p className="text-xs text-gray-500">เลือกกรองตามหมวดหมู่ หรือสถานที่จำหน่ายที่สะดวก</p>
          </div>
          {selectedCategory || selectedLocation || searchQuery ? (
            <button
              onClick={() => { setSelectedCategory(''); setSelectedLocation(''); setSearchQuery(''); }}
              className="text-xs font-semibold text-red-700 hover:underline"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          ) : null}
        </div>

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          categories={categories}
          locations={locations}
        />

        {/* Product List Grid */}
        {loading ? (
          <div className="py-12 text-center text-gray-500 flex justify-center items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-red-700" />
            กำลังโหลดรายการสินค้าจากระบบ Backend...
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-3">
            <Search className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-gray-800">ไม่พบสินค้าตรงกับเงื่อนไขการค้นหา</h3>
            <p className="text-xs text-gray-500">ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่และสถานที่อื่น</p>
          </div>
        )}
      </section>

      {/* Locations Section */}
      <section className="space-y-4 pt-6 border-t border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-700" />
            จุดจำหน่ายสินค้าภายใน มจพ.
          </h2>
          <p className="text-xs text-gray-500">ท่านสามารถไปรับสินค้าที่จองไว้ได้ตามสถานที่จำหน่ายแต่ละจุด</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {locations.map((loc) => (
            <LocationCard key={loc.id} location={loc} />
          ))}
        </div>
      </section>
    </div>
  );
}
