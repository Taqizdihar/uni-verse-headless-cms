import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Plus, Pencil, Trash2, Eye, Loader2, X, Send, Image as ImageIcon, Copy, ArrowUp, ArrowDown, CheckCircle, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useSearch } from '../context/SearchContext';
import { useCMS } from '../context/CMSContext';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { NotificationModal } from '../components/ui/NotificationModal';
import RichTextEditor from '../components/RichTextEditor';
import { BlockBuilder, Block } from '../components/BlockBuilder';
import axios from 'axios';

export function Pages() {
  const { searchQuery } = useSearch();
  const { pages, setPages, deletePage, savePage, togglePageStatus, media } = useCMS();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);

  // Editor State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([]);
  
  // Media Picker State
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [pickerContext, setPickerContext] = useState<{ blockId?: string, field: string, index?: number, subIndex?: number } | null>(null);

  // Status Toggle Loading State
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());
  
  // Confirmation State
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, id: number | null }>({ isOpen: false, id: null });

  // Duplicate State
  const [duplicatingIds, setDuplicatingIds] = useState<Set<number>>(new Set());
  const [notification, setNotification] = useState<{ isOpen: boolean, title: string, message: string, type: 'success' | 'warning' | 'info' }>({
    isOpen: false, title: '', message: '', type: 'success'
  });

  // Reorder State
  const [reorderingIds, setReorderingIds] = useState<Set<number>>(new Set());

  const openMediaPickerForBlock = (blockId: string, field: string, index?: number, subIndex?: number) => {
    setPickerContext({ blockId, field, index, subIndex });
    setIsMediaPickerOpen(true);
  };

  // Real Data Fetching on mount
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/pages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPages(response.data);
      } catch (err) {
        console.error('Failed to fetch pages:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/settings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSettings(response.data);
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      }
    };

    fetchRealData();
    fetchSettings();
  }, [setPages]);

  const filteredPages = useMemo(() => {
    return pages
      .filter(page => page.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  }, [pages, searchQuery]);

  const openEditor = (page: any = null) => {
    if (page) {
      setEditingId(page.id);
      setTitle(page.title);
      setSlug(page.slug);
      let parsed = [];
      if (typeof page.content === 'string') {
        try { parsed = JSON.parse(page.content); } catch (e) {}
      } else {
        parsed = page.content;
      }
      setBlocks(Array.isArray(parsed) ? parsed : []);
    } else {
      setEditingId(null);
      setTitle('');
      setSlug('');
      setBlocks([]);
    }
    setIsModalOpen(true);
  };

  const handleToggle = async (page: any) => {
    if (togglingIds.has(page.id)) return;
    setTogglingIds(prev => new Set(prev).add(page.id));
    await togglePageStatus(page.id, page.status);
    setTogglingIds(prev => {
      const next = new Set(prev);
      next.delete(page.id);
      return next;
    });
  };

  const handleDuplicate = async (pageId: number) => {
    if (duplicatingIds.has(pageId)) return;
    setDuplicatingIds(prev => new Set(prev).add(pageId));
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/pages/${pageId}/duplicate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 201) {
        // Refresh the pages list
        const listRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/pages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPages(listRes.data);
        setNotification({
          isOpen: true,
          title: 'Berhasil Diduplikasi',
          message: `Halaman "${res.data.title}" berhasil dibuat sebagai draft.`,
          type: 'success'
        });
      }
    } catch (err) {
      console.error('Duplicate failed:', err);
      setNotification({
        isOpen: true,
        title: 'Gagal',
        message: 'Gagal menduplikasi halaman. Silakan coba lagi.',
        type: 'warning'
      });
    } finally {
      setDuplicatingIds(prev => {
        const next = new Set(prev);
        next.delete(pageId);
        return next;
      });
    }
  };

  const handleReorder = async (pageId: number, direction: 'up' | 'down') => {
    if (reorderingIds.has(pageId)) return;
    setReorderingIds(prev => new Set(prev).add(pageId));
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/pages/${pageId}/reorder`,
        { direction },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh list
      const listRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/pages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPages(listRes.data);
    } catch (err) {
      console.error('Reorder failed:', err);
    } finally {
      setReorderingIds(prev => {
        const next = new Set(prev);
        next.delete(pageId);
        return next;
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find existing status if editing
    const existingPage = editingId ? pages.find(p => p.id === editingId) : null;
    const status = existingPage ? existingPage.status : 'published';

    const payload = {
      ...(editingId && { id: editingId }),
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      content: JSON.stringify(blocks),
      status: status || 'published'
    };
    await savePage(payload);
    setIsModalOpen(false);
    
    // Refresh pages
    const token = localStorage.getItem('token');
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/pages`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    setPages(response.data);
  };

  const renderDynamicInputs = () => {
    return <BlockBuilder blocks={blocks} onChange={setBlocks} onOpenMediaPicker={openMediaPickerForBlock} />;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
        <p className="mt-4 text-zinc-500 font-bold uppercase tracking-widest text-xs">Memuat sumber daya...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Pages</h2>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Kelola halaman statis website Anda.</p>
        </div>
        <button onClick={() => openEditor()} className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-zinc-900 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-amber-400/20 active:scale-95">
          <Plus className="w-5 h-5 stroke-[3]" />
          Tambah Halaman Baru
        </button>
      </div>

      <Card className="bg-white border-zinc-200 shadow-sm rounded-2xl overflow-hidden">
         <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-[10px] text-zinc-400 uppercase bg-zinc-50/50 font-black tracking-[0.2em] border-b border-zinc-100">
                <tr>
                  <th scope="col" className="pl-8 pr-3 py-5 w-12 text-center">No</th>
                  <th scope="col" className="px-8 py-5">Judul Halaman</th>
                  <th scope="col" className="px-8 py-5">Tanggal</th>
                  <th scope="col" className="px-8 py-5 text-center">Tampilkan</th>
                  <th scope="col" className="px-8 py-5 text-center">Status</th>
                  <th scope="col" className="px-8 py-5 text-center">Urutan</th>
                  <th scope="col" className="px-8 py-5 text-right pr-10">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <AnimatePresence mode="popLayout">
                {filteredPages.length > 0 ? (
                  filteredPages.map((page, idx) => (
                    <motion.tr
                      key={page.id}
                      layout
                      layoutId={`page-row-${page.id}`}
                      initial={false}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }}
                      className="hover:bg-zinc-50/50 transition-colors group"
                    >
                      <td className="pl-8 pr-3 py-6 text-center">
                        <span className="text-zinc-400 font-bold tabular-nums text-xs">{idx + 1}</span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-zinc-900 text-base leading-tight">{page.title}</p>
                        <p className="text-amber-600 font-bold text-[10px] mt-1 italic uppercase tracking-tighter">/{page.slug}</p>
                      </td>
                      <td className="px-8 py-6 text-zinc-400 tabular-nums">
                        {page.updated_at ? new Date(page.updated_at).toLocaleDateString() : 'Hari Ini'}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                            <button 
                                onClick={() => handleToggle(page)}
                                disabled={togglingIds.has(page.id)}
                                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${page.status === 'published' ? 'bg-amber-400' : 'bg-zinc-200'}`}
                            >
                                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${page.status === 'published' ? 'translate-x-4' : 'translate-x-0'}`} />
                            </button>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                            {page.status === 'published' ? (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-200">
                                    <CheckCircle className="w-3 h-3" /> DITERBITKAN
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-zinc-200">
                                    <EyeOff className="w-3 h-3" /> DISEMBUNYIKAN
                                </span>
                            )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleReorder(page.id!, 'up')}
                            disabled={idx === 0 || reorderingIds.has(page.id!)}
                            className="p-2.5 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl border border-transparent hover:border-amber-200 transition-all active:scale-90 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-zinc-400 disabled:hover:border-transparent shadow-sm hover:shadow-md"
                            title="Naikkan"
                          >
                            {reorderingIds.has(page.id!) ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowUp className="w-5 h-5 stroke-[2.5]" />}
                          </button>
                          <button
                            onClick={() => handleReorder(page.id!, 'down')}
                            disabled={idx === filteredPages.length - 1 || reorderingIds.has(page.id!)}
                            className="p-2.5 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl border border-transparent hover:border-amber-200 transition-all active:scale-90 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-zinc-400 disabled:hover:border-transparent shadow-sm hover:shadow-md"
                            title="Turunkan"
                          >
                            {reorderingIds.has(page.id!) ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowDown className="w-5 h-5 stroke-[2.5]" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right pr-10">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => handleDuplicate(page.id!)}
                            disabled={duplicatingIds.has(page.id!)}
                            className="p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Duplikasi Halaman"
                          >
                            {duplicatingIds.has(page.id!) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <button onClick={() => openEditor(page)} className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all" title="Edit Halaman">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setConfirmDelete({ isOpen: true, id: page.id! })}
                            className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td colSpan={7} className="px-8 py-20 text-center text-zinc-400 italic">
                        Tidak ada halaman yang cocok dengan pencarian.
                    </td>
                  </motion.tr>
                )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pages Editor Modal */}
      {isModalOpen && (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200"
            onMouseDown={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-8 border-b border-zinc-100 flex items-center justify-between shrink-0">
                <h2 className="text-2xl font-bold text-zinc-900">{editingId ? 'Edit Halaman' : 'Buat Halaman Baru'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-full transition-colors"><X className="w-6 h-6" /></button>
            </div>
            
            {/* Modal Body (Scrollable Container) */}
            <div className="p-8 overflow-y-auto flex-1">
              <form id="page-edit-form" onSubmit={handleSave} className="space-y-6 p-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Judul Halaman</label>
                    <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-amber-400 font-bold text-zinc-900" placeholder="Judul Halaman" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Slug Unik (URL)</label>
                    <input type="text" value={slug} onChange={e => setSlug(e.target.value)} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-amber-400 font-bold text-xs text-amber-600" placeholder="halaman-baru" />
                  </div>
                </div>



                <div className="pt-4 border-t border-zinc-100">
                    <h3 className="text-sm font-bold text-zinc-900 mb-4 uppercase tracking-wider">Properti Tata Letak</h3>
                    {renderDynamicInputs()}
                </div>
              </form>
            </div>
            
            {/* Modal Footer (Sticky) */}
            <div className="p-6 border-t border-zinc-100 shrink-0 flex justify-end gap-3 bg-white rounded-b-[2rem] sticky bottom-0 z-10 w-full">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3.5 rounded-2xl font-bold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-all bg-white border border-zinc-200">
                  Batal
                </button>
                <button type="submit" form="page-edit-form" className="flex items-center gap-2 bg-amber-400 text-zinc-950 px-8 py-3.5 rounded-2xl font-bold hover:bg-amber-500 shadow-xl shadow-amber-400/20 transition-all active:scale-95">
                  <Send className="w-5 h-5" />
                  Simpan Halaman
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      {isMediaPickerOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-zinc-900/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col h-[80vh]">
                <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900">Galeri Media</h2>
                        <p className="text-xs text-zinc-500 font-medium">Pilih aset untuk disisipkan ke dalam konteks JSON halaman.</p>
                    </div>
                    <button onClick={() => { setIsMediaPickerOpen(false); setPickerContext(null); }} className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-full transition-colors"><X className="w-6 h-6" /></button>
                </div>
                <div className="p-6 flex-1 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {media?.map((m: any, idx: number) => (
                            <div 
                                key={idx} 
                                onClick={() => {
                                    if (pickerContext) {
                                    const { blockId, field, index, subIndex } = pickerContext;
                                    const mediaUrl = m.file_url || m.url;
                                    
                                    if (blockId) {
                                        setBlocks(prev => prev.map(block => {
                                            if (block.id !== blockId) return block;
                                            
                                            if (field === 'activities' && typeof index === 'number') {
                                                const newActivities = [...block.data.activities];
                                                newActivities[index] = { ...newActivities[index], image: mediaUrl };
                                                return { ...block, data: { ...block.data, activities: newActivities } };
                                            }

                                            if (field === 'features_icon' && typeof index === 'number') {
                                                const newItems = [...(block.data.items || [])];
                                                newItems[index] = { ...newItems[index], icon_url: mediaUrl };
                                                return { ...block, data: { ...block.data, items: newItems } };
                                            }

                                            if (field === 'testimonial_image' && typeof index === 'number') {
                                                const newItems = [...(block.data.items || [])];
                                                newItems[index] = { ...newItems[index], author_image: mediaUrl };
                                                return { ...block, data: { ...block.data, items: newItems } };
                                            }

                                            if (field === 'partner_logo' && typeof index === 'number') {
                                                const newLogos = [...(block.data.logos || [])];
                                                newLogos[index] = { ...newLogos[index], logo_url: mediaUrl };
                                                return { ...block, data: { ...block.data, logos: newLogos } };
                                            }

                                            if (field === 'team_photo' && typeof index === 'number') {
                                                const newMembers = [...(block.data.members || [])];
                                                newMembers[index] = { ...newMembers[index], photo_url: mediaUrl };
                                                return { ...block, data: { ...block.data, members: newMembers } };
                                            }

                                            if (field === 'gallery_image' && typeof index === 'number') {
                                                const newImages = [...(block.data.images || [])];
                                                newImages[index] = { ...newImages[index], url: mediaUrl };
                                                return { ...block, data: { ...block.data, images: newImages } };
                                            }
                                            
                                            return { ...block, data: { ...block.data, [field]: mediaUrl } };
                                        }));
                                    }
                                }
                                setIsMediaPickerOpen(false);
                                setPickerContext(null);
                            }}
                                className="group cursor-pointer rounded-xl overflow-hidden border-2 border-transparent hover:border-amber-400 transition-all relative aspect-square bg-zinc-50"
                            >
                                {(m.file_type || '').startsWith('image/') ? (
                                    <img src={m.file_url || m.url} alt={m.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase">{m.filename}</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="bg-amber-400 text-zinc-950 px-3 py-1.5 rounded-lg text-xs font-bold uppercase">Pilih</span>
                                </div>
                            </div>
                        ))}
                        {(!media || media.length === 0) && (
                            <div className="col-span-full py-12 text-center text-zinc-400 text-sm font-medium italic">
                                Belum ada aset media. Silakan unggah di halaman Media terlebih dahulu.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal 
        isOpen={confirmDelete.isOpen}
        title="Hapus Halaman"
        message="Tindakan ini permanen. Hapus item ini?"
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={async () => {
            if (confirmDelete.id) {
                await deletePage(confirmDelete.id);
                // Refresh list
                const token = localStorage.getItem('token');
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/pages`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPages(response.data);
            }
            setConfirmDelete({ isOpen: false, id: null });
        }}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
      />

      <NotificationModal
        isOpen={notification.isOpen}
        title={notification.title}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
