// File: src/layouts/AdminLayout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import axios from 'axios';
import { AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
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
  const { user } = useCMS();

  // Task 3: Super Admin Persistence Fix
  // Prioritize the role over the tenant_id during layout determination process
  if (user && user.role === 'super_admin') {
    return <SuperAdminLayout />;
  }

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
    </div>
  );
}
