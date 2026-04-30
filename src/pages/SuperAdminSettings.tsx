import React from 'react';
import { Settings, Shield, Globe } from 'lucide-react';

export function SuperAdminSettings() {
  return (
    <div className="animate-in fade-in duration-500 space-y-8 max-w-7xl mx-auto pb-20">
      <div>
         <h2 className="text-3xl font-black text-white tracking-tight">Pengaturan Sistem</h2>
         <p className="text-zinc-400 text-sm font-medium mt-1">Konfigurasi global platform Uni-Verse.</p>
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-md rounded-[2rem] border border-slate-800 p-8">
        <div className="flex items-center justify-center p-12 text-zinc-500 flex-col gap-4">
          <Settings className="w-12 h-12 animate-spin-slow" />
          <p className="font-bold">Modul Pengaturan Sistem sedang dalam tahap pengembangan.</p>
        </div>
      </div>
    </div>
  );
}
