// File: src/pages/Media.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  UploadCloud, 
  Image as ImageIcon, 
  Video, 
  File as FileIcon, 
  X, 
  CheckCircle2, 
  LayoutGrid, 
  List, 
  Search,
  Loader2,
  Trash2,
  Edit2,
  Check
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import axios from 'axios';

export function Media() {
  const { media, setMedia, addMedia, deleteMedia } = useCMS();
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Renaming State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  // Confirmation State
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, id: number | null }>({ isOpen: false, id: null });
  
  // Real Data Fetching
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/media`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMedia(response.data);
      } catch (err) {
        console.error('Failed to fetch media:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMedia();
  }, [setMedia]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    
    try {
        const formData = new FormData();
        formData.append('file', selectedFile);

        await addMedia(formData);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
        console.error('Upload Failed:', err);
    } finally {
        setIsUploading(false);
    }
  };

  const handleRename = async (id: number) => {
    if (!editingName.trim()) return;
    setIsRenaming(true);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/media/${id}`, 
        { file_name: editingName },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Update Local State
      setMedia(media.map((m: any) => m.id === id ? { ...m, file_name: editingName } : m));
      setEditingId(null);
      setEditingName("");
    } catch (err) {
      console.error('Rename failed:', err);
      alert('Gagal mengubah nama file.');
    } finally {
      setIsRenaming(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
        <p className="mt-4 text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">Memuat Pustaka Media...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8 max-w-[1200px]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Media</h2>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Unggah dan kelola aset multimedia untuk website Anda.</p>
        </div>
        
        <div className="flex items-center gap-4">
            {/* Grid/List Toggle */}
            <div className="flex bg-white border border-zinc-200 p-1 rounded-xl shadow-sm">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                    <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                    <List className="w-4 h-4" />
                </button>
            </div>

            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            {selectedFile ? (
                <div className="flex items-center gap-3 bg-white p-1 pr-4 border border-amber-400 rounded-xl shadow-lg animate-in slide-in-from-right-2">
                    <span className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase truncate max-w-[120px]">{selectedFile.name}</span>
                    <button 
                        onClick={handleUpload} 
                        disabled={isUploading}
                        className="bg-zinc-900 text-amber-400 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-black transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Memproses...
                            </>
                        ) : 'Unggah'}
                    </button>
                    <button onClick={() => setSelectedFile(null)} className="text-zinc-400 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                </div>
            ) : (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-amber-400 text-zinc-950 px-6 py-3 rounded-xl font-bold text-sm hover:bg-amber-500 shadow-lg shadow-amber-400/20 transition-all font-sans active:scale-95"
                >
                  <Plus className="w-5 h-5 stroke-[3]" />
                  Unggah Baru
                </button>
            )}
        </div>
      </div>

      {/* Media Grid */}
      {media && media.length > 0 ? (
        <div className={viewMode === 'grid' 
            ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
            : "flex flex-col gap-2"
        }>
            {media.map((m: any, idx) => (
              <div key={m.id || idx} className={`bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-all group overflow-hidden ${viewMode === 'list' ? 'flex items-center p-3' : 'p-2'}`}>
                <div className={`${viewMode === 'grid' ? 'aspect-square mb-3' : 'w-16 h-16 mr-4'} bg-zinc-50 rounded-xl overflow-hidden relative flex-shrink-0`}>
                  {(m.file_type || '').startsWith('image/') ? (
                    <img 
                      src={m.file_url || m.url} 
                      alt={m.file_name || m.filename} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Corrupt+Asset';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileIcon className="w-10 h-10 text-zinc-200" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    {editingId === m.id ? (
                      <div className="flex items-center gap-1 w-full animate-in fade-in slide-in-from-left-1">
                        <input 
                          autoFocus
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                             if (e.key === 'Enter') handleRename(m.id);
                             if (e.key === 'Escape') setEditingId(null);
                          }}
                          className="flex-1 text-xs font-bold px-2 py-1 border border-amber-400 rounded-lg outline-none bg-amber-50"
                        />
                        <button 
                          onClick={() => handleRename(m.id)}
                          disabled={isRenaming}
                          className="p-1 text-green-600 hover:bg-green-50 rounded-lg"
                        >
                          {isRenaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-1 text-zinc-400 hover:bg-zinc-50 rounded-lg">
                           <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 w-full group/name min-w-0">
                        <p className="text-sm font-bold text-zinc-900 truncate tracking-tight flex-1" title={m.file_name || m.filename}>
                          {m.file_name || m.filename || 'Aset Media'}
                        </p>
                        <button 
                          onClick={() => {
                            setEditingId(m.id);
                            setEditingName(m.file_name || m.filename || "");
                          }}
                          className="p-1 text-zinc-500 hover:text-amber-500 transition-all flex-shrink-0"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    {!editingId && (
                      <button 
                          onClick={() => setConfirmDelete({ isOpen: true, id: m.id })}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                          <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                        {m.file_size ? `${(m.file_size / (1024 * 1024)).toFixed(2)} MB` : '0.0MB'}
                      </p>
                      <span className="text-zinc-200">|</span>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{m.date || 'Hari Ini'}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-zinc-200 rounded-[2rem] py-24 text-center">
            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-10 h-10 text-zinc-200" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Belum ada aset media</h3>
            <p className="text-zinc-500 mt-2 font-medium italic">Mulai dengan mengunggah gambar pertama Anda.</p>
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="mt-8 text-xs font-bold text-amber-500 uppercase tracking-widest hover:text-zinc-900 transition-colors underline underline-offset-8"
            >
                Buka Panel Unggah
            </button>
        </div>
      )}
      {/* Confirmation Modal */}
      <ConfirmModal 
        isOpen={confirmDelete.isOpen}
        title="Hapus Media"
        message="Tindakan ini permanen. Hapus item ini?"
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={() => {
            if (confirmDelete.id) deleteMedia(confirmDelete.id);
            setConfirmDelete({ isOpen: false, id: null });
        }}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
      />
    </div>
  );
}
