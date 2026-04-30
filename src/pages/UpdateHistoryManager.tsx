import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2, 
  Megaphone, 
  Save, 
  X, 
  Image as ImageIcon,
  History,
  AlertTriangle,
  Info,
  AlertCircle
} from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';

interface UpdateItem {
  id: number;
  title: string;
  description: string;
  version: string;
  date: string;
  images: { id: number, image_url: string }[];
}

export function UpdateHistoryManager() {
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Broadcast State
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastUrgency, setBroadcastUrgency] = useState('info');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    version: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    images: [] as string[]
  });

  const [imageUrlInput, setImageUrlInput] = useState('');

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/superadmin/updates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUpdates(res.data);
    } catch (err) {
      console.error('Failed to fetch updates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg) return alert('Pesan broadcast tidak boleh kosong.');
    
    setIsBroadcasting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/superadmin/broadcast`, {
        message: broadcastMsg,
        urgency_level: broadcastUrgency
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Broadcast berhasil dikirim ke seluruh Tenant!');
      setBroadcastMsg('');
    } catch (err) {
      console.error('Broadcast failed:', err);
      alert('Gagal mengirim broadcast.');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleOpenModal = (update?: UpdateItem) => {
    if (update) {
      setEditingId(update.id);
      setFormData({
        title: update.title,
        version: update.version,
        date: new Date(update.date).toISOString().split('T')[0],
        description: update.description,
        images: update.images.map(img => img.image_url)
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        version: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        images: []
      });
    }
    setImageUrlInput('');
    setIsModalOpen(true);
  };

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setFormData(prev => ({ ...prev, images: [...prev.images, imageUrlInput.trim()] }));
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.version || !formData.description) {
      alert('Data wajib diisi (Judul, Versi, Deskripsi).');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/superadmin/updates/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/superadmin/updates`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      await fetchUpdates();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Save update failed:', err);
      alert('Gagal menyimpan update.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUpdate = async (id: number) => {
    if (!window.confirm('Hapus log update ini?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/superadmin/updates/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUpdates(updates.filter(u => u.id !== id));
    } catch (err) {
      alert('Gagal menghapus update.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8 max-w-7xl mx-auto pb-20">
      
      <div>
         <h2 className="text-3xl font-black text-white tracking-tight">Histori Update & Komunikasi</h2>
         <p className="text-zinc-400 text-sm font-medium mt-1">Kelola changelog sistem dan kirim pengumuman global ke seluruh tenant.</p>
      </div>

      {/* Broadcast Section */}
      <div className="bg-zinc-900/50 backdrop-blur-md rounded-[2rem] border border-blue-500/30 p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-500/10 rounded-2xl">
            <Megaphone className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-black text-white">Sistem Broadcast Global</h3>
        </div>
        <form onSubmit={handleBroadcast} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <input 
                type="text"
                placeholder="Tulis pesan pengumuman penting (misal: Maintenance server pada pukul 00:00 WIB)..."
                value={broadcastMsg}
                onChange={e => setBroadcastMsg(e.target.value)}
                className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 text-white rounded-2xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
              />
            </div>
            <div className="md:col-span-1">
              <select 
                value={broadcastUrgency}
                onChange={e => setBroadcastUrgency(e.target.value)}
                className="w-full h-full px-5 py-4 bg-zinc-950 border border-zinc-800 text-white rounded-2xl outline-none focus:border-blue-500 transition-all text-sm appearance-none font-bold"
              >
                <option value="info">Info (Biru)</option>
                <option value="warning">Warning (Kuning)</option>
                <option value="danger">Danger (Merah)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button 
              type="submit"
              disabled={isBroadcasting}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-sm transition-all disabled:opacity-50"
            >
              {isBroadcasting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Megaphone className="w-5 h-5" />}
              Kirim Broadcast
            </button>
          </div>
        </form>
      </div>

      {/* Update History Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-2xl">
            <History className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-xl font-black text-white">Changelog Sistem</h3>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-black text-sm transition-all"
        >
          <Plus className="w-5 h-5" /> Rilis Update Baru
        </button>
      </div>

      <div className="space-y-4">
        {updates.length === 0 ? (
          <div className="p-12 bg-zinc-900/50 rounded-[2rem] border border-zinc-800 text-center text-zinc-500 font-medium">
            Belum ada histori update.
          </div>
        ) : (
          updates.map((update) => (
            <div key={update.id} className="bg-zinc-900/50 backdrop-blur-md rounded-[2rem] border border-slate-800 p-6 flex flex-col md:flex-row gap-6 justify-between items-start group hover:border-emerald-500/30 transition-all">
              <div className="flex-1 space-y-4 w-full">
                 <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-500/20">
                      v{update.version}
                    </span>
                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                      {new Date(update.date).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                    </span>
                 </div>
                 <h3 className="text-xl font-black text-white">{update.title}</h3>
                 <div 
                   className="prose prose-invert prose-sm max-w-none text-zinc-400 prose-p:leading-relaxed"
                   dangerouslySetInnerHTML={{ __html: update.description }}
                 />
                 
                 {update.images && update.images.length > 0 && (
                   <div className="flex gap-3 overflow-x-auto py-2">
                     {update.images.map(img => (
                       <img key={img.id} src={img.image_url} alt="Update" className="h-24 w-auto rounded-lg border border-zinc-800 object-cover" />
                     ))}
                   </div>
                 )}
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-zinc-800">
                 <button 
                   onClick={() => handleOpenModal(update)}
                   className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-emerald-500 text-zinc-300 hover:text-black rounded-xl transition-colors font-bold text-xs"
                 >
                   <Edit2 className="w-4 h-4" /> Edit
                 </button>
                 <button 
                   onClick={() => handleDeleteUpdate(update.id)}
                   className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-colors font-bold text-xs"
                 >
                   <Trash2 className="w-4 h-4" /> Hapus
                 </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal CRUD Update */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#09090b] border border-zinc-800 rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-8 py-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
               <h3 className="text-xl font-black text-white">
                 {editingId ? 'Edit Histori Update' : 'Rilis Update Baru'}
               </h3>
               <button onClick={() => setIsModalOpen(false)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors">
                 <X className="w-5 h-5" />
               </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1">
              <form id="update-form" onSubmit={handleSubmitUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 ml-2">Judul Update</label>
                    <input 
                      required
                      type="text" 
                      value={formData.title} 
                      onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                      className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 text-white rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 ml-2">Versi Sistem</label>
                    <input 
                      required
                      type="text" 
                      value={formData.version} 
                      onChange={e => setFormData(p => ({ ...p, version: e.target.value }))}
                      className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 text-white rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium font-mono" 
                      placeholder="e.g. 1.2.0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 ml-2">Tanggal Rilis</label>
                  <input 
                    required
                    type="date" 
                    value={formData.date} 
                    onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                    className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 text-white rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 ml-2">Deskripsi (Release Notes)</label>
                  <div className="rounded-2xl overflow-hidden border border-zinc-800 focus-within:border-emerald-500 transition-colors">
                    <RichTextEditor 
                      value={formData.description} 
                      onChange={val => setFormData(p => ({ ...p, description: val }))} 
                      placeholder="Tuliskan fitur baru, perbaikan bug, dll..." 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 ml-2">Lampiran Gambar (Multi-Image)</label>
                  <div className="flex gap-3 mb-3">
                    <input 
                      type="url" 
                      placeholder="https://... URL Gambar"
                      value={imageUrlInput}
                      onChange={e => setImageUrlInput(e.target.value)}
                      className="flex-1 px-5 py-3 bg-zinc-950 border border-zinc-800 text-white rounded-xl outline-none focus:border-emerald-500 text-sm"
                    />
                    <button type="button" onClick={handleAddImage} className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Tambah
                    </button>
                  </div>
                  
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden border border-zinc-800 aspect-video">
                          <img src={img} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button" 
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-6 h-6 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </form>
            </div>

            <div className="px-8 py-6 border-t border-zinc-800 flex items-center justify-end gap-4 bg-zinc-900/50">
               <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-zinc-400 font-bold text-sm hover:text-white">Batal</button>
               <button type="submit" form="update-form" disabled={isSubmitting} className="flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-black text-sm transition-all disabled:opacity-50">
                 {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Simpan
               </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
