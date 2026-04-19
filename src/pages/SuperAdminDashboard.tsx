import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Plus, 
  Send, 
  Image as ImageIcon, 
  X, 
  Loader2, 
  LayoutDashboard,
  ShieldAlert,
  Server
} from 'lucide-react';
import axios from 'axios';
import RichTextEditor from '../components/RichTextEditor';

export function SuperAdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalTenants: 0 });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    version: '',
    images: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/super-admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploading(true);
    
    const files = Array.from(e.target.files);
    const uploadedUrls: string[] = [];

    try {
      const token = localStorage.getItem('token');
      for (const file of files) {
        const data = new FormData();
        data.append('file', file);
        
        // Use existing media upload endpoint
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/media`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        uploadedUrls.push(res.data.url);
      }
      setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Gagal mengunggah beberapa gambar.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/super-admin/updates`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Update history berhasil disimpan!');
      setFormData({ title: '', description: '', version: '', images: [] });
    } catch (err) {
      console.error('Submit failed:', err);
      alert('Gagal menyimpan update history.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="mt-4 text-zinc-500 font-bold uppercase tracking-widest text-xs">Otorisasi Super Admin...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8 pb-20 p-8">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 bg-zinc-900 rounded-[2.5rem] text-white">
        <div className="p-4 bg-emerald-500/20 rounded-2xl">
          <ShieldAlert className="w-8 h-8 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight">Super Admin Hub</h2>
          <p className="text-zinc-400 text-sm font-medium tracking-wide">Pusat kendali pertumbuhan platform Uni-Verse.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm flex items-center justify-between group hover:border-emerald-500 transition-all">
          <div>
            <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Total Terdaftar</p>
            <h3 className="text-5xl font-black text-zinc-900 tabular-nums">{stats.totalUsers}</h3>
            <div className="flex items-center gap-2 mt-4 text-emerald-600 font-bold text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+12% Pertumbuhan</span>
            </div>
          </div>
          <div className="p-6 bg-zinc-50 rounded-[2.5rem] group-hover:bg-emerald-50 transition-colors">
            <Users className="w-12 h-12 text-zinc-300 group-hover:text-emerald-500 transition-colors" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm flex items-center justify-between group hover:border-blue-500 transition-all">
          <div>
            <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Total Tenant</p>
            <h3 className="text-5xl font-black text-zinc-900 tabular-nums">{stats.totalTenants}</h3>
            <div className="flex items-center gap-2 mt-4 text-blue-600 font-bold text-sm">
              <Server className="w-4 h-4" />
              <span>Infrastruktur Aktif</span>
            </div>
          </div>
          <div className="p-6 bg-zinc-50 rounded-[2.5rem] group-hover:bg-blue-50 transition-colors">
            <LayoutDashboard className="w-12 h-12 text-zinc-300 group-hover:text-blue-500 transition-colors" />
          </div>
        </div>
      </div>

      {/* Update History Form */}
      <div className="bg-white rounded-[3rem] border border-zinc-200 shadow-2xl overflow-hidden">
        <div className="p-10 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-zinc-900 tracking-tight">Post Update Sistem</h3>
            <p className="text-sm text-zinc-500 font-medium">Informasikan fitur baru kepada seluruh tenant.</p>
          </div>
          <div className="px-5 py-2 bg-zinc-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
            v{formData.version || '0.0.0'}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 ml-2">Judul Update</label>
              <input 
                required
                type="text" 
                value={formData.title} 
                onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl outline-none focus:border-emerald-500 font-bold transition-all" 
                placeholder="Misal: Optimasi Kecepatan ZIP Export"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 ml-2">Versi</label>
              <input 
                required
                type="text" 
                value={formData.version}
                onChange={e => setFormData(p => ({ ...p, version: e.target.value }))}
                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl outline-none focus:border-emerald-500 font-bold transition-all" 
                placeholder="1.0.4"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 ml-2">Deskripsi Detail</label>
            <RichTextEditor 
              value={formData.description} 
              onChange={val => setFormData(p => ({ ...p, description: val }))} 
              placeholder="Jelaskan perubahan teknis atau fitur baru..." 
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4 px-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-500" /> Screenshot Update
              </label>
              <label className="cursor-pointer px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors border border-emerald-100">
                <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" />
                Tambah Gambar
              </label>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {formData.images.map((url, idx) => (
                <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-zinc-200 shadow-sm">
                  <img src={url} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  <button 
                    type="button" 
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {uploading && (
                <div className="aspect-square rounded-2xl border-2 border-dashed border-zinc-100 flex flex-col items-center justify-center animate-pulse">
                  <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                  <span className="text-[10px] text-zinc-400 font-bold mt-2 uppercase">Unggah...</span>
                </div>
              )}
              {formData.images.length === 0 && !uploading && (
                <div className="col-span-full py-12 bg-zinc-50 border-2 border-dashed border-zinc-100 rounded-3xl text-center text-zinc-400 font-medium italic text-sm">
                  Belum ada gambar yang dipilih.
                </div>
              )}
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-100 flex justify-end">
             <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex items-center gap-3 bg-zinc-900 text-emerald-400 px-12 py-5 rounded-[2rem] font-black text-sm hover:bg-black shadow-2xl shadow-emerald-500/10 transition-all active:scale-95 disabled:opacity-50"
             >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Publikasikan Update
                  </>
                )}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
