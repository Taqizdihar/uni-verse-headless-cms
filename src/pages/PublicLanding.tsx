import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Layout as LayoutIcon, Layers, Lock, ChevronRight, Globe, ShieldCheck } from 'lucide-react';

export function PublicLanding() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.tenant_id) {
        navigate('/dashboard');
      } else {
        navigate('/setup');
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#09090b] text-gray-400 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      {/* Navigation */}
      <header className="bg-zinc-900/50 backdrop-blur-xl border-b border-zinc-800 flex items-center justify-between px-8 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-2">
           <div className="p-2 bg-amber-400 rounded-lg text-black">
             <LayoutIcon className="w-6 h-6" />
           </div>
           <span className="text-xl font-black text-white tracking-tighter uppercase">Uni-Inside</span>
        </div>
        <div className="flex items-center gap-6">
           <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-amber-400 transition-colors">Login Admin</Link>
           <Link to="/register" className="px-6 py-2.5 bg-amber-400 text-black text-sm font-bold rounded-xl hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/10 active:scale-95">Mulai Sekarang</Link>
        </div>
      </header>
      
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center">
        <section className="w-full flex flex-col items-center justify-center pt-32 pb-24 px-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/10 via-transparent to-transparent">
          <div className="text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-amber-400 font-bold text-xs uppercase tracking-[0.2em] mb-10 shadow-xl">
              <Zap className="w-4 h-4 fill-amber-400" /> API-First Architecture
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-tight mb-8">
              CMS Headless <br/> Dirancang untuk <span className="text-amber-400">Konteks.</span>
            </h1>
            <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
              Uni-Inside menghadirkan keteraturan pada arsitektur multi-tenant. Tentukan logika, distribusikan konten, dan pertahankan kontrol desain penuh di setiap endpoint.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="group flex items-center gap-3 px-10 py-5 bg-amber-400 text-black text-lg font-black rounded-2xl hover:bg-amber-300 transition-all shadow-2xl shadow-amber-400/20 active:scale-95">
                 Konfigurasi Tenant Anda <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="px-10 py-5 bg-zinc-900 text-white border border-zinc-800 text-lg font-bold rounded-2xl hover:bg-zinc-800 transition-all active:scale-95">
                 Lihat Demo Langsung
              </Link>
            </div>
          </div>
        </section>

        {/* Features Matrix */}
        <section className="py-24 max-w-7xl px-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: 'Logika Multi-Tenant', desc: 'Partisi data global secara aman di berbagai subdomain dengan isolasi tenant yang tidak dapat diubah.' },
              { icon: Layers, title: 'Skema Visual', desc: 'Bangun blueprint untuk halaman beranda, profil, dan kontak menggunakan batasan JSON.' },
              { icon: ShieldCheck, title: 'Keamanan JWT', desc: 'Keamanan tingkat enterprise menggunakan hashed secrets dan propagasi token berbasis peran.' }
            ].map((feat, idx) => (
               <div key={idx} className="bg-zinc-900/40 p-10 rounded-[2.5rem] border border-zinc-800/50 flex flex-col items-start gap-6 hover:border-amber-400/30 transition-all cursor-default group hover:-translate-y-2">
                  <div className="p-4 bg-zinc-900 border border-zinc-800 text-amber-400 rounded-2xl group-hover:scale-110 transition-transform shadow-lg shadow-black">
                     <feat.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{feat.title}</h3>
                  <p className="text-gray-500 font-medium leading-relaxed">{feat.desc}</p>
               </div>
            ))}
          </div>
        </section>

        {/* Visual Identity Section */}
        <section className="py-24 border-t border-zinc-900 w-full flex justify-center">
             <div className="w-full max-w-7xl px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div>
                   <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-8 leading-tight">
                      Kelola dengan Presisi <span className="text-amber-400 underline decoration-zinc-800 underline-offset-8">Dark-Mode</span>.
                   </h2>
                   <p className="text-lg text-gray-500 font-medium mb-10 leading-relaxed">
                      Panel administrasi kami dirancang dengan kejelasan di atas segalanya. Tanpa bloat, hanya data mentah yang Anda butuhkan untuk mendukung frontend Anda.
                   </p>
                   <ul className="space-y-4">
                      {['Skema Konten JSON', 'Deployment Cepat', 'Manajemen Aset Media'].map((i) => (
                         <li key={i} className="flex items-center gap-3 text-white font-bold">
                            <div className="w-2 h-2 rounded-full bg-amber-400" />
                            {i}
                         </li>
                      ))}
                   </ul>
                </div>
                <div className="relative">
                   <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 shadow-2xl relative overflow-hidden group">
                      <div className="absolute inset-0 bg-amber-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-zinc-800" />
                        <div className="w-3 h-3 rounded-full bg-zinc-800" />
                        <div className="w-3 h-3 rounded-full bg-zinc-800" />
                      </div>
                      <div className="h-64 bg-zinc-800/20 rounded-xl" />
                   </div>
                   <div className="absolute -bottom-6 -left-6 bg-amber-400 p-6 rounded-2xl shadow-xl text-black font-black uppercase text-xs tracking-widest hidden md:block animate-bounce duration-[3000ms]">
                      Full-Stack Connected
                   </div>
                </div>
             </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-900 px-8 flex justify-between items-center bg-zinc-950">
        <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">© 2026 Uni-Inside CMS. Hak Cipta Dilindungi.</span>
        <div className="flex gap-8">
           <a href="#" className="text-xs font-bold text-zinc-600 hover:text-white transition-colors">Dokumentasi</a>
           <a href="#" className="text-xs font-bold text-zinc-600 hover:text-white transition-colors">Changelog</a>
        </div>
      </footer>
    </div>
  );
}
