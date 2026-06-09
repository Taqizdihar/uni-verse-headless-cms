// File: src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Link } from 'react-router-dom';
import { Users, FileText, CheckCircle, TrendingUp, Loader2, Image as ImageIcon, MessageSquare, TrendingUp as Up, TrendingDown as Down, Mail } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { formatActivityDate } from '@/utils/dateFormatter';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

export function Dashboard() {
  const { pages, posts, media, comments, totalUsers, totalInquiries, settings, user, token, activeTenantId } = useCMS();
  const [isLoading, setIsLoading] = useState(true);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [chartsData, setChartsData] = useState<any>(null);
  const [isChartsLoading, setIsChartsLoading] = useState(true);

  const pendingCommentsCount = comments ? comments.filter(c => c.status === 'Pending').length : 0;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      if (user?.role === 'guest') return;
      if (!token) return;
      
      try {
        const headers: Record<string, string> = {
          'Authorization': `Bearer ${token}`
        };
        if (activeTenantId) {
          headers['x-active-tenant'] = String(activeTenantId);
        }
        
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/activity-logs`, { headers });
        if (res.ok) {
          const data = await res.json();
          setActivityLogs(data);
        }
      } catch (err) {
        console.error('Failed to fetch activity logs', err);
      }
    };

    const fetchCharts = async () => {
      if (!token || !activeTenantId) {
        setIsChartsLoading(false);
        return;
      }
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/dashboard/charts`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-active-tenant': String(activeTenantId)
          }
        });
        if (res.ok) {
          const data = await res.json();
          setChartsData(data);
        }
      } catch (e) {
        console.error('Failed to fetch charts', e);
      } finally {
        setIsChartsLoading(false);
      }
    };
    
    fetchLogs();
    fetchCharts();
  }, [token, activeTenantId, user?.role]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] h-full space-y-4">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        <p className="text-zinc-500 font-medium">Mensinkronisasi data ekosistem...</p>
      </div>
    );
  }

  const stats = [
    { title: "Total User", value: totalUsers.toString(), icon: Users },
    { title: "Halaman Diterbitkan", value: pages?.length.toString() || "0", icon: FileText },
    { title: "Post Aktif", value: posts?.length.toString() || "0", icon: CheckCircle },
    { title: "Aset Media", value: media?.length.toString() || "0", icon: ImageIcon },
    { title: "Komentar Tertunda", value: pendingCommentsCount.toString(), icon: MessageSquare },
    { title: "Email Masuk", value: totalInquiries?.toString() || "0", icon: Mail }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Dashboard</h2>
          <p className="text-zinc-500 text-sm mt-1">Pantau metrik operasional dan umpan aktivitas tenant.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="items-center gap-2 hidden md:flex">
             <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Pembaruan Langsung:</span>
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
           </div>
        </div>
      </div>

      {/* Charts Section */}
      {isChartsLoading ? (
        <div className="w-full h-[300px] bg-zinc-50 rounded-xl flex flex-col items-center justify-center border border-zinc-200">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-4" />
          <p className="text-sm font-medium text-zinc-400">Memuat visualisasi data...</p>
        </div>
      ) : chartsData ? (
        <div className="space-y-6">
          {/* Row 1: Area Chart */}
          <Card className="border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="border-b border-zinc-50 p-6">
              <CardTitle className="text-lg font-bold text-zinc-900">Tren Aktivitas (7 Hari Terakhir)</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {chartsData.activityTrend && chartsData.activityTrend.length > 0 ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartsData.activityTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAktivitas" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                      <XAxis dataKey="date" tick={{fontSize: 12, fill: '#a1a1aa', fontWeight: 600}} tickLine={false} axisLine={false} />
                      <YAxis tick={{fontSize: 12, fill: '#a1a1aa', fontWeight: 600}} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f4f4f5', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="aktivitas" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorAktivitas)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-zinc-400 font-medium italic">Belum ada data yang cukup untuk visualisasi</div>
              )}
            </CardContent>
          </Card>

          {/* Row 2: Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Doughnut Chart */}
            <Card className="border-none shadow-sm overflow-hidden bg-white">
              <CardHeader className="border-b border-zinc-50 p-6">
                <CardTitle className="text-lg font-bold text-zinc-900">Komposisi Tim</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {chartsData.roleDistribution && chartsData.roleDistribution.length > 0 ? (
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartsData.roleDistribution}
                          innerRadius={70}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {chartsData.roleDistribution.map((entry: any, index: number) => {
                            const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899'];
                            return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                          })}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f4f4f5', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#71717a' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-zinc-400 font-medium italic">Belum ada data yang cukup untuk visualisasi</div>
                )}
              </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card className="border-none shadow-sm overflow-hidden bg-white">
              <CardHeader className="border-b border-zinc-50 p-6">
                <CardTitle className="text-lg font-bold text-zinc-900">Distribusi Konten</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {chartsData.contentDistribution && chartsData.contentDistribution.some((d: any) => d.total > 0) ? (
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartsData.contentDistribution} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                        <XAxis dataKey="name" tick={{fontSize: 12, fill: '#a1a1aa', fontWeight: 600}} tickLine={false} axisLine={false} />
                        <YAxis tick={{fontSize: 12, fill: '#a1a1aa', fontWeight: 600}} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{fill: '#f4f4f5'}} contentStyle={{ borderRadius: '12px', border: '1px solid #f4f4f5', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="total" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-zinc-400 font-medium italic">Belum ada data yang cukup untuk visualisasi</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="bg-white border-zinc-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  {stat.title}
                </CardTitle>
                <div className="p-2 bg-zinc-50 rounded-lg">
                  <Icon className="w-4 h-4 text-zinc-900" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-zinc-900">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="border-b border-zinc-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Umpan Aktivitas Terbaru</CardTitle>
              <CardDescription className="mt-0.5 text-zinc-500 italic">
                Sinyal interaksi terbaru di semua subdomain.
              </CardDescription>
            </div>
            <Link to="/log-aktivitas" className="text-xs font-bold text-amber-400 hover:text-zinc-900 transition-colors uppercase tracking-widest underline underline-offset-4">
              Log Audit
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-[10px] text-zinc-400 uppercase bg-zinc-50/50 font-bold tracking-widest">
                <tr>
                  <th scope="col" className="px-6 py-4">Pengguna</th>
                  <th scope="col" className="px-6 py-4">Peran</th>
                  <th scope="col" className="px-6 py-4">Aksi Protokol</th>
                  <th scope="col" className="px-6 py-4">Waktu</th>
                  <th scope="col" className="px-6 py-4 text-right pr-10">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {user?.role === 'guest' ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-400 italic">
                        Akses log aktivitas dibatasi untuk peran Guest.
                    </td>
                  </tr>
                ) : activityLogs && activityLogs.length > 0 ? activityLogs.slice(0, 10).map((activity) => (
                  <tr key={activity.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-zinc-900">{activity.real_actor_name || activity.actor_name}</td>
                    <td className="px-6 py-4 text-zinc-600 font-medium">{
                      activity.actor_role ? activity.actor_role.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') : 'Unknown'
                    }</td>
                    <td className="px-6 py-4 text-zinc-600 group-hover:text-zinc-900 transition-colors font-medium italic">{activity.action}</td>
                    <td className="px-6 py-4 text-zinc-400 text-xs">
                      {formatActivityDate(activity.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right pr-10">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        activity.status?.toLowerCase() === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-400 italic">
                        Tidak ada sinyal aktivitas yang terdeteksi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
