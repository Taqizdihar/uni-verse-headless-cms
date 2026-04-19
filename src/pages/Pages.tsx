import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Plus, Pencil, Trash2, Eye, Loader2, X, Send, Image as ImageIcon } from 'lucide-react';

import { useSearch } from '../context/SearchContext';
import { useCMS } from '../context/CMSContext';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import RichTextEditor from '../components/RichTextEditor';
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
  const [pageType, setPageType] = useState('home');
  const [formData, setFormData] = useState<any>({});
  
  // Media Picker State
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [pickerContext, setPickerContext] = useState<{ field: string, index?: number } | null>(null);

  // Status Toggle Loading State
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());
  
  // Confirmation State
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, id: number | null }>({ isOpen: false, id: null });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const openMediaPicker = (field: string, index?: number) => {
    setPickerContext({ field, index });
    setIsMediaPickerOpen(true);
  };

  const addGalleryImage = () => {
    const currentImages = formData.images || [];
    openMediaPicker('images', currentImages.length);
  };

  const removeGalleryImage = (index: number) => {
    const currentImages = formData.images || [];
    handleInputChange('images', currentImages.filter((_: any, i: number) => i !== index));
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
    return pages.filter(page => 
      page.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [pages, searchQuery]);

  const openEditor = (page: any = null) => {
    if (page) {
      setEditingId(page.id);
      setTitle(page.title);
      setSlug(page.slug);
      setPageType(page.page_type);
      setFormData(typeof page.content === 'string' ? JSON.parse(page.content) : (page.content || {}));
    } else {
      setEditingId(null);
      setTitle('');
      setSlug('');
      setPageType('home');
      setFormData({});
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find existing status if editing
    const existingPage = editingId ? pages.find(p => p.id === editingId) : null;
    const status = existingPage ? existingPage.status : 'published';

    const payload = {
      ...(editingId && { id: editingId }),
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      page_type: pageType,
      content: formData,
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
    switch (pageType) {
      case 'home':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Judul Utama (Headline)</label>
              <input type="text" value={formData.headline || ''} onChange={e => handleInputChange('headline', e.target.value)} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-amber-400 font-bold" placeholder="Judul Hero" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Sub Judul</label>
              <input type="text" value={formData.sub_headline || ''} onChange={e => handleInputChange('sub_headline', e.target.value)} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-amber-400" placeholder="Teks pendukung" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Gambar Hero</label>
              <div className="flex gap-2 items-center">
                  <input type="text" value={formData.hero_image || ''} readOnly className="flex-1 px-4 py-3 bg-zinc-100 border border-zinc-200 text-zinc-500 rounded-xl outline-none" placeholder="Pilih gambar..." />
                  {formData.hero_image && (
                      <button type="button" onClick={() => handleInputChange('hero_image', '')} className="p-3 bg-red-100 text-red-500 rounded-xl hover:bg-red-200 transition-colors">
                          <Trash2 className="w-5 h-5" />
                      </button>
                  )}
                  <button type="button" onClick={() => openMediaPicker('hero_image')} className="p-3 bg-amber-400 text-zinc-900 rounded-xl hover:bg-amber-500 transition-colors">
                      <ImageIcon className="w-5 h-5" />
                  </button>
              </div>
              {formData.hero_image && (
                  <div className="mt-3 aspect-video w-48 rounded-xl overflow-hidden border border-zinc-200 shadow-sm">
                      <img src={formData.hero_image} alt="Hero Preview" className="w-full h-full object-cover" />
                  </div>
              )}
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Email Dukungan</label>
              <input type="email" value={formData.email || ''} onChange={e => handleInputChange('email', e.target.value)} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-amber-400 font-bold" placeholder="hello@perusahaan.com" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Nomor Telepon</label>
              <input type="tel" value={formData.phone || ''} onChange={e => handleInputChange('phone', e.target.value)} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-amber-400 font-bold" placeholder="+62 812-0000-0000" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Tautan Embed Google Maps</label>
              <input type="text" value={formData.maps_link || ''} onChange={e => handleInputChange('maps_link', e.target.value)} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-amber-400 text-xs text-amber-600" placeholder="https://maps.google.com/..." />
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-4">
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Tentang Kami</label>
            <RichTextEditor value={formData.about_us || ''} onChange={val => handleInputChange('about_us', val)} placeholder="Misi perusahaan kami..." />
          </div>
        );
      case 'gallery':
        return (
          <div className="space-y-4 font-bold">
             <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1 italic">Judul Galeri</label>
              <input type="text" value={formData.gallery_title || ''} onChange={e => handleInputChange('gallery_title', e.target.value)} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-amber-400" placeholder="Misal: Portofolio Kami" />
            </div>
            <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1 italic">Deskripsi</label>
                <RichTextEditor value={formData.description || ''} onChange={val => handleInputChange('description', val)} placeholder="Deskripsikan secara singkat koleksi ini..." />
            </div>
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 italic">Gambar Galeri</label>
                    <button type="button" onClick={addGalleryImage} className="text-[10px] font-black text-amber-600 hover:text-amber-700 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded-md border border-amber-100 flex items-center gap-1">
                        <Plus className="w-3 h-3 stroke-[4]" /> Tambah Gambar
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {(formData.images || []).map((img: string, idx: number) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden border border-zinc-100 bg-zinc-50 p-2 shadow-sm">
                            {img ? (
                                <img src={img} alt="Preview" className="w-full aspect-square object-cover rounded-lg mb-2" />
                            ) : (
                                <div className="aspect-square bg-zinc-100 rounded-lg mb-2 flex items-center justify-center">
                                    <ImageIcon className="w-6 h-6 text-zinc-300" />
                                </div>
                            )}
                            <div className="flex gap-1">
                                <button type="button" onClick={() => openMediaPicker('images', idx)} className="flex-1 p-2 bg-amber-400 text-zinc-900 rounded-lg hover:bg-amber-500 transition-colors flex justify-center shadow-lg shadow-amber-400/20">
                                    <Pencil className="w-3 h-3" />
                                </button>
                                <button type="button" onClick={() => removeGalleryImage(idx)} className="p-2 bg-zinc-100 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex justify-center">
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {(formData.images || []).length === 0 && (
                        <div className="col-span-full py-8 border-2 border-dashed border-zinc-100 rounded-2xl flex flex-col items-center justify-center text-zinc-400 italic text-xs">
                            Belum ada gambar yang ditambahkan. Klik "Tambah Gambar" di atas.
                        </div>
                    )}
                </div>
            </div>
          </div>
        );
      case 'news':
        return (
          <div className="space-y-4">
             <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Judul Artikel</label>
              <input type="text" value={formData.news_title || ''} onChange={e => handleInputChange('news_title', e.target.value)} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-amber-400 font-bold" placeholder="Misal: Laporan Pertumbuhan Q3" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Gambar Utama</label>
              <div className="flex gap-2 items-center">
                  <input type="text" value={formData.featured_image || ''} readOnly className="flex-1 px-4 py-3 bg-zinc-100 border border-zinc-200 text-zinc-500 rounded-xl outline-none text-xs" placeholder="Pilih aset header..." />
                  {formData.featured_image && (
                      <button type="button" onClick={() => handleInputChange('featured_image', '')} className="p-3 bg-red-100 text-red-500 rounded-xl hover:bg-red-200 transition-colors shadow-lg shadow-red-500/20">
                          <Trash2 className="w-5 h-5" />
                      </button>
                  )}
                  <button type="button" onClick={() => openMediaPicker('featured_image')} className="p-3 bg-amber-400 text-zinc-900 rounded-xl hover:bg-amber-500 transition-colors shadow-lg shadow-amber-400/20">
                      <ImageIcon className="w-5 h-5" />
                  </button>
              </div>
              {formData.featured_image && (
                  <div className="mt-3 aspect-video w-48 rounded-xl overflow-hidden border border-zinc-200 shadow-sm">
                      <img src={formData.featured_image} alt="Main Preview" className="w-full h-full object-cover" />
                  </div>
              )}
            </div>
            <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Ringkasan</label>
                <RichTextEditor value={formData.summary || ''} onChange={val => handleInputChange('summary', val)} placeholder="Pengantar singkat..." />
            </div>
            <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Konten Utama</label>
                <RichTextEditor value={formData.body || ''} onChange={val => handleInputChange('body', val)} placeholder="Tuliskan isi artikel lengkap di sini..." />
            </div>
          </div>
        );
      default: return null;
    }
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
                  <th scope="col" className="px-8 py-5">Judul Halaman</th>
                  <th scope="col" className="px-8 py-5">Tipe</th>
                  <th scope="col" className="px-8 py-5">Tanggal</th>
                  <th scope="col" className="px-8 py-5 text-center">Tampilkan</th>
                  <th scope="col" className="px-8 py-5 text-center">Status</th>
                  <th scope="col" className="px-8 py-5 text-right pr-10">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredPages.length > 0 ? (
                  filteredPages.map((page) => (
                    <tr key={page.id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <p className="font-bold text-zinc-900 text-base leading-tight">{page.title}</p>
                        <p className="text-amber-600 font-bold text-[10px] mt-1 italic uppercase tracking-tighter">/{page.slug}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-zinc-100 text-zinc-600 rounded-md text-[10px] font-bold uppercase tracking-wider">{page.page_type}</span>
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
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            page.status === 'published' 
                                ? 'bg-green-100 text-green-700 border-green-200' 
                                : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                            }`}>
                            {page.status === 'published' ? 'DITERBITKAN' : 'DISEMBUNYIKAN'}
                            </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right pr-10">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => {
                              if (!settings) {
                                console.error("Settings not loaded yet");
                                alert("Mohon tunggu, pengaturan situs sedang dimuat...");
                                return;
                              }
                              const userStr = localStorage.getItem('user');
                              const user = userStr ? JSON.parse(userStr) : null;
                              const subdomain = settings?.subdomain || user?.subdomain || 'site';
                              const slg = (page.slug || '').replace(/^\/+/, '');
                              window.open(`/preview/${subdomain}/${slg}`, '_blank');
                            }}
                            className={`p-2 rounded-lg transition-all ${!settings ? 'text-zinc-200 cursor-not-allowed' : 'text-zinc-400 hover:text-amber-500 hover:bg-amber-50'}`} 
                            title="Pratinjau Halaman"
                            disabled={!settings}
                          >
                            <Eye className="w-4 h-4" />
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-zinc-400 italic">
                        Tidak ada halaman yang cocok dengan pencarian.
                    </td>
                  </tr>
                )}
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

                <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Skema Halaman</label>
                    <select 
                        value={pageType} 
                        onChange={e => setPageType(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-amber-400 font-bold text-zinc-900 cursor-pointer"
                    >
                        <option value="home">Home</option>
                        <option value="profile">Profile</option>
                        <option value="contact">Contact Us</option>
                        <option value="gallery">Gallery</option>
                        <option value="news">News</option>
                    </select>
                </div>

                <div className="pt-4 border-t border-zinc-100">
                    <h3 className="text-sm font-bold text-zinc-900 mb-4 uppercase tracking-wider">Properti Tata Letak</h3>
                    {renderDynamicInputs()}
                </div>
              </form>
            </div>
            
            {/* Modal Footer (Sticky) */}
            <div className="p-8 border-t border-zinc-100 shrink-0 flex justify-end bg-zinc-50/50 rounded-b-[2rem]">
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
                                        const { field, index } = pickerContext;
                                        if (index !== undefined) {
                                            const currentArr = [...(formData[field] || [])];
                                            currentArr[index] = m.file_url || m.url;
                                            handleInputChange(field, currentArr);
                                        } else {
                                            handleInputChange(field, m.file_url || m.url);
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
    </div>
  );
}
