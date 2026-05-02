// File: src/layouts/Sidebar.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Files, 
  FileText, 
  Image as ImageIcon, 
  MessageSquare, 
  LayoutTemplate, 
  Users, 
  Blocks, 
  Settings,
  History,
  Terminal,
  Zap,
  HelpCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Handshake
} from 'lucide-react';
import universeLogo from '../assets/logo/UNI-VERSE Logo V3.png';
import { useCMS } from '../context/CMSContext';
import { cn } from '../lib/utils';

const allNavItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'content_creative', 'guest'] },
  { name: 'Halaman', path: '/pages', icon: Files, roles: ['admin', 'content_creative', 'guest'] },
  { name: 'Postingan', path: '/posts', icon: FileText, roles: ['admin', 'content_creative', 'guest'] },
  { name: 'Media', path: '/media', icon: ImageIcon, roles: ['admin', 'content_creative', 'guest'] },
  { name: 'Komentar', path: '/comments', icon: MessageSquare, roles: ['admin', 'guest'] },

  { name: 'Pengguna', path: '/users', icon: Users, roles: ['admin', 'guest'] },
  { name: 'Integrasi API', path: '/api-integration', icon: Terminal, roles: ['admin', 'guest'] },
  { name: 'Uji Coba API', path: '/api-sandbox', icon: Zap, roles: ['admin', 'guest'] },
  { name: 'Pengaturan', path: '/settings', icon: Settings, roles: ['admin', 'guest'] },
  { name: 'Pusat FAQ', path: '/faq', icon: HelpCircle, roles: ['admin', 'content_creative', 'guest'] }
];

interface SidebarProps {
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ onClose, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const { settings, activeRole } = useCMS();

  // Determine effective role (fallback to 'admin' if not set — own workspace)
  const effectiveRole = activeRole || 'admin';
  const isOwnWorkspace = effectiveRole === 'admin' || effectiveRole === 'super_admin';

  // Filter nav items based on active role
  const navItems = allNavItems.filter(item => item.roles.includes(effectiveRole));
  
  return (
    <aside className={cn("bg-zinc-900 text-white h-screen flex flex-col relative shadow-xl transition-all duration-300", isCollapsed ? "w-20" : "w-64")}>
      <div className={cn("transition-all duration-300", isCollapsed ? "p-4 pt-8" : "p-8")}>
        <div className="flex items-center justify-between mb-2 md:block">
          <div className={cn("flex flex-col gap-1 transition-all duration-300", isCollapsed ? "items-center" : "items-start")}>
            {isCollapsed ? (
                <img src="/favicon.png" alt="Favicon" className="w-10 h-10 object-contain scale-110" />
            ) : (
                <img src={universeLogo} alt="UNI-VERSE" className="h-10 w-auto" />
            )}
            {!isCollapsed && (
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[10px] text-white font-bold uppercase tracking-[0.2em] opacity-90 whitespace-nowrap">UNI-INSIDE'S CMS</p>
                </div>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 md:hidden text-zinc-400 hover:text-white transition-colors absolute top-4 right-4"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <nav className="flex-1 px-4 pb-4 space-y-0.5 overflow-y-auto hide-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center py-2.5 rounded-xl transition-all font-bold text-[13px] pointer-events-auto overflow-hidden",
                  isCollapsed ? "justify-center px-0" : "gap-3 px-4",
                  isActive 
                    ? "bg-amber-400 text-zinc-950 shadow-lg shadow-amber-400/20" 
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                )
              }
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className={cn("whitespace-nowrap transition-all duration-300", isCollapsed ? "w-0 opacity-0" : "opacity-100")}>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className={cn("p-4 border-t border-zinc-800 flex-shrink-0 transition-all", isCollapsed ? "px-2" : "px-4")}>
          <div className={cn("bg-zinc-800/50 rounded-xl transition-all duration-300 flex items-center justify-between", isCollapsed ? "p-3 flex-col gap-3" : "p-4")}>
              <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)] shrink-0"></div>
                  {!isCollapsed && (
                      <div className="flex flex-col gap-0.5 overflow-hidden">
                        <span className="text-xs font-bold text-zinc-300 whitespace-nowrap">Sistem Online</span>
                      </div>
                  )}
              </div>
              <button 
                  onClick={onToggleCollapse}
                  className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                  {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
          </div>
      </div>
    </aside>
  );
}
