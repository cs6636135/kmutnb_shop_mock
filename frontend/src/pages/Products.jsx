import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { productService, categoryService, locationService, initialMockProducts, initialMockCategories, initialMockLocations } from '../services/api';
import { ShoppingBag, Loader2 } from 'lucide-react';

export default function Products() {
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
        console.warn("Failed to load products from API", err);
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
    <div className="space-y-6 pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-red-700" />
            รายการสินค้าทั้งหมด ({filteredProducts.length})
          </h1>
          <p className="text-xs text-gray-500">เลือกดูสินค้าและตรวจสอบ Stock ตามสาขาเพื่อสั่งจอง</p>
        </div>
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

      {loading ? (
        <div className="py-12 text-center text-gray-500 flex justify-center items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-red-700" />
          กำลังโหลดรายการสินค้า...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
