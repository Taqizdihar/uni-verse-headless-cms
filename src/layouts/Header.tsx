import React, { useState } from 'react';
import { Bell, UserCircle, LogOut, Menu, History } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { useNavigate } from 'react-router-dom';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { NotificationModal } from '../components/ui/NotificationModal';
interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {

  const { user, setUser, setToken, settings } = useCMS();
  const navigate = useNavigate();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  return (
    <header className="h-20 bg-white border-b border-zinc-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 w-full">
      <div className="flex items-center gap-3 md:gap-6">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-zinc-500 md:hidden hover:bg-zinc-50 rounded-xl transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-start leading-tight">
          <h1 className="text-xl font-black text-amber-500 tracking-tighter uppercase italic truncate max-w-[150px] md:max-w-[200px]" title={settings?.site_name || 'Uni-Inside'}>
            {settings?.site_name || 'Uni-Inside'}
          </h1>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">
            PANEL <span className="text-zinc-400">ADMIN</span>
          </span>
        </div>

      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button 
           onClick={() => {
              const url = settings?.global_options?.frontend_url;
              if (url) window.open(url, '_blank');
              else setIsWarningOpen(true);
           }}
           className="hidden md:flex px-4 py-2 bg-amber-400 text-zinc-900 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-amber-500 transition-colors shadow-sm items-center gap-2"
         >
           Buka Frontend
        </button>

        <div 
          onClick={() => navigate('/dashboard/updates')}
          className="flex items-center gap-2 cursor-pointer hover:bg-zinc-50 p-2 rounded-xl transition-colors border border-zinc-200 hover:border-zinc-300"
        >
          <History className="w-5 h-5 text-zinc-500" />
          <span className="hidden xl:block text-xs font-bold text-zinc-600 uppercase tracking-widest">Histori Update</span>
        </div>

        <button className="relative p-2.5 text-zinc-500 hover:text-amber-400 transition-colors rounded-full hover:bg-zinc-50 border border-transparent">
          <Bell className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-4 pl-6 border-l border-zinc-200">
          <div 
            className="text-right hidden sm:block cursor-pointer"
            onClick={() => navigate('/profile')}
          >
            <p className="text-sm font-bold text-zinc-900 leading-none hover:text-amber-500 transition-colors">{user?.name || 'Admin User'}</p>
            <p className="text-[11px] text-zinc-500 font-medium mt-1 uppercase tracking-wider">{user?.role || 'Superadmin'}</p>
          </div>
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigate('/profile')}
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-zinc-100 group-hover:border-amber-400 transition-all shadow-sm">
                {user?.profile_picture_url ? (
                    <img src={user.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                        <UserCircle className="w-8 h-8" />
                    </div>
                )}
            </div>
            <button onClick={(e) => { e.stopPropagation(); setIsLogoutConfirmOpen(true); }} className="p-2 text-zinc-400 hover:text-red-500 transition-colors" title="Keluar">
                <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <ConfirmModal 
        isOpen={isLogoutConfirmOpen}
        title="Keluar"
        message="Apakah Anda yakin ingin keluar?"
        confirmLabel="Keluar"
        onConfirm={handleLogout}
        onClose={() => setIsLogoutConfirmOpen(false)}
      />

      <NotificationModal 
        isOpen={isWarningOpen}
        title="URL Belum Diatur"
        message="Frontend URL belum dikonfigurasi. Silakan atur di menu Pengaturan terlebih dahulu."
        type="warning"
        onClose={() => setIsWarningOpen(false)}
      />
    </header>
  );
}
