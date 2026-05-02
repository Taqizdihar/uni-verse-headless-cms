import React, { useState, useEffect, useRef } from 'react';
import { Zap, Eye, EyeOff, ChevronDown, Play, Loader2, Copy, Check, Terminal, AlertTriangle, Info } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const PRODUCTION_BASE_URL = 'https://uni-verse-headless-cms.onrender.com';

interface EndpointOption {
  label: string;
  method: 'GET' | 'POST';
  path: string;
  paramType?: 'slug' | 'id';
  paramLabel?: string;
  paramPlaceholder?: string;
  hasBody?: boolean;
  bodyTemplate?: string;
}

const ENDPOINT_OPTIONS: EndpointOption[] = [
  {
    label: 'Health Check',
    method: 'GET',
    path: '/api/v1/health',
  },
  {
    label: 'Pengaturan Situs',
    method: 'GET',
    path: '/api/v1/public/settings',
  },
  {
    label: 'Navigasi',
    method: 'GET',
    path: '/api/v1/public/navigation',
  },
  {
    label: 'Daftar Halaman',
    method: 'GET',
    path: '/api/v1/public/pages',
  },
  {
    label: 'Detail Halaman',
    method: 'GET',
    path: '/api/v1/public/pages/:slug',
    paramType: 'slug',
    paramLabel: 'Slug Halaman',
    paramPlaceholder: 'contoh: tentang-kami',
  },
  {
    label: 'Daftar Post/Berita',
    method: 'GET',
    path: '/api/v1/public/posts',
  },
  {
    label: 'Detail Post/Berita',
    method: 'GET',
    path: '/api/v1/public/posts/:slug',
    paramType: 'slug',
    paramLabel: 'Slug Post',
    paramPlaceholder: 'contoh: seminar-teknologi-2026',
  },
  {
    label: 'Daftar Komentar Post',
    method: 'GET',
    path: '/api/v1/public/posts/:id/comments',
    paramType: 'id',
    paramLabel: 'ID Post',
    paramPlaceholder: 'contoh: 10',
  },
  {
    label: 'Kirim Komentar Baru',
    method: 'POST',
    path: '/api/v1/public/posts/:id/comments',
    paramType: 'id',
    paramLabel: 'ID Post',
    paramPlaceholder: 'contoh: 10',
    hasBody: true,
    bodyTemplate: `{
  "author_name": "Budi Santoso",
  "author_email": "budi@example.com",
  "content": "Informasi yang sangat bermanfaat!"
}`,
  },
];

export function ApiSandbox() {
  const [apiKey, setApiKey] = useState('');
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [paramValue, setParamValue] = useState('');
  const [requestBody, setRequestBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<{ status: number; statusText: string; data: any; duration: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const responseRef = useRef<HTMLDivElement>(null);

  const selected = ENDPOINT_OPTIONS[selectedIdx];

  // Fetch existing API key on mount
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/settings/api-key`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setApiKey(data.api_key || '');
        }
      } catch {
        // Silently fail
      }
    };
    fetchApiKey();
  }, []);

  // Reset param & body when endpoint changes
  useEffect(() => {
    setParamValue('');
    setRequestBody(selected.bodyTemplate || '');
  }, [selectedIdx]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const buildUrl = (): string => {
    let path = selected.path;
    if (selected.paramType === 'slug') {
      path = path.replace(':slug', paramValue || ':slug');
    } else if (selected.paramType === 'id') {
      path = path.replace(':id', paramValue || ':id');
    }
    return `${PRODUCTION_BASE_URL}${path}`;
  };

  const handleExecute = async () => {
    // Validate param
    if (selected.paramType && !paramValue.trim()) {
      setError(`Parameter "${selected.paramLabel}" wajib diisi.`);
      setResponse(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    const url = buildUrl();
    const startTime = performance.now();

    try {
      const fetchOptions: RequestInit = {
        method: selected.method,
        headers: {
          'x-api-key': apiKey,
          ...(selected.method === 'POST' ? { 'Content-Type': 'application/json' } : {}),
        },
      };

      if (selected.hasBody && requestBody.trim()) {
        // Validate JSON before sending
        try {
          JSON.parse(requestBody);
        } catch {
          setError('Format JSON body tidak valid. Periksa kembali sintaks JSON Anda.');
          setIsLoading(false);
          return;
        }
        fetchOptions.body = requestBody;
      }

      const res = await fetch(url, fetchOptions);
      const duration = Math.round(performance.now() - startTime);

      let data: any;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        data,
        duration,
      });

      // Scroll response into view on mobile
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      const duration = Math.round(performance.now() - startTime);
      setError(err.message || 'Terjadi kesalahan jaringan.');
      setResponse({
        status: 0,
        statusText: 'Network Error',
        data: { error: err.message },
        duration,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (status >= 400 && status < 500) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    if (status >= 500) return 'bg-red-500/20 text-red-400 border-red-500/30';
    return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
  };

  const copyResponse = () => {
    if (!response) return;
    const text = typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2);
    navigator.clipboard.writeText(text);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const responseJson = response
    ? (typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2))
    : '';

  return (
    <div className="animate-in fade-in duration-500 space-y-8 pb-10">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
          Uji Coba API
        </h2>
        <p className="text-zinc-500 mt-1 font-medium">
          Jalankan permintaan API secara real-time dan lihat respon langsung dari server produksi.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* ==================== LEFT: REQUEST PANE ==================== */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-visible">
            {/* Section: API Key */}
            <div className="p-6 border-b border-zinc-100">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">
                Kunci API Rahasia
              </label>
              <div className="relative flex items-center">
                <input
                  type={isKeyVisible ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full pl-4 pr-24 py-3.5 bg-white border border-zinc-200 rounded-xl outline-none font-mono text-zinc-700 text-xs focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all shadow-sm"
                  placeholder="Masukkan API Key Anda..."
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setIsKeyVisible(!isKeyVisible)}
                    className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors rounded-lg hover:bg-zinc-100"
                  >
                    {isKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Section: Endpoint Selector */}
            <div className="p-6 border-b border-zinc-100">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">
                Aksi Endpoint
              </label>

              {/* Custom dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-left hover:border-amber-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      selected.method === 'GET'
                        ? 'bg-sky-100 text-sky-600'
                        : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {selected.method}
                    </span>
                    <span className="text-sm font-bold text-zinc-800">{selected.label}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-50 top-full mt-2 w-full bg-white rounded-xl border border-zinc-200 shadow-2xl shadow-zinc-200/50 py-2 max-h-72 overflow-y-auto">
                    {ENDPOINT_OPTIONS.map((ep, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedIdx(idx);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-amber-50 transition-colors ${
                          idx === selectedIdx ? 'bg-amber-50' : ''
                        }`}
                      >
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          ep.method === 'GET'
                            ? 'bg-sky-100 text-sky-600'
                            : 'bg-emerald-100 text-emerald-600'
                        }`}>
                          {ep.method}
                        </span>
                        <span className="text-sm font-semibold text-zinc-700">{ep.label}</span>
                        <code className="ml-auto text-[10px] text-zinc-400 font-mono hidden md:block">{ep.path}</code>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Resolved URL Preview */}
              <div className="mt-3 px-4 py-2.5 bg-zinc-900 rounded-xl">
                <code className="text-[11px] text-amber-400/90 font-mono break-all">{buildUrl()}</code>
              </div>
            </div>

            {/* Section: Dynamic Parameter */}
            {selected.paramType && (
              <div className="p-6 border-b border-zinc-100">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">
                  {selected.paramLabel}
                </label>
                <input
                  type="text"
                  value={paramValue}
                  onChange={(e) => setParamValue(e.target.value)}
                  className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-sm font-medium text-zinc-800 placeholder-zinc-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  placeholder={selected.paramPlaceholder}
                />
              </div>
            )}

            {/* Section: Request Body (POST only) */}
            {selected.hasBody && (
              <div className="p-6 border-b border-zinc-100">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">
                  Body Permintaan (JSON)
                </label>
                <textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  rows={7}
                  className="w-full px-4 py-3.5 bg-zinc-950 border border-zinc-800 rounded-xl outline-none text-sm font-mono text-green-400 placeholder-zinc-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all resize-none"
                  placeholder='{ "key": "value" }'
                />
              </div>
            )}

            {/* Execute Button */}
            <div className="p-6">
              <button
                type="button"
                onClick={handleExecute}
                disabled={isLoading}
                className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-zinc-950 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-amber-400/20 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Mengambil Data...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Jalankan Permintaan
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block mb-1">CORS & Dukungan</span>
                <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                  Permintaan dikirim langsung dari browser Anda ke server produksi. Pastikan server mengizinkan origin ini melalui konfigurasi CORS.
                  Jika Anda mengalami error CORS, hubungi administrator untuk menambahkan domain ini ke daftar yang diizinkan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== RIGHT: RESPONSE PANE ==================== */}
        <div ref={responseRef}>
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 shadow-xl overflow-hidden sticky top-8">
            {/* Terminal Title Bar */}
            <div className="px-5 py-3.5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="flex items-center gap-3">
                {response && (
                  <>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getStatusColor(response.status)}`}>
                      {response.status} {response.statusText}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {response.duration}ms
                    </span>
                  </>
                )}
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Respon Server</span>
              </div>
            </div>

            {/* Response Content */}
            <div className="relative min-h-[420px] max-h-[75vh] overflow-y-auto">
              {/* Copy button */}
              {response && (
                <button
                  type="button"
                  onClick={copyResponse}
                  className="absolute top-4 right-4 z-10 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-sm transition-all"
                  title="Salin Respon"
                >
                  {copiedResponse ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              )}

              {/* Idle State */}
              {!response && !error && !isLoading && (
                <div className="flex flex-col items-center justify-center h-[420px] text-center px-8">
                  <div className="w-20 h-20 rounded-3xl bg-zinc-800 flex items-center justify-center mb-6">
                    <Terminal className="w-9 h-9 text-zinc-600" />
                  </div>
                  <h4 className="text-lg font-bold text-zinc-400 mb-2">Menunggu Eksekusi</h4>
                  <p className="text-sm text-zinc-600 font-medium max-w-xs">
                    Pilih endpoint dan tekan <span className="text-amber-500 font-bold">"Jalankan Permintaan"</span> untuk melihat respon API secara real-time.
                  </p>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-[420px] text-center">
                  <div className="w-16 h-16 rounded-xl bg-amber-500/10 flex items-center justify-center mb-5 animate-pulse">
                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                  </div>
                  <h4 className="text-base font-bold text-zinc-300 mb-1">Mengirim Permintaan...</h4>
                  <p className="text-sm text-zinc-500 font-medium">Menghubungi server produksi</p>
                </div>
              )}

              {/* Error without response (validation errors) */}
              {error && !response && !isLoading && (
                <div className="flex flex-col items-center justify-center h-[420px] text-center px-8">
                  <div className="w-16 h-16 rounded-xl bg-red-500/10 flex items-center justify-center mb-5">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                  </div>
                  <h4 className="text-base font-bold text-red-400 mb-2">Validasi Gagal</h4>
                  <p className="text-sm text-zinc-400 font-medium">{error}</p>
                </div>
              )}

              {/* Response Data */}
              {response && !isLoading && (
                <div>
                  {/* Error banner for non-2xx */}
                  {(response.status < 200 || response.status >= 300) && (
                    <div className="mx-4 mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span className="text-xs text-red-300 font-bold">
                        {response.status === 0
                          ? 'Gagal terhubung ke server. Periksa koneksi atau konfigurasi CORS.'
                          : `Server mengembalikan status ${response.status} ${response.statusText}`}
                      </span>
                    </div>
                  )}
                  <div className="p-4">
                    <SyntaxHighlighter
                      language="json"
                      style={vscDarkPlus}
                      customStyle={{ margin: 0, padding: '1rem', background: 'transparent', fontSize: '12px', lineHeight: '1.6' }}
                      wrapLongLines
                    >
                      {responseJson}
                    </SyntaxHighlighter>
                  </div>
                </div>
              )}
            </div>

            {/* Terminal Footer */}
            <div className="px-5 py-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  isLoading ? 'bg-amber-500 animate-pulse' :
                  response && response.status >= 200 && response.status < 300 ? 'bg-green-500' :
                  response ? 'bg-red-500' :
                  'bg-zinc-600'
                }`}></div>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {isLoading ? 'mengirim...' :
                   response && response.status >= 200 && response.status < 300 ? 'berhasil' :
                   response ? 'gagal' :
                   'siap'}
                </span>
              </div>
              <span className="text-[10px] text-zinc-600 font-mono">UNI-VERSE API v1</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
