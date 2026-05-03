import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Mail, Check, X, Loader2, AlertCircle, Info, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useCMS } from '../context/CMSContext';

interface Notification {
  id: number;
  user_id: number;
  tenant_id: number | null;
  type: string;
  message: string;
  is_read: number;
  created_at: string;
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [respondingId, setRespondingId] = useState<number | null>(null);
  const { user } = useCMS();

  const getHeaders = useCallback(() => {
    const t = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(t ? { Authorization: `Bearer ${t}` } : {})
    };
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('[Notifications] Failed to fetch:', e);
    } finally {
      setIsLoading(false);
    }
  }, [getHeaders]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleRespond = async (notifId: number, action: 'accept' | 'reject') => {
    setRespondingId(notifId);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/respond`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ notification_id: notifId, action })
      });
      if (res.ok) {
        if (action === 'accept') {
          window.location.reload();
        } else {
          await fetchNotifications();
        }
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal merespon undangan.');
      }
    } catch (e) {
      console.error('[Notifications] Respond error:', e);
    } finally {
      setRespondingId(null);
    }
  };

  const handleMarkRead = async (notifId: number) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${notifId}/read`, {
        method: 'PATCH',
        headers: getHeaders()
      });
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: 1 } : n));
    } catch (e) {
      console.error('[Notifications] Mark read error:', e);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'invitation':
        return { icon: Mail, color: 'bg-amber-100 text-amber-600', label: 'Undangan Bergabung' };
      case 'system_update':
        return { icon: Info, color: 'bg-blue-100 text-blue-600', label: 'Update Sistem' };
      case 'alert':
        return { icon: AlertCircle, color: 'bg-red-100 text-red-600', label: 'Peringatan' };
      default:
        return { icon: Bell, color: 'bg-zinc-100 text-zinc-500', label: 'Notifikasi' };
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] h-full space-y-4">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        <p className="text-zinc-500 font-medium italic">Mengambil notifikasi...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter italic">Pusat Notifikasi</h2>
          <p className="text-zinc-500 text-sm mt-1">Kelola undangan dan pemberitahuan sistem Anda.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest">
           <Bell className="w-4 h-4 text-amber-400" />
           {notifications.filter(n => !n.is_read).length} Baru
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="border-dashed border-2 border-zinc-200 bg-transparent">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-zinc-200" />
              </div>
              <p className="text-zinc-400 font-medium">Kotak masuk Anda kosong.</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notif) => {
            const { icon: Icon, color, label } = getTypeStyles(notif.type);
            return (
              <Card 
                key={notif.id} 
                className={`transition-all duration-300 border-l-4 ${
                  !notif.is_read ? 'border-l-amber-400 bg-amber-50/30' : 'border-l-transparent bg-white hover:border-l-zinc-200'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${color} shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full ${color}`}>
                            {label}
                          </span>
                          {!notif.is_read && (
                            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-bold uppercase tracking-wider">{formatDate(notif.created_at)}</span>
                        </div>
                      </div>

                      <p className="text-zinc-700 font-medium leading-relaxed italic">
                        {notif.message}
                      </p>

                      <div className="flex items-center justify-between pt-2">
                        {notif.type === 'invitation' && !notif.is_read ? (
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleRespond(notif.id, 'accept')}
                              disabled={respondingId === notif.id}
                              className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 text-zinc-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-500 transition-all disabled:opacity-50 shadow-lg shadow-amber-400/20 active:scale-95"
                            >
                              {respondingId === notif.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                              Terima Undangan
                            </button>
                            <button
                              onClick={() => handleRespond(notif.id, 'reject')}
                              disabled={respondingId === notif.id}
                              className="flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-zinc-200 text-zinc-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all disabled:opacity-50 active:scale-95"
                            >
                              <X className="w-4 h-4" />
                              Tolak
                            </button>
                          </div>
                        ) : !notif.is_read ? (
                          <button
                            onClick={() => handleMarkRead(notif.id)}
                            className="text-xs font-black text-amber-500 uppercase tracking-widest hover:text-zinc-900 transition-colors underline underline-offset-4"
                          >
                            Tandai Sudah Dibaca
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Sudah Dibaca</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
