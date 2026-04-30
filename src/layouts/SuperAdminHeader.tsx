import React, { useState } from 'react';
import { Menu, LogOut, ShieldCheck, ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ConfirmModal } from '../components/ui/ConfirmModal';

interface SuperAdminHeaderProps {
  onMenuClick?: () => void;
}

const breadcrumbMap: Record<string, string> = {
    '/super-admin/dashboard': 'Overview',
    '/super-admin/tenants': 'Manajemen Tenant',
    '/super-admin/faq': 'Pusat FAQ',
    '/super-admin/updates': 'Histori Update',
    '/super-admin/infrastructure': 'Infrastruktur',
    '/super-admin/settings': 'Pengaturan Sistem'
};

export function SuperAdminHeader({ onMenuClick }: SuperAdminHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentPath = breadcrumbMap[location.pathname] || 'Dashboard';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="h-20 bg-[#09090b] border-b border-zinc-800/50 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 w-full shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-zinc-400 md:hidden hover:bg-zinc-800 rounded-xl transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Breadcrumbs */}
        <div className="hidden sm:flex items-center text-xs font-bold uppercase tracking-widest text-zinc-500">
           <span>Super Admin</span>
           <ChevronRight className="w-4 h-4 mx-2 text-zinc-700" />
           <span className="text-zinc-200">{currentPath}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* System Live Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
           <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></div>
           <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">System Live</span>
        </div>

        <div className="flex items-center gap-4 pl-6 border-l border-zinc-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white leading-none">{user?.name || 'Administrator'}</p>
            <div className="flex items-center gap-1 mt-1 justify-end text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <p className="text-[10px] font-black uppercase tracking-wider">Super Admin</p>
            </div>
          </div>
          
          <button 
             onClick={() => setIsLogoutConfirmOpen(true)} 
             className="flex items-center justify-center p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all rounded-xl border border-red-500/20 group"
             title="Logout"
          >
              <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isLogoutConfirmOpen}
        title="Keluar dari Sistem"
        message="Anda akan keluar dari sesi Super Admin. Lanjutkan?"
        confirmLabel="Logout"
        onConfirm={handleLogout}
        onClose={() => setIsLogoutConfirmOpen(false)}
      />
    </header>
  );
}
