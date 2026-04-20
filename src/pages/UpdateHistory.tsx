import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, History as HistoryIcon, Package } from 'lucide-react';
import superAdminAvatar from '../assets/logo/super-admin-profile.jpg';

interface UpdateItem {
  id: number;
  title: string;
  description: string;
  version: string;
  created_at: string;
  images: string[];
}

export function UpdateHistory() {
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/public/updates`);
        console.log('[DEBUG] Update History Payload:', response.data);
        
        // Defensive Mapping to ensure compatibility with both internal and schema field names
        const mappedData: UpdateItem[] = (response.data || []).map((item: any): UpdateItem => ({
          id: item.id ? Number(item.id) : 0,
          title: String(item.title || item.update_title || ''),
          description: String(item.description || item.update_description || ''),
          version: String(item.version || item.update_version || ''),
          created_at: String(item.created_at || item.update_date || ''),
          images: Array.isArray(item.images) ? item.images : []
        }));

        setUpdates(mappedData);
      } catch (err) {
        console.error('[ERROR] Failed to synchronize update history:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUpdates();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
        <p className="mt-4 text-zinc-500 font-bold uppercase tracking-widest text-xs">Menyelaraskan Histori Sistem...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-12">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-zinc-200">
            <HistoryIcon className="w-6 h-6 text-zinc-900" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Histori Update</h2>
            <p className="text-zinc-500 text-sm font-medium">Log perkembangan dan perbaikan fitur platform Uni-Verse.</p>
          </div>
      </div>

      {updates.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-zinc-200 rounded-[2.5rem] py-24 text-center">
            <Package className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-zinc-900">Belum ada histori update</h3>
            <p className="text-zinc-500 mt-2 font-medium italic">Semua rilis sistem akan muncul di sini.</p>
        </div>
      ) : (
        <div className="relative space-y-12">
          {/* Vertical Line Connecting Avatars */}
          <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-zinc-200 -z-10" />

          {updates.map((update, index) => {
            console.log('[DEBUG] Rendering Update Item:', update);
            return (
              <div key={update.id} className="flex gap-6 relative group animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                {/* Avatar Container */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full border-4 border-white shadow-md overflow-hidden ring-1 ring-zinc-200 bg-zinc-100">
                    <img 
                      src={superAdminAvatar} 
                      alt="Super Admin" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>

                {/* Chat Bubble Container */}
                <div className="flex-1">
                  <div className="bg-blue-50/80 backdrop-blur-sm rounded-[2rem] rounded-tl-none border border-blue-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                          <h3 className="text-lg font-black text-zinc-900 leading-tight">
                              {update.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                              <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest whitespace-nowrap shadow-sm shadow-blue-600/20">
                                  v{update.version}
                              </span>
                              <span className="text-blue-500/80 text-xs font-bold uppercase tracking-widest">
                                  {update.created_at ? new Date(update.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tanggal tidak tersedia'}
                              </span>
                          </div>
                      </div>
                    </div>

                    {/* Description (Rich Text) */}
                    {update.description && (
                      <div 
                        className="rich-text-content text-zinc-700 leading-relaxed text-sm"
                        dangerouslySetInnerHTML={{ __html: update.description }}
                      />
                    )}

                  {/* Images Gallery */}
                  {update.images && update.images.length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-6 pt-6 border-t border-blue-200/50">
                      {update.images.map((img, i) => (
                        <div key={i} className="aspect-video rounded-xl overflow-hidden border border-blue-100 group/img cursor-pointer bg-blue-100/50">
                            <img 
                                src={img} 
                                alt={`Update Screenshot ${i+1}`} 
                                className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500" 
                            />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Visual Connector Line for chat bubble tail feel */}
                <div className="absolute left-[3.5rem] top-4 w-4 h-4 bg-blue-50/80 backdrop-blur-sm border-l border-t border-blue-100 -rotate-45 -z-10" />
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
