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
  History
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { cn } from '../lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Halaman', path: '/pages', icon: Files },
  { name: 'Postingan', path: '/posts', icon: FileText },
  { name: 'Media', path: '/media', icon: ImageIcon },
  { name: 'Komentar', path: '/comments', icon: MessageSquare },
  { name: 'Tata Letak', path: '/layout', icon: LayoutTemplate },
  { name: 'Pengguna', path: '/users', icon: Users },
  { name: 'Plugin', path: '/plugins', icon: Blocks },
  { name: 'Pengaturan', path: '/settings', icon: Settings },
  { name: 'Histori Update', path: '/dashboard/updates', icon: History },
];

export function Sidebar() {
  const { settings } = useCMS();
  
  return (
    <aside className="w-64 bg-zinc-900 text-white h-screen flex flex-col fixed left-0 top-0 overflow-y-auto z-50 shadow-xl">
      <div className="p-8">
        <h1 className="text-2xl font-black text-amber-400 tracking-tighter uppercase italic truncate" title={settings?.site_name || 'Uni-Inside'}>
            {settings?.site_name || 'Uni-Inside'}
        </h1>
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.3em] mt-1 ml-0.5 opacity-60">Konsol Admin</p>
      </div>

      <nav className="flex-1 px-4 pb-8 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm pointer-events-auto",
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

      <div className="p-6 border-t border-zinc-800">
          <div className="bg-zinc-800/50 rounded-2xl p-4">
              <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-zinc-300">Sistem Online</span>
                    <span className="text-[10px] font-medium text-zinc-500">Beta Version</span>
                  </div>
              </div>
          </div>
      </div>
    </aside>
  );
}
