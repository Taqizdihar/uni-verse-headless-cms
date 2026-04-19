import React, { useState } from 'react';
import { Plus, X, Send, Settings, Tag, Trash2, CheckCircle, Image as ImageIcon, Pencil, Calendar, MapPin, Users, Clock, AlignLeft, EyeOff, Eye } from 'lucide-react';
import axios from 'axios';
import { useCMS } from '../context/CMSContext';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import RichTextEditor from '../components/RichTextEditor';

export function Posts() {
  const { posts, savePost, deletePost, togglePostStatus, media, fetchAllData } = useCMS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toggling, setToggling] = useState<{ [key: number]: boolean }>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('News');
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
  
  // Media Picker State
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [pickerContext, setPickerContext] = useState<{ field: string, index?: number } | null>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const openMediaPicker = (field: string, index?: number) => {
    setPickerContext({ field, index });
    setIsMediaPickerOpen(true);
  };

  const addAgendaItem = () => {
    const current = formData.agenda || [];
    handleInputChange('agenda', [...current, { time: '', activity: '' }]);
  };

  const removeAgendaItem = (index: number) => {
    const current = formData.agenda || [];
    handleInputChange('agenda', current.filter((_: any, i: number) => i !== index));
  };

  const updateAgendaItem = (index: number, field: string, value: string) => {
    const current = [...(formData.agenda || [])];
    current[index][field] = value;
    handleInputChange('agenda', current);
  };

  const addSpeaker = () => {
    const current = formData.speakers || [];
    handleInputChange('speakers', [...current, { name: '', role: '' }]);
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

  const openEditor = (post: any = null) => {
    if (post) {
      setEditingId(post.id);
      setTitle(post.title);
      setSlug(post.slug);
      setCategory(post.category || 'News');
      setFormData(typeof post.content === 'string' ? JSON.parse(post.content) : (post.content || {}));
      handleInputChange('excerpt', post.excerpt || '');
    } else {
      setEditingId(null);
      setTitle('');
      setSlug('');
      setCategory('News');
      setFormData({});
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...(editingId && { id: editingId }),
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      content: formData,
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

  const renderDynamicInputs = () => {
    const fixImgLocal = (url: string) => url && url.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL}${url}` : url;

    if (category === 'News') {
      return (
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Gambar Utama</label>
            <div className="flex gap-2 items-center mb-3">
                <input type="text" value={formData.featured_image || ''} readOnly className="flex-1 px-4 py-3 bg-zinc-100 border border-zinc-200 text-zinc-500 rounded-xl outline-none text-xs" placeholder="Pilih gambar header..." />
                <button type="button" onClick={() => openMediaPicker('featured_image')} className="p-3 bg-amber-400 text-zinc-900 rounded-xl hover:bg-amber-500 transition-colors shadow-sm">
                    <ImageIcon className="w-5 h-5" />
                </button>
            </div>
            
            {formData.featured_image && (
              <div className="relative group w-48 aspect-video rounded-xl overflow-hidden border border-zinc-200 shadow-sm">
                <img src={fixImgLocal(formData.featured_image)} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => handleInputChange('featured_image', null)}
                  className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-lg shadow-md hover:bg-red-50 transition-all shadow-sm"
                  title="Hapus Gambar"
                >
                  <Trash2 className="w-3.5 h-3.5 font-bold" />
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1 flex items-center gap-1.5 font-black text-zinc-400"><AlignLeft className="w-3 h-3"/> Ringkasan Konten (Excerpt)</label>
            <RichTextEditor value={formData.excerpt || ''} onChange={val => handleInputChange('excerpt', val)} placeholder="Ringkasan singkat tentang post ini..." />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Konten Utama</label>
            <RichTextEditor value={formData.body || ''} onChange={val => handleInputChange('body', val)} placeholder="Tuliskan isi artikel lengkap di sini..." />
          </div>
        </div>
      );
    }

    if (category === 'Event') {
      return (
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Sampul Event</label>
            <div className="flex gap-2 items-center mb-3">
                <input type="text" value={formData.featured_image || ''} readOnly className="flex-1 px-4 py-3 bg-zinc-100 border border-zinc-200 text-zinc-500 rounded-xl outline-none text-xs" placeholder="Pilih banner event..." />
                <button type="button" onClick={() => openMediaPicker('featured_image')} className="p-3 bg-amber-400 text-zinc-900 rounded-xl hover:bg-amber-500 transition-colors shadow-sm">
                    <ImageIcon className="w-5 h-5" />
                </button>
            </div>

            {formData.featured_image && (
              <div className="relative group w-48 aspect-video rounded-xl overflow-hidden border border-zinc-200 shadow-sm">
                <img src={fixImgLocal(formData.featured_image)} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => handleInputChange('featured_image', null)}
                  className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-lg shadow-md hover:bg-red-50 transition-all shadow-sm"
                  title="Hapus Gambar"
                >
                  <Trash2 className="w-3.5 h-3.5 font-bold" />
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1.5 font-black text-zinc-300"><Calendar className="w-3 h-3"/> Tanggal & Waktu Event</label>
              <input type="text" value={formData.event_date || ''} onChange={e => handleInputChange('event_date', e.target.value)} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-amber-400 font-bold" placeholder="Misal: 24 Okt 2026, 09:00 AM" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1.5 font-black text-zinc-300"><MapPin className="w-3 h-3"/> Lokasi</label>
              <input type="text" value={formData.location || ''} onChange={e => handleInputChange('location', e.target.value)} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-amber-400 font-bold" placeholder="Misal: Grand Ballroom, Tech Valley" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1.5 font-black text-zinc-300"><AlignLeft className="w-3 h-3"/> Deskripsi Event</label>
            <RichTextEditor value={formData.body || ''} onChange={val => handleInputChange('body', val)} placeholder="Deskripsi lengkap mengenai event ini..." />
          </div>

          {/* Agenda Section */}
          <div className="p-6 bg-zinc-50/50 border border-zinc-100 rounded-[2rem]">
            <div className="flex items-center justify-between mb-4">
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-[0.1em] flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-500"/> Agenda Acara</label>
                <button type="button" onClick={addAgendaItem} className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 flex items-center gap-1.5 transition-all shadow-sm">
                    <Plus className="w-3 h-3" /> Tambah Sesi
                </button>
            </div>
            <div className="space-y-3">
              {(formData.agenda || []).map((item: any, idx: number) => (
                <div key={idx} className="flex flex-col md:flex-row gap-2 items-start md:items-center bg-white p-3 rounded-2xl border border-zinc-200 shadow-sm group">
                  <input type="text" value={item.time} onChange={(e) => updateAgendaItem(idx, 'time', e.target.value)} placeholder="Waktu" className="w-full md:w-32 px-4 py-2.5 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-emerald-400 text-sm font-bold" />
                  <input type="text" value={item.activity} onChange={(e) => updateAgendaItem(idx, 'activity', e.target.value)} placeholder="Nama Aktivitas" className="w-full flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-emerald-400 text-sm font-medium" />
                  <button type="button" onClick={() => removeAgendaItem(idx)} className="p-2.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              {(!formData.agenda || formData.agenda.length === 0) && (
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider text-center py-4 opacity-50">Belum ada agenda.</p>
              )}
            </div>
          </div>

          {/* Speakers Section */}
          <div className="p-6 bg-zinc-50/50 border border-zinc-100 rounded-[2rem]">
            <div className="flex items-center justify-between mb-4">
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-[0.1em] flex items-center gap-2"><Users className="w-4 h-4 text-blue-500"/> Narasumber / Pembicara</label>
                <button type="button" onClick={addSpeaker} className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-2 rounded-xl border border-blue-100 flex items-center gap-1.5 transition-all shadow-sm">
                    <Plus className="w-3 h-3" /> Tambah Personel
                </button>
            </div>
            <div className="space-y-3">
              {(formData.speakers || []).map((item: any, idx: number) => (
                <div key={idx} className="flex flex-col md:flex-row gap-2 items-start md:items-center bg-white p-3 rounded-2xl border border-zinc-200 shadow-sm group">
                  <input type="text" value={item.name} onChange={(e) => updateSpeaker(idx, 'name', e.target.value)} placeholder="Nama Lengkap" className="w-full md:w-48 px-4 py-2.5 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-blue-400 text-sm font-bold" />
                  <input type="text" value={item.role} onChange={(e) => updateSpeaker(idx, 'role', e.target.value)} placeholder="Jabatan / Peran" className="w-full flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-blue-400 text-sm font-medium" />
                  <button type="button" onClick={() => removeSpeaker(idx)} className="p-2.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              {(!formData.speakers || formData.speakers.length === 0) && (
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider text-center py-4 opacity-50">Belum ada pembicara.</p>
              )}
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Posts</h2>
          <p className="text-zinc-500 text-sm mt-1">Kelola konten dinamis secara kronologis.</p>
        </div>
        <button 
          onClick={() => openEditor()}
          className="flex items-center gap-2 bg-amber-400 text-zinc-950 px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 shadow-lg shadow-amber-400/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          Buat Konten
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-zinc-200 shadow-sm overflow-hidden p-0">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-50/50 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-zinc-100">
                    <tr>
                        <th className="px-8 py-5">Judul Post</th>
                        <th className="px-8 py-5">Format</th>
                        <th className="px-8 py-5 text-center">Status</th>
                        <th className="px-8 py-5 text-center">Tampilkan</th>
                        <th className="px-8 py-5">Dibuat Pada</th>
                        <th className="px-8 py-5 text-right pr-10">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-sm">
                    {posts && posts.length > 0 ? posts.map((post, idx) => (
                        <tr key={idx} className="hover:bg-zinc-50/50 transition-colors group">
                            <td className="px-8 py-6">
                                <p className="font-bold text-zinc-900 text-base leading-tight">{post.title}</p>
                                <p className="text-amber-600 font-bold text-[10px] mt-1 italic uppercase tracking-tighter">/{post.slug}</p>
                            </td>
                            <td className="px-8 py-6">
                                <span className={`flex justify-center w-fit px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${
                                    post.category === 'Event' 
                                        ? 'bg-purple-50 text-purple-700 border-purple-200' 
                                        : 'bg-blue-50 text-blue-700 border-blue-200'
                                }`}>
                                    {post.category || 'News'}
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
                                        onClick={() => {
                                          const userStr = localStorage.getItem('user');
                                          const user = userStr ? JSON.parse(userStr) : null;
                                          const subdomain = settings?.subdomain || user?.subdomain || 'site';
                                          const slg = (post.slug || '').replace(/^\/+/, '');
                                          window.open(`/preview/${subdomain}/${slg}`, '_blank');
                                        }}
                                        className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all" 
                                        title="Pratinjau Post"
                                    >
                                        <Eye className="w-4 h-4" />
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
                            <td colSpan={6} className="px-8 py-20 text-center text-zinc-400 italic">Belum ada Post yang dibuat.</td>
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
            <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-white z-10">
              <div>
                <h2 className="text-2xl font-black text-zinc-900 tracking-tight">{editingId ? 'Edit Post' : 'Buat Post Baru'}</h2>
                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] mt-0.5">{category} Format</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 rounded-2xl transition-all"><X className="w-6 h-6" /></button>
            </div>
            
            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-10">
              <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 ml-1">Format Konten</label>
                    <div className="flex gap-4">
                        {['News', 'Event'].map(type => (
                            <label key={type} className="flex-1 group">
                                <input type="radio" value={type} checked={category === type} onChange={e => setCategory(e.target.value)} className="peer sr-only" />
                                <div className="p-4 rounded-2xl border-2 border-zinc-100 cursor-pointer text-center ring-offset-2 peer-checked:ring-2 peer-checked:ring-amber-400/30 bg-zinc-50/50 hover:bg-zinc-50 peer-checked:bg-amber-50 peer-checked:border-amber-400 peer-checked:text-amber-950 transition-all font-black text-sm uppercase tracking-wider">
                                    {type}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-zinc-100">
                    <h3 className="text-[10px] font-black text-zinc-300 mb-6 uppercase tracking-[0.25em]">Elemen Konten Khusus</h3>
                    {renderDynamicInputs()}
                </div>

                <div className="pt-6 flex justify-end gap-3 sticky bottom-0 bg-white border-t border-zinc-100 -mx-10 px-10 py-6 mt-10 rounded-b-[2.5rem]">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-3.5 rounded-2xl font-bold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-all active:scale-95"
                  >
                    Batal
                  </button>
                  <button type="submit" className="flex items-center gap-2 bg-amber-400 text-zinc-950 px-8 py-3.5 rounded-2xl font-bold hover:bg-amber-500 shadow-xl shadow-amber-400/20 transition-all active:scale-95">
                    <Send className="w-5 h-5" />
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      {isMediaPickerOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-xl animate-in fade-in duration-200">
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
    </div>
  );
}
