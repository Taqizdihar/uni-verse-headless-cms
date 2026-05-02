import React, { useState } from 'react';
import { X, Search, Image as ImageIcon, Video as VideoIcon, File as FileIcon } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

interface MediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (mediaUrl: string) => void;
}

export function MediaPicker({ isOpen, onClose, onSelect }: MediaPickerProps) {
  const { media } = useCMS();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'date' | 'size' | 'name'>('date');
  const [fileTypeFilter, setFileTypeFilter] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  if (!isOpen) return null;

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

  const renderIcon = (type: string) => {
    const fileType = (type || '').toLowerCase();
    if (fileType.startsWith('video/')) return <VideoIcon className="w-8 h-8 text-zinc-300 mb-2" />;
    return <FileIcon className="w-8 h-8 text-zinc-300 mb-2" />;
  };

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 md:p-6 bg-zinc-950/80 backdrop-blur-xl animate-in fade-in duration-200" onMouseDown={onClose}>
        <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col h-[85vh]" onMouseDown={e => e.stopPropagation()}>
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div>
                    <h2 className="text-xl font-black text-zinc-900 tracking-tight">Pilih Media</h2>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1 opacity-60">Asset Library</p>
                </div>
                <button onClick={onClose} className="p-2 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-900 rounded-xl transition-all"><X className="w-5 h-5" /></button>
            </div>
            
            {/* Search & Filters */}
            <div className="p-4 border-b border-zinc-100 bg-white flex flex-col md:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input 
                        type="text" 
                        placeholder="Cari aset..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all font-medium placeholder:font-normal"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 hide-scrollbar shrink-0">
                    <select 
                        value={fileTypeFilter}
                        onChange={(e) => setFileTypeFilter(e.target.value as any)}
                        className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-400/20 whitespace-nowrap cursor-pointer hover:bg-zinc-100 transition-colors"
                    >
                        <option value="all">Tipe: Semua</option>
                        <option value="image">Gambar</option>
                        <option value="video">Video</option>
                        <option value="document">Dokumen</option>
                    </select>
                    
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-400/20 whitespace-nowrap cursor-pointer hover:bg-zinc-100 transition-colors"
                    >
                        <option value="date">Urutkan: Tanggal</option>
                        <option value="size">Urutkan: Ukuran</option>
                        <option value="name">Urutkan: Nama</option>
                    </select>

                    <button 
                        onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                        className="p-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-600 hover:bg-zinc-100 transition-colors flex-shrink-0 flex items-center justify-center min-w-[36px] h-[36px]"
                        title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                    >
                        {sortOrder === 'asc' ? <span className="font-bold text-sm">↑</span> : <span className="font-bold text-sm">↓</span>}
                    </button>
                </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto bg-zinc-50">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredMedia.map((m: any, idx: number) => (
                        <div 
                            key={idx} 
                            onClick={() => onSelect(m.file_url || m.url)}
                            className="group cursor-pointer rounded-xl overflow-hidden border-4 border-transparent hover:border-amber-400 transition-all relative aspect-square bg-white shadow-sm ring-offset-2 hover:ring-2 hover:ring-amber-400/20"
                        >
                            {(m.file_type || '').startsWith('image/') ? (
                                <img src={m.file_url || m.url} alt={m.file_name || m.filename} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                                    {renderIcon(m.file_type)}
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase text-center truncate w-full">{m.file_name || m.filename}</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-zinc-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                <span className="bg-amber-400 text-zinc-950 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl">Gunakan</span>
                            </div>
                        </div>
                    ))}
                    {filteredMedia.length === 0 && (
                        <div className="col-span-full py-24 text-center">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-zinc-200">
                                <Search className="w-8 h-8 text-zinc-300" />
                            </div>
                            <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-xs">Aset Tidak Ditemukan</p>
                            <p className="text-zinc-500 text-sm mt-1">Coba sesuaikan kata kunci atau filter Anda.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}
