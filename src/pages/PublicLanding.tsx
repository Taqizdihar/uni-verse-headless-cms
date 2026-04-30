import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import uniInsideLogo from '../assets/logo/Uni-Inside Logo.png';
import universeLogo from '../assets/logo/UNI-VERSE Logo V3.png';

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
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-amber-400 selection:text-black overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Navigation */}
      <header className="flex items-center justify-between px-10 py-6 sticky top-0 z-50">
        <div className="flex items-center">
           <img src={uniInsideLogo} alt="Uni-Inside" className="h-10 w-auto" />
        </div>
        
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
           <span className="text-zinc-500 font-medium text-sm tracking-wide italic">
             Uni-Inside's Content Management System
           </span>
        </div>

        <div className="flex items-center">
           <Link 
            to="/login" 
            className="px-8 py-2.5 bg-white text-black text-sm font-extrabold rounded-full hover:bg-zinc-200 transition-all active:scale-95 shadow-xl"
           >
             Masuk
           </Link>
        </div>
      </header>
      
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center -mt-10 px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Main Logo with subtle pulse */}
          <div className="mb-8 animate-in fade-in zoom-in duration-1000">
            <img 
              src={universeLogo} 
              alt="UNI-VERSE" 
              className="w-full max-w-2xl h-auto drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]" 
            />
          </div>

          <h1 
            className="text-2xl md:text-3xl font-bold tracking-tight mb-12 text-white"
            style={{ textShadow: '0 0 15px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.2)' }}
          >
            Create & design within Uni-Inside's Universe
          </h1>

          <div className="flex flex-col items-center gap-6">
            <Link 
              to="/register" 
              className="px-14 py-4 bg-amber-400 text-black text-xl font-black rounded-full hover:bg-amber-300 transition-all shadow-[0_0_40px_rgba(251,191,36,0.2)] active:scale-95 hover:scale-105"
            >
               Daftar
            </Link>
            
            <span className="text-zinc-500 font-bold text-sm uppercase tracking-[0.3em] italic">
              Beta Version
            </span>
          </div>
        </div>
      </main>

      {/* Subtle bottom detail */}
      <div className="absolute bottom-10 left-10 text-[10px] font-bold text-zinc-800 uppercase tracking-widest">
        SYSTEM READY // V. 1.0.4
      </div>
      <div className="absolute bottom-10 right-10 flex gap-4">
         <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
         <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
         <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
      </div>
    </div>
  );
}
