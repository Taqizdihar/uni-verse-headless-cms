/**
 * Centralized Axios Instance — Tenant-Aware API Client
 * 
 * Every request made through this instance automatically injects:
 * 1. Authorization: Bearer <token>
 * 2. x-active-tenant: <active_tenant_id>
 * 
 * This is critical for Super Admin impersonation (Shadow Mode):
 * The super admin's JWT contains their own tenant_id, but during
 * impersonation, the x-active-tenant header tells the backend
 * which tenant's data to operate on.
 * 
 * Usage: import api from '@/lib/api';
 *        api.get('/api/pages');  // headers injected automatically
 */
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Bootstrap: Synchronously inject token from localStorage at module load.
// This covers the gap between page refresh and React context hydration,
// ensuring the very first API call carries the Authorization header.
const bootstrapToken = localStorage.getItem('token');
if (bootstrapToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${bootstrapToken}`;
}

// Request interceptor — inject auth + tenant headers on every call
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const activeTenantId = localStorage.getItem('active_tenant_id');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (activeTenantId) {
    config.headers['x-active-tenant'] = activeTenantId;
  }

  return config;
});

// Response interceptor — handle 401 Unauthorized gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('active_tenant_id');
      localStorage.removeItem('active_role');
      
      // Ensure we only redirect if we aren't already on the login page to avoid flickering loops
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
