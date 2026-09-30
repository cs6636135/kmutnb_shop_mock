import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, ClipboardList, ShieldCheck, LogOut, Store } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-700 to-amber-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-red-900 block leading-tight">KMUTNB Shop</span>
              <span className="text-[11px] text-gray-500 font-medium">ระบบค้นหาและจองสินค้าภายในมหาวิทยาลัย</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-red-50 text-red-700 font-semibold' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              หน้าแรก
            </Link>
            <Link
              to="/products"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/products') 
                  ? 'bg-red-50 text-red-700 font-semibold' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              รายการสินค้าทั้งหมด
            </Link>
            <Link
              to="/reservation-status"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/reservation-status') 
                  ? 'bg-red-50 text-red-700 font-semibold' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              ตรวจสอบสถานะการจอง
            </Link>
          </nav>

          {/* User / Management Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-800 text-white text-xs font-semibold hover:bg-red-900 transition-colors shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{user.role === 'Admin' ? 'ระบบผู้ดูแล (Admin)' : `เจ้าหน้าที่ (${user.username})`}</span>
                </Link>
                <button
                  onClick={logout}
                  title="ออกจากระบบ"
                  className="p-2 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-red-700 hover:text-white transition-all shadow-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                เข้าสู่ระบบ Admin / Staff
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
