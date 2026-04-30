// File: src/layouts/Sidebar.tsx
import React from 'react';
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
  X
} from 'lucide-react';
import universeLogo from '../assets/logo/UNI-VERSE Logo V3.png';
import { useCMS } from '../context/CMSContext';
import { cn } from '../lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Halaman', path: '/pages', icon: Files },
  { name: 'Postingan', path: '/posts', icon: FileText },
  { name: 'Media', path: '/media', icon: ImageIcon },
  { name: 'Komentar', path: '/comments', icon: MessageSquare },

  { name: 'Pengguna', path: '/users', icon: Users },
  { name: 'Integrasi API', path: '/api-integration', icon: Terminal },
  { name: 'Uji Coba API', path: '/api-sandbox', icon: Zap },
  { name: 'Pusat FAQ', path: '/faq', icon: HelpCircle },
  { name: 'Pengaturan', path: '/settings', icon: Settings }
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const { settings } = useCMS();
  
  return (
    <aside className="w-64 bg-zinc-900 text-white h-screen flex flex-col relative shadow-xl">
      <div className="p-8">
        <div className="flex items-center justify-between mb-2 md:block">
          <div className="flex flex-col items-start gap-1">
            <img src={universeLogo} alt="UNI-VERSE" className="h-8 w-auto brightness-0 invert" />
            <p className="text-[10px] text-white font-bold uppercase tracking-[0.2em] mt-1 opacity-90">UNI-INSIDE'S CMS</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 md:hidden text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <nav className="flex-1 px-4 pb-4 space-y-0.5 overflow-y-auto">
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
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold text-[13px] pointer-events-auto",
                  isActive 
                    ? "bg-amber-400 text-zinc-950 shadow-lg shadow-amber-400/20" 
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                )
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800 flex-shrink-0">
          <div className="bg-zinc-800/50 rounded-2xl p-4">
              <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-zinc-300">Sistem Online</span>
                  </div>
              </div>
          </div>
      </div>
    </aside>
  );
}
