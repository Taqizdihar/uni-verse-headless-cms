import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoUniverse from '../assets/logo/UNI-VERSE Logo.png';
import logoUniInside from '../assets/logo/Uni-Inside Logo.png';

export function PublicLanding() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.site_name && user.site_name !== 'My Site') {
        navigate('/dashboard');
      } else {
        navigate('/setup');
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white selection:text-black relative overflow-hidden">
      {/* Background Decorative Element (Optional, but screenshot looks minimal) */}
      
      {/* Navigation */}
      <header className="flex items-center justify-between px-8 py-6 z-50">
        <div className="flex items-center">
           <img src={logoUniInside} alt="Uni-Inside" className="h-10 w-auto" />
        </div>
        <div className="flex items-center">
           <Link 
             to="/login" 
             className="px-8 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-zinc-200 transition-all active:scale-95"
           >
             Masuk
           </Link>
        </div>
      </header>
      
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center -mt-20">
        <div className="text-center flex flex-col items-center max-w-4xl px-6">
          {/* Main Logo */}
          <div className="mb-8">
            <img 
              src={logoUniverse} 
              alt="UNI-VERSE" 
              className="w-full max-w-2xl h-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
            />
          </div>

          {/* Subtitle */}
          <h2 
            className="text-2xl md:text-3xl font-bold mb-10 tracking-tight"
            style={{ textShadow: '0 0 8px rgba(255,255,255,0.8)' }}
          >
            Create & design within Uni-Inside's Universe
          </h2>

          {/* Primary Action */}
          <Link 
            to="/register" 
            className="px-12 py-4 bg-[#f8d448] text-black text-xl font-bold rounded-full hover:bg-[#e6c342] transition-all shadow-[0_0_20px_rgba(248,212,72,0.2)] active:scale-95 mb-8"
          >
            Daftar
          </Link>

          {/* Beta Note */}
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-[0.3em] mt-2 italic">
            Beta Version
          </p>
        </div>
      </main>

      {/* Footer can be removed or kept extremely minimal. The request didn't specify, but screenshot just shows "Beta Version" in the center. I'll stick to what the user requested. */}
    </div>
  );
}
