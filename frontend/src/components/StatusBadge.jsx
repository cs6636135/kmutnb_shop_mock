import React from 'react';
import { CheckCircle2, Clock, XCircle, PackageCheck } from 'lucide-react';

export default function StatusBadge({ status }) {
  const normalized = status ? status.toLowerCase() : '';

  switch (normalized) {
    case 'reserved':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
          <Clock className="w-3.5 h-3.5" />
          รอรับสินค้า (Reserved)
        </span>
      );
    case 'picked_up':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <PackageCheck className="w-3.5 h-3.5" />
          รับสินค้าแล้ว (Picked Up)
        </span>
      );
    case 'expired':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
          <XCircle className="w-3.5 h-3.5" />
          หมดอายุ (Expired)
        </span>
      );
    case 'cancelled':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-300">
          <XCircle className="w-3.5 h-3.5" />
          ยกเลิก (Cancelled)
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
          {status}
        </span>
      );
  }
}
