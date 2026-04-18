// File: src/pages/Plugins.tsx
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  LineChart, 
  MessageCircle, 
  Mail, 
  Search, 
  Settings, 
  Power,
  Zap,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { useSearch } from '@/context/SearchContext';

const iconMap: Record<string, any> = {
  LineChart,
  MessageCircle,
  Mail,
  Search
};

export function Plugins() {
  const { plugins, togglePluginStatus } = useCMS();
  const { searchQuery } = useSearch();

  const filteredPlugins = useMemo(() => {
    return plugins.filter(plugin => 
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [plugins, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-brand-black">Plugin</h2>
        <p className="text-gray-500 mt-1">Perluas fungsionalitas halaman Anda dengan integrasi pihak ketiga.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlugins.length > 0 ? (
          plugins.map((plugin) => {
            const Icon = iconMap[plugin.iconName || ''] || Settings;
            const isActive = !!plugin.is_active;

            return (
              <Card 
                key={plugin.id} 
                className="group border-none shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                {/* Visual Accent */}
                <div className={`absolute top-0 left-0 w-1 h-full transition-all duration-300 ${isActive ? 'bg-green-500' : 'bg-gray-200'}`} />
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl transition-colors duration-300 ${isActive ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400 group-hover:bg-yellow-50 group-hover:text-brand-yellow'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {isActive ? (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50 px-2 py-1 rounded-full border border-green-100">
                        <CheckCircle2 className="w-3 h-3" /> Aktif
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                        <XCircle className="w-3 h-3" /> Nonaktif
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-brand-black leading-none">{plugin.name}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium min-h-[40px]">
                      {plugin.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Zap className={`w-3.5 h-3.5 ${isActive ? 'text-brand-yellow' : 'text-gray-300'}`} />
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">Konektor Siap</span>
                    </div>
                    
                    <button 
                      onClick={() => togglePluginStatus(plugin.id, isActive)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                        isActive 
                          ? 'bg-gray-100 text-gray-500 hover:bg-gray-200 shadow-sm' 
                          : 'bg-brand-yellow text-brand-black hover:opacity-90 shadow-sm'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      {isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center">
             <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
                <Settings className="w-12 h-12 text-gray-300 animate-spin-slow" />
             </div>
             <h3 className="text-lg font-bold text-brand-black">Plugin tidak ditemukan</h3>
             <p className="text-gray-500">Coba sesuaikan kriteria pencarian Anda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
