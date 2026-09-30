import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Lock, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const res = login(username, password);
    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-red-800 text-white flex items-center justify-center mx-auto shadow-md">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">เข้าสู่ระบบหลังบ้าน (Admin / Staff)</h1>
        <p className="text-xs text-gray-500">
          ระบบจัดการข้อมูลสินค้า หมวดหมู่ จุดจำหน่าย และตรวจสอบรายการจอง
        </p>
      </div>

      <form onSubmit={handleLogin} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700">ชื่อผู้ใช้งาน (Username)</label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin หรือ staff1"
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700">รหัสผ่าน (Password)</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123 หรือ staff123"
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-red-800 hover:bg-red-900 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
        >
          เข้าสู่ระบบ
        </button>

        {/* Demo Accounts Quick Fill */}
        <div className="pt-3 border-t border-gray-100 space-y-2 text-[11px] text-gray-500">
          <span className="font-semibold block text-gray-700 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> บัญชีทดสอบระบบ (Demo Accounts):
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => { setUsername('admin'); setPassword('admin123'); }}
              className="p-2 bg-gray-50 hover:bg-red-50 hover:text-red-800 border rounded-lg text-left transition-colors"
            >
              <strong className="block text-gray-800">Admin (ผู้ดูแลระบบ)</strong>
              <span>admin / admin123</span>
            </button>
            <button
              type="button"
              onClick={() => { setUsername('staff1'); setPassword('staff123'); }}
              className="p-2 bg-gray-50 hover:bg-red-50 hover:text-red-800 border rounded-lg text-left transition-colors"
            >
              <strong className="block text-gray-800">Staff (อาคาร 40)</strong>
              <span>staff1 / staff123</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
