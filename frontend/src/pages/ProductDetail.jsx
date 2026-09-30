import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, XCircle, Clock, Loader2 } from 'lucide-react';
import ReservationForm from '../components/ReservationForm';
import { productService, initialMockProducts } from '../services/api';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const data = await productService.getById(id);
        setProduct(data);
      } catch (err) {
        console.warn("Failed to load product by id from API, fallback to mock data", err);
        const mock = initialMockProducts.find((p) => String(p.id) === String(id)) || initialMockProducts[0];
        setProduct(mock);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center text-gray-500 flex justify-center items-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-red-700" />
        กำลังดึงข้อมูลรายละเอียดสินค้า...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-12 text-center text-gray-500 space-y-4">
        <p>ไม่พบข้อมูลสินค้านี้ในระบบ</p>
        <Link to="/products" className="text-xs font-semibold text-red-700 hover:underline">
          ย้อนกลับไปหน้ารายการสินค้า
        </Link>
      </div>
    );
  }

  const productLocations = product.locations || product.product_locations || [];
  const totalStock = productLocations.reduce((sum, l) => sum + (l.stock || 0), 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Back button */}
      <div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-red-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> ย้อนกลับไปหน้ารายการสินค้า
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Product Image & Info */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-xs">
            <div className="aspect-4/3 rounded-2xl overflow-hidden bg-gray-100 relative">
              <img
                src={product.image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-lg text-xs font-bold bg-black/70 backdrop-blur-md text-white">
                {product.category_name || 'หมวดหมู่สินค้า'}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                <p className="text-xs text-gray-400 mt-1">รหัสสินค้า: PRD-{String(product.id).padStart(4, '0')}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block font-medium">ราคา</span>
                <span className="text-2xl font-black text-red-800">
                  ฿{Number(product.price).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">รายละเอียดสินค้า</h3>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-2xl">
                {product.description}
              </p>
            </div>

            {/* Stock per Location detailed breakdown */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center justify-between">
                <span>จำนวนสินค้าคงเหลือแยกตามจุดจำหน่าย</span>
                <span className="text-red-700">รวม {totalStock} ชิ้น</span>
              </h3>
              <div className="space-y-2">
                {productLocations.map((loc, idx) => (
                  <div key={idx} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                      <div>
                        <span className="font-semibold text-xs text-gray-900 block">{loc.location_name}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      loc.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {loc.stock > 0 ? `คงเหลือ ${loc.stock} ชิ้น` : 'สินค้าหมด'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Reservation Form or Purchase Instructions */}
        <div className="lg:col-span-5 space-y-6">
          {product.reservable ? (
            <ReservationForm product={product} locations={productLocations} />
          ) : (
            <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-4">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <XCircle className="w-5 h-5" />
                สินค้านี้ไม่เปิดให้จองล่วงหน้าผ่านระบบ
              </div>
              <p className="text-xs text-gray-600 leading-relaxed bg-rose-50 p-4 rounded-xl">
                สินค้าประเภทนี้รองรับการเลือกซื้อและชำระเงินที่หน้าร้านเท่านั้น กรุณาเดินทางไปติดต่อที่จุดจำหน่ายตามระบุเพื่อซื้อสินค้า
              </p>
            </div>
          )}

          {/* Rules & Conditions Notice */}
          <div className="bg-amber-50/60 border border-amber-200 p-5 rounded-3xl space-y-2 text-xs text-amber-900">
            <h4 className="font-bold flex items-center gap-1.5 text-amber-950">
              <Clock className="w-4 h-4 text-amber-700" />
              เงื่อนไขการจองสินค้า (Reservation Rules)
            </h4>
            <ul className="list-disc list-inside space-y-1 text-amber-800 text-[11px] leading-relaxed">
              <li>ระบบจะสร้างรหัสการจองและล็อก Stock สินค้าไว้ให้อัตโนมัติ</li>
              <li>การจองมีกำหนดหมดอายุ <strong>4 ชั่วโมง</strong> นับจากเวลาที่กดจองสำเร็จ</li>
              <li>ผู้จองต้องแสดงรหัสการจองหรือแจ้งรหัสนักศึกษา/บุคลากรที่จุดจำหน่าย</li>
              <li>หากเกินกำหนด 4 ชั่วโมง และยังไม่ได้มารับสินค้า ระบบจะคืน Stock กลับทันที</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
