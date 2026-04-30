import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Server,
  Github,
  Copy,
  Check,
  HardDrive
} from 'lucide-react';
import axios from 'axios';

export function SuperAdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalTenants: 0 });
  const [infraStats, setInfraStats] = useState({ total_used_mb: 0, quota_mb: 1024 });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      // Fetch Basic Stats
      const statsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/super-admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsRes.data);

      // Fetch Infrastructure Stats for Storage
      const infraRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/superadmin/infrastructure/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (infraRes.data && infraRes.data.storage) {
        setInfraStats({
          total_used_mb: infraRes.data.storage.total_used_mb || 0,
          quota_mb: infraRes.data.storage.quota_mb || 1024
        });
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText('https://github.com/Taqizdihar/uni-verse-headless-cms.git');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-zinc-500 font-bold uppercase tracking-widest text-xs">Memuat Metrik Sistem...</p>
      </div>
    );
  }

  // Live Storage Data
  const storageUsed = infraStats.total_used_mb;
  const storageTotal = infraStats.quota_mb;
  const storagePercentage = Math.round((storageUsed / storageTotal) * 100);

  return (
    <div className="animate-in fade-in duration-500 space-y-8 max-w-7xl mx-auto">
      
      {/* Grid System for Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Tenants */}
        <div className="bg-zinc-900/50 backdrop-blur-md p-6 rounded-[2rem] border border-slate-800 shadow-xl flex flex-col justify-between group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
             <div className="p-3 bg-emerald-500/10 rounded-2xl group-hover:bg-emerald-500/20 transition-colors">
               <Server className="w-6 h-6 text-emerald-400" />
             </div>
             <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
               <TrendingUp className="w-3 h-3" />
               +12%
             </div>
          </div>
          <div>
             <h3 className="text-4xl font-black text-white tabular-nums tracking-tight">{stats.totalTenants}</h3>
             <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Total Startups / Tenants</p>
          </div>
        </div>

        {/* Card 2: Users */}
        <div className="bg-zinc-900/50 backdrop-blur-md p-6 rounded-[2rem] border border-slate-800 shadow-xl flex flex-col justify-between group hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
             <div className="p-3 bg-cyan-500/10 rounded-2xl group-hover:bg-cyan-500/20 transition-colors">
               <Users className="w-6 h-6 text-cyan-400" />
             </div>
          </div>
          <div>
             <h3 className="text-4xl font-black text-white tabular-nums tracking-tight">{stats.totalUsers}</h3>
             <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Total Active Admins</p>
          </div>
        </div>

        {/* Card 3: Storage */}
        <div className="bg-zinc-900/50 backdrop-blur-md p-6 rounded-[2rem] border border-slate-800 shadow-xl flex flex-col justify-between lg:col-span-2 group hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
             <div className="p-3 bg-blue-500/10 rounded-2xl group-hover:bg-blue-500/20 transition-colors">
               <HardDrive className="w-6 h-6 text-blue-400" />
             </div>
             <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{storageUsed} MB / 1 GB</span>
          </div>
          <div>
             <div className="flex items-end justify-between mb-2">
                 <h3 className="text-4xl font-black text-white tabular-nums tracking-tight">{storagePercentage}%</h3>
                 <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest pb-1">Storage Quota Used</p>
             </div>
             <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div 
                   className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out" 
                   style={{ width: `${storagePercentage}%` }} 
                />
             </div>
          </div>
        </div>

      </div>

      {/* Super Admin Hub Card (GitHub Link) */}
      <div className="bg-gradient-to-br from-zinc-900/80 to-[#020617] backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
         {/* Decorative Background Elements */}
         <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
               <h2 className="text-2xl font-black text-white tracking-tight mb-2">System Repository</h2>
               <p className="text-zinc-400 text-sm font-medium">Akses source code utama UNI-VERSE CMS. Harap berhati-hati saat melakukan force push.</p>
            </div>
            
            <div className="flex items-center gap-3 bg-black/40 border border-zinc-800/80 p-2 pl-5 rounded-2xl w-full md:w-auto">
               <Github className="w-5 h-5 text-zinc-400 flex-shrink-0" />
               <span className="text-xs font-mono text-zinc-300 truncate max-w-[200px] md:max-w-none">
                  https://github.com/Taqizdihar/uni-verse-headless-cms.git
               </span>
               <button 
                 onClick={copyToClipboard}
                 className="flex items-center justify-center p-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95 group"
                 title="Copy Repository Link"
               >
                 {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                 <span className="ml-2 text-xs font-black uppercase tracking-wider">{copied ? 'Copied' : 'Copy Link'}</span>
               </button>
            </div>
         </div>
      </div>
      
    </div>
  );
}
