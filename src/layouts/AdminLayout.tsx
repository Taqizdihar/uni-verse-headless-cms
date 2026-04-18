// File: src/layouts/AdminLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-zinc-100 text-zinc-900 font-sans selection:bg-amber-400 selection:text-black uppercase-none">
      {/* Sidebar - Fixed width */}
      <Sidebar />

      {/* Main Content Area - Taking remaining space and offset by sidebar width */}
      <div className="flex-1 flex flex-col pl-64 relative z-0">
        <Header />
        
        {/* Scrollable content */}
        <main className="flex-1 p-8 overflow-y-auto w-full relative pointer-events-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
