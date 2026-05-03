// File: src/pages/Users.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Plus, Trash2, Mail, ShieldCheck, UserCircle, X, Loader2, Send, Users as UsersIcon } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { useSearch } from '@/context/SearchContext';

interface TenantUser {
  user_id: number;
  name: string;
  email: string;
  profile_picture_url?: string;
  role: string;
  status: string;
}

export function Users() {
  const { user, deleteUser, fetchAllData } = useCMS();
  const { searchQuery } = useSearch();
  const [tenantUsers, setTenantUsers] = useState<TenantUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('guest');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [deleteModalData, setDeleteModalData] = useState<{ id: number, name: string } | null>(null);

  const getHeaders = useCallback(() => {
    const t = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(t ? { Authorization: `Bearer ${t}` } : {})
    };
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setTenantUsers(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('[Users] Fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return tenantUsers.filter(u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tenantUsers, searchQuery]);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      setInviteError('Email wajib diisi.');
      return;
    }
    setInviteLoading(true);
    setInviteError('');
    setInviteSuccess('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tenant/invite`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole })
      });
      const data = await res.json();

      if (res.ok) {
        setInviteSuccess(data.message || 'Undangan berhasil dikirim!');
        setInviteEmail('');
        setInviteRole('guest');
        await fetchUsers();
        await fetchAllData();
        setTimeout(() => {
          setIsInviteOpen(false);
          setInviteSuccess('');
        }, 2000);
      } else {
        setInviteError(data.error || 'Gagal mengirim undangan.');
      }
    } catch (e) {
      setInviteError('Terjadi kesalahan jaringan.');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleDelete = (userId: number, userName: string) => {
    setDeleteModalData({ id: userId, name: userName });
  };

  const confirmDelete = async () => {
    if (!deleteModalData) return;
    await deleteUser(deleteModalData.id);
    await fetchUsers();
    setDeleteModalData(null);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-zinc-900 text-white';
      case 'content_creative':
        return 'bg-blue-100 text-blue-700';
      case 'guest':
        return 'bg-zinc-100 text-zinc-500';
      default:
        return 'bg-zinc-100 text-zinc-500';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'Admin';
      case 'content_creative': return 'Content Creative';
      case 'guest': return 'Guest';
      default: return role;
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { color: 'bg-green-500', textColor: 'text-green-700', label: 'Aktif' };
      case 'pending':
        return { color: 'bg-amber-400', textColor: 'text-amber-700', label: 'Menunggu' };
      case 'rejected':
        return { color: 'bg-red-500', textColor: 'text-red-700', label: 'Ditolak' };
      default:
        return { color: 'bg-green-500', textColor: 'text-green-700', label: 'Aktif' };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-brand-black">Pengguna</h2>
          <p className="text-gray-500 mt-1">Kelola anggota tim dan peran mereka.</p>
        </div>
        <button 
          onClick={() => { setIsInviteOpen(true); setInviteError(''); setInviteSuccess(''); }}
          className="flex items-center gap-2 bg-brand-yellow text-brand-black px-4 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-all shadow-sm group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Tambah Pengguna
        </button>
      </div>

      <Card className="border-none shadow-sm shadow-gray-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-[10px] text-gray-400 uppercase bg-gray-50/50 font-bold tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">Pengguna</th>
                  <th scope="col" className="px-6 py-4">Peran</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right pr-6">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-amber-400 mx-auto mb-2" />
                      <span className="text-sm text-zinc-400 font-medium">Memuat data pengguna...</span>
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => {
                    const statusCfg = getStatusConfig(u.status);
                    return (
                      <tr key={u.user_id} className="hover:bg-gray-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center font-bold text-sm flex-shrink-0">
                              {u.profile_picture_url ? (
                                <img src={u.profile_picture_url} alt={u.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className={`w-full h-full flex items-center justify-center ${
                                  u.role.toLowerCase() === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-400'
                                }`}>
                                  {(u.name || 'U').charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-brand-black">{u.name}</p>
                              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                                <Mail className="w-3 h-3" />
                                {u.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getRoleBadgeColor(u.role)}`}>
                            {u.role.toLowerCase() === 'admin' && <ShieldCheck className="w-3 h-3" />}
                            {getRoleLabel(u.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${statusCfg.color}`} />
                            <span className={`text-[10px] font-bold uppercase ${statusCfg.textColor}`}>
                              {statusCfg.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right pr-6">
                          <div className="flex items-center justify-end gap-2">
                            {/* Don't allow deleting yourself */}
                            {u.user_id !== user?.id && (
                              <button 
                                onClick={() => handleDelete(u.user_id, u.name)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                                title="Hapus dari tenant"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">
                        Pengguna tidak ditemukan.
                      </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onMouseDown={() => setIsInviteOpen(false)}
        >
          <div 
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
            onMouseDown={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 bg-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center">
                  <UsersIcon className="w-5 h-5 text-zinc-900" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-wider">Undang Pengguna</h3>
                  <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">Kirim undangan via email</p>
                </div>
              </div>
              <button onClick={() => setIsInviteOpen(false)} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Alamat Email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => { setInviteEmail(e.target.value); setInviteError(''); }}
                  placeholder="contoh: user@email.com"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder:text-zinc-300"
                  autoFocus
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Peran</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="admin">Admin</option>
                  <option value="content_creative">Content Creative</option>
                  <option value="guest">Guest</option>
                </select>
              </div>

              {/* Error Message */}
              {inviteError && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium flex items-center gap-2">
                  <X className="w-4 h-4 flex-shrink-0" />
                  {inviteError}
                </div>
              )}

              {/* Success Message */}
              {inviteSuccess && (
                <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600 font-medium flex items-center gap-2">
                  <Send className="w-4 h-4 flex-shrink-0" />
                  {inviteSuccess}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setIsInviteOpen(false)}
                className="flex-1 px-6 py-3.5 rounded-xl font-bold text-zinc-500 bg-zinc-50 hover:bg-zinc-100 transition-all border border-zinc-100"
              >
                Batal
              </button>
              <button
                onClick={handleInvite}
                disabled={inviteLoading || !inviteEmail.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-amber-400 text-zinc-900 hover:bg-amber-500 transition-all shadow-lg shadow-amber-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {inviteLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Kirim Undangan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalData && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onMouseDown={() => setDeleteModalData(null)}
        >
          <div 
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
            onMouseDown={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 bg-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-zinc-900" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-wider">Hapus Pengguna</h3>
                </div>
              </div>
              <button onClick={() => setDeleteModalData(null)} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-6">
              <p className="text-sm font-medium text-zinc-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus <span className="font-bold text-zinc-900">{deleteModalData.name}</span> dari tim? Tindakan ini akan segera mencabut akses mereka.
              </p>
            </div>
            {/* Modal Footer */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setDeleteModalData(null)}
                className="flex-1 px-6 py-3.5 rounded-xl font-bold text-zinc-500 bg-zinc-50 hover:bg-zinc-100 transition-all border border-zinc-100"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-6 py-3.5 rounded-xl font-bold bg-amber-400 text-zinc-900 hover:bg-amber-500 transition-all shadow-lg shadow-amber-400/20"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
