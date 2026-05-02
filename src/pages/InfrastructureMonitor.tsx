import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Database, 
  HardDrive, 
  Server, 
  Activity, 
  FileText, 
  LayoutTemplate, 
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle2,
  PieChart
} from 'lucide-react';

interface InfraStats {
  dbStatus: string;
  rowCounts: {
    posts: number;
    pages: number;
    media: number;
  };
  storage: {
    total_used_mb: number;
    quota_mb: number;
    top_consumers: {
      tenant_id: number;
      subdomain: string;
      total_size_mb: number;
    }[];
  };
}

export function InfrastructureMonitor() {
  const [stats, setStats] = useState<InfraStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    // Optional: Refresh every 30 seconds for "real-time" feel
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/superadmin/infrastructure/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch infrastructure stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-zinc-500 font-bold uppercase tracking-widest text-xs">Memeriksa Infrastruktur...</p>
      </div>
    );
  }

  // Calculate Progress
  const percentage = Math.min(100, Math.round((stats.storage.total_used_mb / stats.storage.quota_mb) * 100));
  
  // Determine Color
  let progressColor = 'bg-amber-500';
  let textColor = 'text-amber-400';
  let bgColor = 'bg-amber-500/10';
  let borderColor = 'border-amber-500/20';

  if (percentage >= 90) {
    progressColor = 'bg-red-500';
    textColor = 'text-red-400';
    bgColor = 'bg-red-500/10';
    borderColor = 'border-red-500/20';
  } else if (percentage >= 70) {
    progressColor = 'bg-yellow-500';
    textColor = 'text-yellow-400';
    bgColor = 'bg-yellow-500/10';
    borderColor = 'border-yellow-500/20';
  }

  const isDbConnected = stats.dbStatus === 'connected';

  return (
    <div className="animate-in fade-in duration-500 space-y-8 max-w-7xl mx-auto pb-20">
      
      <div>
         <h2 className="text-3xl font-black text-white tracking-tight">Monitor Infrastruktur</h2>
         <p className="text-zinc-400 text-sm font-medium mt-1">Pantau kesehatan database dan metrik penggunaan kapasitas penyimpanan server.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Database Health Overview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900/50 backdrop-blur-md rounded-xl border border-slate-800 p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Database className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-black text-white">Database Health</h3>
              </div>
              <div className={`px-3 py-1.5 rounded-full flex items-center gap-2 border text-[10px] font-black uppercase tracking-widest ${
                isDbConnected ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {isDbConnected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {isDbConnected ? 'Connected' : 'Disconnected'}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                <div className="flex items-center gap-3">
                   <FileText className="w-5 h-5 text-zinc-500" />
                   <span className="text-sm font-bold text-zinc-300">Total Posts</span>
                </div>
                <span className="text-xl font-black text-white tabular-nums">{stats.rowCounts.posts.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                <div className="flex items-center gap-3">
                   <LayoutTemplate className="w-5 h-5 text-zinc-500" />
                   <span className="text-sm font-bold text-zinc-300">Total Pages</span>
                </div>
                <span className="text-xl font-black text-white tabular-nums">{stats.rowCounts.pages.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                <div className="flex items-center gap-3">
                   <ImageIcon className="w-5 h-5 text-zinc-500" />
                   <span className="text-sm font-bold text-zinc-300">Media Assets</span>
                </div>
                <span className="text-xl font-black text-white tabular-nums">{stats.rowCounts.media.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Analytics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/50 backdrop-blur-md rounded-xl border border-slate-800 p-8 shadow-xl">
             <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <HardDrive className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-black text-white">Storage Usage Analytics</h3>
             </div>

             {/* Main Progress Bar */}
             <div className="mb-10">
                <div className="flex items-end justify-between mb-3">
                   <div>
                     <span className={`text-5xl font-black tracking-tight ${textColor} tabular-nums`}>{percentage}%</span>
                     <span className="text-zinc-500 font-bold text-sm ml-2">Used</span>
                   </div>
                   <div className="text-right">
                      <p className="text-white font-black text-lg">{stats.storage.total_used_mb.toLocaleString()} MB</p>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">of {stats.storage.quota_mb.toLocaleString()} MB Quota</p>
                   </div>
                </div>
                <div className="h-4 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50 shadow-inner">
                   <div 
                      className={`h-full ${progressColor} transition-all duration-1000 ease-out`}
                      style={{ width: `${percentage}%` }}
                   />
                </div>
                {percentage >= 90 && (
                  <p className="mt-3 text-xs font-bold text-red-400 flex items-center gap-2 animate-pulse">
                    <AlertTriangle className="w-4 h-4" />
                    Peringatan: Kapasitas penyimpanan global hampir penuh.
                  </p>
                )}
             </div>

             {/* Top Consumers */}
             <div>
                <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <PieChart className="w-4 h-4" /> Top 5 Storage Consumers
                </h4>
                <div className="space-y-3">
                  {stats.storage.top_consumers.length === 0 ? (
                    <div className="p-6 text-center text-zinc-500 font-medium bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                      Belum ada data penggunaan media.
                    </div>
                  ) : (
                    stats.storage.top_consumers.map((consumer, idx) => {
                      // Calculate width relative to the largest consumer or total quota
                      const maxConsumerSize = stats.storage.top_consumers[0].total_size_mb || 1;
                      const relativePercentage = Math.max(5, Math.round((consumer.total_size_mb / maxConsumerSize) * 100));

                      return (
                        <div key={consumer.tenant_id} className="relative p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50 overflow-hidden group">
                           {/* Background Bar */}
                           <div 
                             className="absolute top-0 left-0 h-full bg-zinc-800/30 transition-all duration-500 z-0"
                             style={{ width: `${relativePercentage}%` }}
                           />
                           <div className="relative z-10 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                               <div className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-400">
                                 #{idx + 1}
                               </div>
                               <div>
                                 <p className="text-sm font-bold text-white leading-none">{consumer.subdomain}</p>
                                 <p className="text-[10px] text-zinc-500 font-mono mt-1">{consumer.subdomain}.uni-verse.id</p>
                               </div>
                             </div>
                             <div className="text-right">
                               <p className="text-sm font-black text-purple-400 tabular-nums">{consumer.total_size_mb.toLocaleString()} MB</p>
                             </div>
                           </div>
                        </div>
                      );
                    })
                  )}
                </div>
             </div>

          </div>
        </div>

      </div>
    </div>
  );
}
