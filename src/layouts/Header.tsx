import React, { useState } from 'react';
import { Bell, Search, UserCircle, LogOut } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { useCMS } from '../context/CMSContext';
import { useNavigate } from 'react-router-dom';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import universeLogo from '../assets/logo/UNI-VERSE Logo V2.png';

export function Header() {
  const { searchQuery, setSearchQuery } = useSearch();
  const { user, setUser, setToken } = useCMS();
  const navigate = useNavigate();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  return (
    <header className="h-20 bg-white border-b border-zinc-200 flex items-center justify-between px-8 sticky top-0 z-10 w-full">
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-start leading-tight">
          <img src={universeLogo} alt="UNI-VERSE" className="h-7 w-auto mb-0.5" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">
            Uni-Inside <span className="text-amber-500">CMS</span>
          </span>
        </div>
        {/* Search bar */}
        <div className="relative hidden lg:block">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Cari sumber daya, dokumen..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-full text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all w-80 text-zinc-900 placeholder-zinc-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2.5 text-zinc-500 hover:text-amber-400 transition-colors rounded-full hover:bg-zinc-50 border border-transparent">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-amber-400 rounded-full border-2 border-white shadow-sm"></span>
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
            <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-zinc-100 group-hover:border-amber-400 transition-all shadow-sm">
                {user?.profile_picture ? (
                    <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
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
    </header>
  );
}
