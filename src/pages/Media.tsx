import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  UploadCloud, 
  Image as ImageIcon, 
  File as FileIcon, 
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
  FolderTree
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import axios from 'axios';
import imageCompression from 'browser-image-compression';

export function Media() {
  const { media, setMedia, addMedia, deleteMedia } = useCMS();
  
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
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/folders`, { headers: { Authorization: `Bearer ${token}` } });
        setAllFolders(res.data);
    } catch (err) {
        console.error('Failed to fetch all folders:', err);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const folderQuery = searchInAll ? '' : `?folder_id=${currentFolderId || ''}`;
      
      const [mediaRes, folderRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/media${folderQuery}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/folders${folderQuery}`, { headers: { Authorization: `Bearer ${token}` } })
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
  }, [currentFolderId, searchInAll]);

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
      const token = localStorage.getItem('token');
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/media/${id}`, 
        { file_name: editingName },
        { headers: { Authorization: `Bearer ${token}` }}
      );
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
        const token = localStorage.getItem('token');
        await axios.patch(`${import.meta.env.VITE_API_URL}/api/folders/${id}`, 
            { name: editingFolderName },
            { headers: { Authorization: `Bearer ${token}` }}
        );
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
          const token = localStorage.getItem('token');
          await axios.delete(`${import.meta.env.VITE_API_URL}/api/folders/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
          });
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
          const token = localStorage.getItem('token');
          await axios.post(`${import.meta.env.VITE_API_URL}/api/folders`, 
            { name: newFolderName, parent_id: currentFolderId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
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
          const token = localStorage.getItem('token');
          await axios.patch(`${import.meta.env.VITE_API_URL}/api/media/${movingFileId}`,
             { folder_id: targetFolderId },
             { headers: { Authorization: `Bearer ${token}` } }
          );
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
            
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setIsCreateFolderOpen(true)}
                    className="flex items-center gap-2 bg-zinc-100 text-zinc-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-zinc-200 transition-all font-sans active:scale-95 border border-zinc-200"
                >
                    <FolderPlus className="w-5 h-5" />
                    Buat Folder
                </button>
                <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
                <div className="relative group">
                    <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 bg-amber-400 text-zinc-950 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-500 shadow-lg shadow-amber-400/20 transition-all font-sans active:scale-95"
                    >
                    <Plus className="w-5 h-5 stroke-[3]" />
                    Unggah Media
                    </button>
                </div>
            </div>
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
          {filteredFolders.map(folder => (
              <div 
                  key={`folder-${folder.id}`} 
                  onDoubleClick={() => enterFolder(folder)}
                  className={`bg-zinc-50 rounded-xl border border-zinc-200 hover:border-amber-400/50 hover:bg-amber-50/30 transition-all group cursor-pointer ${viewMode === 'list' ? 'flex items-center p-3' : 'p-4 flex flex-col items-center justify-center aspect-square relative'}`}
              >
                  {viewMode === 'list' ? (
                      <Folder className="w-8 h-8 text-amber-400 mr-4 fill-amber-400/20" />
                  ) : (
                      <Folder className="w-16 h-16 text-amber-400 mb-3 fill-amber-400/20 group-hover:scale-105 transition-transform" />
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
                              {viewMode === 'list' && (
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button onClick={(e) => { e.stopPropagation(); setEditingFolderId(folder.id); setEditingFolderName(folder.name); }} className="p-1.5 text-zinc-500 hover:text-amber-600"><Edit2 className="w-4 h-4"/></button>
                                      <button onClick={(e) => { e.stopPropagation(); setConfirmDelete({ isOpen: true, id: folder.id, type: 'folder' }); }} className="p-1.5 text-zinc-500 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                                  </div>
                              )}
                          </div>
                      )}
                  </div>
                  
                  {viewMode === 'grid' && !editingFolderId && (
                      <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); setEditingFolderId(folder.id); setEditingFolderName(folder.name); }} className="p-1.5 bg-white shadow-sm rounded-md text-zinc-600 hover:text-amber-600"><Edit2 className="w-3.5 h-3.5"/></button>
                          <button onClick={(e) => { e.stopPropagation(); setConfirmDelete({ isOpen: true, id: folder.id, type: 'folder' }); }} className="p-1.5 bg-white shadow-sm rounded-md text-zinc-600 hover:text-red-600"><Trash2 className="w-3.5 h-3.5"/></button>
                      </div>
                  )}
              </div>
          ))}

          {/* Render Media Files */}
          {filteredMedia.map((m: any) => (
             <div key={`media-${m.id}`} className={`bg-white rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-all group overflow-hidden relative ${viewMode === 'list' ? 'flex items-center p-3' : 'p-2'}`}>
                <div 
                  className={`${viewMode === 'grid' ? 'aspect-square mb-3' : 'w-16 h-16 mr-4'} bg-zinc-50 rounded-xl overflow-hidden relative flex-shrink-0 cursor-pointer group/preview`}
                  onClick={() => window.open(m.file_url || m.url, '_blank')}
                >
                  {(m.file_type || '').startsWith('image/') ? (
                    <img src={m.file_url || m.url} alt={m.file_name || m.filename} className="w-full h-full object-cover transition-transform duration-500 group-hover/preview:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><FileIcon className="w-10 h-10 text-zinc-200" /></div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex flex-col items-center text-white transform translate-y-2 group-hover/preview:translate-y-0 transition-transform duration-300">
                        <Eye className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Lihat</span>
                      </div>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    {editingId === m.id ? (
                      <div ref={renameRef} className="flex items-center gap-1 w-full animate-in fade-in slide-in-from-left-1 relative">
                        <input autoFocus type="text" value={editingName} onChange={(e) => setEditingName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleRenameFile(m.id); if (e.key === 'Escape') setEditingId(null); }} className="flex-1 min-w-0 text-xs font-bold px-2 py-1.5 border border-amber-400 rounded-md outline-none focus:ring-2 focus:ring-amber-400/20" />
                        <button onClick={() => handleRenameFile(m.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-md"><Check className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 w-full group/name min-w-0">
                        <p className="text-sm font-bold text-zinc-900 truncate flex-1" title={m.file_name || m.filename}>{m.file_name || m.filename}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{(m.file_size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>

                {/* File Action Menu */}
                {!editingId && (
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
    </div>
  );
}
