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
  Check,
  Eye
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import axios from 'axios';
import imageCompression from 'browser-image-compression';

export function Media() {
  const { media, setMedia, addMedia, deleteMedia } = useCMS();
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  interface QueuedFile {
    id: string;
    file: File;
    originalSize: number;
    status: 'Ready' | 'Too Large' | 'Compressing' | 'Error';
    errorMessage?: string;
  }
  const [fileQueue, setFileQueue] = useState<QueuedFile[]>([]);
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

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const updateQueue = (id: string, updates: Partial<QueuedFile>) => {
    setFileQueue(prev => prev.map(qf => qf.id === id ? { ...qf, ...updates } : qf));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newFiles = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substring(7),
        file,
        originalSize: file.size,
        status: 'Ready' as const,
    }));

    setFileQueue(prev => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";

    newFiles.forEach(async (queuedFile) => {
        const file = queuedFile.file;
        const isImage = file.type.startsWith('image/');
        const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
        const MAX_IMAGE_UPLOAD_SIZE = 5 * 1024 * 1024;
        const MAX_OTHER_SIZE = 10 * 1024 * 1024;

        if (isImage) {
            if (file.size > MAX_IMAGE_UPLOAD_SIZE) {
                updateQueue(queuedFile.id, { status: 'Too Large', errorMessage: 'Ukuran Terlalu Besar (> 5MB)' });
            } else if (file.size > MAX_IMAGE_SIZE) {
                updateQueue(queuedFile.id, { status: 'Compressing' });
                try {
                    const options = {
                        maxSizeMB: 2,
                        maxWidthOrHeight: 1920,
                        useWebWorker: true
                    };
                    const compressedFile = await imageCompression(file, options);
                    
                    if (compressedFile.size > MAX_IMAGE_SIZE) {
                        updateQueue(queuedFile.id, { status: 'Too Large', errorMessage: 'Ukuran Terlalu Besar (Gagal dikompresi)' });
                    } else {
                        updateQueue(queuedFile.id, { file: compressedFile, status: 'Ready' });
                    }
                } catch (error) {
                    updateQueue(queuedFile.id, { status: 'Error', errorMessage: 'Gagal mengompresi gambar' });
                }
            } else {
                updateQueue(queuedFile.id, { status: 'Ready' });
            }
        } else {
            if (file.size > MAX_OTHER_SIZE) {
                updateQueue(queuedFile.id, { status: 'Too Large', errorMessage: 'Ukuran Terlalu Besar (> 10MB)' });
            } else {
                updateQueue(queuedFile.id, { status: 'Ready' });
            }
        }
    });
  };

  const handleUpload = async () => {
    const filesToUpload = fileQueue.filter(f => f.status === 'Ready');
    if (filesToUpload.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    for (let i = 0; i < filesToUpload.length; i++) {
        const qf = filesToUpload[i];
        try {
            const formData = new FormData();
            formData.append('file', qf.file);
            await addMedia(formData);
            
            // Remove successful file from queue
            setFileQueue(prev => prev.filter(item => item.id !== qf.id));
        } catch (err) {
            console.error('Upload Failed for', qf.file.name, err);
            updateQueue(qf.id, { status: 'Error', errorMessage: 'Gagal mengunggah' });
        }
        setUploadProgress(Math.round(((i + 1) / filesToUpload.length) * 100));
    }
    
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleClearAll = () => setFileQueue([]);

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

            <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
            <div className="relative group">
                <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-amber-400 text-zinc-950 px-6 py-3 rounded-xl font-bold text-sm hover:bg-amber-500 shadow-lg shadow-amber-400/20 transition-all font-sans active:scale-95"
                >
                <Plus className="w-5 h-5 stroke-[3]" />
                Pilih File
                </button>
                <div className="absolute top-full right-0 mt-2 w-max max-w-xs p-2 bg-zinc-900 text-white text-xs font-medium rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                Batas Unggah: Gambar (Maks 5MB - Auto Compress ke 2MB), Video & Dokumen (Maks 10MB)
                </div>
            </div>
        </div>
      </div>

      {/* File Queue Section */}
      {fileQueue.length > 0 && (
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 md:p-6 mb-8 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-zinc-900 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-amber-500" />
              Antrean Unggah ({fileQueue.length})
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={handleClearAll}
                disabled={isUploading}
                className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-widest disabled:opacity-50"
              >
                Hapus Semua
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading || !fileQueue.some(f => f.status === 'Ready')}
                className="bg-zinc-900 text-amber-400 px-5 py-2 rounded-xl text-xs font-bold uppercase hover:bg-black transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mengunggah {uploadProgress}%
                  </>
                ) : (
                  'Unggah'
                )}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-2">
            {fileQueue.map(qf => (
              <div 
                key={qf.id} 
                className={`flex items-center p-3 bg-white rounded-xl border ${qf.status === 'Too Large' || qf.status === 'Error' ? 'border-red-400' : qf.status === 'Compressing' ? 'border-blue-400' : 'border-zinc-200'} shadow-sm transition-all`}
              >
                <div className="flex-1 min-w-0 pr-3">
                  <p className="text-sm font-bold text-zinc-900 truncate" title={qf.file.name}>{qf.file.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      {(qf.originalSize / (1024 * 1024)).toFixed(2)} MB
                    </span>
                    <span className="text-zinc-300">|</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      qf.status === 'Ready' ? 'text-green-500' : 
                      qf.status === 'Compressing' ? 'text-blue-500' : 
                      'text-red-500'
                    }`}>
                      {qf.status === 'Compressing' ? 'Mengompresi...' : 
                       qf.status === 'Too Large' ? 'Terlalu Besar' : 
                       qf.status === 'Error' ? 'Gagal' : 'Siap'}
                    </span>
                  </div>
                  {(qf.status === 'Too Large' || qf.status === 'Error') && qf.errorMessage && (
                    <p className="text-[10px] text-red-500 mt-1 font-medium leading-tight">
                      {qf.errorMessage}
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => setFileQueue(prev => prev.filter(item => item.id !== qf.id))}
                  disabled={isUploading && qf.status === 'Ready'}
                  className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Media Grid */}
      {media && media.length > 0 ? (
        <div className={viewMode === 'grid' 
            ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
            : "flex flex-col gap-2"
        }>
            {media.map((m: any, idx) => (
              <div key={m.id || idx} className={`bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-all group overflow-hidden ${viewMode === 'list' ? 'flex items-center p-3' : 'p-2'}`}>
                <div 
                  className={`${viewMode === 'grid' ? 'aspect-square mb-3' : 'w-16 h-16 mr-4'} bg-zinc-50 rounded-xl overflow-hidden relative flex-shrink-0 cursor-pointer group/preview`}
                  onClick={() => window.open(m.file_url || m.url, '_blank')}
                >
                  {(m.file_type || '').startsWith('image/') ? (
                    <img 
                      src={m.file_url || m.url} 
                      alt={m.file_name || m.filename} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/preview:scale-110" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Corrupt+Asset';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileIcon className="w-10 h-10 text-zinc-200" />
                    </div>
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex flex-col items-center text-white transform translate-y-2 group-hover/preview:translate-y-0 transition-transform duration-300">
                      <Eye className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Lihat</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0 transition-opacity duration-300 group-hover:opacity-90">
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
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                        {m.file_type ? m.file_type.split('/').pop()?.toUpperCase() : 'UNKNOWN'}
                      </p>
                      {m.file_size ? (
                        <>
                          <span className="text-zinc-200">|</span>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                            {(m.file_size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </>
                      ) : null}
                      <span className="text-zinc-200">|</span>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                        {m.created_at ? new Date(m.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : (m.date || 'HARI INI')}
                      </p>
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
            <p className="text-xs text-zinc-400 mt-4">Batas Unggah: Gambar (Maks 2MB), Video & Dokumen (Maks 10MB)</p>
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
