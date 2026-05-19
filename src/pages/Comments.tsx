// File: src/pages/Comments.tsx
import React, { useState, useMemo } from 'react';
import { Check, Ban, Trash2, MessageSquare, User, Mail, ExternalLink, Search, X, AlertCircle, Clock, ChevronDown, Loader2, MessageCircle } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';

interface Comment {
  id: number;
  post_id: number;
  author_name: string;
  author_email: string;
  content: string;
  post_title: string;
  created_at: string;
  status: 'pending' | 'approved' | 'spam';
}

export function Comments() {
  const { comments, approveComment, markCommentAsSpam, deleteComment } = useCMS();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'spam'>('all');
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number } | null>(null);

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

  const filtered = useMemo(() => {
    return (comments as Comment[]).filter(c => {
      const matchesSearch =
        !searchQuery ||
        c.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.author_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.post_title || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [comments, searchQuery, filterStatus]);

  const pendingCount = comments.filter(c => c.status === 'pending').length;
  const approvedCount = comments.filter(c => c.status === 'approved').length;
  const spamCount = comments.filter(c => c.status === 'spam').length;

  const handleApprove = async (id: number) => {
    await approveComment(id);
    if (selectedComment?.id === id) {
      setSelectedComment(prev => prev ? { ...prev, status: 'approved' } : null);
    }
  };

  const handleSpam = async (id: number) => {
    await markCommentAsSpam(id);
    if (selectedComment?.id === id) {
      setSelectedComment(prev => prev ? { ...prev, status: 'spam' } : null);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteComment(id);
    setSelectedComment(null);
    setDeleteConfirm(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <Check className="w-3 h-3" />
            Disetujui
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <Clock className="w-3 h-3" />
            Menunggu
          </span>
        );
      case 'spam':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <Ban className="w-3 h-3" />
            Spam
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-zinc-900">Komentar</h2>
            {pendingCount > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                {pendingCount} menunggu
              </span>
            )}
          </div>
          <p className="text-zinc-500 mt-1">Kelola dan moderasi komentar pengunjung di seluruh platform Anda.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari nama, email, atau isi komentar..."
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
            <option value="pending">Menunggu</option>
            <option value="approved">Disetujui</option>
            <option value="spam">Spam</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
        </div>
      </div>

      {/* Table / Empty State */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-zinc-100 shadow-sm">
          <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-zinc-300" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-1">Belum ada komentar</h3>
          <p className="text-zinc-400 text-sm max-w-sm text-center">
            {searchQuery || filterStatus !== 'all'
              ? 'Tidak ditemukan komentar yang cocok dengan filter Anda.'
              : 'Komentar dari pengunjung website Anda akan muncul di sini.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-[10px] text-zinc-400 uppercase bg-zinc-50/80 font-bold tracking-widest border-b border-zinc-100">
                <tr>
                  <th scope="col" className="px-5 py-4">Penulis</th>
                  <th scope="col" className="px-5 py-4">Komentar</th>
                  <th scope="col" className="px-5 py-4">Sebagai Respons Untuk</th>
                  <th scope="col" className="px-5 py-4 text-center">Status</th>
                  <th scope="col" className="px-5 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filtered.map(comment => {
                  const isPending = comment.status === 'pending';
                  return (
                    <tr
                      key={comment.id}
                      className={`transition-all cursor-pointer group ${
                        isPending
                          ? 'bg-amber-50/30 hover:bg-amber-50/60'
                          : 'hover:bg-zinc-50/50'
                      }`}
                      onClick={() => setSelectedComment(comment)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 flex-shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className={`font-bold truncate ${isPending ? 'text-zinc-900' : 'text-zinc-600'}`}>
                              {comment.author_name}
                            </p>
                            <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
                              <Mail className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{comment.author_email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        <p className="text-zinc-600 line-clamp-2 leading-relaxed italic">
                          "{comment.content}"
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-1 font-medium">{formatDate(comment.created_at)}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-blue-600 font-bold">
                          <span className="truncate max-w-[160px]">{comment.post_title || '(Post dihapus)'}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        {getStatusBadge(comment.status)}
                      </td>
                      <td className="px-5 py-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {comment.status !== 'approved' && (
                            <button
                              onClick={() => handleApprove(comment.id)}
                              className="p-2 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                              title="Setujui"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {comment.status !== 'spam' && (
                            <button
                              onClick={() => handleSpam(comment.id)}
                              className="p-2 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                              title="Tandai Spam"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteConfirm({ id: comment.id })}
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
              Menampilkan {filtered.length} dari {comments.length} komentar
            </p>
            <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-amber-500 rounded-full" />
                {pendingCount} menunggu
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                {approvedCount} disetujui
              </span>
              <span className="flex items-center gap-1.5">
                <Ban className="w-3.5 h-3.5 text-red-400" />
                {spamCount} spam
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedComment && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onMouseDown={() => setSelectedComment(null)}
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
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">Detail Komentar</h3>
                    <p className="text-xs text-zinc-400 font-medium mt-0.5">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {formatDate(selectedComment.created_at)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedComment(null)}
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
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Penulis</span>
                  </div>
                  <p className="text-sm font-bold text-zinc-900">{selectedComment.author_name}</p>
                </div>
                <div className="bg-zinc-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email</span>
                  </div>
                  <a
                    href={`mailto:${selectedComment.author_email}`}
                    className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors break-all"
                  >
                    {selectedComment.author_email}
                  </a>
                </div>
              </div>

              <div className="bg-zinc-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Sebagai Respons Untuk</span>
                </div>
                <p className="text-sm font-bold text-blue-600">{selectedComment.post_title || '(Post dihapus)'}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Komentar</span>
                  {getStatusBadge(selectedComment.status)}
                </div>
                <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-5">
                  <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                    {selectedComment.content}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer — Action Buttons */}
            <div className="px-8 py-5 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {selectedComment.status !== 'approved' && (
                  <button
                    onClick={() => handleApprove(selectedComment.id)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    Setujui
                  </button>
                )}
                {selectedComment.status !== 'spam' && (
                  <button
                    onClick={() => handleSpam(selectedComment.id)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 transition-all active:scale-95 shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    <Ban className="w-4 h-4" />
                    Tandai Spam
                  </button>
                )}
              </div>
              <button
                onClick={() => setDeleteConfirm({ id: selectedComment.id })}
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

              <h3 className="text-xl font-bold text-zinc-900 mb-2">Hapus Komentar Ini?</h3>
              <p className="text-zinc-500 leading-relaxed mb-8">
                Komentar ini akan dihapus secara permanen dan tidak dapat dikembalikan.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-6 py-3.5 rounded-xl font-bold text-zinc-500 bg-zinc-50 hover:bg-zinc-100 transition-all border border-zinc-100"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.id)}
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
