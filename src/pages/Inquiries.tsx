import React, { useState, useEffect, useCallback } from 'react';
import { Mail, Trash2, Eye, Search, CheckCheck, X, AlertCircle, Loader2, MailOpen, Clock, User, AtSign, FileText, ChevronDown } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

interface Inquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read';
  created_at: string;
}

export function Inquiries() {
  const { token, activeTenantId } = useCMS();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'single' | 'bulk'; id?: number } | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const getHeaders = useCallback(() => {
    const t = token || localStorage.getItem('token');
    const tid = activeTenantId || localStorage.getItem('active_tenant_id');
    return {
      'Content-Type': 'application/json',
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
      ...(tid ? { 'x-active-tenant': String(tid) } : {}),
    };
  }, [token, activeTenantId]);

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/inquiries`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, getHeaders]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleOpenDetail = async (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);

    // Mark as read immediately
    if (inquiry.status === 'unread') {
      try {
        await fetch(`${API_URL}/api/inquiries/${inquiry.id}/read`, {
          method: 'PATCH',
          headers: getHeaders(),
        });
        setInquiries(prev =>
          prev.map(i => (i.id === inquiry.id ? { ...i, status: 'read' } : i))
        );
      } catch (err) {
        console.error('Failed to mark as read:', err);
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_URL}/api/inquiries/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      setInquiries(prev => prev.filter(i => i.id !== id));
      setSelectedInquiry(null);
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const ids = Array.from(selectedIds);
      await fetch(`${API_URL}/api/inquiries/bulk-delete`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ ids }),
      });
      setInquiries(prev => prev.filter(i => !selectedIds.has(i.id)));
      setSelectedIds(new Set());
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to bulk delete:', err);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(i => i.id)));
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Filter and search
  const filtered = inquiries.filter(i => {
    const matchesSearch =
      !searchQuery ||
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || i.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const unreadCount = inquiries.filter(i => i.status === 'unread').length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] h-full space-y-4">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        <p className="text-zinc-500 font-medium">Memuat pesan masuk...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-zinc-900">Pesan Masuk</h2>
            {unreadCount > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                {unreadCount} baru
              </span>
            )}
          </div>
          <p className="text-zinc-500 mt-1">Kelola pesan dari form kontak website Anda.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari nama, email, atau pesan..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-xl outline-none focus:border-amber-400 text-sm font-medium transition-colors"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
            className="appearance-none pl-4 pr-10 py-3 bg-white border border-zinc-200 rounded-xl outline-none focus:border-amber-400 text-sm font-bold text-zinc-700 cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="unread">Belum Dibaca</option>
            <option value="read">Sudah Dibaca</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
        </div>

        {selectedIds.size > 0 && (
          <button
            onClick={() => setDeleteConfirm({ type: 'bulk' })}
            className="flex items-center gap-2 px-5 py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20"
          >
            <Trash2 className="w-4 h-4" />
            Hapus ({selectedIds.size})
          </button>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-zinc-100 shadow-sm">
          <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-zinc-300" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-1">Belum ada pesan</h3>
          <p className="text-zinc-400 text-sm max-w-sm text-center">
            {searchQuery || filterStatus !== 'all'
              ? 'Tidak ditemukan pesan yang cocok dengan filter Anda.'
              : 'Pesan dari form kontak website Anda akan muncul di sini.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-[10px] text-zinc-400 uppercase bg-zinc-50/80 font-bold tracking-widest border-b border-zinc-100">
                <tr>
                  <th scope="col" className="px-5 py-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-zinc-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                  </th>
                  <th scope="col" className="px-5 py-4">Nama</th>
                  <th scope="col" className="px-5 py-4">Email</th>
                  <th scope="col" className="px-5 py-4">Subjek</th>
                  <th scope="col" className="px-5 py-4">Tanggal</th>
                  <th scope="col" className="px-5 py-4 text-center">Status</th>
                  <th scope="col" className="px-5 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filtered.map(inquiry => {
                  const isUnread = inquiry.status === 'unread';
                  return (
                    <tr
                      key={inquiry.id}
                      className={`transition-all cursor-pointer group ${
                        isUnread
                          ? 'bg-blue-50/30 hover:bg-blue-50/60'
                          : 'hover:bg-zinc-50/50'
                      }`}
                      onClick={() => handleOpenDetail(inquiry)}
                    >
                      <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(inquiry.id)}
                          onChange={() => toggleSelect(inquiry.id)}
                          className="w-4 h-4 rounded border-zinc-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {isUnread && (
                            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0 shadow-[0_0_6px_rgba(59,130,246,0.4)]" />
                          )}
                          <span className={`${isUnread ? 'font-bold text-zinc-900' : 'font-medium text-zinc-600'}`}>
                            {inquiry.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-zinc-500 font-medium">{inquiry.email}</td>
                      <td className="px-5 py-4">
                        <span className={`${isUnread ? 'font-bold text-zinc-800' : 'text-zinc-500'} truncate block max-w-[200px]`}>
                          {inquiry.subject || '(Tanpa subjek)'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-zinc-400 text-xs font-medium whitespace-nowrap">
                        {formatDate(inquiry.created_at)}
                      </td>
                      <td className="px-5 py-4 text-center">
                        {isUnread ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            <Mail className="w-3 h-3" />
                            Baru
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 text-zinc-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            <MailOpen className="w-3 h-3" />
                            Dibaca
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenDetail(inquiry)}
                            className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'single', id: inquiry.id })}
                            className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer Stats */}
          <div className="px-6 py-4 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-between">
            <p className="text-xs text-zinc-400 font-medium">
              Menampilkan {filtered.length} dari {inquiries.length} pesan
            </p>
            <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                {unreadCount} belum dibaca
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCheck className="w-3.5 h-3.5 text-green-500" />
                {inquiries.length - unreadCount} sudah dibaca
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedInquiry && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onMouseDown={() => setSelectedInquiry(null)}
        >
          <div
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
            onMouseDown={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-8 pt-8 pb-6 border-b border-zinc-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-400/10 text-amber-600 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">Detail Pesan</h3>
                    <p className="text-xs text-zinc-400 font-medium mt-0.5">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {formatDate(selectedInquiry.created_at)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="p-2 text-zinc-400 hover:bg-zinc-50 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-8 py-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Nama</span>
                  </div>
                  <p className="text-sm font-bold text-zinc-900">{selectedInquiry.name}</p>
                </div>
                <div className="bg-zinc-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AtSign className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email</span>
                  </div>
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors break-all"
                  >
                    {selectedInquiry.email}
                  </a>
                </div>
              </div>

              {selectedInquiry.subject && (
                <div className="bg-zinc-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Subjek</span>
                  </div>
                  <p className="text-sm font-bold text-zinc-900">{selectedInquiry.subject}</p>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Pesan</span>
                </div>
                <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-5">
                  <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-between">
              <a
                href={`mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject || 'Pesan Anda'}`}
                className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-amber-400 rounded-xl font-bold text-sm hover:bg-black transition-all active:scale-95 shadow-lg"
              >
                <Mail className="w-4 h-4" />
                Balas via Email
              </a>
              <button
                onClick={() => {
                  setDeleteConfirm({ type: 'single', id: selectedInquiry.id });
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl font-bold text-sm transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onMouseDown={() => setDeleteConfirm(null)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
            onMouseDown={e => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-xl bg-red-50 text-red-500">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <button onClick={() => setDeleteConfirm(null)} className="p-2 text-zinc-400 hover:bg-zinc-50 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-xl font-bold text-zinc-900 mb-2">
                {deleteConfirm.type === 'bulk' ? 'Hapus Pesan Terpilih?' : 'Hapus Pesan Ini?'}
              </h3>
              <p className="text-zinc-500 leading-relaxed mb-8">
                {deleteConfirm.type === 'bulk'
                  ? `${selectedIds.size} pesan yang dipilih akan dihapus secara permanen.`
                  : 'Pesan ini akan dihapus secara permanen dan tidak dapat dikembalikan.'}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-6 py-3.5 rounded-xl font-bold text-zinc-500 bg-zinc-50 hover:bg-zinc-100 transition-all border border-zinc-100"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    if (deleteConfirm.type === 'bulk') {
                      handleBulkDelete();
                    } else if (deleteConfirm.id) {
                      handleDelete(deleteConfirm.id);
                    }
                  }}
                  className="flex-1 px-6 py-3.5 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all active:scale-95"
                >
                  Hapus Permanen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
