import React, { useState, useEffect } from 'react';
import { useCMS } from '../context/CMSContext';
import { Save, Globe, Mail, CheckCircle2, Eye, EyeOff, X, Image as ImageIcon, LayoutTemplate, MapPin, Phone, Link as LinkIcon, Plus, Trash, Key, Copy, RefreshCw, BookOpen, Check, ShieldCheck, ExternalLink } from 'lucide-react';

import { ConfirmModal } from '../components/ui/ConfirmModal';
import { NotificationModal } from '../components/ui/NotificationModal';

export function Settings() {
  const { settings, updateSettings, fetchAllData, media } = useCMS();
  const [formData, setFormData] = useState({
    site_name: '',
    tagline: '',
    support_email: '',
    logo_url: '',
    frontend_url: '',
    footer_config: {
      copyright_text: '',
      social_links: []
    }
  });

  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'general' | 'footer'>('general');
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [pickerContext, setPickerContext] = useState<{ field: string, index?: number } | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isKeyLoading, setIsKeyLoading] = useState(false);
  const [isKeyConfirmOpen, setIsKeyConfirmOpen] = useState(false);
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notification, setNotification] = useState({ title: '', message: '', type: 'success' as 'success' | 'warning' | 'info' });
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  // ─── Centralized Public Endpoint Definitions ──────────────────────
  const PRODUCTION_BASE_URL = 'https://uni-verse-headless-cms.onrender.com';

  const PUBLIC_ENDPOINTS = [
    { name: 'Health',        method: 'GET',  path: '/api/v1/health',                     auth: false, desc: 'Cek status server.' },
    { name: 'Settings',      method: 'GET',  path: '/api/v1/public/settings',            auth: true,  desc: 'Metadata & konfigurasi situs.' },
    { name: 'Navigation',    method: 'GET',  path: '/api/v1/public/navigation',          auth: true,  desc: 'Data menu navigasi.' },
    { name: 'Pages List',    method: 'GET',  path: '/api/v1/public/pages',               auth: true,  desc: 'Daftar halaman (terbit).' },
    { name: 'Page Detail',   method: 'GET',  path: '/api/v1/public/pages/:slug',         auth: true,  desc: 'Detail halaman berdasarkan slug.' },
    { name: 'Posts List',    method: 'GET',  path: '/api/v1/public/posts',               auth: true,  desc: 'Daftar post (terbit).' },
    { name: 'Post Detail',   method: 'GET',  path: '/api/v1/public/posts/:slug',         auth: true,  desc: 'Detail post berdasarkan slug.' },
    { name: 'Get Comments',  method: 'GET',  path: '/api/v1/public/posts/:id/comments',  auth: true,  desc: 'Komentar untuk sebuah post.' },
    { name: 'Post Comment',  method: 'POST', path: '/api/v1/public/posts/:id/comments',  auth: true,  desc: 'Kirim komentar baru.' },
  ];

  const copyEndpointUrl = (path: string) => {
    const fullUrl = `${PRODUCTION_BASE_URL}${path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedEndpoint(path);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  useEffect(() => {
    // Fetch API Key
    const fetchApiKey = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/settings/api-key`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
           const data = await res.json();
           setApiKey(data.api_key);
        }
      } catch (err) {
        console.error('Failed to fetch API key');
      }
    }
    fetchApiKey();
  }, []);

  // Pre-fill form when data arrives from context
  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setFormData({
        site_name: settings.site_name || '',
        tagline: settings.tagline || '',
        support_email: settings.global_options?.support_email || '',
        logo_url: settings.logo_url || '',
        frontend_url: settings.global_options?.frontend_url || '',
        footer_config: settings.global_options?.footer_config || {
          copyright_text: '',
          social_links: []
        }
      });
      setIsSettingsLoaded(true);
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
        if (section === 'social_links') {
            const arr = [...newFooter.social_links];
            if (index !== undefined) {
                arr[index] = { ...arr[index], [field]: value };
            }
            newFooter.social_links = arr;
        } else {
            (newFooter as any)[section] = value;
        }
        return { ...prev, footer_config: newFooter };
    });
  };

  const addFooterItem = (section: 'social_links') => {
      setFormData(prev => {
          const newFooter = { ...prev.footer_config };
          if (section === 'social_links') {
              newFooter.social_links = [...newFooter.social_links, { icon: 'instagram', url: '' }];
          }
          return { ...prev, footer_config: newFooter };
      });
  };

  const removeFooterItem = (section: 'social_links', index: number) => {
      setFormData(prev => {
          const newFooter = { ...prev.footer_config };
          const arr = [...newFooter[section]];
          arr.splice(index, 1);
          newFooter[section] = arr as any;
          return { ...prev, footer_config: newFooter };
      });
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
    
    try {
        await updateSettings({
          ...formData,
          global_options: {
              ...settings?.global_options,
              footer_config: formData.footer_config,
              frontend_url: formData.frontend_url,
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

  const handleRegenerateApiKey = async () => {
    setIsKeyConfirmOpen(false);
    setIsKeyLoading(true);
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/settings/api-key/regenerate`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
           const data = await res.json();
           setApiKey(data.api_key);
           setNotification({
               title: 'Berhasil',
               message: 'API Key berhasil diregenerasi!',
               type: 'success'
           });
           setIsNotificationOpen(true);
        }
    } catch (err) {
        setNotification({
            title: 'Gagal',
            message: 'Gagal meregenerasi API Key.',
            type: 'warning'
        });
        setIsNotificationOpen(true);
    } finally {
        setIsKeyLoading(false);
    }
  };

  if (!isSettingsLoaded) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in fade-in duration-500">
            <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Menyinkronkan Pengaturan...</p>
        </div>
    );
  }

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
        {/* Tabs moved outside the grid to align sidebar height properly */}
        <div className="flex space-x-2 border-b border-zinc-200 mb-6 pb-2">
          <button type="button" onClick={() => setActiveTab('general')} className={`px-4 py-2 font-bold text-sm rounded-t-xl transition-all ${activeTab === 'general' ? 'text-amber-600 border-b-2 border-amber-500' : 'text-zinc-500 hover:text-zinc-800'}`}>Pengaturan Umum</button>
          <button type="button" onClick={() => setActiveTab('footer')} className={`px-4 py-2 font-bold text-sm rounded-t-xl transition-all ${activeTab === 'footer' ? 'text-amber-600 border-b-2 border-amber-500' : 'text-zinc-500 hover:text-zinc-800'}`}>Konfigurasi Footer</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2">

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
                                    {formData.logo_url ? <img src={formData.logo_url} alt="Logo" className="w-full h-full object-contain p-1" /> : <ImageIcon className="w-6 h-6 text-zinc-300" />}
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

                        <div>
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Frontend URL</label>
                            <div className="relative">
                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 pointer-events-none" />
                                <input 
                                    type="url" 
                                    value={formData.frontend_url} 
                                    onChange={e => handleInputChange('frontend_url', e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:bg-white focus:border-amber-400 outline-none transition-all font-bold text-blue-600" 
                                    placeholder="https://uninside.app | kroombox.com | netlify.app | dll." 
                                />
                            </div>
                        </div>

                    </div>
                </Card>

                {/* Akses API */}
                <Card className="p-8">
                    <h3 className="text-lg font-bold text-zinc-900 mb-2 flex items-center gap-2">
                        <Key className="w-5 h-5 text-amber-500" />
                        Akses API
                    </h3>
                    <p className="text-zinc-400 text-xs font-medium mb-6">Kelola kunci API untuk menghubungkan aplikasi frontend Anda dengan Headless CMS ini.</p>
                    
                    <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Current API Key</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 pointer-events-none" />
                                <input 
                                    type={isKeyVisible ? "text" : "password"} 
                                    readOnly
                                    value={apiKey}
                                    className="w-full pl-11 pr-12 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none font-mono text-zinc-700 text-sm" 
                                    placeholder={isKeyLoading ? 'Memuat...' : 'Belum ada API Key'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsKeyVisible(!isKeyVisible)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                                    title={isKeyVisible ? "Sembunyikan Key" : "Tampilkan Key"}
                                >
                                    {isKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <button 
                                type="button"
                                onClick={() => { 
                                    navigator.clipboard.writeText(apiKey); 
                                    setNotification({
                                        title: 'Disalin',
                                        message: 'API Key berhasil disalin ke papan klip.',
                                        type: 'success'
                                    });
                                    setIsNotificationOpen(true);
                                }}
                                className="px-4 py-3 bg-zinc-100 text-zinc-600 rounded-xl font-bold hover:bg-zinc-200 transition-all flex items-center justify-center border border-zinc-200"
                                title="Salin Key"
                            >
                                <Copy className="w-5 h-5" />
                            </button>
                            <button 
                                type="button"
                                onClick={() => setIsKeyConfirmOpen(true)}
                                disabled={isKeyLoading}
                                className="px-4 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center justify-center border border-red-100 disabled:opacity-50"
                                title="Regenerasi Key"
                            >
                                <RefreshCw className={`w-5 h-5 ${isKeyLoading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-zinc-100">
                        <h4 className="text-sm font-bold text-zinc-900 mb-1 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-amber-500" />
                            Dokumentasi API Publik
                        </h4>
                        <p className="text-zinc-400 text-xs font-medium mb-5">Referensi lengkap endpoint yang tersedia untuk aplikasi frontend Anda.</p>

                        {/* Authentication Reminder */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/60 rounded-2xl p-5 mb-5">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 bg-blue-500/10 flex items-center justify-center rounded-xl flex-shrink-0 mt-0.5">
                                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-blue-900 mb-1">Header Autentikasi Diperlukan</p>
                                    <p className="text-xs text-blue-700/80 leading-relaxed mb-3">
                                        Semua endpoint (kecuali <code className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-800 font-mono text-[10px]">/health</code>) memerlukan header <code className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-800 font-mono text-[10px]">x-api-key</code>.
                                    </p>
                                    <div className="bg-zinc-900 rounded-lg px-4 py-2.5 font-mono text-xs flex items-center justify-between gap-3">
                                        <code className="text-blue-300 truncate">x-api-key: <span className="text-amber-400">{apiKey ? (isKeyVisible ? apiKey : '••••••••••••••••') : 'YOUR_API_KEY'}</span></code>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigator.clipboard.writeText(`x-api-key: ${apiKey}`);
                                                setNotification({ title: 'Disalin', message: 'Header autentikasi berhasil disalin.', type: 'success' });
                                                setIsNotificationOpen(true);
                                            }}
                                            className="text-zinc-500 hover:text-white transition-colors flex-shrink-0"
                                            title="Salin Header"
                                        >
                                            <Copy className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Base URL */}
                        <div className="bg-zinc-900 rounded-xl px-5 py-3.5 mb-4 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Production Base URL</span>
                                <code className="text-amber-400 font-mono text-sm font-bold break-all">{PRODUCTION_BASE_URL}</code>
                            </div>
                            <button
                                type="button"
                                onClick={() => { navigator.clipboard.writeText(PRODUCTION_BASE_URL); setCopiedEndpoint('__base__'); setTimeout(() => setCopiedEndpoint(null), 2000); }}
                                className={`flex-shrink-0 p-2.5 rounded-xl transition-all ${copiedEndpoint === '__base__' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'}`}
                                title="Salin Base URL"
                            >
                                {copiedEndpoint === '__base__' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>

                        {/* Endpoint List */}
                        <div className="space-y-2">
                            {PUBLIC_ENDPOINTS.map((ep) => {
                                const fullUrl = `${PRODUCTION_BASE_URL}${ep.path}`;
                                const isCopied = copiedEndpoint === ep.path;
                                return (
                                    <div
                                        key={`${ep.method}-${ep.path}`}
                                        className="group bg-zinc-900 rounded-xl border border-zinc-800/60 hover:border-zinc-700 transition-all overflow-hidden"
                                    >
                                        <div className="flex items-center gap-3 px-4 py-3">
                                            {/* Method Badge */}
                                            <span className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                                ep.method === 'POST'
                                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                                    : 'bg-sky-500/15 text-sky-400 border border-sky-500/20'
                                            }`}>
                                                {ep.method}
                                            </span>

                                            {/* URL */}
                                            <div className="flex-1 min-w-0">
                                                <code className="font-mono text-xs text-zinc-300 break-all leading-relaxed select-all">{fullUrl}</code>
                                            </div>

                                            {/* Auth Badge */}
                                            {ep.auth ? (
                                                <span className="flex-shrink-0 hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/15">
                                                    <Key className="w-2.5 h-2.5" /> Key
                                                </span>
                                            ) : (
                                                <span className="flex-shrink-0 hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/15">
                                                    Public
                                                </span>
                                            )}

                                            {/* Copy Button */}
                                            <button
                                                type="button"
                                                onClick={() => copyEndpointUrl(ep.path)}
                                                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                                                    isCopied
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-700 active:scale-95'
                                                }`}
                                                title={isCopied ? 'Disalin!' : 'Salin URL'}
                                            >
                                                {isCopied ? <><Check className="w-3.5 h-3.5" /> <span>Copied!</span></> : <><Copy className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Copy</span></>}
                                            </button>
                                        </div>

                                        {/* Description Row */}
                                        <div className="px-4 pb-3 flex items-center gap-2">
                                            <span className="text-[11px] text-zinc-500 font-medium">{ep.name}</span>
                                            <span className="text-zinc-700">·</span>
                                            <span className="text-[11px] text-zinc-600">{ep.desc}</span>
                                        </div>
                                    </div>
                                );
                            })}
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
                        

                        {/* Copyright Text */}
                        <div className="mb-6">
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Teks Hak Cipta (Copyright Text)</label>
                            <input 
                                type="text" 
                                value={formData.footer_config.copyright_text} 
                                onChange={(e) => handleFooterChange('copyright_text', '', e.target.value)}
                                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:bg-white focus:border-amber-400 outline-none transition-all font-medium text-zinc-600" 
                                placeholder="© 2026 Uni-Inside. All rights reserved." 
                            />
                        </div>

                        {/* Social Media */}
                        <div className="border-t border-zinc-100 pt-6">
                            <div className="flex justify-between items-center mb-4 ml-1">
                                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Ikon Media Sosial</label>
                                <button type="button" onClick={() => addFooterItem('social_links')} className="text-xs text-amber-600 font-bold flex items-center gap-1 hover:text-amber-700"><Plus className="w-3 h-3" /> Tambah Sosial</button>
                            </div>
                            <div className="space-y-3">
                                {formData.footer_config.social_links.map((social, idx) => (
                                    <div key={idx} className="flex gap-3 items-center animate-in slide-in-from-top-2 duration-200">
                                        <select value={social.icon} onChange={(e) => handleFooterChange('social_links', 'icon', e.target.value, idx)} className="w-32 px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg text-sm outline-none focus:border-amber-400 font-bold">
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
                                {formData.footer_config.social_links.length === 0 && <p className="text-xs text-zinc-400 italic ml-1">Belum ada media sosial ditambahkan.</p>}
                            </div>
                        </div>
                    </Card>

                    <Card className="p-8">
                        <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                            <Eye className="w-5 h-5 text-amber-500" />
                            Pratinjau Footer
                        </h3>
                        <div className="bg-zinc-900 text-zinc-400 p-12 rounded-[2.5rem] text-xs space-y-4 font-mono shadow-xl overflow-hidden relative">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-zinc-800 pt-12 mt-12">
                                <div>
                                    <h4 className="font-bold mb-4 text-sm text-amber-400">{formData.site_name || 'Logo / Judul'}</h4>
                                    <p className="opacity-70 leading-relaxed mb-6 text-[11px] max-w-xs">{formData.tagline || 'Tagline tertera di sini...'}</p>
                                    <div className="flex gap-3 items-center">
                                        {formData.footer_config.social_links.map((s, i) => (
                                           <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center opacity-80 transition-transform hover:scale-110 bg-zinc-800 text-amber-400 border border-zinc-700">
                                              {s.icon[0].toUpperCase()}
                                           </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-center md:text-right">
                                    <p className="opacity-50 text-[10px] uppercase tracking-widest mb-2">Didukung oleh UNI-VERSE CMS</p>
                                    <p className="text-zinc-300 font-bold">{formData.footer_config.copyright_text || `© ${new Date().getFullYear()} ${formData.site_name || 'My Site'}. All rights reserved.`}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
            </div>

            {/* Sidebar Stats / Info */}
            <div className="space-y-6">
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

                    <div className="mt-8 pt-6 border-t border-zinc-800 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Status Server</span>
                            <span className="text-green-500 text-[10px] font-bold uppercase">Online</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Terakhir Disinkron</span>
                            <span className="text-zinc-300 text-[10px] font-bold tabular-nums">Baru Saja</span>
                        </div>
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
      
      <ConfirmModal 
        isOpen={isKeyConfirmOpen}
        title="Regenerasi API Key"
        message="Peringatan: Regenerasi API Key akan membuat aplikasi frontend lama Anda berhenti berfungsi sampai Key diperbarui. Lanjutkan?"
        confirmLabel="Ya, Reset Kunci"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={handleRegenerateApiKey}
        onClose={() => setIsKeyConfirmOpen(false)}
      />

      <NotificationModal 
        isOpen={isNotificationOpen}
        title={notification.title}
        message={notification.message}
        type={notification.type}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return <div className={`bg-white rounded-[2rem] border border-zinc-200 shadow-sm ${className}`}>{children}</div>;
}
