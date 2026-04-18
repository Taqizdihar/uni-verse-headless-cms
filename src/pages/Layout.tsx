import React, { useState, useEffect } from 'react';
import { useCMS } from '../context/CMSContext';
import { Save, LayoutGrid, ArrowUp, ArrowDown, GripVertical, AlertCircle, Plus, Image, Newspaper, LayoutTemplate, Link as LinkIcon, FileText } from 'lucide-react';
import { Card } from '../components/ui/Card';

export function Layout() {
  const { token, API_URL } = useCMS();
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<number | null>(null);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [status, setStatus] = useState<'loading' | 'idle' | 'saving' | 'saved'>('loading');
  const [iframeKey, setIframeKey] = useState<number>(0);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/pages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPages(data);
        if (data.length > 0) {
            setSelectedPageId(data[0].id);
            setBlocks(data[0].content || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch pages', err);
    } finally {
        setStatus('idle');
    }
  };

  const handlePageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const id = parseInt(e.target.value);
      setSelectedPageId(id);
      const page = pages.find(p => p.id === id);
      setBlocks(page?.content || []);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newBlocks = [...blocks];
    [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
    setBlocks(newBlocks);
  };

  const moveDown = (index: number) => {
    if (index === blocks.length - 1) return;
    const newBlocks = [...blocks];
    [newBlocks[index + 1], newBlocks[index]] = [newBlocks[index], newBlocks[index + 1]];
    setBlocks(newBlocks);
  };

  const handleSave = async () => {
    if (!selectedPageId) return;
    setStatus('saving');
    try {
        const res = await fetch(`${API_URL}/api/pages/${selectedPageId}/layout`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(blocks)
        });
        if (res.ok) {
            // Update local pages state
            setPages(pages.map(p => p.id === selectedPageId ? { ...p, content: blocks } : p));
            setStatus('saved');
            setIframeKey(prev => prev + 1); // Refresh iframe
            
            // Show toast (simulated with a simple timeout reset)
            setTimeout(() => setStatus('idle'), 2500);
        } else {
            console.error('Save failed');
            setStatus('idle');
        }
    } catch (error) {
        console.error('Error saving layout:', error);
        setStatus('idle');
    }
  };

  const getBlockIcon = (type: string) => {
      switch (type) {
          case 'hero': return <Image className="w-5 h-5 text-amber-500" />;
          case 'gallery': return <LayoutGrid className="w-5 h-5 text-amber-500" />;
          case 'news': return <Newspaper className="w-5 h-5 text-amber-500" />;
          default: return <FileText className="w-5 h-5 text-amber-500" />;
      }
  };

  const selectedPageSlug = pages.find(p => p.id === selectedPageId)?.slug || '';
  const previewUrl = `http://localhost:3000/preview/${selectedPageSlug}`;

  if (status === 'loading') {
      return <div className="p-8 text-center text-zinc-500">Memuat data...</div>;
  }

  if (pages.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center p-20 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
              <AlertCircle className="w-12 h-12 text-zinc-300 mb-4" />
              <p className="text-zinc-500 font-medium">Belum ada halaman. Silakan buat halaman terlebih dahulu di menu Halaman.</p>
          </div>
      );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Pengatur Tata Letak</h2>
          <p className="text-zinc-500 mt-1">Ubah urutan blok untuk mengatur struktur halaman.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-200px)]">
        
        {/* Left Panel: Controls */}
        <div className="lg:col-span-1 flex flex-col gap-6">
            <Card className="p-6">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 ml-1">Pilih Halaman</label>
                <select 
                    value={selectedPageId || ''} 
                    onChange={handlePageChange}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-amber-400 font-bold text-zinc-800"
                >
                    {pages.map(page => (
                        <option key={page.id} value={page.id}>{page.title} (/{page.slug})</option>
                    ))}
                </select>
            </Card>

            <Card className="p-0 overflow-hidden border-zinc-200 flex-1 flex flex-col shadow-lg relative">
                <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                    <h3 className="font-bold text-zinc-900 flex items-center gap-2 text-sm">
                        <LayoutTemplate className="w-4 h-4 text-amber-500" />
                        Urutan Blok
                    </h3>
                    <span className="text-[10px] font-bold text-zinc-400 bg-white shadow-sm px-2 py-1 rounded-full">{blocks.length}</span>
                </div>
                
                <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-zinc-50/30">
                    {blocks.map((block, index) => (
                        <div key={block.id || index} className="flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-xl shadow-sm hover:border-amber-400 hover:shadow-md transition-all group">
                            <div className="flex items-center gap-3">
                                <GripVertical className="w-4 h-4 text-zinc-300 group-hover:text-amber-400 transition-colors" />
                                <div className="w-8 h-8 flex items-center justify-center bg-zinc-100 rounded-lg text-amber-600">
                                    {getBlockIcon(block.type)}
                                </div>
                                <div>
                                    <p className="font-bold text-zinc-900 text-xs uppercase tracking-tight">
                                        {block.type}
                                    </p>
                                    <p className="text-[9px] text-zinc-400 font-medium">Bagian {index + 1}</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <button onClick={() => moveUp(index)} disabled={index === 0} className="p-1.5 text-zinc-400 hover:text-amber-500 hover:bg-amber-50 rounded-md disabled:opacity-20 transition-all cursor-pointer"><ArrowUp className="w-3.5 h-3.5" /></button>
                                <button onClick={() => moveDown(index)} disabled={index === blocks.length - 1} className="p-1.5 text-zinc-400 hover:text-amber-500 hover:bg-amber-50 rounded-md disabled:opacity-20 transition-all cursor-pointer"><ArrowDown className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>
                    ))}
                    {blocks.length === 0 && (
                        <div className="py-12 text-center">
                             <p className="text-zinc-400 text-sm font-medium italic">Halaman ini kosong.</p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-zinc-100 bg-white">
                    <button 
                        onClick={handleSave}
                        disabled={status === 'saving'}
                        className="w-full flex justify-center items-center py-3 bg-amber-400 text-zinc-900 rounded-xl font-bold hover:bg-amber-500 transition-all disabled:opacity-50 shadow-md active:scale-95"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {status === 'saving' ? 'Memproses...' : status === 'saved' ? 'Berhasil Disimpan!' : 'Simpan Tata Letak'}
                    </button>
                    {status === 'saved' && (
                        <p className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-zinc-900 text-amber-400 text-xs font-bold px-4 py-2 rounded-full shadow-xl animate-in slide-in-from-bottom-5">
                            Tata letak berhasil diperbarui!
                        </p>
                    )}
                </div>
            </Card>
        </div>

        {/* Right Panel: Live Preview */}
        <div className="lg:col-span-2 h-full">
            <Card className="h-full border-zinc-200 overflow-hidden flex flex-col bg-zinc-100 shadow-inner">
                <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between shrink-0">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="px-4 py-1 bg-zinc-800 rounded-full flex items-center gap-2 max-w-sm w-full opacity-80">
                        <LinkIcon className="w-3 h-3 text-zinc-400" />
                        <span className="text-[10px] text-zinc-400 font-mono truncate">{previewUrl}</span>
                    </div>
                    <div className="w-12"></div> {/* Spacer for balance */}
                </div>
                <div className="flex-1 bg-white relative">
                    {selectedPageSlug ? (
                         <iframe 
                            key={iframeKey}
                            src={previewUrl} 
                            className="absolute inset-0 w-full h-full border-0"
                            title="Live Preview"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                            Pilih halaman untuk melihat pratinjau
                        </div>
                    )}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}
