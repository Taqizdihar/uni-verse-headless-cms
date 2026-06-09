import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Loader2, History } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { formatActivityDate } from '@/utils/dateFormatter';

export function LogAktivitas() {
  const { user, token, activeTenantId } = useCMS();
  const [isLoading, setIsLoading] = useState(true);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      if (user?.role === 'guest') {
        setIsLoading(false);
        return;
      }
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
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLogs();
  }, [token, activeTenantId, user?.role]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] h-full space-y-4">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        <p className="text-zinc-500 font-medium">Memuat log audit...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <History className="w-6 h-6 text-amber-400" /> Log Aktivitas
          </h2>
          <p className="text-zinc-500 text-sm mt-1">Daftar lengkap riwayat interaksi dan aktivitas sistem untuk tenant aktif.</p>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="border-b border-zinc-50 p-6">
          <CardTitle className="text-lg font-bold">Semua Aktivitas</CardTitle>
          <CardDescription className="mt-0.5 text-zinc-500 italic">
            Catatan jejak audit lengkap dari aksi para anggota workspace.
          </CardDescription>
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
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-400 italic">
                        Akses log aktivitas dibatasi untuk peran Guest.
                    </td>
                  </tr>
                ) : activityLogs && activityLogs.length > 0 ? activityLogs.map((activity) => (
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
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-400 italic">
                        Tidak ada log aktivitas yang tercatat di workspace ini.
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
