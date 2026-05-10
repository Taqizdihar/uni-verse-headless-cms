import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Plus, 
  UploadCloud, 
  Image as ImageIcon, 
  ImageOff,
  File as FileIcon, 
  FileText as FileTextIcon,
  Video as VideoIcon,
  X, 
  LayoutGrid, 
  List, 
  Search,
  Loader2,
  Trash2,
  Edit2,
  Check,
  Eye,
  Folder,
  FolderPlus,
  ChevronRight,
  MoreVertical,
  FolderTree,
  Clock,
  CheckSquare,
  Square,
  AlertTriangle,
  Play
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import api from '../lib/api';

/**
 * MediaCardItem — Extracted component for each media file card.
 * Owns its own `imgError` state (required by Rules of Hooks — cannot use useState inside .map()).
 * Handles: image preview with <a target="_blank">, onError fallback, processing placeholder.
 */
function MediaCardItem({ m, viewMode, editingId, editingName, renameRef, setEditingId, setEditingName, handleRenameFile, setMovingFileId, setIsMoveModalOpen, setConfirmDelete, isSelected, onToggleSelect, user }: any) {
  const [imgError, setImgError] = React.useState(false);

  const isProcessing = m.status === 'processing';
  const isImage = (m.file_type || '').startsWith('image/');
  const isVideo = (m.file_type || '').startsWith('video/');
  const isPdf = (m.file_type || '').toLowerCase() === 'application/pdf';
  const viewableUrl = m.file_url || m.url;

  return (
    <div className={`bg-white rounded-xl border-2 shadow-sm hover:shadow-md transition-all group overflow-hidden relative ${isSelected ? 'border-amber-400 ring-2 ring-amber-400/30 bg-amber-50/30' : 'border-zinc-200'} ${viewMode === 'list' ? 'flex items-center p-3' : 'p-2'}`}>
      {/* Bulk Selection Checkbox */}
      <div 
        className={`absolute top-2 left-2 z-10 transition-all duration-200 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); onToggleSelect(m.id); }}
      >
        <div className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-all shadow-sm ${isSelected ? 'bg-amber-400 text-white border-amber-500' : 'bg-white/90 backdrop-blur border border-zinc-300 text-transparent hover:border-amber-400 hover:text-amber-400'}`}>
          <Check className="w-3.5 h-3.5" strokeWidth={3} />
        </div>
      </div>

      <div
        className={`${viewMode === 'grid' ? 'aspect-square mb-3' : 'w-16 h-16 mr-4'} bg-zinc-50 rounded-xl overflow-hidden relative flex-shrink-0 ${isProcessing ? 'cursor-not-allowed' : 'cursor-pointer'} group/preview`}
      >
        {isProcessing ? (
          /* Status: PROCESSING — static icon placeholder */
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-zinc-800 border border-zinc-700 text-zinc-300">
            {isImage ? (
              <><ImageIcon className="w-10 h-10 mb-3 opacity-60 text-amber-500" /><span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest leading-tight">Gambar sedang<br/>diproses...</span></>
            ) : isVideo ? (
              <><VideoIcon className="w-10 h-10 mb-3 opacity-60 text-amber-500" /><span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest leading-tight">Video sedang<br/>diproses...</span></>
            ) : (
              <><FileIcon className="w-10 h-10 mb-3 opacity-60 text-amber-500" /><span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest leading-tight">Dokumen sedang<br/>diproses...</span></>
            )}
          </div>
        ) : isImage && !imgError ? (
          /* Image preview — thumbnail URL */
          <a href={viewableUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
            <img
              src={viewableUrl}
              alt={m.file_name || m.filename}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover/preview:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (viewableUrl.includes('thumbnail?id=') && !target.dataset.retried) {
                  target.dataset.retried = 'true';
                  const driveId = viewableUrl.split('id=')[1].split('&')[0];
                  target.src = `https://drive.google.com/thumbnail?id=${driveId}&sz=w800`;
                } else if (viewableUrl.includes('uc?id=') && !target.src.includes('thumbnail?id=')) {
                  const driveId = viewableUrl.split('id=')[1].split('&')[0];
                  target.src = `https://drive.google.com/thumbnail?id=${driveId}&sz=w1200`;
                } else {
                  target.onerror = null;
                  setImgError(true);
                }
              }}
            />
          </a>
        ) : isImage && imgError ? (
          /* Image error fallback */
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 text-zinc-400">
            <ImageOff className="w-10 h-10 mb-2 opacity-60" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Pratinjau Tidak Tersedia</span>
          </div>
        ) : isVideo ? (
          /* Video preview — Google thumbnail as poster, click opens Drive player */
          <a
            href={viewableUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full relative bg-zinc-900 group/video"
          >
            {/* Attempt thumbnail from Drive ID if available */}
            {viewableUrl.includes('/file/d/') && (() => {
              const driveId = viewableUrl.split('/file/d/')[1]?.split('/')[0];
              return driveId ? (
                <img
                  src={`https://drive.google.com/thumbnail?id=${driveId}&sz=w400`}
                  alt={m.file_name || m.filename}
                  className="w-full h-full object-cover opacity-70"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : null;
            })()}
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur shadow-xl flex items-center justify-center group-hover/video:scale-110 transition-transform duration-200">
                <Play className="w-5 h-5 text-zinc-900 ml-0.5" fill="currentColor" />
              </div>
            </div>
            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 rounded text-[9px] font-bold text-white uppercase tracking-wider">
              Video
            </div>
          </a>
        ) : isPdf ? (
          /* PDF preview — opens Google Drive PDF viewer */
          <a href={viewableUrl} target="_blank" rel="noopener noreferrer" className="w-full h-full flex flex-col items-center justify-center bg-red-50 hover:bg-red-100 transition-colors">
            <FileTextIcon className="w-12 h-12 text-red-400 mb-2" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-red-500">PDF</span>
          </a>
        ) : (
          /* Other files: open in new tab */
          <a href={viewableUrl} target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center justify-center bg-zinc-50">
            <FileIcon className="w-10 h-10 text-zinc-300" />
          </a>
        )}

        {/* Hover overlay — only when ready and no error, skip for videos (they have play button) */}
        {!isProcessing && !imgError && !isVideo && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center text-white transform translate-y-2 group-hover/preview:translate-y-0 transition-transform duration-300">
              <Eye className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{isPdf ? 'Buka PDF' : 'Lihat'}</span>
            </div>
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          {editingId === m.id ? (
            <div ref={renameRef} className="flex items-center gap-1 w-full animate-in fade-in slide-in-from-left-1 relative">
              <input autoFocus type="text" value={editingName} onChange={(e: any) => setEditingName(e.target.value)} onKeyDown={(e: any) => { if (e.key === 'Enter') handleRenameFile(m.id); if (e.key === 'Escape') setEditingId(null); }} className="flex-1 min-w-0 text-xs font-bold px-2 py-1.5 border border-amber-400 rounded-md outline-none focus:ring-2 focus:ring-amber-400/20" />
              <button onClick={() => handleRenameFile(m.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-md"><Check className="w-3.5 h-3.5" /></button>
            </div>
          ) : (
            <div className="flex items-center gap-1 w-full group/name min-w-0">
              <p className="text-sm font-bold text-zinc-900 truncate flex-1" title={m.file_name || m.filename}>{m.file_name || m.filename}</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest bg-zinc-100 px-1.5 py-0.5 rounded">{(m.file_type || '').split('/').pop() || 'UNKNOWN'}</p>
          {isProcessing && (
            <span className="text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded animate-pulse">PROCESSING</span>
          )}
          <span className="text-zinc-300">•</span>
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{(m.file_size / (1024 * 1024)).toFixed(2)} MB</p>
          <span className="text-zinc-300">•</span>
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{m.created_at ? new Date(m.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : (m.date ? new Date(m.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : 'HARI INI')}</p>
        </div>
      </div>

      {/* File Action Menu */}
      {!editingId && user?.role !== 'guest' && (
        <div className={`absolute ${viewMode === 'list' ? 'right-4' : 'top-3 right-3'} opacity-0 group-hover:opacity-100 transition-opacity group/menu`}>
          <button className="p-1.5 bg-white/90 backdrop-blur border border-zinc-200 rounded-md shadow-sm text-zinc-600 hover:text-zinc-900">
            <MoreVertical className="w-4 h-4" />
          </button>
          <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-zinc-200 rounded-xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 overflow-hidden">
            <button onClick={() => { setEditingId(m.id); setEditingName(m.file_name || m.filename || ""); }} className="w-full text-left px-4 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2">
              <Edit2 className="w-3.5 h-3.5" /> Ganti Nama
            </button>
            <button onClick={() => { setMovingFileId(m.id); setIsMoveModalOpen(true); }} className="w-full text-left px-4 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2">
              <FolderTree className="w-3.5 h-3.5" /> Pindahkan
            </button>
            <div className="h-px bg-zinc-100 my-1"></div>
            <button onClick={() => setConfirmDelete({ isOpen: true, id: m.id, type: 'file' })} className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2">
              <Trash2 className="w-3.5 h-3.5" /> Hapus
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function Media() {
  const { media, setMedia, addMedia, deleteMedia, user } = useCMS();
  
  // Hierarchical State
  const [folders, setFolders] = useState<any[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<{id: number | null, name: string}[]>([{id: null, name: 'Media'}]);
  const [allFolders, setAllFolders] = useState<any[]>([]);

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

  const [editingFolderId, setEditingFolderId] = useState<number | null>(null);
  const [editingFolderName, setEditingFolderName] = useState("");
  const [isRenamingFolder, setIsRenamingFolder] = useState(false);

  // Folder Actions
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [movingFileId, setMovingFileId] = useState<number | null>(null);

  // Confirmation State
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, id: number | null, type: 'file' | 'folder' }>({ isOpen: false, id: null, type: 'file' });
  
  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'date' | 'size' | 'name'>('date');
  const [fileTypeFilter, setFileTypeFilter] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchInAll, setSearchInAll] = useState(false);

  // Bulk Selection State
  const [selectedMediaIds, setSelectedMediaIds] = useState<number[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false);

  const renameRef = useRef<HTMLDivElement>(null);
  const renameFolderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editingId && renameRef.current && !renameRef.current.contains(event.target as Node)) {
        setEditingId(null);
        setEditingName("");
      }
      if (editingFolderId && renameFolderRef.current && !renameFolderRef.current.contains(event.target as Node)) {
        setEditingFolderId(null);
        setEditingFolderName("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingId, editingFolderId]);
  
  const fetchAllFolders = async () => {
    try {
        const res = await api.get('/api/folders');
        setAllFolders(res.data);
    } catch (err) {
        console.error('Failed to fetch all folders:', err);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const folderQuery = searchInAll ? '' : `?folder_id=${currentFolderId || ''}`;
      
      const [mediaRes, folderRes] = await Promise.all([
          api.get(`/api/media${folderQuery}`),
          api.get(`/api/folders${folderQuery}`)
      ]);

      setMedia(mediaRes.data);
      setFolders(folderRes.data);
    } catch (err) {
      console.error('Failed to fetch media/folders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchAllFolders();
    setSelectedMediaIds([]); // Clear selection on folder change
  }, [currentFolderId, searchInAll]);

  // Task 3: Global Polling System for "Processing" Items
  // Triggered when any item is in 'processing' state. Hits /api/media to trigger Task 1's Silent Sync.
  useEffect(() => {
    const hasProcessing = (media || []).some((m: any) => m.status === 'processing');
    let intervalId: ReturnType<typeof setInterval>;

    if (hasProcessing) {
      // Poll every 8 seconds
      intervalId = setInterval(async () => {
        try {
          const folderQuery = searchInAll ? '' : `?folder_id=${currentFolderId || ''}`;
          
          const mediaRes = await api.get(`/api/media${folderQuery}`);
          
          // Update media with the newly synced data and add cache buster when transitioning to ready
          setMedia((prev: any[]) => {
              const prevMap = new Map(prev.map(p => [p.id, p.status]));
              return mediaRes.data.map((m: any) => {
                  const prevStatus = prevMap.get(m.id);
                  if (prevStatus === 'processing' && m.status === 'ready') {
                      const separator = m.file_url && m.file_url.includes('?') ? '&' : '?';
                      m.file_url = `${m.file_url}${separator}t=${Date.now()}`;
                  }
                  return m;
              });
          });
          console.log('[POLL] Silent sync completed. Updates applied.');
        } catch (err) {
          console.error('[POLL] Silent poll failed:', err);
        }
      }, 8000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [media, currentFolderId, searchInAll, setMedia]);

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
        // Bypass file size restrictions as requested
        updateQueue(queuedFile.id, { status: 'Ready' });
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
            if (currentFolderId) {
                formData.append('folder_id', currentFolderId.toString());
            }
            await addMedia(formData);
            setFileQueue(prev => prev.filter(item => item.id !== qf.id));
        } catch (err) {
            console.error('Upload Failed for', qf.file.name, err);
            updateQueue(qf.id, { status: 'Error', errorMessage: 'Gagal mengunggah' });
        }
        setUploadProgress(Math.round(((i + 1) / filesToUpload.length) * 100));
    }
    
    setIsUploading(false);
    setUploadProgress(0);
    fetchData();
  };

  const handleClearAll = () => setFileQueue([]);

  const handleRenameFile = async (id: number) => {
    if (!editingName.trim()) return;
    setIsRenaming(true);
    try {
      await api.patch(`/api/media/${id}`, { file_name: editingName });
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

  const handleRenameFolder = async (id: number) => {
    if (!editingFolderName.trim()) return;
    setIsRenamingFolder(true);
    try {
        await api.patch(`/api/folders/${id}`, { name: editingFolderName });
        setFolders(folders.map((f: any) => f.id === id ? { ...f, name: editingFolderName } : f));
        setEditingFolderId(null);
        setEditingFolderName("");
        fetchAllFolders();
    } catch (err) {
        alert('Gagal mengubah nama folder.');
    } finally {
        setIsRenamingFolder(false);
    }
  };

  const handleDeleteFolder = async (id: number) => {
      try {
          await api.delete(`/api/folders/${id}`);
          setFolders(folders.filter(f => f.id !== id));
          fetchAllFolders();
      } catch (err) {
          alert('Gagal menghapus folder. Pastikan folder kosong atau Anda memiliki izin.');
      }
  };

  const handleCreateFolder = async () => {
      if (!newFolderName.trim()) return;
      setIsCreatingFolder(true);
      try {
          await api.post('/api/folders', { name: newFolderName, parent_id: currentFolderId });
          setIsCreateFolderOpen(false);
          setNewFolderName("");
          fetchData();
          fetchAllFolders();
      } catch (err) {
          alert('Gagal membuat folder.');
      } finally {
          setIsCreatingFolder(false);
      }
  };

  const handleMoveFile = async (targetFolderId: number | null) => {
      if (!movingFileId) return;
      try {
          await api.patch(`/api/media/${movingFileId}`, { folder_id: targetFolderId });
          setIsMoveModalOpen(false);
          setMovingFileId(null);
          fetchData();
      } catch (err) {
          alert('Gagal memindahkan file.');
      }
  };

  const enterFolder = (folder: any) => {
      setCurrentFolderId(folder.id);
      setBreadcrumbs([...breadcrumbs, { id: folder.id, name: folder.name }]);
      setSearchTerm("");
      setSearchInAll(false);
  };

  const navigateToBreadcrumb = (index: number) => {
      const crumb = breadcrumbs[index];
      setCurrentFolderId(crumb.id);
      setBreadcrumbs(breadcrumbs.slice(0, index + 1));
  };

  const renderFolderTree = (parentId: number | null, depth = 0) => {
      const children = allFolders.filter(f => f.parent_id === parentId);
      if (children.length === 0) return null;
      
      return children.map(folder => (
          <div key={folder.id}>
              <button 
                  onClick={() => handleMoveFile(folder.id)}
                  className="flex items-center gap-2 w-full text-left py-2 px-3 hover:bg-amber-50 rounded-lg transition-colors text-sm font-medium text-zinc-700"
                  style={{ paddingLeft: `${depth * 16 + 12}px` }}
              >
                  <Folder className="w-4 h-4 text-amber-500 flex-shrink-0 fill-amber-500/20" />
                  <span className="truncate">{folder.name}</span>
              </button>
              {renderFolderTree(folder.id, depth + 1)}
          </div>
      ));
  };

  if (isLoading && folders.length === 0 && (!media || media.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
        <p className="mt-4 text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">Memuat Pustaka Media...</p>
      </div>
    );
  }

  const filteredFolders = (folders || []).filter((f: any) => {
      if (searchTerm && !f.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
  });

  const filteredMedia = (media || []).filter((m: any) => {
    if (!searchInAll) {
        if (currentFolderId === null) {
            if (m.folder_id != null) return false;
        } else {
            if (m.folder_id !== currentFolderId) return false;
        }
    }
    const filename = (m.file_name || m.filename || '').toLowerCase();
    if (searchTerm && !filename.includes(searchTerm.toLowerCase())) return false;

    if (fileTypeFilter !== 'all') {
      const type = (m.file_type || '').toLowerCase();
      if (fileTypeFilter === 'image' && !type.startsWith('image/')) return false;
      if (fileTypeFilter === 'video' && !type.startsWith('video/')) return false;
      if (fileTypeFilter === 'document' && (type.startsWith('image/') || type.startsWith('video/'))) return false;
    }
    return true;
  }).sort((a: any, b: any) => {
    let comparison = 0;
    if (sortBy === 'name') {
      const nameA = (a.file_name || a.filename || '').toLowerCase();
      const nameB = (b.file_name || b.filename || '').toLowerCase();
      comparison = nameA.localeCompare(nameB);
    } else if (sortBy === 'size') {
      const sizeA = a.file_size || 0;
      const sizeB = b.file_size || 0;
      comparison = sizeA - sizeB;
    } else if (sortBy === 'date') {
      const dateA = new Date(a.created_at || a.date || 0).getTime();
      const dateB = new Date(b.created_at || b.date || 0).getTime();
      comparison = dateA - dateB;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="animate-in fade-in duration-500 space-y-8 max-w-[1200px]">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Media</h2>
              <p className="text-zinc-500 text-sm mt-1 font-medium">Unggah dan kelola aset multimedia untuk website Anda.</p>
            </div>
            
            {user?.role !== 'guest' && (
              <div className="flex items-center gap-3">
                  {/* Bulk Delete Button — visible when items are selected */}
                  {selectedMediaIds.length > 0 && (
                    <button 
                      onClick={() => setBulkDeleteModal(true)}
                      className="flex items-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20 animate-in fade-in slide-in-from-right-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Hapus ({selectedMediaIds.length})
                    </button>
                  )}
                  <button 
                      onClick={() => setIsCreateFolderOpen(true)}
                      className="flex items-center gap-2 bg-zinc-100 text-zinc-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-zinc-200 transition-all font-sans active:scale-95 border border-zinc-200"
                  >
                      <FolderPlus className="w-5 h-5" />
                      Buat Folder
                  </button>
                  <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                  <div className="relative group">
                      <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 bg-amber-400 text-zinc-950 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-500 shadow-lg shadow-amber-400/20 transition-all font-sans active:scale-95"
                      title="Unggah Media (Tanpa Batas Ukuran)"
                      >
                      <Plus className="w-5 h-5 stroke-[3]" />
                      Unggah Media
                      </button>
                  </div>
              </div>
            )}
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col lg:flex-row items-center gap-3 bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">
             <div className="relative flex-1 w-full">
                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                 <input 
                     type="text" 
                     placeholder="Cari aset atau folder..." 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all font-medium placeholder:font-normal"
                 />
             </div>
             
             <label className="flex items-center gap-2 text-sm font-medium text-zinc-600 bg-zinc-50 px-3 py-2.5 rounded-xl border border-zinc-200 cursor-pointer">
                 <input 
                    type="checkbox" 
                    checked={searchInAll}
                    onChange={(e) => setSearchInAll(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500/20 w-4 h-4"
                 />
                 Cari Semua Folder
             </label>

             <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 hide-scrollbar">
                 <select 
                     value={fileTypeFilter}
                     onChange={(e) => setFileTypeFilter(e.target.value as any)}
                     className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-400/20 whitespace-nowrap cursor-pointer hover:bg-zinc-100 transition-colors"
                 >
                     <option value="all">Jenis: Semua</option>
                     <option value="image">Gambar</option>
                     <option value="video">Video</option>
                     <option value="document">Dokumen</option>
                 </select>
                 
                 <select 
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value as any)}
                     className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-400/20 whitespace-nowrap cursor-pointer hover:bg-zinc-100 transition-colors"
                 >
                     <option value="date">Urutan: Tanggal</option>
                     <option value="size">Urutan: Ukuran</option>
                     <option value="name">Urutan: Nama</option>
                 </select>

                 <button 
                     onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                     className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-600 hover:bg-zinc-100 transition-colors flex-shrink-0 flex items-center justify-center min-w-[42px]"
                 >
                     {sortOrder === 'asc' ? <span className="font-bold text-sm">↑</span> : <span className="font-bold text-sm">↓</span>}
                 </button>

                 <div className="h-8 w-px bg-zinc-200 mx-1 flex-shrink-0"></div>

                 <div className="flex bg-zinc-50 border border-zinc-200 p-1 rounded-xl flex-shrink-0">
                     <button 
                       onClick={() => setViewMode('grid')}
                       className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                     >
                         <LayoutGrid className="w-4 h-4" />
                     </button>
                     <button 
                       onClick={() => setViewMode('list')}
                       className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                     >
                         <List className="w-4 h-4" />
                     </button>
                 </div>
             </div>
          </div>
          
          {/* Breadcrumbs */}
          {!searchInAll && (
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-600 overflow-x-auto hide-scrollbar pb-2">
                  {breadcrumbs.map((crumb, idx) => (
                      <React.Fragment key={crumb.id || 'root'}>
                          <button 
                              onClick={() => navigateToBreadcrumb(idx)}
                              className={`hover:text-amber-500 transition-colors whitespace-nowrap ${idx === breadcrumbs.length - 1 ? 'text-zinc-900 font-bold' : ''}`}
                          >
                              {crumb.name}
                          </button>
                          {idx < breadcrumbs.length - 1 && <ChevronRight className="w-4 h-4 text-zinc-300" />}
                      </React.Fragment>
                  ))}
              </div>
          )}
      </div>

      {/* File Queue Section */}
      {fileQueue.length > 0 && (
         <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 md:p-6 mb-8 animate-in slide-in-from-top-4">
             {/* Queue content remains similar, condensed for brevity */}
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                 <UploadCloud className="w-5 h-5 text-amber-500" />
                 Antrean Unggah ({fileQueue.length}) ke {currentFolderId ? breadcrumbs[breadcrumbs.length - 1].name : 'Root'}
               </h3>
               <div className="flex items-center gap-3">
                   <button onClick={handleClearAll} disabled={isUploading} className="text-xs font-bold text-red-500 hover:text-red-700">Hapus Semua</button>
                   <button onClick={handleUpload} disabled={isUploading || !fileQueue.some(f => f.status === 'Ready')} className="bg-zinc-900 text-amber-400 px-5 py-2 rounded-xl text-xs font-bold uppercase hover:bg-black transition-all">
                       {isUploading ? `Mengunggah ${uploadProgress}%` : 'Unggah'}
                   </button>
               </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                 {fileQueue.map(qf => (
                     <div key={qf.id} className="flex items-center p-3 bg-white rounded-xl border border-zinc-200 shadow-sm">
                         <div className="flex-1 min-w-0 pr-3">
                             <p className="text-sm font-bold text-zinc-900 truncate">{qf.file.name}</p>
                             <p className="text-[10px] text-zinc-400 mt-1">{qf.status}</p>
                         </div>
                         <button onClick={() => setFileQueue(prev => prev.filter(i => i.id !== qf.id))} className="p-1.5 text-red-500"><X className="w-4 h-4"/></button>
                     </div>
                 ))}
             </div>
         </div>
      )}

      {/* Main Grid View */}
      <div className={viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6" : "flex flex-col gap-2"}>
          {/* Render Folders First */}
          {filteredFolders.map(folder => {
              const itemsCount = (media || []).filter((m: any) => m.folder_id === folder.id).length + (allFolders || []).filter(f => f.parent_id === folder.id).length;
              return (
              <div 
                  key={`folder-${folder.id}`} 
                  onDoubleClick={() => enterFolder(folder)}
                  className={`bg-zinc-50 rounded-xl border border-zinc-200 hover:border-[#FAD02C]/50 hover:bg-[#FAD02C]/5 hover:scale-[1.02] transition-all group cursor-pointer ${viewMode === 'list' ? 'flex items-center p-3' : 'p-4 flex flex-col items-center justify-center aspect-square relative'}`}
              >
                  {viewMode === 'list' ? (
                      <Folder className="w-8 h-8 mr-4" style={{ color: '#FAD02C', fill: '#FAD02C' }} fillOpacity={0.2} />
                  ) : (
                      <div className="relative mb-3">
                          <Folder className="w-16 h-16 group-hover:scale-105 transition-transform" style={{ color: '#FAD02C', fill: '#FAD02C' }} fillOpacity={0.2} />
                          {itemsCount > 0 && (
                              <div className="absolute -bottom-1 -right-1 bg-white text-zinc-600 border border-zinc-200 rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold shadow-sm">
                                  {itemsCount}
                              </div>
                          )}
                      </div>
                  )}
                  
                  <div className={`flex-1 min-w-0 w-full ${viewMode === 'grid' ? 'text-center' : ''}`}>
                      {editingFolderId === folder.id ? (
                          <div ref={renameFolderRef} className="flex items-center gap-1 w-full justify-center">
                              <input 
                                  autoFocus
                                  value={editingFolderName}
                                  onChange={e => setEditingFolderName(e.target.value)}
                                  onKeyDown={e => {
                                      if(e.key === 'Enter') handleRenameFolder(folder.id);
                                      if(e.key === 'Escape') setEditingFolderId(null);
                                  }}
                                  className="w-full text-sm font-bold px-2 py-1 border border-amber-400 rounded outline-none"
                              />
                              <button onClick={() => handleRenameFolder(folder.id)} className="text-green-600 p-1"><Check className="w-4 h-4"/></button>
                          </div>
                      ) : (
                          <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-bold text-zinc-800 truncate" title={folder.name}>{folder.name}</p>
                              {viewMode === 'list' && user?.role !== 'guest' && (
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button onClick={(e) => { e.stopPropagation(); setEditingFolderId(folder.id); setEditingFolderName(folder.name); }} className="p-1.5 text-zinc-500 hover:text-amber-600"><Edit2 className="w-4 h-4"/></button>
                                      <button onClick={(e) => { e.stopPropagation(); setConfirmDelete({ isOpen: true, id: folder.id, type: 'folder' }); }} className="p-1.5 text-zinc-500 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                                  </div>
                              )}
                          </div>
                      )}
                  </div>
                  
                  {viewMode === 'grid' && !editingFolderId && user?.role !== 'guest' && (
                      <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); setEditingFolderId(folder.id); setEditingFolderName(folder.name); }} className="p-1.5 bg-white shadow-sm rounded-md text-zinc-600 hover:text-amber-600"><Edit2 className="w-3.5 h-3.5"/></button>
                          <button onClick={(e) => { e.stopPropagation(); setConfirmDelete({ isOpen: true, id: folder.id, type: 'folder' }); }} className="p-1.5 bg-white shadow-sm rounded-md text-zinc-600 hover:text-red-600"><Trash2 className="w-3.5 h-3.5"/></button>
                      </div>
                  )}
              </div>
          )})}

          {/* Render Media Files */}
          {filteredMedia.map((m: any) => (
            <MediaCardItem 
              key={`media-${m.id}`}
              m={m}
              viewMode={viewMode}
              editingId={editingId}
              editingName={editingName}
              renameRef={renameRef}
              setEditingId={setEditingId}
              setEditingName={setEditingName}
              handleRenameFile={handleRenameFile}
              setMovingFileId={setMovingFileId}
              setIsMoveModalOpen={setIsMoveModalOpen}
              setConfirmDelete={setConfirmDelete}
              isSelected={selectedMediaIds.includes(m.id)}
              onToggleSelect={(id: number) => {
                setSelectedMediaIds(prev => 
                  prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
                );
              }}
              user={user}
            />
          ))}
      </div>

      {folders.length === 0 && (!media || filteredMedia.length === 0) && !isLoading && (
          <div className="bg-white border-2 border-dashed border-zinc-200 rounded-xl py-24 text-center">
              <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ImageIcon className="w-10 h-10 text-zinc-200" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Folder ini kosong</h3>
              <p className="text-zinc-500 mt-2 font-medium">Unggah aset atau buat subfolder baru di sini.</p>
          </div>
      )}

      {/* Create Folder Modal */}
      {isCreateFolderOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in p-4">
              <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
                  <h3 className="text-xl font-bold text-zinc-900 mb-4">Buat Folder Baru</h3>
                  <input 
                      autoFocus
                      type="text" 
                      placeholder="Nama folder..." 
                      value={newFolderName}
                      onChange={e => setNewFolderName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 font-medium"
                  />
                  <div className="flex justify-end gap-3 mt-6">
                      <button onClick={() => setIsCreateFolderOpen(false)} className="px-5 py-2.5 text-sm font-bold text-zinc-500 hover:bg-zinc-100 rounded-xl transition-colors">Batal</button>
                      <button onClick={handleCreateFolder} disabled={isCreatingFolder || !newFolderName.trim()} className="px-5 py-2.5 bg-zinc-900 text-amber-400 hover:bg-black rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50">
                          {isCreatingFolder ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Buat Folder'}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Move File Modal */}
      {isMoveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in p-4">
              <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative flex flex-col max-h-[80vh]">
                  <h3 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
                      <FolderTree className="w-5 h-5 text-amber-500" />
                      Pindahkan File
                  </h3>
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                      <button 
                          onClick={() => handleMoveFile(null)}
                          className="flex items-center gap-2 w-full text-left py-3 px-3 hover:bg-amber-50 rounded-lg transition-colors text-sm font-bold text-zinc-800 mb-1"
                      >
                          <Folder className="w-5 h-5 text-zinc-400" />
                          Root (Media Utama)
                      </button>
                      <div className="h-px bg-zinc-100 my-2"></div>
                      {renderFolderTree(null)}
                  </div>
                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-100">
                      <button onClick={() => setIsMoveModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-zinc-500 hover:bg-zinc-100 rounded-xl transition-colors">Batal</button>
                  </div>
              </div>
          </div>
      )}

      <ConfirmModal 
        isOpen={confirmDelete.isOpen}
        title={confirmDelete.type === 'folder' ? "Hapus Folder" : "Hapus Media"}
        message={confirmDelete.type === 'folder' ? "Anda yakin ingin menghapus folder ini beserta seluruh isinya? Tindakan ini permanen." : "Tindakan ini permanen. Hapus item ini?"}
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={() => {
            if (confirmDelete.id) {
                if (confirmDelete.type === 'folder') {
                    handleDeleteFolder(confirmDelete.id);
                } else {
                    deleteMedia(confirmDelete.id);
                }
            }
            setConfirmDelete({ isOpen: false, id: null, type: 'file' });
        }}
        onClose={() => setConfirmDelete({ isOpen: false, id: null, type: 'file' })}
      />

      {/* Bulk Delete Confirmation Modal */}
      {bulkDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-in zoom-in-95 fade-in">
            <div className="flex items-center justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 text-center mb-2">Hapus {selectedMediaIds.length} aset media?</h3>
            <p className="text-sm text-zinc-500 text-center leading-relaxed">
              Tindakan ini <span className="font-bold text-red-600">permanen</span> dan akan menghapus file dari <span className="font-bold">Database</span> serta <span className="font-bold">CDN Kroombox</span>.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setBulkDeleteModal(false)} 
                disabled={isBulkDeleting}
                className="px-5 py-2.5 text-sm font-bold text-zinc-500 hover:bg-zinc-100 rounded-xl transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button 
                onClick={async () => {
                  setIsBulkDeleting(true);
                  try {
                    await api.post('/api/media/bulk-delete', { ids: selectedMediaIds });
                    setSelectedMediaIds([]);
                    setBulkDeleteModal(false);
                    fetchData();
                  } catch (err) {
                    console.error('Bulk delete failed:', err);
                  } finally {
                    setIsBulkDeleting(false);
                  }
                }}
                disabled={isBulkDeleting}
                className="px-5 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-red-600/20"
              >
                {isBulkDeleting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Trash2 className="w-4 h-4" />}
                {isBulkDeleting ? 'Menghapus...' : `Ya, Hapus ${selectedMediaIds.length} File`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
