import React, { useState, useEffect, Suspense } from 'react';
import { useCMS } from '../context/CMSContext';
import { Save, Globe, Palette, Mail, CheckCircle2, Monitor, Sparkles, Eye, X, Image, LayoutTemplate, MapPin, Phone, Link as LinkIcon, Plus, Trash, Download } from 'lucide-react';

import { ConfirmModal } from '../components/ui/ConfirmModal';

class ErrorBoundary extends React.Component<{ fallback: React.ReactNode, children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("Preview Template rendering error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const TemplateRegistry: Record<string, React.LazyExoticComponent<any>> = {
  minimalist: React.lazy(() => import('../templates/minimalist/MinimalistTemplate')),
  corporate: React.lazy(() => import('../templates/corporate/CorporateTemplate')),
  creative: React.lazy(() => import('../templates/creative/CreativeTemplate')),
  portfolio: React.lazy(() => import('../templates/PortfolioTemplate')),
  blog: React.lazy(() => import('../templates/BlogTemplate')),
  newssimple: React.lazy(() => import('../templates/NewsSimpleTemplate')),
  gov: React.lazy(() => import('../templates/GovTemplate')),
  legal: React.lazy(() => import('../templates/LegalTemplate')),
  medical: React.lazy(() => import('../templates/MedicalTemplate')),
  photo: React.lazy(() => import('../templates/PhotoTemplate')),
  realestate: React.lazy(() => import('../templates/RealEstateTemplate')),
  resto: React.lazy(() => import('../templates/RestoTemplate')),
  saas: React.lazy(() => import('../templates/SaaSTemplate')),
  fintech: React.lazy(() => import('../templates/FintechTemplate')),
  industrial: React.lazy(() => import('../templates/IndustrialTemplate')),
  event: React.lazy(() => import('../templates/EventTemplate')),
  ngo: React.lazy(() => import('../templates/NGOTemplate')),
  edu: React.lazy(() => import('../templates/EduTemplate')),
  architect: React.lazy(() => import('../templates/ArchitectTemplate')),
  vlog: React.lazy(() => import('../templates/VlogTemplate')),
  beauty: React.lazy(() => import('../templates/BeautyTemplate')),
  travel: React.lazy(() => import('../templates/TravelTemplate')),
  retro: React.lazy(() => import('../templates/RetroTemplate')),
  brutalist: React.lazy(() => import('../templates/BrutalistTemplate')),
  glass: React.lazy(() => import('../templates/GlassTemplate')),
  cyber: React.lazy(() => import('../templates/CyberTemplate'))
};

interface BrandingPalette {
  name: string;
  primary: string;
  secondary: string;
  surface: string;
  text: string;
}

const PRESET_PALETTES: BrandingPalette[] = [
  {
    name: "Uni-Inside's Color",
    primary: '#FBBF24',
    secondary: '#18181B',
    surface: '#FFFFFF',
    text: '#27272A',
  },
  {
    name: 'Ocean Breeze',
    primary: '#06B6D4',
    secondary: '#0F172A',
    surface: '#F8FAFC',
    text: '#1E293B',
  },
  {
    name: 'Forest Emerald',
    primary: '#10B981',
    secondary: '#1C1917',
    surface: '#FAFAF9',
    text: '#292524',
  },
  {
    name: 'Royal Violet',
    primary: '#8B5CF6',
    secondary: '#1E1B4B',
    surface: '#FAF5FF',
    text: '#2E1065',
  },
  {
    name: 'Sunset Coral',
    primary: '#F97316',
    secondary: '#1C1917',
    surface: '#FFFBEB',
    text: '#292524',
  },
];

export function Settings() {
  const { settings, updateSettings, fetchAllData, media } = useCMS();
  const [formData, setFormData] = useState({
    site_name: '',
    tagline: '',
    support_email: '',
    active_template: 'minimalist',
    theme_color: '#fbbf24',
    logo_url: '',
    footer_config: {
      social_links: [],
      quick_links: [],
      contact_info: { phone: '', whatsapp: '', email: '', service_hours: '' },
      location_embed_link: ''
    }
  });
  const [activePalette, setActivePalette] = useState<BrandingPalette>(PRESET_PALETTES[0]);
  const [paletteMode, setPaletteMode] = useState<'preset' | 'custom'>('preset');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'general' | 'footer'>('general');
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [pickerContext, setPickerContext] = useState<{ field: string, index?: number } | null>(null);
  const [homePreviewData, setHomePreviewData] = useState<{pageData: any, navPages: any[]}>({ pageData: null, navPages: [] });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting'>('idle');


  useEffect(() => {
    // Fetch home page to show in preview
    const fetchHomeInfo = async () => {
      try {
        // Find index or home
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/public/site/home`);
        if (res.ok) {
           const data = await res.json();
           setHomePreviewData({ pageData: data.page, navPages: data.navPages });
        } else {
           const resAlt = await fetch(`${import.meta.env.VITE_API_URL}/api/public/site/index`);
           if (resAlt.ok) {
               const data = await resAlt.json();
               setHomePreviewData({ pageData: data.page, navPages: data.navPages });
           }
        }
      } catch (err) {}
    }
    fetchHomeInfo();
  }, []);

  // Pre-fill form when data arrives from context
  useEffect(() => {
    if (settings) {
      setFormData({
        site_name: settings.site_name || '',
        tagline: settings.tagline || '',
        support_email: settings.global_options?.support_email || '',
        active_template: settings.active_template || 'minimalist',
        theme_color: settings.global_options?.theme_color || '#fbbf24',
        logo_url: settings.logo_url || '',
        footer_config: settings.global_options?.footer_config || {
          social_links: [],
          quick_links: [],
          contact_info: { phone: '', whatsapp: '', email: '', service_hours: '' },
          location_embed_link: ''
        }
      });
      // Restore palette from saved settings
      const savedPalette = settings.global_options?.branding_palette;
      if (savedPalette) {
        setActivePalette(savedPalette);
        // Check if it matches a preset
        const matchedPreset = PRESET_PALETTES.find(p => p.primary === savedPalette.primary && p.secondary === savedPalette.secondary);
        setPaletteMode(matchedPreset ? 'preset' : 'custom');
      }
    }
  }, [settings]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const openMediaPicker = (field: string, index?: number) => {
    setPickerContext({ field, index });
    setIsMediaPickerOpen(true);
  };

  const handleFooterChange = (section: string, field: string, value: any, index?: number) => {
    setFormData(prev => {
        const newFooter = { ...prev.footer_config };
        if (section === 'contact_info') {
            newFooter.contact_info = { ...newFooter.contact_info, [field]: value };
        } else if (section === 'social_links' || section === 'quick_links') {
            const listName = section as 'social_links' | 'quick_links';
            const arr = [...(newFooter[listName] as any[])];
            if (index !== undefined) {
                arr[index] = { ...arr[index], [field]: value };
            }
            newFooter[listName] = arr as any;
        } else {
            (newFooter as any)[section] = value;
        }
        return { ...prev, footer_config: newFooter };
    });
  };

  const addFooterItem = (section: 'social_links' | 'quick_links') => {
      setFormData(prev => {
          const newFooter = { ...prev.footer_config };
          if (section === 'social_links') {
              newFooter.social_links = [...newFooter.social_links, { icon: 'instagram', url: '' }];
          } else {
              if (newFooter.quick_links.length < 5) {
                  newFooter.quick_links = [...newFooter.quick_links, { label: '', url: '' }];
              }
          }
          return { ...prev, footer_config: newFooter };
      });
  };

  const removeFooterItem = (section: 'social_links' | 'quick_links', index: number) => {
      setFormData(prev => {
          const newFooter = { ...prev.footer_config };
          const arr = [...newFooter[section]];
          arr.splice(index, 1);
          newFooter[section] = arr as any;
          return { ...prev, footer_config: newFooter };
      });
  };

  const handlePaletteSelect = (palette: BrandingPalette) => {
    setActivePalette(palette);
    setPaletteMode('preset');
    // Also update theme_color to match primary for backward compatibility
    setFormData(prev => ({ ...prev, theme_color: palette.primary }));
  };

  const handleCustomColorChange = (key: keyof BrandingPalette, value: string) => {
    setActivePalette(prev => ({ ...prev, [key]: value }));
    setPaletteMode('custom');
    if (key === 'primary') {
      setFormData(prev => ({ ...prev, theme_color: value }));
    }
  };

  const resolveMapsUrl = (input: string) => {
    if (!input) return '';
    if (input.includes('<iframe')) {
        const match = input.match(/src="([^"]+)"/);
        return match ? match[1] : input;
    }
    return input;
  };

  const handleSave = async () => {
    setStatus('saving');
    
    // Sanitize Maps URL - Task 3
    const sanitizedFooter = { 
        ...formData.footer_config, 
        location_embed_link: resolveMapsUrl(formData.footer_config.location_embed_link) 
    };

    try {
        await updateSettings({
          ...formData,
          global_options: {
              ...settings?.global_options,
              footer_config: sanitizedFooter,
              branding_palette: activePalette,
              theme_color: activePalette.primary,
              support_email: formData.support_email
          }
        } as any);
        await fetchAllData();
        setStatus('saved');
        setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
        setStatus('error');
    }
  };

  const handleDownloadZip = async () => {
    setExportStatus('exporting');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/export/zip`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error('Export failed');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = res.headers.get('Content-Disposition');
      let fileName = 'site-source.zip';
      if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/);
          if (match) fileName = match[1];
      }
      
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('Gagal mendownload source code. Silakan coba lagi.');
    } finally {
      setExportStatus('idle');
    }
  };


  return (
    <div className="animate-in fade-in duration-500 space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 uppercase tracking-tight">Konfigurasi Sistem</h2>
          <p className="text-zinc-500 mt-1 font-medium">Kelola branding dasar, penempatan desain, dan informasi kontak.</p>
        </div>
        
        {status === 'saved' && (
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-100 animate-in slide-in-from-right-4 font-bold text-xs uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4" />
                Pengaturan Disimpan
            </div>
        )}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); setIsConfirmOpen(true); }} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Tabs */}
            <div className="lg:col-span-2">
              <div className="flex space-x-2 border-b border-zinc-200 mb-6 pb-2">
                <button type="button" onClick={() => setActiveTab('general')} className={`px-4 py-2 font-bold text-sm rounded-t-xl transition-all ${activeTab === 'general' ? 'text-amber-600 border-b-2 border-amber-500' : 'text-zinc-500 hover:text-zinc-800'}`}>Pengaturan Umum</button>
                <button type="button" onClick={() => setActiveTab('footer')} className={`px-4 py-2 font-bold text-sm rounded-t-xl transition-all ${activeTab === 'footer' ? 'text-amber-600 border-b-2 border-amber-500' : 'text-zinc-500 hover:text-zinc-800'}`}>Konfigurasi Footer</button>
              </div>

            {/* General Section */}
            {activeTab === 'general' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <Card className="p-8">
                    <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-amber-500" />
                        Identitas & Branding
                    </h3>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Logo Website</label>
                            <div className="flex gap-4 items-center">
                                <div className="w-16 h-16 rounded-xl border-2 border-dashed border-zinc-200 flex items-center justify-center bg-zinc-50 overflow-hidden cursor-pointer hover:border-amber-400 transition-colors" onClick={() => openMediaPicker('logo_url')}>
                                    {formData.logo_url ? <img src={formData.logo_url} alt="Logo" className="w-full h-full object-contain p-1" /> : <Image className="w-6 h-6 text-zinc-300" />}
                                </div>
                                <div className="flex-1">
                                    <input type="text" readOnly value={formData.logo_url} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg text-xs outline-none text-zinc-500 mb-2 cursor-not-allowed" placeholder="Pilih gambar dari Media..." />
                                    <button type="button" onClick={() => openMediaPicker('logo_url')} className="text-xs font-bold text-amber-600 hover:text-amber-700">Telusuri Media</button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Judul Website</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={formData.site_name} 
                                    onChange={e => handleInputChange('site_name', e.target.value)}
                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:bg-white focus:border-amber-400 outline-none transition-all font-bold text-zinc-900" 
                                    placeholder="Uni-Inside CMS" 
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Email Dukungan</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 pointer-events-none" />
                                    <input 
                                        type="email" 
                                        value={formData.support_email} 
                                        onChange={e => handleInputChange('support_email', e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:bg-white focus:border-amber-400 outline-none transition-all font-medium text-zinc-600" 
                                        placeholder="support@example.com" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Slogan (Tagline)</label>
                            <input 
                                type="text" 
                                value={formData.tagline} 
                                onChange={e => handleInputChange('tagline', e.target.value)}
                                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:bg-white focus:border-amber-400 outline-none transition-all font-medium text-zinc-600 italic" 
                                placeholder="The Next-Gen Headless Engine" 
                            />
                        </div>

                    </div>
                </Card>

                {/* Deployment Template */}
                <Card className="p-8">
                    <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-amber-500" />
                        Template Tampilan
                    </h3>
                    <div className="relative">
                        <Monitor className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 pointer-events-none" />
                        <select 
                            value={formData.active_template} 
                            onChange={e => handleInputChange('active_template', e.target.value)}
                            className="w-full pl-11 pr-10 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:bg-white focus:border-amber-400 outline-none transition-all appearance-none font-bold text-zinc-900 text-sm cursor-pointer"
                        >
                            <option value="minimalist">Konsep Minimalis (Bawaan Sistem)</option>
                            <option value="corporate">Paket Identitas Perusahaan</option>
                            <option value="creative">Mesin Kanvas Kreatif</option>
                            <option value="portfolio">Personal Portfolio</option>
                            <option value="blog">Classic Blog (Fokus Baca)</option>
                            <option value="newssimple">Simple News (Gaya Newspaper)</option>
                            <option value="gov">Instansi Pemerintah (Birokrasi Modern)</option>
                            <option value="legal">Firma Hukum (Eksklusif & Serius)</option>
                            <option value="medical">Healthcare (Klinik & Rumah Sakit)</option>
                            <option value="photo">Photography (Full Visual & Gelap)</option>
                            <option value="realestate">Real Estate (Modern & Arsitektur)</option>
                            <option value="resto">Restaurant (Warm & Elegant)</option>
                            <option value="saas">Software Startup (High-Tech & Vibrant)</option>
                            <option value="fintech">Finance Tech (Safe & Professional)</option>
                            <option value="industrial">Manufacturing (Industrial & Bold)</option>
                            <option value="event">Conference/Event (Vibrant & High-Energy)</option>
                            <option value="ngo">Non-Profit (Heartwarming & Impact)</option>
                            <option value="edu">Education (Academic & Formal)</option>
                            <option value="architect">Architecture (Brutalist & Sharp)</option>
                            <option value="vlog">Video Content (Dark & Immersive)</option>
                            <option value="beauty">Spa & Wellness (Pastel & Serene)</option>
                            <option value="travel">Tourism (Adventurous & Bright)</option>
                            <option value="retro">80s Vintage (Neon & Retro)</option>
                            <option value="brutalist">Brutalist (Raw & Rule-Breaking)</option>
                            <option value="glass">Glassmorphism (Frosted & Airy)</option>
                            <option value="cyber">Cyberpunk (Neon & Glitch)</option>
                        </select>
                    </div>
                </Card>

                {/* Branding Palettes */}
                <Card className="p-8">
                    <h3 className="text-lg font-bold text-zinc-900 mb-2 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-amber-500" />
                        Palet Merek / Warna
                    </h3>
                    <p className="text-zinc-400 text-xs font-medium mb-6">Pilih palet merek bawaan atau buat palet kustom. Warna akan diterapkan secara otomatis di seluruh template.</p>

                    {/* Preset Palette Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                        {PRESET_PALETTES.map((palette) => {
                            const isSelected = paletteMode === 'preset' && activePalette.name === palette.name;
                            return (
                                <button
                                    key={palette.name}
                                    type="button"
                                    onClick={() => handlePaletteSelect(palette)}
                                    className="group relative text-left rounded-2xl border-2 p-4 transition-all duration-200 hover:shadow-lg"
                                    style={{
                                        borderColor: isSelected ? palette.primary : '#e4e4e7',
                                        background: isSelected ? `${palette.primary}08` : '#fafafa',
                                    }}
                                >
                                    {isSelected && (
                                        <div className="absolute top-2 right-2">
                                            <CheckCircle2 className="w-5 h-5" style={{ color: palette.primary }} />
                                        </div>
                                    )}
                                    <div className="flex gap-1.5 mb-3">
                                        <div className="w-8 h-8 rounded-lg shadow-sm border border-black/5" style={{ background: palette.primary }} title="Primary" />
                                        <div className="w-8 h-8 rounded-lg shadow-sm border border-black/5" style={{ background: palette.secondary }} title="Secondary" />
                                        <div className="w-8 h-8 rounded-lg shadow-sm border border-zinc-200" style={{ background: palette.surface }} title="Surface" />
                                        <div className="w-8 h-8 rounded-lg shadow-sm border border-black/5" style={{ background: palette.text }} title="Text" />
                                    </div>
                                    <p className="font-bold text-sm text-zinc-800">{palette.name}</p>
                                    {palette.name === "Uni-Inside's Color" && (
                                        <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-bold uppercase tracking-widest text-amber-600">
                                            <Sparkles className="w-3 h-3" /> Direkomendasikan
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                        {/* Custom Palette Card */}
                        <button
                            type="button"
                            onClick={() => {
                                setPaletteMode('custom');
                                setActivePalette(prev => ({ ...prev, name: 'Custom' }));
                            }}
                            className="group relative text-left rounded-2xl border-2 p-4 transition-all duration-200 hover:shadow-lg"
                            style={{
                                borderColor: paletteMode === 'custom' ? activePalette.primary : '#e4e4e7',
                                background: paletteMode === 'custom' ? `${activePalette.primary}08` : '#fafafa',
                            }}
                        >
                            {paletteMode === 'custom' && (
                                <div className="absolute top-2 right-2">
                                    <CheckCircle2 className="w-5 h-5" style={{ color: activePalette.primary }} />
                                </div>
                            )}
                            <div className="flex gap-1.5 mb-3">
                                <div className="w-8 h-8 rounded-lg shadow-sm border-2 border-dashed border-zinc-300 flex items-center justify-center bg-white">
                                    <Palette className="w-4 h-4 text-zinc-400" />
                                </div>
                                <div className="w-8 h-8 rounded-lg shadow-sm border-2 border-dashed border-zinc-300 bg-white" />
                                <div className="w-8 h-8 rounded-lg shadow-sm border-2 border-dashed border-zinc-300 bg-white" />
                                <div className="w-8 h-8 rounded-lg shadow-sm border-2 border-dashed border-zinc-300 bg-white" />
                            </div>
                            <p className="font-bold text-sm text-zinc-800">Custom</p>
                            <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                                Buat Palet Sendiri
                            </span>
                        </button>
                    </div>

                    {/* Custom Color Editor - Only visible when Custom palette is selected */}
                    {paletteMode === 'custom' && (
                    <div className="border-t border-zinc-100 pt-6 animate-in fade-in slide-in-from-top-4 duration-300">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 ml-1 flex items-center gap-2">
                            <Palette className="w-3.5 h-3.5" /> Pilih Warna
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {([
                                { key: 'primary', label: 'Primary (Utama)' },
                                { key: 'secondary', label: 'Secondary (Sekunder)' },
                                { key: 'surface', label: 'Surface / Background' },
                                { key: 'text', label: 'Text (Teks)' },
                            ] as const).map(({ key, label }) => (
                                <div key={key}>
                                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">{label}</label>
                                    <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-100 rounded-xl px-3 py-2.5 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/10 transition-all">
                                        <label className="relative cursor-pointer flex-shrink-0">
                                            <div className="w-9 h-9 rounded-xl shadow-inner border border-black/10" style={{ background: activePalette[key] }} />
                                            <input
                                                type="color"
                                                value={activePalette[key]}
                                                onChange={(e) => handleCustomColorChange(key, e.target.value)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </label>
                                        <input
                                            type="text"
                                            value={activePalette[key]}
                                            onChange={(e) => handleCustomColorChange(key, e.target.value)}
                                            className="flex-1 bg-transparent outline-none font-mono text-xs uppercase text-zinc-700 font-bold"
                                            maxLength={7}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    )}

                    {/* Live Preview */}
                    <div className="mt-8 border-t border-zinc-100 pt-6">
                        <p className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 ml-1"><Eye className="w-3.5 h-3.5" /> Pratinjau Langsung Template</p>
                        
                        <div 
                            className="rounded-2xl overflow-hidden shadow-lg border border-zinc-200 relative pointer-events-none"
                            style={{ height: '400px', background: activePalette.surface }}
                        >
                            <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '200%' }}>
                                <div style={{
                                    '--primary': activePalette.primary,
                                    '--secondary': activePalette.secondary,
                                    '--bg-color': activePalette.surface,
                                    '--text-main': activePalette.text,
                                    '--primary-accent': activePalette.primary,
                                    minHeight: '100%',
                            background: 'var(--bg-color)', 
                            color: 'var(--text-main)',
                                } as React.CSSProperties}>
                                    <ErrorBoundary fallback={
                                        <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px] bg-red-50 text-red-500 rounded-lg">
                                            <h2 className="text-xl font-bold mb-2">Template Preview Error</h2>
                                            <p className="text-sm">There was a problem loading this template. Make sure the file exists and is valid.</p>
                                        </div>
                                    }>
                                        <Suspense fallback={
                                            <div className="flex items-center justify-center p-8 min-h-[400px]">
                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                                            </div>
                                        }>
                                            {(() => {
                                                const sharedProps = {
                                                    pageData: homePreviewData.pageData || { title: 'Home', page_type: 'home', content: { hero_title: 'Welcome to Uni-Inside', hero_subtitle: 'The best CMS' } },
                                                    postData: null,
                                                    posts: [],
                                                    settings: { ...settings, ...formData, global_options: { ...settings?.global_options, branding_palette: activePalette, footer_config: formData.footer_config, theme_color: activePalette.primary } },
                                                    themeColor: activePalette.primary,
                                                    navPages: homePreviewData.navPages.length ? homePreviewData.navPages : [{ title: 'Home', slug: 'home' }, { title: 'About', slug: 'about' }],
                                                    palette: activePalette,
                                                    currentSlug: 'home'
                                                };
                                                const activeTemplateKey = (formData.active_template || 'minimalist').toLowerCase();
                                                const SelectedTemplate = TemplateRegistry[activeTemplateKey] || TemplateRegistry['minimalist'];
                                                return <SelectedTemplate {...sharedProps} />;
                                            })()}
                                        </Suspense>
                                    </ErrorBoundary>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
              </div>
            )}

            {/* Footer Section */}
            {activeTab === 'footer' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <Card className="p-8">
                        <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                            <LayoutTemplate className="w-5 h-5 text-amber-500" />
                            Konfigurasi Footer
                        </h3>
                        

                        {/* Quick Links */}
                        <div className="mb-6 border-t border-zinc-100 pt-6">
                            <div className="flex justify-between items-center mb-2 ml-1">
                                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Tautan Cepat (Quick Links) - Max 5</label>
                                {formData.footer_config.quick_links.length < 5 && (
                                    <button type="button" onClick={() => addFooterItem('quick_links')} className="text-xs text-amber-600 font-bold flex items-center gap-1 hover:text-amber-700"><Plus className="w-3 h-3" /> Tambah Tautan</button>
                                )}
                            </div>
                            <div className="space-y-3">
                                {formData.footer_config.quick_links.map((link, idx) => (
                                    <div key={idx} className="flex gap-3">
                                        <input type="text" value={link.label} onChange={(e) => handleFooterChange('quick_links', 'label', e.target.value, idx)} className="flex-1 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg text-sm outline-none focus:border-amber-400" placeholder="Label (e.g. Profil)" />
                                        <input type="text" value={link.url} onChange={(e) => handleFooterChange('quick_links', 'url', e.target.value, idx)} className="flex-1 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg text-sm outline-none focus:border-amber-400" placeholder="URL (e.g. /profil)" />
                                        <button type="button" onClick={() => removeFooterItem('quick_links', idx)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash className="w-4 h-4" /></button>
                                    </div>
                                ))}
                                {formData.footer_config.quick_links.length === 0 && <p className="text-xs text-zinc-400 italic">Belum ada tautan ditambahkan.</p>}
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="mb-6 border-t border-zinc-100 pt-6">
                            <div className="flex justify-between items-center mb-2 ml-1">
                                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Ikon Media Sosial</label>
                                <button type="button" onClick={() => addFooterItem('social_links')} className="text-xs text-amber-600 font-bold flex items-center gap-1 hover:text-amber-700"><Plus className="w-3 h-3" /> Tambah Sosial</button>
                            </div>
                            <div className="space-y-3">
                                {formData.footer_config.social_links.map((social, idx) => (
                                    <div key={idx} className="flex gap-3 items-center">
                                        <select value={social.icon} onChange={(e) => handleFooterChange('social_links', 'icon', e.target.value, idx)} className="w-32 px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg text-sm outline-none focus:border-amber-400">
                                            <option value="instagram">Instagram</option>
                                            <option value="tiktok">TikTok</option>
                                            <option value="youtube">YouTube</option>
                                            <option value="facebook">Facebook</option>
                                            <option value="twitter">Twitter / X</option>
                                            <option value="linkedin">LinkedIn</option>
                                        </select>
                                        <input type="text" value={social.url} onChange={(e) => handleFooterChange('social_links', 'url', e.target.value, idx)} className="flex-1 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg text-sm outline-none focus:border-amber-400" placeholder="URL Lengkap..." />
                                        <button type="button" onClick={() => removeFooterItem('social_links', idx)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hubungi Kami */}
                        <div className="mb-6 border-t border-zinc-100 pt-6">
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 ml-1">Hubungi Kami</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" value={formData.footer_config.contact_info.phone} onChange={(e) => handleFooterChange('contact_info', 'phone', e.target.value)} className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg text-sm outline-none focus:border-amber-400" placeholder="Telepon (Misal: +62...)" />
                                <input type="text" value={formData.footer_config.contact_info.whatsapp} onChange={(e) => handleFooterChange('contact_info', 'whatsapp', e.target.value)} className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg text-sm outline-none focus:border-amber-400" placeholder="WhatsApp (Misal: +62...)" />
                                <input type="email" value={formData.footer_config.contact_info.email} onChange={(e) => handleFooterChange('contact_info', 'email', e.target.value)} className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg text-sm outline-none focus:border-amber-400" placeholder="Alamat Email" />
                                <input type="text" value={formData.footer_config.contact_info.service_hours} onChange={(e) => handleFooterChange('contact_info', 'service_hours', e.target.value)} className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg text-sm outline-none focus:border-amber-400" placeholder="Jam Operasional (Misal: Senin-Jumat, 09:00-17:00)" />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="border-t border-zinc-100 pt-6">
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Lokasi (Google Maps Embed URL)</label>
                            <div className="flex gap-2">
                                <MapPin className="w-5 h-5 text-zinc-400 mt-2 flex-shrink-0" />
                                <textarea 
                                    value={formData.footer_config.location_embed_link}
                                    onChange={(e) => handleFooterChange('location_embed_link', '', e.target.value)}
                                    className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:bg-white focus:border-amber-400 outline-none transition-all font-medium text-zinc-600 text-xs h-20 resize-none"
                                    placeholder="<iframe src='...'></iframe> OR just the src URL..."
                                />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-8">
                        <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                            <Eye className="w-5 h-5 text-amber-500" />
                            Pratinjau Footer
                        </h3>
                        <div className="bg-zinc-900 text-zinc-400 p-12 rounded-[2.5rem] text-xs space-y-4 font-mono shadow-xl overflow-hidden relative" style={{ color: activePalette.surface, background: activePalette.secondary }}>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                                <div>
                                    <h4 className="font-bold mb-4 text-sm" style={{ color: activePalette.primary }}>{formData.site_name || 'Logo / Judul'}</h4>
                                    <p className="opacity-70 leading-relaxed mb-6 text-[11px]">{formData.tagline || 'Tagline tertera di sini...'}</p>
                                    <div className="flex gap-3 items-center">
                                        {formData.footer_config.social_links.map((s, i) => (
                                           <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center opacity-80 transition-transform hover:scale-110" style={{ background: activePalette.surface, color: activePalette.secondary }}>
                                              {s.icon[0].toUpperCase()}
                                           </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-4 text-sm" style={{ color: activePalette.primary }}>Tautan Cepat</h4>
                                    <ul className="space-y-3 opacity-70 text-[11px]">
                                        {formData.footer_config.quick_links.map((link, idx) => (
                                            <li key={idx} className="hover:translate-x-1 transition-transform">→ {link.label || 'Tautan'}</li>
                                        ))}
                                        {formData.footer_config.quick_links.length === 0 && <li>- Belum ada tautan -</li>}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-4 text-sm" style={{ color: activePalette.primary }}>Hubungi Kami</h4>
                                    <div className="space-y-3 opacity-70 text-[11px]">
                                       <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {formData.footer_config.contact_info.phone || '+62...'}</p>
                                       <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {formData.footer_config.contact_info.whatsapp || '+62...'}</p>
                                       <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {formData.footer_config.contact_info.email || 'email@contoh.com'}</p>
                                       <p className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> {formData.footer_config.contact_info.service_hours || 'Senin-Jumat'}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-4 text-sm" style={{ color: activePalette.primary }}>Lokasi Kami</h4>
                                    {formData.footer_config.location_embed_link ? (
                                        <div className="w-full h-32 rounded-2xl overflow-hidden shadow-lg border" style={{ borderColor: `${activePalette.primary}33` }}>
                                            <iframe src={resolveMapsUrl(formData.footer_config.location_embed_link)} width="100%" height="100%" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                                        </div>
                                    ) : (
                                        <div className="w-full h-32 rounded-2xl flex items-center justify-center opacity-30 border border-dashed" style={{ borderColor: activePalette.primary, background: `${activePalette.surface}08` }}>Peta (Maps Embed)</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
            </div>

            {/* Sidebar Stats / Info */}
            <div className="space-y-6 lg:sticky lg:top-24 self-start">
                <Card className="p-6 bg-zinc-900 border-zinc-800">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-amber-400/10 flex items-center justify-center rounded-xl">
                            <Save className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">Simpan Perubahan</p>
                            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Terapkan ke Sistem</p>
                        </div>
                    </div>
                    
                    <button 
                        type="submit"
                        disabled={status === 'saving'}
                        className="w-full py-4 bg-amber-400 text-zinc-950 rounded-2xl font-bold hover:bg-amber-500 transition-all shadow-xl shadow-amber-400/10 active:scale-[0.98] disabled:opacity-50"
                    >
                        {status === 'saving' ? 'Memproses...' : 'Simpan Pengaturan'}
                    </button>

                    <button 
                        type="button"
                        onClick={handleDownloadZip}
                        disabled={exportStatus === 'exporting'}
                        className="w-full mt-4 py-4 bg-zinc-100 text-zinc-900 rounded-2xl font-bold hover:bg-zinc-200 transition-all border border-zinc-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <Download className="w-5 h-5 text-zinc-500" />
                        {exportStatus === 'exporting' ? 'Menyiapkan Kode...' : 'Download Source Code (ZIP)'}
                    </button>


                    <div className="mt-8 pt-6 border-t border-zinc-800 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Status Server</span>
                            <span className="text-green-500 text-[10px] font-bold uppercase">Online</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Palet Aktif</span>
                            <span className="text-zinc-300 text-[10px] font-bold">{activePalette.name || 'Kustom'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Terakhir Disinkron</span>
                            <span className="text-zinc-300 text-[10px] font-bold tabular-nums">Baru Saja</span>
                        </div>
                    </div>
                </Card>

                {/* Active Palette Summary */}
                <Card className="p-6">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Token Palet Aktif</p>
                    <div className="space-y-3">
                        {[
                            { label: '--primary', color: activePalette.primary },
                            { label: '--secondary', color: activePalette.secondary },
                            { label: '--bg-color', color: activePalette.surface },
                            { label: '--text-main', color: activePalette.text },
                        ].map(({ label, color }) => (
                            <div key={label} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-md border border-zinc-200 shadow-sm flex-shrink-0" style={{ background: color }} />
                                <div className="flex-1 min-w-0">
                                    <span className="text-[10px] font-mono font-bold text-zinc-500 block">{label}</span>
                                    <span className="text-xs font-mono text-zinc-800 uppercase">{color}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="px-4 text-center">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
                        Mengubah pengaturan global akan memperbarui semua tampilan secara langsung.
                    </p>
                </div>
            </div>

        </div>
      </form>

      {/* Media Picker Modal */}
      {isMediaPickerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col h-[80vh]">
                  <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                      <div>
                          <h2 className="text-xl font-bold text-zinc-900">Galeri Media</h2>
                          <p className="text-xs text-zinc-500 font-medium">Pilih aset untuk disisipkan.</p>
                      </div>
                      <button onClick={() => { setIsMediaPickerOpen(false); setPickerContext(null); }} className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-full transition-colors"><X className="w-6 h-6" /></button>
                  </div>
                  <div className="p-6 flex-1 overflow-y-auto">
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {(media as any[])?.map((m: any, idx: number) => (
                              <div 
                                  key={idx} 
                                  onClick={() => {
                                      if (pickerContext) {
                                          const { field, index } = pickerContext;
                                          if (index !== undefined) {
                                              handleInputChange(field, m.file_url || m.url);
                                          } else {
                                              handleInputChange(field, m.file_url || m.url);
                                          }
                                      }
                                      setIsMediaPickerOpen(false);
                                  }}
                                  className="group aspect-square rounded-2xl border-2 border-zinc-100 overflow-hidden cursor-pointer hover:border-amber-400 focus:border-amber-400 transition-all shadow-sm hover:shadow-md relative bg-zinc-50 flex items-center justify-center"
                              >
                                  {m.file_type?.startsWith('image/') ? (
                                      <img src={m.file_url || m.url} alt="Media" className="w-full h-full object-cover" />
                                  ) : (
                                      <div className="flex flex-col items-center justify-center p-4">
                                          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-zinc-200 flex items-center justify-center mb-3">
                                              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{m.file_type?.split('/')[1] || 'FILE'}</span>
                                          </div>
                                      </div>
                                  )}
                              </div>
                          ))}
                          {(!media || (media as any[]).length === 0) && (
                              <div className="col-span-full py-12 text-center text-zinc-500 text-sm">
                                  Belum ada media. Silakan unggah di Pintu Kaca terlebih dahulu.
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      )}
      {/* Confirmation Modal */}
      <ConfirmModal 
        isOpen={isConfirmOpen}
        title="Simpan Pengaturan"
        message="Simpan perubahan pada pengaturan situs?"
        confirmLabel="Simpan Perubahan"
        onConfirm={handleSave}
        onClose={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return <div className={`bg-white rounded-[2rem] border border-zinc-200 shadow-sm ${className}`}>{children}</div>;
}
