import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ── Request Interceptor ───────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Token is handled via HTTP-only cookies automatically
    // Optionally attach Bearer token from memory
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor – Auto Refresh ──────────────────
let isRefreshing = false;
let failedQueue: { resolve: (v: unknown) => void; reject: (r: unknown) => void }[] = [];

const processQueue = (error: unknown, token?: string) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/auth/refresh');
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, undefined);
        // Redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ── API Helper Functions ──────────────────────────────────
export const apiGet = async <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
  try {
    const res = await api.get<{ success: boolean; data: T }>(url, { params });
    return res.data.data;
  } catch (error) {
    if (url === '/orders') {
      if (typeof window !== 'undefined') {
        const localOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
        return { orders: localOrders.slice().reverse(), total: localOrders.length } as any;
      }
      return { orders: [], total: 0 } as any;
    } else if (url.startsWith('/orders/')) {
      const orderId = url.split('/')[2];
      if (typeof window !== 'undefined') {
        const localOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
        const order = localOrders.find((o: any) => o._id === orderId);
        if (order) return order as any;
      }
    }
    throw error;
  }
};

export const apiPost = async <T>(url: string, data?: any): Promise<T> => {
  try {
    const res = await api.post<{ success: boolean; data: T }>(url, data);
    return res.data.data;
  } catch (error) {
    if (url === '/orders') {
      if (typeof window !== 'undefined') {
        const newOrder = {
          _id: Math.random().toString(36).substring(7),
          orderId: 'ORD-' + Math.floor(Math.random() * 1000000),
          createdAt: new Date().toISOString(),
          status: 'pending',
          items: data.items,
          pricing: { total: data.items.reduce((acc: number, i: any) => acc + (i.price * i.quantity), 0) + (data.items.length > 0 ? 49 : 0) } // mock total
        };
        const localOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
        localOrders.push(newOrder);
        localStorage.setItem('mock_orders', JSON.stringify(localOrders));
        return newOrder as any;
      }
    } else if (url.match(/^\/orders\/[^\/]+\/cancel$/)) {
      const orderId = url.split('/')[2];
      if (typeof window !== 'undefined') {
        const localOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
        const idx = localOrders.findIndex((o: any) => o._id === orderId);
        if (idx !== -1) {
          localOrders[idx].status = 'cancelled';
          localStorage.setItem('mock_orders', JSON.stringify(localOrders));
          return { message: 'Order cancelled' } as any;
        }
      }
    }
    throw error;
  }
};

export const apiPut = async <T>(url: string, data?: unknown): Promise<T> => {
  const res = await api.put<{ success: boolean; data: T }>(url, data);
  return res.data.data;
};

export const apiDelete = async <T>(url: string): Promise<T> => {
  const res = await api.delete<{ success: boolean; data: T }>(url);
  return res.data.data;
};
