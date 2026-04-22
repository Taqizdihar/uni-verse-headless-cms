// File: src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Users, FileText, CheckCircle, TrendingUp, Loader2, Image as ImageIcon, MessageSquare, TrendingUp as Up, TrendingDown as Down } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';

export function Dashboard() {
  const { activities, pages, posts, media, comments, totalUsers, settings } = useCMS();
  const [isLoading, setIsLoading] = useState(true);

  const pendingCommentsCount = comments ? comments.filter(c => c.status === 'Pending').length : 0;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

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
    { title: "Komentar Tertunda", value: pendingCommentsCount.toString(), icon: MessageSquare }
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
            <button className="text-xs font-bold text-amber-400 hover:text-zinc-900 transition-colors uppercase tracking-widest underline underline-offset-4">
              Log Audit
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-[10px] text-zinc-400 uppercase bg-zinc-50/50 font-bold tracking-widest">
                <tr>
                  <th scope="col" className="px-6 py-4">Tenant</th>
                  <th scope="col" className="px-6 py-4">Aksi Protokol</th>
                  <th scope="col" className="px-6 py-4">Waktu</th>
                  <th scope="col" className="px-6 py-4 text-right pr-10">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {activities && activities.length > 0 ? activities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-zinc-900 italic uppercase tracking-tighter">{activity.tenant}</td>
                    <td className="px-6 py-4 text-zinc-600 group-hover:text-zinc-900 transition-colors font-medium italic">{activity.action}</td>
                    <td className="px-6 py-4 text-zinc-400 text-xs">{activity.date}</td>
                    <td className="px-6 py-4 text-right pr-10">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        activity.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
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
