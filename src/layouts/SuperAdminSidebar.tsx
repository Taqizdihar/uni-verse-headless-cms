import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  HelpCircle, 
  History, 
  HardDrive, 
  Settings,
  Menu,
  ChevronLeft
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
      <div className={cn("p-6 flex items-center mb-4 transition-all", isCollapsed ? "justify-center" : "justify-between")}>
        {!isCollapsed && (
          <div className="flex flex-col items-start gap-1">
             <img src={universeLogo} alt="UNI-VERSE" className="h-10 w-auto" />
             <span className="text-[10px] text-amber-400 font-bold uppercase tracking-[0.2em] mt-1 opacity-90">Super Admin</span>
          </div>
        )}
        {isCollapsed && <img src={universeLogo} alt="Logo" className="w-8 h-8 object-contain" />}
        
        {/* Mobile close button is separate from collapse */}
        <button 
          onClick={onClose}
          className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors absolute right-4 top-6"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
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
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle Button (Desktop Only) */}
      <div className="hidden md:flex p-4 border-t border-zinc-800">
          <button 
             onClick={toggleCollapse}
             className={cn(
                 "w-full flex items-center p-3 rounded-xl text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all",
                 isCollapsed ? "justify-center" : "justify-between"
             )}
          >
              {!isCollapsed && <span className="text-xs font-bold uppercase tracking-widest">Collapse</span>}
              <Menu className="w-5 h-5" />
          </button>
      </div>
    </aside>
  );
}
