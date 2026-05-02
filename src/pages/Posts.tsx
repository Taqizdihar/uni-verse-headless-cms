import React, { useState } from 'react';
import { Plus, X, Send, Settings, Tag, Trash2, CheckCircle, Image as ImageIcon, Pencil, Calendar, MapPin, Users, Clock, AlignLeft, EyeOff, Eye, Copy, Loader2, Newspaper, ShoppingBag, Briefcase, Megaphone, AlertTriangle, ArrowRight, DollarSign, Info, ListChecks, Star, Globe, Search, Filter } from 'lucide-react';
import axios from 'axios';
import { useCMS } from '../context/CMSContext';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { NotificationModal } from '../components/ui/NotificationModal';
import RichTextEditor from '../components/RichTextEditor';

const CATEGORIES = [
  { id: 'Artikel', label: 'Artikel', icon: Newspaper, color: 'text-blue-500', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700 border-blue-200', description: 'Berita atau artikel informatif' },
  { id: 'Event', label: 'Event', icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', description: 'Kegiatan, seminar, atau pertemuan' },
  { id: 'Produk', label: 'Produk', icon: ShoppingBag, color: 'text-amber-500', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700 border-amber-200', description: 'Informasi produk atau jasa' },
  { id: 'Lowongan', label: 'Lowongan', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50', badge: 'bg-purple-100 text-purple-700 border-purple-200', description: 'Kesempatan karir atau pekerjaan' },
  { id: 'Pengumuman', label: 'Pengumuman', icon: Megaphone, color: 'text-rose-500', bg: 'bg-rose-50', badge: 'bg-rose-100 text-rose-700 border-rose-200', description: 'Informasi penting atau siaran' },
];

export function Posts() {
  const { posts, savePost, deletePost, togglePostStatus, media, fetchAllData } = useCMS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [confirmCategoryChange, setConfirmCategoryChange] = useState<{ isOpen: boolean, nextCategory: string | null }>({ isOpen: false, nextCategory: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('Semua Kategori');
  
  const [toggling, setToggling] = useState<{ [key: number]: boolean }>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Artikel');
  const [formData, setFormData] = useState<any>({});
  const [settings, setSettings] = useState<any>(null);

  React.useEffect(() => {
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
    fetchSettings();
  }, []);
  
  // Confirmation State
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, id: number | null }>({ isOpen: false, id: null });

  // Duplicate State
  const [duplicatingIds, setDuplicatingIds] = useState<Set<number>>(new Set());
  const [notification, setNotification] = useState<{ isOpen: boolean, title: string, message: string, type: 'success' | 'warning' | 'info' }>({
    isOpen: false, title: '', message: '', type: 'success'
  });
  
  // Media Picker State
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [pickerContext, setPickerContext] = useState<{ field: string, index?: number, subField?: string } | null>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const openMediaPicker = (field: string, index?: number, subField?: string) => {
    setPickerContext({ field, index, subField });
    setIsMediaPickerOpen(true);
  };

  const addAgendaItem = () => {
    const current = formData.rundown || [];
    handleInputChange('rundown', [...current, { time: '', activity: '' }]);
  };

  const removeAgendaItem = (index: number) => {
    const current = formData.rundown || [];
    handleInputChange('rundown', current.filter((_: any, i: number) => i !== index));
  };

  const updateAgendaItem = (index: number, field: string, value: string) => {
    const current = [...(formData.rundown || [])];
    current[index][field] = value;
    handleInputChange('rundown', current);
  };

  const addSpeaker = () => {
    const current = formData.speakers || [];
    handleInputChange('speakers', [...current, { name: '', position: '', bio: '', photo_url: '' }]);
  };

  const removeSpeaker = (index: number) => {
    const current = formData.speakers || [];
    handleInputChange('speakers', current.filter((_: any, i: number) => i !== index));
  };

  const updateSpeaker = (index: number, field: string, value: string) => {
    const current = [...(formData.speakers || [])];
    current[index][field] = value;
    handleInputChange('speakers', current);
  };

  const addEventGalleryImage = () => {
    const current = formData.event_gallery || [];
    handleInputChange('event_gallery', [...current, { url: '', caption: '', alt_text: '' }]);
  };

  const removeEventGalleryImage = (index: number) => {
    const current = formData.event_gallery || [];
    handleInputChange('event_gallery', current.filter((_: any, i: number) => i !== index));
  };

  const updateEventGalleryImage = (index: number, subField: string, value: string) => {
    const current = [...(formData.event_gallery || [])];
    current[index][subField] = value;
    handleInputChange('event_gallery', current);
  };

  const addSpec = () => {
    const current = formData.specifications || [];
    handleInputChange('specifications', [...current, { label: '', value: '' }]);
  };

  const removeSpec = (index: number) => {
    const current = formData.specifications || [];
    handleInputChange('specifications', current.filter((_: any, i: number) => i !== index));
  };

  const updateSpec = (index: number, field: string, value: string) => {
    const current = [...(formData.specifications || [])];
    current[index][field] = value;
    handleInputChange('specifications', current);
  };

  const addGalleryImage = () => {
    const current = formData.product_gallery || [];
    handleInputChange('product_gallery', [...current, '']);
  };

  const removeGalleryImage = (index: number) => {
    const current = formData.product_gallery || [];
    handleInputChange('product_gallery', current.filter((_: any, i: number) => i !== index));
  };

  const openEditor = (post: any = null) => {
    if (post) {
      setEditingId(post.id);
      setTitle(post.title);
      setSlug(post.slug);
      setCategory(post.category || 'Artikel');
      
      let parsed: any = {};
      if (typeof post.content === 'string') {
        try { parsed = JSON.parse(post.content); } catch (e) {}
      } else {
        parsed = post.content || {};
      }
      
      // Ensure content is treated as the first element of the array if it's an array
      const contentData = Array.isArray(parsed) ? (parsed[0] || {}) : parsed;
      
      setFormData({
        excerpt: post.excerpt || '',
        featured_image: contentData.featured_image || '',
        ...contentData
      });
      
      setIsModalOpen(true);
    } else {
      setEditingId(null);
      setTitle('');
      setSlug('');
      setCategory('Artikel');
      setFormData({
        excerpt: '',
        featured_image: ''
      });
      setIsCategoryModalOpen(true);
    }
  };

  const handleCategorySelect = (selectedCat: string) => {
    if (editingId && category !== selectedCat) {
      setConfirmCategoryChange({ isOpen: true, nextCategory: selectedCat });
    } else {
      setCategory(selectedCat);
      setIsCategoryModalOpen(false);
      setIsModalOpen(true);
      
      // Reset specific data but keep global ones if it's a new post or we're fine with it
      if (!editingId) {
          setFormData({
              excerpt: formData.excerpt || '',
              featured_image: formData.featured_image || '',
              // Reset category specific fields
          });
      }
    }
  };

  const proceedCategoryChange = () => {
    if (confirmCategoryChange.nextCategory) {
      setCategory(confirmCategoryChange.nextCategory);
      setFormData({
        excerpt: formData.excerpt || '',
        featured_image: formData.featured_image || '',
      });
      setConfirmCategoryChange({ isOpen: false, nextCategory: null });
      setIsCategoryModalOpen(false);
      setIsModalOpen(true);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitize data: convert empty strings to null
    const sanitizedData = Object.keys(formData).reduce((acc: any, key) => {
      const val = formData[key];
      acc[key] = (val === '' || val === undefined) ? null : val;
      return acc;
    }, {});

    const payload = {
      ...(editingId && { id: editingId }),
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      content: [sanitizedData], // Wrap in an array for compatibility
      excerpt: formData.excerpt || '',
      status: editingId ? (posts.find((p: any) => p.id === editingId)?.status || 'published') : 'published'
    };
    await savePost(payload);
    setIsModalOpen(false);
  };

  const handleToggle = async (id: number, currentStatus: string = 'published') => {
      setToggling(prev => ({ ...prev, [id]: true }));
      await togglePostStatus(id, currentStatus);
      setToggling(prev => ({ ...prev, [id]: false }));
  };

  const handleDuplicate = async (postId: number) => {
    if (duplicatingIds.has(postId)) return;
    setDuplicatingIds(prev => new Set(prev).add(postId));
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts/${postId}/duplicate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 201) {
        await fetchAllData();
        setNotification({
          isOpen: true,
          title: 'Berhasil Diduplikasi',
          message: `Post "${res.data.title}" berhasil dibuat sebagai draft.`,
          type: 'success'
        });
      }
    } catch (err) {
      console.error('Duplicate post failed:', err);
      setNotification({
        isOpen: true,
        title: 'Gagal',
        message: 'Gagal menduplikasi post. Silakan coba lagi.',
        type: 'warning'
      });
    } finally {
      setDuplicatingIds(prev => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    }
  };

  const renderDynamicInputs = () => {
    switch (category) {
      case 'Artikel':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 ml-1">Konten Artikel</label>
              <RichTextEditor 
                value={formData.body_content || ''} 
                onChange={val => handleInputChange('body_content', val)} 
                placeholder="Tulis artikel lengkap di sini..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Tags (Pisahkan dengan koma)</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                  <input type="text" value={formData.tags || ''} onChange={e => handleInputChange('tags', e.target.value)} placeholder="Misal: Teknologi, Edukasi" className="w-full pl-12 pr-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Estimasi Waktu Baca</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                  <input type="text" value={formData.reading_time || ''} onChange={e => handleInputChange('reading_time', e.target.value)} placeholder="Misal: 5 Menit" className="w-full pl-12 pr-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Catatan Penulis (Internal)</label>
              <textarea 
                value={formData.author_note || ''} 
                onChange={e => handleInputChange('author_note', e.target.value)} 
                placeholder="Berikan catatan tambahan jika perlu..." 
                className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-medium text-zinc-700 min-h-[80px] resize-none transition-all"
              />
            </div>
          </div>
        );
      
      case 'Event':
        return (
          <div className="space-y-8">
            {/* 1. Informasi Dasar */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest border-b border-zinc-100 pb-2">Informasi Dasar</h4>
              
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Label Kategori (Pisahkan dengan koma)</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                  <input type="text" value={(formData.event_labels || []).join(', ')} onChange={e => handleInputChange('event_labels', e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))} placeholder="Misal: Kuliner, F&B" className="w-full pl-12 pr-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all" />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 ml-1">Deskripsi Acara</label>
                <RichTextEditor 
                  value={formData.event_description || ''} 
                  onChange={val => handleInputChange('event_description', val)} 
                  placeholder="Tulis detail lengkap acara di sini..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Tanggal Acara</label>
                  <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                      <input type="date" value={formData.event_date || ''} onChange={e => handleInputChange('event_date', e.target.value)} className="w-full pl-12 pr-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Jam Mulai</label>
                  <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                      <input type="time" value={formData.start_time || ''} onChange={e => handleInputChange('start_time', e.target.value)} className="w-full pl-12 pr-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Jam Selesai</label>
                  <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                      <input type="time" value={formData.end_time || ''} onChange={e => handleInputChange('end_time', e.target.value)} className="w-full pl-12 pr-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Nama Lokasi</label>
                  <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                      <input type="text" value={formData.location_name || ''} onChange={e => handleInputChange('location_name', e.target.value)} placeholder="Misal: Aula Utama" className="w-full pl-12 pr-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Kapasitas / Quota</label>
                  <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                      <input type="text" value={formData.quota || ''} onChange={e => handleInputChange('quota', e.target.value)} placeholder="Misal: 100 Orang" className="w-full pl-12 pr-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">URL Google Maps</label>
                  <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 opacity-50" />
                      <input type="url" value={formData.Maps_url || ''} onChange={e => handleInputChange('Maps_url', e.target.value)} placeholder="https://maps.google.com/..." className="w-full pl-12 pr-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Link Pendaftaran</label>
                  <div className="relative">
                      <ArrowRight className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                      <input type="url" value={formData.registration_link || ''} onChange={e => handleInputChange('registration_link', e.target.value)} placeholder="https://forms.gle/..." className="w-full pl-12 pr-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-5 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <input 
                      type="checkbox" 
                      id="is_online"
                      checked={formData.is_online || false} 
                      onChange={e => handleInputChange('is_online', e.target.checked)} 
                      className="w-5 h-5 rounded border-zinc-300 text-amber-500 focus:ring-amber-500"
                  />
                  <label htmlFor="is_online" className="text-sm font-bold text-zinc-700 cursor-pointer flex items-center gap-2">
                      <Globe className="w-4 h-4 text-zinc-400" /> Acara Online (Zoom / G-Meet)
                  </label>
              </div>
            </div>

            {/* 2. Agenda & Pembicara */}
            <div className="space-y-6 pt-4">
              <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest border-b border-zinc-100 pb-2">Agenda & Pembicara</h4>
              
              <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-xs font-bold text-zinc-800">Rundown Acara</h5>
                  <button type="button" onClick={addAgendaItem} className="text-[10px] font-black text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg transition-colors">+ TAMBAH AGENDA</button>
                </div>
                <div className="space-y-3">
                  {(formData.rundown || []).map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-3 items-start animate-in slide-in-from-right-2 duration-300">
                      <input 
                          type="time" 
                          value={item.time || ''} 
                          onChange={e => updateAgendaItem(idx, 'time', e.target.value)}
                          className="w-1/3 px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-amber-400 text-xs font-bold"
                      />
                      <input 
                          type="text" 
                          placeholder="Keterangan Agenda" 
                          value={item.activity || ''} 
                          onChange={e => updateAgendaItem(idx, 'activity', e.target.value)}
                          className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-amber-400 text-xs font-bold"
                      />
                      <button type="button" onClick={() => removeAgendaItem(idx)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  {(!formData.rundown || formData.rundown.length === 0) && (
                    <p className="text-xs text-zinc-400 font-medium italic">Belum ada agenda yang ditambahkan.</p>
                  )}
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-xs font-bold text-zinc-800">Profil Pembicara</h5>
                  <button type="button" onClick={addSpeaker} className="text-[10px] font-black text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg transition-colors">+ TAMBAH PEMBICARA</button>
                </div>
                <div className="space-y-4">
                  {(formData.speakers || []).map((speaker: any, idx: number) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-4 items-start p-4 bg-zinc-50 rounded-xl border border-zinc-100 relative group animate-in slide-in-from-right-2 duration-300">
                      <button type="button" onClick={() => removeSpeaker(idx)} className="absolute top-2 right-2 p-1.5 text-red-400 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                      
                      <div className="w-24 h-24 shrink-0 rounded-xl bg-white border border-zinc-200 overflow-hidden cursor-pointer hover:border-amber-400 transition-colors" onClick={() => openMediaPicker('speakers', idx, 'photo_url')}>
                        {speaker.photo_url ? (
                          <img src={speaker.photo_url} alt="Speaker" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-zinc-300 mb-1" />
                            <span className="text-[8px] font-bold text-zinc-400 uppercase">Pilih Foto</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 w-full space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input type="text" placeholder="Nama Pembicara" value={speaker.name || ''} onChange={e => updateSpeaker(idx, 'name', e.target.value)} className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg outline-none focus:border-amber-400 text-xs font-bold" />
                          <input type="text" placeholder="Gelar / Posisi" value={speaker.position || ''} onChange={e => updateSpeaker(idx, 'position', e.target.value)} className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg outline-none focus:border-amber-400 text-xs" />
                        </div>
                        <textarea placeholder="Deskripsi Singkat..." value={speaker.bio || ''} onChange={e => updateSpeaker(idx, 'bio', e.target.value)} className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg outline-none focus:border-amber-400 text-xs min-h-[60px] resize-none" />
                      </div>
                    </div>
                  ))}
                  {(!formData.speakers || formData.speakers.length === 0) && (
                    <p className="text-xs text-zinc-400 font-medium italic">Belum ada pembicara yang ditambahkan.</p>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Media Tambahan */}
            <div className="space-y-6 pt-4">
              <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest border-b border-zinc-100 pb-2">Media Tambahan</h4>
              
              <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h5 className="text-xs font-bold text-zinc-800">Galeri Event Singkat</h5>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Media tambahan tanpa detail lengkap</p>
                  </div>
                  <button type="button" onClick={addEventGalleryImage} className="text-[10px] font-black text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg transition-colors">+ TAMBAH FOTO</button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(formData.event_gallery || []).map((img: any, idx: number) => (
                        <div key={idx} className="relative group aspect-[4/3] rounded-2xl bg-zinc-50 border border-zinc-200 overflow-hidden flex flex-col">
                            <div className="flex-1 relative cursor-pointer" onClick={() => openMediaPicker('event_gallery', idx, 'url')}>
                              {img.url ? (
                                  <img src={img.url} className="w-full h-full absolute inset-0 object-cover" alt="Gallery" />
                              ) : (
                                  <div className="w-full h-full absolute inset-0 flex flex-col items-center justify-center hover:bg-zinc-100 transition-colors">
                                      <ImageIcon className="w-6 h-6 text-zinc-300" />
                                      <span className="text-[8px] font-black text-zinc-400 uppercase mt-2">Pilih Foto</span>
                                  </div>
                              )}
                            </div>
                            <div className="h-8 border-t border-zinc-200 bg-white">
                                <input type="text" placeholder="Caption..." value={img.caption || ''} onChange={e => updateEventGalleryImage(idx, 'caption', e.target.value)} className="w-full h-full px-2 text-[10px] font-medium outline-none focus:bg-amber-50" />
                            </div>
                            <button 
                                type="button" 
                                onClick={() => removeEventGalleryImage(idx)}
                                className="absolute top-2 right-2 p-1 bg-white/90 text-red-500 rounded flex opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-zinc-200"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    {(!formData.event_gallery || formData.event_gallery.length === 0) && (
                      <div className="col-span-full text-xs text-zinc-400 font-medium italic">Belum ada foto galeri event yang ditambahkan.</div>
                    )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'Produk':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Mata Uang</label>
                <input type="text" value={formData.currency || 'IDR'} onChange={e => handleInputChange('currency', e.target.value)} placeholder="Misal: IDR" className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Harga Normal</label>
                <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                    <input type="number" value={formData.base_price || ''} onChange={e => handleInputChange('base_price', e.target.value)} placeholder="0" className="w-full pl-12 pr-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Harga Diskon</label>
                <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                    <input type="number" value={formData.discounted_price || ''} onChange={e => handleInputChange('discounted_price', e.target.value)} placeholder="0" className="w-full pl-12 pr-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Status Stok</label>
                    <select 
                        value={formData.stock_status || 'In Stock'} 
                        onChange={e => handleInputChange('stock_status', e.target.value)}
                        className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all appearance-none"
                    >
                        <option value="In Stock">In Stock (Tersedia)</option>
                        <option value="Out of Stock">Out of Stock (Habis)</option>
                        <option value="Pre-Order">Pre-Order</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">URL Pembelian</label>
                    <div className="relative">
                        <ArrowRight className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                        <input type="url" value={formData.buy_url || ''} onChange={e => handleInputChange('buy_url', e.target.value)} placeholder="https://marketplace.com/..." className="w-full pl-12 pr-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all" />
                    </div>
                </div>
            </div>

            <div className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Spesifikasi Produk</h4>
                <button type="button" onClick={addSpec} className="text-[10px] font-black text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg transition-colors">+ TAMBAH SPEK</button>
              </div>
              <div className="space-y-3">
                {(formData.specifications || []).map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-3 items-start animate-in slide-in-from-right-2 duration-300">
                    <input 
                        type="text" 
                        placeholder="Label (Misal: Warna)" 
                        value={item.label} 
                        onChange={e => updateSpec(idx, 'label', e.target.value)}
                        className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-amber-400 text-xs font-bold"
                    />
                    <input 
                        type="text" 
                        placeholder="Nilai (Misal: Merah)" 
                        value={item.value} 
                        onChange={e => updateSpec(idx, 'value', e.target.value)}
                        className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-amber-400 text-xs font-bold"
                    />
                    <button type="button" onClick={() => removeSpec(idx)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Galeri Produk</h4>
                    <button type="button" onClick={addGalleryImage} className="text-[10px] font-black text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg transition-colors">+ TAMBAH GAMBAR</button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                    {(formData.product_gallery || []).map((img: string, idx: number) => (
                        <div key={idx} className="relative group aspect-square rounded-2xl bg-zinc-50 border border-zinc-100 overflow-hidden">
                            {img ? (
                                <img src={img} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                            ) : (
                                <div onClick={() => openMediaPicker('product_gallery', idx)} className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-100 transition-colors">
                                    <ImageIcon className="w-6 h-6 text-zinc-300" />
                                    <span className="text-[8px] font-black text-zinc-400 uppercase mt-2">Pilih</span>
                                </div>
                            )}
                            <button 
                                type="button" 
                                onClick={() => removeGalleryImage(idx)}
                                className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        );

      case 'Lowongan':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Posisi Jabatan</label>
                <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                    <input type="text" value={formData.job_role || ''} onChange={e => handleInputChange('job_role', e.target.value)} placeholder="Misal: Senior Developer" className="w-full pl-12 pr-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Tipe Pekerjaan</label>
                <select 
                    value={formData.job_type || 'Full-time'} 
                    onChange={e => handleInputChange('job_type', e.target.value)}
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all appearance-none"
                >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Range Gaji</label>
                <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                    <input type="text" value={formData.salary_range || ''} onChange={e => handleInputChange('salary_range', e.target.value)} placeholder="Misal: 10jt - 15jt" className="w-full pl-12 pr-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Batas Akhir (Deadline)</label>
                <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                    <input type="date" value={formData.deadline_date || ''} onChange={e => handleInputChange('deadline_date', e.target.value)} className="w-full pl-12 pr-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all" />
                </div>
              </div>
            </div>

            <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 ml-1">Persyaratan & Kualifikasi</label>
                <RichTextEditor 
                    value={formData.requirements || ''} 
                    onChange={val => handleInputChange('requirements', val)} 
                    placeholder="Tuliskan kualifikasi dan detail pekerjaan..."
                />
            </div>

            <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Link atau Email Lamaran</label>
                <div className="relative">
                    <Send className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                    <input type="text" value={formData.apply_email_or_link || ''} onChange={e => handleInputChange('apply_email_or_link', e.target.value)} placeholder="Misal: career@company.com atau link form" className="w-full pl-12 pr-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all" />
                </div>
            </div>
          </div>
        );

      case 'Pengumuman':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Tingkat Urgensi</label>
                    <select 
                        value={formData.urgency_level || 'Medium'} 
                        onChange={e => handleInputChange('urgency_level', e.target.value)}
                        className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all appearance-none"
                    >
                        <option value="Low">Low (Informasi Biasa)</option>
                        <option value="Medium">Medium (Penting)</option>
                        <option value="High">High (Sangat Penting / Urgent)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Tanggal Kedaluwarsa</label>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                        <input type="date" value={formData.expiry_date || ''} onChange={e => handleInputChange('expiry_date', e.target.value)} className="w-full pl-12 pr-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all" />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 ml-1">Pesan Pengumuman</label>
                <textarea 
                    value={formData.alert_message || ''} 
                    onChange={e => handleInputChange('alert_message', e.target.value)} 
                    placeholder="Tuliskan isi pengumuman penting di sini..."
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-medium text-zinc-700 min-h-[120px] resize-none transition-all"
                />
            </div>

            <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Link Aksi (Optional)</label>
                <div className="relative">
                    <ArrowRight className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                    <input type="url" value={formData.action_link || ''} onChange={e => handleInputChange('action_link', e.target.value)} placeholder="https://domain.com/baca-selengkapnya" className="w-full pl-12 pr-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all" />
                </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="py-10 text-center bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
            <Info className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Pilih kategori untuk menampilkan formulir.</p>
          </div>
        );
    }
  };


  const filteredPosts = posts?.filter((post: any) => {
    const matchesSearch = post.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'Semua Kategori' || post.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Posts</h2>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Kelola konten dinamis secara kronologis.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Cari judul post..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-sm font-medium transition-all"
            />
          </div>
          
          {/* Category Filter */}
          <div className="relative w-full sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <select
              value={selectedCategoryFilter}
              onChange={e => setSelectedCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-white border border-zinc-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-sm font-medium appearance-none transition-all cursor-pointer"
            >
              <option value="Semua Kategori">Semua Kategori</option>
              <option value="Artikel">Artikel</option>
              <option value="Event">Event</option>
              <option value="Produk">Produk</option>
              <option value="Lowongan">Lowongan</option>
              <option value="Pengumuman">Pengumuman</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          <button 
            onClick={() => openEditor()}
            className="flex items-center justify-center gap-2 bg-amber-400 text-zinc-950 px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 shadow-lg shadow-amber-400/20 transition-all active:scale-95 w-full sm:w-auto shrink-0"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            Buat Konten
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-zinc-200 shadow-sm overflow-hidden p-0">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-50/50 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-zinc-100">
                    <tr>
                        <th className="pl-8 pr-3 py-5 w-12 text-center">No</th>
                        <th className="px-8 py-5">Judul Post</th>
                        <th className="px-8 py-5">Format</th>
                        <th className="px-8 py-5 text-center">Status</th>
                        <th className="px-8 py-5 text-center">Tampilkan</th>
                        <th className="px-8 py-5">Dibuat Pada</th>
                        <th className="px-8 py-5 text-right pr-10">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-sm">
                    {filteredPosts && filteredPosts.length > 0 ? filteredPosts.map((post, idx) => (
                        <tr key={idx} className="hover:bg-zinc-50/50 transition-colors group">
                            <td className="pl-8 pr-3 py-6 text-center">
                                <span className="text-zinc-400 font-bold tabular-nums text-xs">{idx + 1}</span>
                            </td>
                            <td className="px-8 py-6">
                                <p className="font-bold text-zinc-900 text-base leading-tight">{post.title}</p>
                                <p className="text-amber-600 font-bold text-[10px] mt-1 italic uppercase tracking-tighter">/{post.slug}</p>
                            </td>
                            <td className="px-8 py-6">
                                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border shadow-sm ${CATEGORIES.find(c => c.id === post.category)?.badge || 'bg-zinc-50 text-zinc-600 border-zinc-200'}`}>
                                    {post.category || 'Lainnya'}
                                </span>
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex justify-center">
                                    {post.status === 'published' ? (
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
                                <div className="flex justify-center">
                                    <button 
                                        onClick={() => handleToggle(post.id!, post.status)}
                                        disabled={toggling[post.id!]}
                                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 outline-none flex items-center shadow-inner ${
                                            toggling[post.id!] ? 'opacity-50 cursor-not-allowed' : ''
                                        } ${post.status === 'published' ? 'bg-amber-400' : 'bg-zinc-200'}`}
                                    >
                                        {toggling[post.id!] ? (
                                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <div className={`absolute w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${
                                                post.status === 'published' ? 'translate-x-7' : 'translate-x-1'
                                            }`} />
                                        )}
                                    </button>
                                </div>
                            </td>
                            <td className="px-8 py-6 font-medium text-zinc-400 tabular-nums">
                                {post.created_at ? new Date(post.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
                            </td>
                            <td className="px-8 py-6 text-right pr-10">
                                <div className="flex justify-end gap-1.5">
                                    <button 
                                      onClick={() => handleDuplicate(post.id!)}
                                      disabled={duplicatingIds.has(post.id!)}
                                      className="p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                      title="Duplikasi Post"
                                    >
                                      {duplicatingIds.has(post.id!) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                    <button onClick={() => openEditor(post)} className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all" title="Edit Post">
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => setConfirmDelete({ isOpen: true, id: post.id! })} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete Post">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={7} className="px-8 py-20 text-center text-zinc-400 italic">Belum ada Post yang dibuat.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-zinc-900/70 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header */}
            <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-white shrink-0 z-10">
              <div>
                <h2 className="text-2xl font-black text-zinc-900 tracking-tight">{editingId ? 'Edit Post' : 'Buat Post Baru'}</h2>
                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] mt-0.5">{category || 'News'} Format</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 rounded-2xl transition-all"><X className="w-6 h-6" /></button>
            </div>
            
            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 py-6 md:px-10">
              <form id="post-edit-form" onSubmit={handleSave} className="space-y-6 flex flex-col p-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Judul Post</label>
                      <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all" placeholder="Misal: Seminar Tahunan" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Slug (URL)</label>
                      <input type="text" value={slug} onChange={e => setSlug(e.target.value)} className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-bold text-xs text-amber-600 transition-all" placeholder="seminar-tahunan" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Gambar Utama (Featured)</label>
                    <div 
                      onClick={() => openMediaPicker('featured_image')}
                      className="group relative aspect-[4/3] rounded-2xl bg-zinc-50 border-2 border-dashed border-zinc-200 hover:border-amber-400 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-2"
                    >
                      {formData.featured_image ? (
                        <>
                          <img src={formData.featured_image} className="w-full h-full object-cover rounded-xl" alt="Featured" />
                          <div className="absolute inset-0 bg-zinc-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-zinc-900/50 px-3 py-1.5 rounded-lg">Ganti Gambar</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-zinc-300 group-hover:text-amber-500 transition-colors mb-2">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Pilih Gambar</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 ml-1">Kategori Konten</label>
                    <button 
                        type="button"
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="w-full flex items-center justify-between px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl hover:border-amber-400 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${CATEGORIES.find(c => c.id === category)?.bg || 'bg-zinc-100'}`}>
                                {React.createElement(CATEGORIES.find(c => c.id === category)?.icon || Tag, { 
                                    className: `w-5 h-5 ${CATEGORIES.find(c => c.id === category)?.color || 'text-zinc-500'}` 
                                })}
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-black text-zinc-900 uppercase tracking-wider">{category}</p>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase">Klik untuk mengubah kategori</p>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                    </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Ringkasan Pendek (Excerpt)</label>
                  <textarea 
                    value={formData.excerpt || ''} 
                    onChange={e => handleInputChange('excerpt', e.target.value)} 
                    placeholder="Berikan ringkasan singkat untuk tampilan list..." 
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-amber-400 font-medium text-zinc-700 min-h-[80px] resize-none transition-all"
                  />
                </div>

                <div className="pt-6 border-t border-zinc-100">
                    <h3 className="text-[10px] font-black text-zinc-300 mb-6 uppercase tracking-[0.25em]">Detail Konten Terstruktur</h3>
                    {renderDynamicInputs()}
                </div>
              </form>
            </div>
            
            {/* Modal Footer (Sticky) */}
            <div className="p-6 border-t border-zinc-100 shrink-0 flex justify-end gap-3 bg-white rounded-b-[2.5rem] sticky bottom-0 z-10 w-full">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3.5 rounded-2xl font-bold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-all bg-white border border-zinc-200">
                  Batal
                </button>
                <button type="submit" form="post-edit-form" className="flex items-center gap-2 bg-amber-400 text-zinc-950 px-8 py-3.5 rounded-2xl font-bold hover:bg-amber-500 shadow-xl shadow-amber-400/20 transition-all active:scale-95">
                  <Send className="w-5 h-5" />
                  Simpan Perubahan
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Selection Modal */}
      {isCategoryModalOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-300"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setIsCategoryModalOpen(false); }}
        >
          <div 
            className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Pilih Kategori Konten</h3>
                <p className="text-sm text-zinc-500 font-bold mt-1 uppercase tracking-wider opacity-60">Pilih format konten yang sesuai</p>
              </div>
              <button onClick={() => setIsCategoryModalOpen(false)} className="p-3 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 rounded-2xl transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`flex flex-col items-center p-6 text-center border-2 rounded-[2rem] transition-all group relative overflow-hidden ${
                    category === cat.id ? 'border-amber-400 bg-amber-50/50 shadow-lg shadow-amber-400/10' : 'border-zinc-100 hover:border-amber-200 hover:bg-zinc-50'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-110 duration-500 ${cat.bg}`}>
                    {React.createElement(cat.icon, { className: `w-8 h-8 ${cat.color}` })}
                  </div>
                  <span className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-1">{cat.label}</span>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase leading-relaxed">{cat.description}</p>
                  
                  {category === cat.id && (
                    <div className="absolute top-4 right-4">
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-ping" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Change Warning */}
      <ConfirmModal 
        isOpen={confirmCategoryChange.isOpen}
        title="Ubah Kategori?"
        message="Mengubah kategori akan mereset detail konten khusus yang sudah Anda isi untuk kategori saat ini. Lanjutkan?"
        confirmLabel="Ya, Ubah Kategori"
        variant="danger"
        onConfirm={proceedCategoryChange}
        onClose={() => setConfirmCategoryChange({ isOpen: false, nextCategory: null })}
      />

      {/* Media Picker Modal */}
      {isMediaPickerOpen && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-xl animate-in fade-in duration-200">
            <div className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col h-[85vh]">
                <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Pilih Media</h2>
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mt-1 opacity-60">Asset Library</p>
                    </div>
                    <button onClick={() => { setIsMediaPickerOpen(false); setPickerContext(null); }} className="p-3 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-900 rounded-2xl transition-all"><X className="w-6 h-6" /></button>
                </div>
                <div className="p-8 flex-1 overflow-y-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {media?.map((m: any, idx: number) => (
                            <div 
                                key={idx} 
                                onClick={() => {
                                    if (pickerContext) {
                                        const { field, index, subField } = pickerContext;
                                        const mediaUrl = m.file_url || m.url;

                                        if (field) {
                                            if (index !== undefined && subField) {
                                                const currentArr = [...(formData[field] || [])];
                                                currentArr[index] = { ...currentArr[index], [subField]: mediaUrl };
                                                handleInputChange(field, currentArr);
                                            } else if (index !== undefined) {
                                                const currentArr = [...(formData[field] || [])];
                                                currentArr[index] = mediaUrl;
                                                handleInputChange(field, currentArr);
                                            } else {
                                                handleInputChange(field, mediaUrl);
                                            }
                                        }
                                    }
                                    setIsMediaPickerOpen(false);
                                    setPickerContext(null);
                                }}
                                className="group cursor-pointer rounded-2xl overflow-hidden border-4 border-transparent hover:border-amber-400 transition-all relative aspect-square bg-zinc-100 ring-offset-2 hover:ring-2 hover:ring-amber-400/20 shadow-sm"
                            >
                                {(m.file_type || '').startsWith('image/') ? (
                                    <img src={m.file_url || m.url} alt={m.filename} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-4">
                                        <ImageIcon className="w-8 h-8 text-zinc-300 mb-2" />
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase text-center truncate w-full">{m.filename}</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-zinc-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                    <span className="bg-amber-400 text-zinc-950 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl">Gunakan</span>
                                </div>
                            </div>
                        ))}
                        {(!media || media.length === 0) && (
                            <div className="col-span-full py-24 text-center">
                                <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-zinc-200">
                                    <ImageIcon className="w-8 h-8 text-zinc-300" />
                                </div>
                                <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-xs">Library Kosong</p>
                                <p className="text-zinc-500 text-sm mt-1">Unggah media melalui menu Media terlebih dahulu.</p>
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
        title="Hapus Post"
        message="Tindakan ini permanen. Hapus item ini?"
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={() => {
            if (confirmDelete.id) deletePost(confirmDelete.id);
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
