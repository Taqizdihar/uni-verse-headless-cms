import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import { useTenantGuard } from '../hooks/useTenantGuard';
import { ShieldAlert } from 'lucide-react';

export function ProtectedRoute() {
  const { setToken, setUser, fetchAllData } = useCMS();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isEvicted, handleEvictionAck } = useTenantGuard();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      setToken(token);
      setUser(JSON.parse(userStr));
      setIsAuthenticated(true);
    }
    
    setIsChecking(false);
  }, [setToken, setUser]);

  if (isChecking) {
    return <div className="h-screen flex items-center justify-center bg-gray-50"><div className="w-8 h-8 flex animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" /></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Outlet />
      {/* Eviction Modal */}
      {isEvicted && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-zinc-900/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-6 py-5 bg-red-600 flex items-center justify-center">
               <ShieldAlert className="w-12 h-12 text-white" />
            </div>
            <div className="p-8 text-center space-y-4">
              <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tight">Akses Dicabut</h3>
              <p className="text-sm font-medium text-zinc-600 leading-relaxed">
                Akses Anda ke workspace ini telah dicabut oleh Admin. Anda akan dialihkan kembali ke workspace pribadi Anda.
              </p>
            </div>
            <div className="px-6 pb-6">
              <button
                onClick={handleEvictionAck}
                className="w-full flex justify-center items-center py-3.5 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
