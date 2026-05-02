import React, { useState, useEffect } from 'react';
import { Terminal, Copy, Check, Eye, EyeOff, RefreshCw, Key, ShieldAlert } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { NotificationModal } from '../components/ui/NotificationModal';
import { ConfirmModal } from '../components/ui/ConfirmModal';

const PRODUCTION_BASE_URL = 'https://uni-verse-headless-cms.onrender.com';

const PUBLIC_ENDPOINTS = [
  { 
    name: 'Health Check', 
    method: 'GET', 
    path: '/api/v1/health', 
    desc: 'Mengecek apakah server dan database sedang aktif.',
    response: `{
  "success": true,
  "message": "Service is healthy"
}`
  },
  { 
    name: 'Pengaturan Global', 
    method: 'GET', 
    path: '/api/v1/public/settings', 
    desc: 'Mengambil data identitas situs (Logo, Nama, Tagline, dan Pengaturan Global).',
    response: `{
  "success": true,
  "data": {
    "site_name": "Uni-Inside",
    "site_tagline": "Portal Berita Terkini",
    "site_logo": "https://..."
  }
}`
  },
  { 
    name: 'Navigasi', 
    method: 'GET', 
    path: '/api/v1/public/navigation', 
    desc: 'Mengambil daftar menu untuk Navbar (Halaman yang ditandai masuk menu).',
    response: `{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Beranda",
      "slug": "beranda",
      "priority": 1,
      "status": "published"
    }
  ]
}`
  },
  { 
    name: 'Daftar Halaman', 
    method: 'GET', 
    path: '/api/v1/public/pages', 
    desc: 'Mengambil daftar semua halaman yang berstatus Published.',
    response: `{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Tentang Kami",
      "slug": "tentang-kami",
      "status": "published"
    }
  ]
}`
  },
  { 
    name: 'Detail Halaman', 
    method: 'GET', 
    path: '/api/v1/public/pages/:slug', 
    desc: 'Mengambil detail konten halaman (blok-blok JSON) berdasarkan slug-nya.',
    response: `{
  "success": true,
  "data": {
    "title": "Tentang Kami",
    "slug": "tentang-kami",
    "content": [
      {
        "id": "block-1",
        "type": "hero",
        "data": {
          "title": "Selamat Datang di Uni-Inside",
          "subtitle": "Temukan informasi terbaru."
        }
      }
    ]
  }
}`
  },
  { 
    name: 'Daftar Post/Berita', 
    method: 'GET', 
    path: '/api/v1/public/posts', 
    desc: 'Mengambil daftar berita/artikel yang berstatus Published.',
    response: `{
  "success": true,
  "data": [
    {
      "id": 10,
      "title": "Seminar Teknologi 2026",
      "slug": "seminar-teknologi-2026",
      "category": "Event",
      "excerpt": "Bergabunglah dengan kami dalam seminar...",
      "featured_image": "https://..."
    }
  ]
}`
  },
  { 
    name: 'Detail Post/Berita', 
    method: 'GET', 
    path: '/api/v1/public/posts/:slug', 
    desc: 'Mengambil isi lengkap berita berdasarkan slug.',
    response: `{
  "success": true,
  "data": {
    "title": "Seminar Teknologi 2026",
    "slug": "seminar-teknologi-2026",
    "category": "Event",
    "content": [
      {
        "type": "post_event",
        "data": {
          "location": "Auditorium Utama",
          "start_date": "2026-05-10T09:00:00Z"
        }
      }
    ]
  }
}`
  },
  {
    name: 'Daftar Komentar',
    method: 'GET',
    path: '/api/v1/public/posts/:id/comments',
    desc: 'Mengambil daftar komentar yang sudah disetujui untuk post tertentu.',
    response: `{
  "success": true,
  "data": [
    {
      "id": 1,
      "author_name": "Budi Santoso",
      "content": "Informasi yang sangat bermanfaat!",
      "created_at": "2026-04-30T08:00:00Z"
    }
  ]
}`
  },
  {
    name: 'Kirim Komentar',
    method: 'POST',
    path: '/api/v1/public/posts/:id/comments',
    desc: 'Mengirimkan komentar baru dari pengunjung website.',
    requestBody: `{
  "author_name": "Budi Santoso",
  "author_email": "budi@example.com",
  "content": "Informasi yang sangat bermanfaat!"
}`,
    response: `{
  "success": true,
  "message": "Komentar berhasil dikirim dan menunggu persetujuan."
}`
  }
];

export function ApiIntegration() {
  const [apiKey, setApiKey] = useState('');
  const [isKeyLoading, setIsKeyLoading] = useState(false);
  const [isKeyConfirmOpen, setIsKeyConfirmOpen] = useState(false);
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notification, setNotification] = useState({ title: '', message: '', type: 'success' as 'success' | 'warning' | 'info' });
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  useEffect(() => {
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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
          Panduan Integrasi API
        </h2>
        <p className="text-zinc-500 mt-1 font-medium">Pelajari cara menghubungkan dan mengintegrasikan frontend Anda ke API UNI-VERSE.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          {/* Base URL Card */}
          <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 shadow-xl text-white">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-500" />
              URL Dasar API Publik
            </h3>
            <p className="text-zinc-400 text-sm mb-6">Semua endpoint relatif terhadap URL dasar ini.</p>
            <div className="bg-zinc-950 rounded-xl px-5 py-4 flex items-center justify-between gap-3 border border-zinc-800/60">
              <code className="text-amber-400 font-mono text-sm font-bold break-all">{PRODUCTION_BASE_URL}</code>
              <button
                  type="button"
                  onClick={() => copyToClipboard(PRODUCTION_BASE_URL, '__base__')}
                  className={`flex-shrink-0 p-2.5 rounded-xl transition-all ${copiedEndpoint === '__base__' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'}`}
                  title="Salin URL Dasar"
              >
                  {copiedEndpoint === '__base__' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block mb-1">TIPS: Kebutuhan Headers</span>
                <p className="text-xs text-amber-200/70 font-medium">Hampir semua permintaan membutuhkan header <code className="bg-amber-500/20 px-1 py-0.5 rounded text-amber-300">x-api-key</code> untuk mengautentikasi aplikasi frontend.</p>
              </div>
            </div>
          </div>

          {/* Endpoints */}
          <h3 className="text-xl font-bold text-zinc-900 mt-10 mb-6">Dokumentasi Endpoint</h3>
          
          <div className="space-y-8">
            {PUBLIC_ENDPOINTS.map((ep: any, idx: number) => {
              const fullUrl = `${PRODUCTION_BASE_URL}${ep.path}`;
              const isCopiedSnippet = copiedEndpoint === `snippet_${idx}`;
              const isCopiedUrl = copiedEndpoint === `url_${idx}`;
              const isPost = ep.method === 'POST';
              
              const snippet = `fetch("${fullUrl}", {
  method: "${ep.method}",
  headers: {
    "x-api-key": "YOUR_API_KEY"${isPost ? ',\n    "Content-Type": "application/json"' : ''}
  }${isPost && ep.requestBody ? `,\n  body: JSON.stringify(${ep.requestBody.replace(/\n/g, '\n  ')})` : ''}
})
  .then(res => res.json())
  .then(data => console.log(data));`;

              return (
                <div key={idx} className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${
                          ep.method === 'GET' ? 'bg-sky-50 text-sky-600 border border-sky-100' : 
                          ep.method === 'POST' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                          'bg-red-50 text-red-600 border border-red-100'
                      }`}>
                          {ep.method}
                      </span>
                      <h4 className="text-lg font-bold text-zinc-900">{ep.name}</h4>
                    </div>
                  </div>
                  
                  <div className="p-6 pb-4">
                    <p className="text-zinc-500 text-sm font-medium mb-4">{ep.desc}</p>
                    
                    <div className="mb-4">
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Endpoint URL</label>
                      <div className="bg-zinc-50 rounded-xl px-4 py-3 flex items-center justify-between gap-3 border border-zinc-200">
                        <code className="text-zinc-700 font-mono text-xs font-medium break-all">{fullUrl}</code>
                        <button
                            type="button"
                            onClick={() => copyToClipboard(fullUrl, `url_${idx}`)}
                            className={`flex-shrink-0 p-2 rounded-lg transition-all ${isCopiedUrl ? 'bg-green-500/10 text-green-600' : 'bg-zinc-200/50 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200'}`}
                            title="Salin URL"
                        >
                            {isCopiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {ep.name === 'Navigasi' && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
                        <ShieldAlert className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest block mb-0.5">PERINGATAN</span>
                          <p className="text-xs text-yellow-800 font-medium">Selalu gunakan field <code className="font-mono bg-yellow-100 px-1 py-0.5 rounded">priority</code> untuk mengurutkan item navigasi dengan benar.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 bg-zinc-950 divide-y xl:divide-y-0 xl:divide-x divide-zinc-800">
                    {/* Left: Request */}
                    <div className="relative group">
                      <div className="absolute top-4 right-4 z-10">
                        <button
                          onClick={() => copyToClipboard(snippet, `snippet_${idx}`)}
                          className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all"
                          title="Salin Permintaan"
                        >
                          {isCopiedSnippet ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Contoh Permintaan (Fetch)</span>
                      </div>
                      <div className="p-4 overflow-x-auto text-sm">
                        <SyntaxHighlighter language="javascript" style={vscDarkPlus} customStyle={{ margin: 0, padding: 0, background: 'transparent' }}>
                          {snippet}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                    
                    {/* Right: Response */}
                    <div className="relative">
                      <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Respon Berhasil</span>
                      </div>
                      <div className="p-4 overflow-x-auto text-sm">
                        <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ margin: 0, padding: 0, background: 'transparent' }}>
                          {ep.response}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm sticky top-8">
            <h3 className="text-sm font-bold text-zinc-900 mb-2 flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-500" />
                Manajemen API Key
            </h3>
            <p className="text-zinc-500 text-xs font-medium mb-6">Kelola API key yang dibutuhkan untuk otorisasi frontend.</p>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Key Saat Ini</label>
                    <div className="relative flex items-center">
                        <input 
                            type={isKeyVisible ? "text" : "password"} 
                            readOnly
                            value={apiKey}
                            className="w-full pl-4 pr-12 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none font-mono text-zinc-700 text-xs" 
                            placeholder={isKeyLoading ? 'Memuat...' : 'Belum ada API Key'}
                        />
                        <button
                            type="button"
                            onClick={() => setIsKeyVisible(!isKeyVisible)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                        >
                            {isKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                
                <div className="flex gap-2">
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
                      className="flex-1 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                      <Copy className="w-4 h-4" />
                      Salin Key
                  </button>
                  <button 
                      type="button"
                      onClick={() => setIsKeyConfirmOpen(true)}
                      disabled={isKeyLoading}
                      className="flex-shrink-0 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center justify-center border border-red-100 disabled:opacity-50"
                      title="Regenerasi Key"
                  >
                      <RefreshCw className={`w-5 h-5 ${isKeyLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-100">
                <div className="flex items-start gap-3 bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-200/50">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                  <p className="text-[11px] font-medium leading-relaxed">
                    <strong>Catatan:</strong> Meregenerasi API Key akan langsung menonaktifkan key sebelumnya. Pastikan Anda memperbarui variabel lingkungan frontend Anda segera setelah regenerasi.
                  </p>
                </div>
            </div>
          </div>
        </div>
      </div>
      
      <ConfirmModal 
        isOpen={isKeyConfirmOpen}
        title="Regenerasi API Key"
        message="Peringatan: Meregenerasi API Key akan membuat aplikasi frontend Anda saat ini berhenti berfungsi hingga key diperbarui. Lanjutkan?"
        confirmLabel="Ya, Reset Key"
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
