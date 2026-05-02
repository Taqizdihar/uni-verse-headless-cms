import React, { useState, useEffect } from 'react';
import { Plus, X, Save, FileText, Layout, User, Phone, Globe, Trash2, Edit3, CheckCircle } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export function PagesEditor() {
  const { pages, savePage, deletePage } = useCMS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageType, setPageType] = useState('home');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isInNavbar, setIsInNavbar] = useState(false);
  const [priority, setPriority] = useState(0);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isModalOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      page_type: pageType,
      content: { ...formData },
      status: 'published',
      is_in_navbar: isInNavbar ? 1 : 0,
      priority: Number(priority)
    };
    await savePage(payload);
    setIsModalOpen(false);
    setTitle('');
    setSlug('');
    setFormData({});
    setIsInNavbar(false);
    setPriority(0);
  };


  const renderDynamicInputs = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Headline</label>
              <input type="text" value={formData.headline || ''} onChange={e => handleInputChange('headline', e.target.value)} className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl outline-none focus:border-amber-400" placeholder="Hero Headline" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Sub Judul</label>
              <input type="text" value={formData.sub_headline || ''} onChange={e => handleInputChange('sub_headline', e.target.value)} className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl outline-none focus:border-amber-400" placeholder="Teks pendukung" />
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Email</label>
              <input type="email" value={formData.email || ''} onChange={e => handleInputChange('email', e.target.value)} className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl outline-none focus:border-amber-400" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Telepon</label>
              <input type="tel" value={formData.phone || ''} onChange={e => handleInputChange('phone', e.target.value)} className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl outline-none focus:border-amber-400" />
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-4">
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Tentang Kami</label>
            <textarea value={formData.company_history || ''} onChange={e => handleInputChange('company_history', e.target.value)} className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl outline-none focus:border-amber-400 min-h-[120px]" />
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Halaman</h2>
          <p className="text-zinc-500 mt-1">Kelola halaman statis dan konten fragments.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-amber-400 text-zinc-950 px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 shadow-lg shadow-amber-400/10 transition-all"
        >
          <Plus className="w-5 h-5" />
          Tambah Halaman
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pages.map((page, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-6">
              <div className="p-3 bg-amber-400/10 text-amber-600 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="px-2.5 py-0.5 bg-zinc-100 text-zinc-500 rounded-full text-[10px] font-bold uppercase tracking-widest">{page.page_type}</span>
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-tighter shadow-sm">
                  <CheckCircle className="w-3 h-3" />
                  DITERBITKAN
                </span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-zinc-900 leading-tight">{page.title}</h3>
            <p className="text-xs text-zinc-400 font-medium mt-1">/{page.slug}</p>
            
            <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-between">
              <div className="flex gap-1.5">
                <button className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => { if(window.confirm('Hapus halaman ini?')) deletePage(page.id!); }} className="p-2 text-zinc-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
              <button className="text-[10px] font-bold text-zinc-400 hover:text-amber-500 uppercase tracking-widest">Lihat Draf</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200"
          onMouseDown={() => setIsModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
            onMouseDown={e => e.stopPropagation()}
          >
            <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-zinc-900">Halaman Baru</h2>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 text-zinc-400 hover:bg-zinc-50 rounded-full transition-colors"><X className="w-6 h-6" /></button>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Judul Halaman</label>
                            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-amber-400" placeholder="Tentang Kami" />
                        </div>
                        <div className="w-1/3">
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Tipe</label>
                            <select value={pageType} onChange={e => setPageType(e.target.value)} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-amber-400 appearance-none font-bold text-sm">
                                <option value="home">Beranda</option>
                                <option value="profile">Profil</option>
                                <option value="contact">Kontak</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 flex items-center h-[50px] mt-[26px]">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={isInNavbar}
                                    onChange={(e) => setIsInNavbar(e.target.checked)}
                                    className="w-5 h-5 rounded border-zinc-200 text-amber-500 focus:ring-amber-500 focus:ring-offset-1"
                                />
                                <span className="text-sm font-bold text-zinc-700">Tampilkan di Navbar</span>
                            </label>
                        </div>
                        <div className="w-1/3">
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Urutan Menu</label>
                            <input 
                                type="number" 
                                value={priority} 
                                onChange={(e) => setPriority(parseInt(e.target.value) || 0)} 
                                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-amber-400" 
                                placeholder="0" 
                                min="0"
                            />
                        </div>
                    </div>


                    <div className="p-6 bg-zinc-50 rounded-xl border border-zinc-100">
                        {renderDynamicInputs()}
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="flex items-center gap-2 bg-zinc-900 text-amber-400 px-8 py-3.5 rounded-xl font-bold hover:bg-black shadow-xl active:scale-95 transition-all transition-duration-300">
                            <Save className="w-5 h-5" />
                            Simpan Halaman
                        </button>
                    </div>
                </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
