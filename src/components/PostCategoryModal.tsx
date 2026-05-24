import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Loader2, AlertCircle } from 'lucide-react';
import api from '../lib/api';
import { ConfirmModal } from './ui/ConfirmModal';
import { NotificationModal } from './ui/NotificationModal';

interface PostCategory {
  id: number;
  name: string;
  slug: string;
}

interface PostCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PostCategoryModal({ isOpen, onClose }: PostCategoryModalProps) {
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });
  const [notification, setNotification] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'warning' | 'info' }>({
    isOpen: false, title: '', message: '', type: 'success'
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      resetForm();
    }
  }, [isOpen]);

  // Auto-generate slug from name if slug is empty or user is typing name (and not editing an existing slug)
  useEffect(() => {
    if (!editingId) {
      const generatedSlug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  }, [name, editingId]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/v1/post-categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      showNotification('Error', 'Gagal memuat kategori. Silakan coba lagi.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSlug('');
  };

  const showNotification = (title: string, message: string, type: 'success' | 'warning' | 'info') => {
    setNotification({ isOpen: true, title, message, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingId) {
        await api.put(`/api/v1/post-categories/${editingId}`, { name, slug });
        showNotification('Sukses', 'Kategori berhasil diperbarui', 'success');
      } else {
        await api.post('/api/v1/post-categories', { name, slug });
        showNotification('Sukses', 'Kategori baru berhasil ditambahkan', 'success');
      }
      resetForm();
      fetchCategories();
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Terjadi kesalahan saat menyimpan kategori.';
      showNotification('Gagal', msg, 'warning');
    }
  };

  const handleEdit = (category: PostCategory) => {
    setEditingId(category.id);
    setName(category.name);
    setSlug(category.slug);
  };

  const handleDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await api.delete(`/api/v1/post-categories/${confirmDelete.id}`);
      showNotification('Sukses', 'Kategori berhasil dihapus', 'success');
      fetchCategories();
    } catch (error: any) {
      showNotification('Gagal', 'Gagal menghapus kategori', 'warning');
    } finally {
      setConfirmDelete({ isOpen: false, id: null });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-300"
        onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div 
          className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-white shrink-0">
            <div>
              <h2 className="text-xl font-black text-zinc-900 tracking-tight">Kelola Kategori Custom</h2>
              <p className="text-sm font-medium text-zinc-500 mt-0.5">Tambah, ubah, atau hapus kategori untuk postingan Anda.</p>
            </div>
            <button onClick={onClose} className="p-2.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 rounded-xl transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/30 flex flex-col gap-6">
            
            {/* Form */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-zinc-800 mb-4">{editingId ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Nama Kategori</label>
                    <input 
                      type="text" 
                      required 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      placeholder="Misal: Fashion" 
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-amber-400 font-bold transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Slug (URL)</label>
                    <input 
                      type="text" 
                      value={slug} 
                      onChange={e => setSlug(e.target.value)} 
                      placeholder="fashion" 
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-amber-400 font-bold text-amber-600 transition-all text-xs"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  {editingId && (
                    <button 
                      type="button" 
                      onClick={resetForm}
                      className="px-5 py-2.5 rounded-lg font-bold text-zinc-600 hover:bg-zinc-100 transition-colors text-xs"
                    >
                      Batal Edit
                    </button>
                  )}
                  <button 
                    type="submit" 
                    className="flex items-center gap-2 bg-amber-400 text-zinc-950 px-5 py-2.5 rounded-lg font-bold hover:bg-amber-500 shadow-md shadow-amber-400/20 transition-all active:scale-95 text-xs"
                  >
                    {editingId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {editingId ? 'Simpan Perubahan' : 'Tambah Kategori'}
                  </button>
                </div>
              </form>
            </div>

            {/* List */}
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden flex-1">
              {isLoading ? (
                <div className="p-10 flex flex-col items-center justify-center text-zinc-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-4" />
                  <p className="text-sm font-medium text-zinc-500">Memuat kategori...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="p-10 flex flex-col items-center justify-center text-center">
                  <AlertCircle className="w-10 h-10 text-zinc-300 mb-3" />
                  <p className="text-sm font-bold text-zinc-600">Belum ada kategori kustom.</p>
                  <p className="text-xs text-zinc-400 mt-1">Gunakan form di atas untuk membuat kategori baru.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-zinc-50 border-b border-zinc-200">
                    <tr>
                      <th className="px-5 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider w-12 text-center">No</th>
                      <th className="px-5 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Nama Kategori</th>
                      <th className="px-5 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Slug</th>
                      <th className="px-5 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {categories.map((cat, idx) => (
                      <tr key={cat.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-5 py-4 text-center text-xs font-medium text-zinc-400 tabular-nums">{idx + 1}</td>
                        <td className="px-5 py-4">
                          <span className="font-bold text-zinc-800">{cat.name}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">
                            /{cat.slug}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleEdit(cat)}
                              className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setConfirmDelete({ isOpen: true, id: cat.id })}
                              className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={confirmDelete.isOpen}
        title="Hapus Kategori"
        message="Yakin ingin menghapus kategori ini? Postingan yang terkait dengan kategori ini tidak akan memiliki kategori."
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={handleDelete}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
      />

      <NotificationModal
        isOpen={notification.isOpen}
        title={notification.title}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
      />
    </>
  );
}
