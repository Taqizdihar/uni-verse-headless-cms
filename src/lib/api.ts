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

export default api;
