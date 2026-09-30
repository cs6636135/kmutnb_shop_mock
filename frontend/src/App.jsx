import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Components
import Navbar from './components/Navbar';

// Customer Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import ReservationStatus from './pages/ReservationStatus';

// Admin & Staff Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProductsAdmin from './pages/admin/Products';
import CategoriesAdmin from './pages/admin/Categories';
import LocationsAdmin from './pages/admin/Locations';
import StockAdmin from './pages/admin/Stock';
import ReservationsAdmin from './pages/admin/Reservations';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin } = useAuth();
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  if (adminOnly && !isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col font-['Sarabun',sans-serif]">
          <Navbar />
          
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <Routes>
              {/* Customer Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/reservation-status" element={<ReservationStatus />} />

              {/* Admin / Staff Management Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute adminOnly><ProductsAdmin /></ProtectedRoute>} />
              <Route path="/admin/categories" element={<ProtectedRoute adminOnly><CategoriesAdmin /></ProtectedRoute>} />
              <Route path="/admin/locations" element={<ProtectedRoute adminOnly><LocationsAdmin /></ProtectedRoute>} />
              <Route path="/admin/stock" element={<ProtectedRoute><StockAdmin /></ProtectedRoute>} />
              <Route path="/admin/reservations" element={<ProtectedRoute><ReservationsAdmin /></ProtectedRoute>} />
            </Routes>
          </main>

          <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
            <div className="max-w-7xl mx-auto px-4 space-y-1">
              <p className="font-bold text-red-900">ระบบค้นหาและจองสินค้าภายในมหาวิทยาลัย (KMUTNB Shop)</p>
              <p>รายงานส่วนหนึ่งของรายวิชา ภาควิชาวิทยาการคอมพิวเตอร์และสารสนเทศ คณะวิทยาศาสตร์ประยุกต์ มจพ.</p>
              <p className="text-[11px] text-gray-400">© 2026 KMUTNB Shop. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}
