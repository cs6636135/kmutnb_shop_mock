import React from 'react';
import { MapPin, Building, DoorOpen, Layers, Info } from 'lucide-react';

export default function LocationCard({ location }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-all space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">{location.name}</h4>
            <span className="text-xs text-gray-500">{location.building}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs">
        <div className="flex items-center gap-1.5 text-gray-600">
          <Layers className="w-3.5 h-3.5 text-gray-400" />
          <span>ชั้น: <strong>{location.floor || '-'}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-600">
          <DoorOpen className="w-3.5 h-3.5 text-gray-400" />
          <span>ห้อง/บริเวณ: <strong>{location.room || '-'}</strong></span>
        </div>
      </div>

      {location.description && (
        <p className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded-xl flex items-start gap-2">
          <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <span>{location.description}</span>
        </p>
      )}
    </div>
  );
}
