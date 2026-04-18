import React, { useState, useEffect } from 'react';
import { useCMS } from '../context/CMSContext';
import { Save, LayoutGrid, ArrowUp, ArrowDown, GripVertical, AlertCircle, Plus } from 'lucide-react';

export function LayoutManager() {
  const { layoutBlocks, updateLayout } = useCMS();
  const [blocks, setBlocks] = useState<any[]>([]);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    if (layoutBlocks && layoutBlocks.length > 0) {
      setBlocks([...layoutBlocks]); 
    } else {
      setBlocks([
        { type: 'hero', order: 1 },
        { type: 'features', order: 2 },
        { type: 'contact', order: 3 }
      ]);
    }
  }, [layoutBlocks]);

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
    setStatus('saving');
    const computedOrder = blocks.map((b, idx) => ({ ...b, order: idx + 1 }));
    setBlocks(computedOrder); 
    await updateLayout(computedOrder);
    setStatus('saved');
    setTimeout(() => setStatus('idle'), 2500);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Pengatur Tata Letak</h2>
          <p className="text-zinc-500 mt-1">Atur urutan struktur halaman beranda Anda.</p>
        </div>
        <button className="flex items-center gap-2 bg-amber-400 text-zinc-950 px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 shadow-lg shadow-amber-400/10 transition-all font-sans">
          <Plus className="w-5 h-5" />
          Tambah Blok
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card className="p-0 overflow-hidden border-zinc-200">
                <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
                    <h3 className="font-bold text-zinc-900 flex items-center gap-2 uppercase tracking-tight">
                        <LayoutGrid className="w-5 h-5 text-amber-500" />
                        Susunan Komponen Aktif
                    </h3>
                    <span className="text-[10px] font-bold text-zinc-400 bg-white border border-zinc-100 px-3 py-1 rounded-full uppercase tracking-widest">{blocks.length} Blok</span>
                </div>
                <div className="p-8 space-y-4">
                    {blocks.map((block, index) => (
                        <div key={`${block.type}-${index}`} className="flex items-center justify-between p-5 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:border-amber-400 group transition-all">
                            <div className="flex items-center gap-4">
                                <GripVertical className="w-5 h-5 text-zinc-300 group-hover:text-amber-400 transition-colors" />
                                <div className="w-10 h-10 flex items-center justify-center bg-zinc-900 text-amber-400 font-bold rounded-xl text-xs">
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="font-bold text-zinc-950 uppercase tracking-tighter text-sm">
                                        Komponen {block.type}
                                    </p>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Tipe: Segmen Utama</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <button onClick={() => moveUp(index)} disabled={index === 0} className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-zinc-50 rounded-lg disabled:opacity-20 transition-all cursor-pointer"><ArrowUp className="w-5 h-5" /></button>
                                <button onClick={() => moveDown(index)} disabled={index === blocks.length - 1} className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-zinc-50 rounded-lg disabled:opacity-20 transition-all cursor-pointer"><ArrowDown className="w-5 h-5" /></button>
                            </div>
                        </div>
                    ))}
                    {blocks.length === 0 && (
                        <div className="py-20 text-center border-2 border-dashed border-zinc-100 rounded-2xl">
                             <AlertCircle className="w-12 h-12 mx-auto mb-4 text-zinc-200" />
                             <p className="text-zinc-400 font-medium italic">Matriks tata letak saat ini kosong.</p>
                        </div>
                    )}
                </div>
                <div className="px-8 py-6 border-t border-zinc-100 bg-zinc-50/30">
                    <button 
                        onClick={handleSave}
                        disabled={status === 'saving'}
                        className="w-full flex justify-center items-center py-4 bg-zinc-900 text-amber-400 rounded-2xl font-bold hover:bg-black transition-all disabled:opacity-50 shadow-xl"
                    >
                        <Save className="w-5 h-5 mr-3" />
                        {status === 'saving' ? 'Memproses Perubahan...' : status === 'saved' ? 'Urutan Disimpan!' : 'Simpan Peta Urutan'}
                    </button>
                </div>
            </Card>
        </div>

        <div className="space-y-6">
            <Card className="p-8 border-zinc-200">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">Pratinjau Visual</h3>
                <div className="space-y-3">
                    <div className="h-8 w-full bg-zinc-100 rounded-full mb-6"></div>
                    {blocks.map((block, idx) => (
                        <div key={idx} className="h-16 w-full bg-amber-400/5 border border-amber-400/20 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                           <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 opacity-20"></div>
                           <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest leading-none">[{block.type}]</span>
                        </div>
                    ))}
                    <div className="h-16 w-full bg-zinc-50 border border-zinc-100 rounded-2xl border-dashed"></div>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return <div className={`bg-white rounded-3xl border border-zinc-200 shadow-sm ${className}`}>{children}</div>;
}
