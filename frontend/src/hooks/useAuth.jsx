import React, { useState, createContext, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kmutnb_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (username, password) => {
    try {
      const res = await authService.login(username, password);
      if (res && res.token) {
        const userData = {
          id: res.user.id,
          username: res.user.username,
          role: res.user.role,
          location_id: res.user.location,
          location_name: res.user.location_name || (res.user.role === 'Admin' ? 'ทุกสาขา / ทั้งระบบ' : 'ประจำจุดจำหน่าย'),
          name: res.user.first_name || res.user.username
        };
        setUser(userData);
        localStorage.setItem('kmutnb_user', JSON.stringify(userData));
        localStorage.setItem('kmutnb_token', res.token);
        return { success: true, user: userData };
      }
    } catch (err) {
      console.warn("Backend auth failed, trying fallback mock auth", err);
    }

    // Fallback Mock Login
    if (username === 'admin' && password === 'admin123') {
      const userData = {
        id: 1,
        username: 'admin',
        role: 'Admin',
        location_id: null,
        location_name: 'ทุกสาขา / ทั้งระบบ',
        name: 'ผู้ดูแลระบบ (Admin)'
      };
      setUser(userData);
      localStorage.setItem('kmutnb_user', JSON.stringify(userData));
      localStorage.setItem('kmutnb_token', 'mock-admin-token-123456');
      return { success: true, user: userData };
    } else if (username === 'staff1' && password === 'staff123') {
      const userData = {
        id: 2,
        username: 'staff1',
        role: 'Staff',
        location_id: 1,
        location_name: 'ร้านค้าสวัสดิการ อาคาร 40 ชั้น 1',
        name: 'เจ้าหน้าที่ ร้านค้าสวัสดิการ (อาคาร 40)'
      };
      setUser(userData);
      localStorage.setItem('kmutnb_user', JSON.stringify(userData));
      localStorage.setItem('kmutnb_token', 'mock-staff-token-1');
      return { success: true, user: userData };
    } else if (username === 'staff2' && password === 'staff123') {
      const userData = {
        id: 3,
        username: 'staff2',
        role: 'Staff',
        location_id: 2,
        location_name: 'ศูนย์หนังสือ คณะวิศวกรรมศาสตร์ อาคาร 81 ชั้น 2',
        name: 'เจ้าหน้าที่ ศูนย์หนังสือวิศวะ (อาคาร 81)'
      };
      setUser(userData);
      localStorage.setItem('kmutnb_user', JSON.stringify(userData));
      localStorage.setItem('kmutnb_token', 'mock-staff-token-2');
      return { success: true, user: userData };
    }

    return { success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (ตัวอย่าง: admin/admin123, staff1/staff123)' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kmutnb_user');
    localStorage.removeItem('kmutnb_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'Admin', isStaff: user?.role === 'Staff' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
