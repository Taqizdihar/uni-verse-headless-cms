// File: src/layouts/AdminLayout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-100 text-zinc-900 font-sans selection:bg-amber-400 selection:text-black uppercase-none overflow-x-hidden">
      {/* Sidebar - Responsive */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area - Taking remaining space and offset by sidebar width */}
      <div className="flex-1 flex flex-col md:pl-64 relative z-0 min-w-0">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        {/* Scrollable content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full relative pointer-events-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
