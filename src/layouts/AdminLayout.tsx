// File: src/layouts/AdminLayout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import axios from 'axios';
import { AlertCircle, Info, AlertTriangle, X, Eye, ArrowLeft } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { SuperAdminLayout } from './SuperAdminLayout';

interface BroadcastMsg {
  message: string;
  urgency_level: 'info' | 'warning' | 'danger';
  timestamp: string;
}

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [broadcast, setBroadcast] = useState<BroadcastMsg | null>(null);
  const [isBroadcastVisible, setIsBroadcastVisible] = useState(true);
  const [urgentAlert, setUrgentAlert] = useState<any>(null);
  const { user } = useCMS();

  // Check if super admin is impersonating a tenant
  const impersonatingStr = localStorage.getItem('impersonating_tenant');
  const isImpersonating = !!impersonatingStr && user?.role === 'super_admin';
  let impersonationData: any = null;
  if (isImpersonating && impersonatingStr) {
    try { impersonationData = JSON.parse(impersonatingStr); } catch (e) {}
  }

  // Task 3: Super Admin Persistence Fix
  // Only force SuperAdminLayout if NOT impersonating
  if (user && user.role === 'super_admin' && !isImpersonating) {
    return <SuperAdminLayout />;
  }

  // Handle "Back to Super Admin" — clear impersonation state
  const handleExitImpersonation = () => {
    localStorage.removeItem('impersonating_tenant');
    localStorage.removeItem('active_tenant_id');
    localStorage.removeItem('active_role');
    window.location.replace('/super-admin/tenants');
  };

  React.useEffect(() => {
    const fetchBroadcast = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/public/broadcast`);
        if (res.data && res.data.message) {
          setBroadcast(res.data);
        }
      } catch (e) {
        console.error('Failed to fetch broadcast');
      }
    };
    fetchBroadcast();
  }, []);

  // Task 2: Live Alert Polling
  React.useEffect(() => {
    const fetchLatestAlert = async () => {
      if (urgentAlert) return; // Stop polling if modal is open
      
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notifications/latest-alert`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data && res.data.id) {
          setUrgentAlert(res.data);
        }
      } catch (e) {
        // Silent catch for polling
      }
    };

    fetchLatestAlert();
    const intervalId = setInterval(fetchLatestAlert, 30000); // 30 seconds heartbeat
    return () => clearInterval(intervalId);
  }, [urgentAlert]);

  const handleAcknowledgeAlert = async () => {
    if (!urgentAlert) return;
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/notifications/${urgentAlert.id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUrgentAlert(null);
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-100 text-zinc-900 font-sans selection:bg-amber-400 selection:text-black uppercase-none overflow-x-hidden">
      {/* Sidebar - Responsive */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} isCollapsed={isSidebarCollapsed} onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area - Taking remaining space and offset by sidebar width */}
      <div className={`flex-1 flex flex-col relative z-0 min-w-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'}`}>
        {/* Impersonation Bar (Task 3) */}
        {isImpersonating && impersonationData && (
          <div 
            className="w-full px-4 py-2.5 flex items-center justify-between text-white z-50"
            style={{
              background: 'linear-gradient(135deg, #0e7490 0%, #155e75 50%, #164e63 100%)',
              boxShadow: '0 2px 12px rgba(14, 116, 144, 0.3)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white/15 rounded-lg backdrop-blur-sm">
                <Eye className="w-4 h-4 text-cyan-200" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200/80">Mode Impersonate:</span>
                <span className="text-sm font-bold text-white">
                  Mengelola {impersonationData.site_name || impersonationData.subdomain}
                </span>
                {impersonationData.admin_name && (
                  <span className="text-xs text-cyan-200/60 hidden sm:inline">
                    (Admin: {impersonationData.admin_name})
                  </span>
                )}
              </div>
            </div>
            <button 
              onClick={handleExitImpersonation}
              className="flex items-center gap-2 px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all text-xs font-bold backdrop-blur-sm hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kembali ke Super Admin</span>
              <span className="sm:hidden">Keluar</span>
            </button>
          </div>
        )}

        {broadcast && isBroadcastVisible && (
          <div className={`w-full px-4 py-3 flex items-center justify-between text-white shadow-sm z-50 ${
            broadcast.urgency_level === 'danger' ? 'bg-red-600' :
            broadcast.urgency_level === 'warning' ? 'bg-amber-500 text-black' :
            'bg-blue-600'
          }`}>
            <div className="flex items-center gap-3">
              {broadcast.urgency_level === 'danger' ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> :
               broadcast.urgency_level === 'warning' ? <AlertTriangle className="w-5 h-5 flex-shrink-0" /> :
               <Info className="w-5 h-5 flex-shrink-0" />}
              <p className="text-sm font-bold truncate max-w-3xl">
                <span className="uppercase tracking-widest font-black mr-2 opacity-80 text-xs">PENGUMUMAN GLOBAL:</span>
                {broadcast.message}
              </p>
            </div>
            <button onClick={() => setIsBroadcastVisible(false)} className="p-1 hover:bg-black/10 rounded-full transition-colors flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        {/* Scrollable content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full relative pointer-events-auto">
          <Outlet />
        </main>
      </div>

      {/* Task 4: Custom Modal UI & Behavior (Urgent Alert) */}
      {urgentAlert && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <div className="relative bg-zinc-900 border border-red-500/50 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">Pengumuman Penting</h2>
                <div className="w-12 h-1 bg-red-500 mx-auto rounded-full mb-6" />
                <p className="text-zinc-300 text-lg leading-relaxed">
                  {urgentAlert.message}
                </p>
              </div>
              <div className="pt-4">
                <button
                  onClick={handleAcknowledgeAlert}
                  className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-500/20"
                >
                  Mengerti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
