import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, CheckCircle, XCircle, ArrowRight, ShoppingBag } from 'lucide-react';

export default function ProductCard({ product }) {
  const totalStock = product.locations 
    ? product.locations.reduce((sum, loc) => sum + loc.stock, 0) 
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group">
      {/* Image container */}
      <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-black/60 backdrop-blur-md text-white">
            {product.category_name || 'สินค้า'}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          {product.reservable ? (
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/90 backdrop-blur-md text-white flex items-center gap-1 shadow-xs">
              <CheckCircle className="w-3.5 h-3.5" />
              รองรับการจอง
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-600/90 backdrop-blur-md text-white flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" />
              ซื้อหน้าร้านเท่านั้น
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-base font-bold text-gray-900 line-clamp-1 group-hover:text-red-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Stock Breakdown per Location */}
        <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs">
          <div className="flex items-center justify-between text-gray-600 font-medium pb-1">
            <span className="flex items-center gap-1 text-gray-500">
              <MapPin className="w-3.5 h-3.5" />
              จุดจำหน่าย & Stock:
            </span>
            <span className={`font-semibold ${totalStock > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
              รวม {totalStock} ชิ้น
            </span>
          </div>

          {product.locations && product.locations.map((loc, idx) => (
            <div key={idx} className="flex justify-between items-center bg-gray-50 px-2.5 py-1.5 rounded-lg">
              <span className="text-gray-700 truncate max-w-[180px] text-[11px]">{loc.location_name}</span>
              <span className={`font-bold text-[11px] px-1.5 py-0.5 rounded ${loc.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>
                {loc.stock > 0 ? `คงเหลือ ${loc.stock}` : 'หมด'}
              </span>
            </div>
          ))}
        </div>

        {/* Footer info & Action button */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-400 block font-medium">ราคา</span>
            <span className="text-lg font-bold text-red-800">
              ฿{Number(product.price).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/products/${product.id}`}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-700 text-white hover:bg-red-800 transition-colors flex items-center gap-1 shadow-xs"
            >
              <span>{product.reservable && totalStock > 0 ? 'รายละเอียด/จอง' : 'ดูรายละเอียด'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
