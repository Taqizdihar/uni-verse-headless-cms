import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { SuperAdminHeader } from './SuperAdminHeader';

export function SuperAdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#020617] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black overflow-x-hidden">
      {/* Sidebar - Responsive */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static transition-transform duration-300 ease-in-out`}>
        <SuperAdminSidebar 
           isCollapsed={isCollapsed} 
           toggleCollapse={() => setIsCollapsed(!isCollapsed)}
           onClose={() => setIsSidebarOpen(false)} 
        />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-0 min-w-0 h-screen overflow-hidden">
        <SuperAdminHeader onMenuClick={() => setIsSidebarOpen(true)} />
        
        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto w-full relative pointer-events-auto bg-[#020617]">
          <div className="p-4 md:p-8">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
