import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  HelpCircle, 
  History, 
  HardDrive, 
  Settings,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import universeLogo from '../assets/logo/UNI-VERSE Logo V3.png';

const navItems = [
  { name: 'Overview', path: '/super-admin/dashboard', icon: LayoutDashboard },
  { name: 'Manajemen Tenant', path: '/super-admin/tenants', icon: Users },
  { name: 'Pusat FAQ', path: '/super-admin/faq', icon: HelpCircle },
  { name: 'Histori Update', path: '/super-admin/updates', icon: History },
  { name: 'Infrastruktur', path: '/super-admin/infrastructure', icon: HardDrive },
  { name: 'Pengaturan Sistem', path: '/super-admin/settings', icon: Settings }
];

interface SuperAdminSidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  onClose?: () => void;
}

export function SuperAdminSidebar({ isCollapsed, toggleCollapse, onClose }: SuperAdminSidebarProps) {
  return (
    <aside className={cn(
      "bg-[#09090b] text-white h-screen flex flex-col relative shadow-2xl border-r border-zinc-800/50 transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Header */}
      <div className={cn("transition-all duration-300", isCollapsed ? "p-4 pt-8" : "p-8")}>
        <div className="flex items-center justify-between mb-2 md:block">
          <div className={cn("flex flex-col gap-1 transition-all duration-300", isCollapsed ? "items-center" : "items-start")}>
            {isCollapsed ? (
                <img src="/favicon.png" alt="Favicon" className="w-10 h-10 object-contain scale-110" />
            ) : (
                <>
                  <img src={universeLogo} alt="UNI-VERSE" className="h-10 w-auto" />
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-[0.2em] mt-1 opacity-90 whitespace-nowrap">Super Admin</span>
                </>
            )}
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-2 md:hidden text-zinc-400 hover:text-white transition-colors absolute top-4 right-4"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/super-admin/dashboard'}
              onClick={() => { if (window.innerWidth < 768 && onClose) onClose(); }}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-bold text-sm group",
                  isActive 
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent",
                  isCollapsed ? "justify-center" : "justify-start"
                )
              }
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className={cn("whitespace-nowrap transition-all duration-300", isCollapsed ? "w-0 opacity-0" : "opacity-100")}>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle Button & Status */}
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
                  onClick={toggleCollapse}
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
