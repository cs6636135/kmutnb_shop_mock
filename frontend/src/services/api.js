import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach Token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kmutnb_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// API Services
export const authService = {
  login: async (username, password) => {
    const res = await api.post('/auth/login/', { username, password });
    return res.data;
  },
};

export const productService = {
  getAll: async () => {
    const res = await api.get('/products/');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/products/${id}/`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/products/', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/products/${id}/`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/products/${id}/`);
    return res.data;
  }
};

export const categoryService = {
  getAll: async () => {
    const res = await api.get('/categories/');
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/categories/', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/categories/${id}/`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/categories/${id}/`);
    return res.data;
  }
};

export const locationService = {
  getAll: async () => {
    const res = await api.get('/locations/');
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/locations/', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/locations/${id}/`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/locations/${id}/`);
    return res.data;
  }
};

export const stockService = {
  getAll: async () => {
    const res = await api.get('/stocks/');
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.patch(`/stocks/${id}/`, data);
    return res.data;
  }
};

export const reservationService = {
  getAll: async (params = {}) => {
    const res = await api.get('/reservations/', { params });
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/reservations/', data);
    return res.data;
  },
  updateStatus: async (id, status) => {
    const res = await api.patch(`/reservations/${id}/`, { status });
    return res.data;
  },
  checkExpired: async () => {
    const res = await api.post('/reservations/check-expired/');
    return res.data;
  }
};

export const dashboardService = {
  getStats: async () => {
    const res = await api.get('/dashboard/stats/');
    return res.data;
  }
};

// Fallback Mock Data for standalone testing if needed
export const initialMockProducts = [
  {
    id: 1,
    name: 'หนังสือ Data Structure & Algorithms',
    category_id: 1,
    category_name: 'หนังสือเรียน',
    price: 350.00,
    description: 'ตำราเรียนวิชาโครงสร้างข้อมูลและอัลกอริทึม สำหรับนักศึกษาภาควิชาคอมพิวเตอร์',
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60',
    reservable: true,
    created_at: '2026-01-15T09:00:00Z',
    locations: [
      { location_id: 1, location_name: 'ร้านค้าสวัสดิการ อาคาร 40 ชั้น 1', stock: 10 },
      { location_id: 2, location_name: 'ศูนย์หนังสือ คณะวิศวกรรมศาสตร์ อาคาร 81 ชั้น 2', stock: 5 }
    ]
  },
  {
    id: 2,
    name: 'เสื้อช็อปนักศึกษา KMUTNB (สีกรม)',
    category_id: 2,
    category_name: 'เครื่องแบบนักศึกษา',
    price: 450.00,
    description: 'เสื้อช็อปปฏิบัติการ ตัดเย็บจากผ้าเวสปอยท์อย่างดี ปักโลโก้มหาวิทยาลัย',
    image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60',
    reservable: true,
    created_at: '2026-01-16T10:00:00Z',
    locations: [
      { location_id: 1, location_name: 'ร้านค้าสวัสดิการ อาคาร 40 ชั้น 1', stock: 15 },
      { location_id: 3, location_name: 'ร้านค้าสหกรณ์ อาคารอธิการบดี', stock: 8 }
    ]
  },
  {
    id: 3,
    name: 'เข็มวิทยะ KMUTNB พระวิษณุกรรม',
    category_id: 3,
    category_name: 'เครื่องประดับ & ของที่ระลึก',
    price: 120.00,
    description: 'เข็มติดปกเสื้อช็อป/ชุดนักศึกษา ตราพระวิษณุกรรม โลหะชุบทองอย่างดี',
    image_url: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&auto=format&fit=crop&q=60',
    reservable: true,
    created_at: '2026-01-18T14:30:00Z',
    locations: [
      { location_id: 1, location_name: 'ร้านค้าสวัสดิการ อาคาร 40 ชั้น 1', stock: 25 },
      { location_id: 2, location_name: 'ศูนย์หนังสือ คณะวิศวกรรมศาสตร์ อาคาร 81 ชั้น 2', stock: 20 }
    ]
  },
  {
    id: 4,
    name: 'สมุดโน้ตตรากราฟ KMUTNB (ปกแข็ง)',
    category_id: 4,
    category_name: 'เครื่องเขียน',
    price: 45.00,
    description: 'สมุดโน้ต 100 แผ่น กระดาษถนอมสายตา ตราสัญลักษณ์ KMUTNB',
    image_url: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&auto=format&fit=crop&q=60',
    reservable: false,
    created_at: '2026-01-20T11:20:00Z',
    locations: [
      { location_id: 1, location_name: 'ร้านค้าสวัสดิการ อาคาร 40 ชั้น 1', stock: 50 },
      { location_id: 3, location_name: 'ร้านค้าสหกรณ์ อาคารอธิการบดี', stock: 30 }
    ]
  }
];

export const initialMockCategories = [
  { id: 1, name: 'หนังสือเรียน', description: 'ตำราเรียนและเอกสารประกอบการสอนทุกคณะ' },
  { id: 2, name: 'เครื่องแบบนักศึกษา', description: 'เสื้อช็อป เสื้อนักศึกษา เนกไท และสายเข็มขัด' },
  { id: 3, name: 'เครื่องประดับ & ของที่ระลึก', description: 'เข็มไท เข็มติดเสื้อ ตราประจำมหาวิทยาลัย' },
  { id: 4, name: 'เครื่องเขียน', description: 'สมุด ปากกา อุปกรณ์การเรียนและงานเขียนแบบ' },
];

export const initialMockLocations = [
  { id: 1, name: 'ร้านค้าสวัสดิการ', building: 'อาคาร 40', floor: 'ชั้น 1', room: '101', description: 'จำหน่ายสินค้าทั่วไปและอุปกรณ์นักศึกษา' },
  { id: 2, name: 'ศูนย์หนังสือ คณะวิศวกรรมศาสตร์', building: 'อาคาร 81', floor: 'ชั้น 2', room: '204', description: 'จำหน่ายตำราวิศวะและเครื่องมือเฉพาะทาง' },
  { id: 3, name: 'ร้านค้าสหกรณ์', building: 'อาคารอธิการบดี', floor: 'ชั้น 1', room: 'โถงกลาง', description: 'ของที่ระลึกมหาวิทยาลัยและชุดนักศึกษา' },
];

export default api;
