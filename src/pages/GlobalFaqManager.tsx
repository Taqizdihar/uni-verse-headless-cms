import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Loader2, 
  HelpCircle,
  X,
  Save
} from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  priority: number;
  created_at?: string;
}

const CATEGORIES = [
  'Umum',
  'Akun & Billing',
  'Teknis & Integrasi',
  'Pengelolaan Konten',
  'Troubleshooting'
];

export function GlobalFaqManager() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'Umum',
    priority: 0
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/superadmin/faqs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFaqs(res.data);
    } catch (err) {
      console.error('Failed to fetch FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (faq?: FAQ) => {
    if (faq) {
      setEditingId(faq.id);
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category || 'Umum',
        priority: faq.priority || 0
      });
    } else {
      setEditingId(null);
      setFormData({
        question: '',
        answer: '',
        category: 'Umum',
        priority: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) {
      alert('Pertanyaan dan Jawaban wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/superadmin/faqs/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/superadmin/faqs`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      await fetchFaqs();
      handleCloseModal();
    } catch (err) {
      console.error('Failed to save FAQ:', err);
      alert('Terjadi kesalahan saat menyimpan FAQ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/superadmin/faqs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFaqs(faqs.filter(f => f.id !== id));
    } catch (err) {
      console.error('Failed to delete FAQ:', err);
      alert('Gagal menghapus FAQ.');
    }
  };

  const filteredFaqs = faqs.filter(f => 
    f.question?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-zinc-500 font-bold uppercase tracking-widest text-xs">Memuat Data FAQ...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8 max-w-7xl mx-auto pb-20">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className="text-3xl font-black text-white tracking-tight">Pusat FAQ Global</h2>
           <p className="text-zinc-400 text-sm font-medium mt-1">Kelola basis pengetahuan (Help Center) untuk semua pengguna Tenant.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative group w-full sm:w-64">
            <input 
              type="text"
              placeholder="Cari pertanyaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 pl-12 bg-zinc-900 border border-zinc-800 text-white rounded-2xl placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-all font-medium text-sm"
            />
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-2xl font-black text-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-95"
          >
            <Plus className="w-5 h-5" /> Tambah FAQ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredFaqs.length === 0 ? (
          <div className="bg-zinc-900/50 backdrop-blur-md rounded-[2rem] border border-slate-800 p-12 text-center text-zinc-500 font-medium">
             Tidak ada FAQ yang ditemukan.
          </div>
        ) : (
          filteredFaqs.map((faq) => (
            <div key={faq.id} className="bg-zinc-900/50 backdrop-blur-md rounded-[2rem] border border-slate-800 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 justify-between items-start group hover:border-emerald-500/30 transition-all shadow-xl">
              <div className="flex-1 space-y-4">
                 <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-zinc-700">
                      {faq.category || 'Umum'}
                    </span>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                      Prioritas: {faq.priority}
                    </span>
                 </div>
                 <h3 className="text-xl font-bold text-white flex items-start gap-3">
                    <HelpCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                    {faq.question}
                 </h3>
                 <div 
                   className="prose prose-invert prose-sm max-w-none text-zinc-400 prose-a:text-emerald-400 prose-p:leading-relaxed"
                   dangerouslySetInnerHTML={{ __html: faq.answer }}
                 />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-zinc-800/50">
                 <button 
                   onClick={() => handleOpenModal(faq)}
                   className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-emerald-500 text-zinc-300 hover:text-black rounded-xl transition-colors font-bold text-xs"
                 >
                   <Edit2 className="w-4 h-4" /> Edit
                 </button>
                 <button 
                   onClick={() => handleDelete(faq.id)}
                   className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-colors font-bold text-xs"
                 >
                   <Trash2 className="w-4 h-4" /> Hapus
                 </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="relative bg-[#09090b] border border-zinc-800 rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-8 py-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
               <h3 className="text-xl font-black text-white">
                 {editingId ? 'Edit FAQ' : 'Tambah FAQ Baru'}
               </h3>
               <button onClick={handleCloseModal} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors">
                 <X className="w-5 h-5" />
               </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1">
              <form id="faq-form" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 ml-2">Pertanyaan</label>
                  <input 
                    required
                    type="text" 
                    value={formData.question} 
                    onChange={e => setFormData(p => ({ ...p, question: e.target.value }))}
                    className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 text-white rounded-2xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium" 
                    placeholder="Contoh: Bagaimana cara mengatur domain kustom?"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 ml-2">Kategori</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                      className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 text-white rounded-2xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium appearance-none"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 ml-2">Prioritas (Makin kecil = Makin Atas)</label>
                    <input 
                      type="number" 
                      value={formData.priority}
                      onChange={e => setFormData(p => ({ ...p, priority: parseInt(e.target.value) || 0 }))}
                      className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 text-white rounded-2xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium tabular-nums" 
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 ml-2">Jawaban Lengkap</label>
                  <div className="faq-editor-container rounded-2xl overflow-hidden border border-zinc-800 focus-within:border-emerald-500 transition-colors bg-white">
                    <style>{`
                      .faq-editor-container .ql-editor {
                        color: #000000 !important;
                        min-height: 200px;
                      }
                      .faq-editor-container .ql-toolbar {
                        background: #f4f4f5;
                      }
                    `}</style>
                    <RichTextEditor 
                      value={formData.answer} 
                      onChange={val => setFormData(p => ({ ...p, answer: val }))} 
                      placeholder="Ketik jawaban detail di sini..." 
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="px-8 py-6 border-t border-zinc-800 flex items-center justify-end gap-4 bg-zinc-900/50">
               <button 
                 type="button" 
                 onClick={handleCloseModal}
                 className="px-6 py-3 text-zinc-400 font-bold text-sm hover:text-white transition-colors"
               >
                 Batal
               </button>
               <button 
                 type="submit"
                 form="faq-form"
                 disabled={isSubmitting}
                 className="flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-black text-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-95 disabled:opacity-50"
               >
                 {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                 Simpan FAQ
               </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
