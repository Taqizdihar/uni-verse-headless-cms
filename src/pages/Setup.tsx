import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Globe, Type, AlignLeft, Rocket, ChevronRight, AlertCircle, Layout as LayoutIcon } from 'lucide-react';
import axios from 'axios';
import { useCMS } from '../context/CMSContext';
import universeLogo from '../assets/logo/UNI-VERSE Logo V3.png';

export function Setup() {
  const navigate = useNavigate();
  const { setToken, setUser, fetchAllData } = useCMS();
  const [siteName, setSiteName] = useState('');
  const [tagline, setTagline] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Protect route
  useEffect(() => {
     const token = localStorage.getItem('token');
     const userStr = localStorage.getItem('user');
     const user = userStr ? JSON.parse(userStr) : null;
     
     if (!token) {
         navigate('/login');
     } else if (user && user.site_name && user.site_name !== 'My Site') {
         // If setup is already finished (site_name is not default), go to dashboard
         navigate('/dashboard');
     }
     // If has token but NO tenant_id, stay here to complete setup.
     // Never redirect back to /register from here if authenticated.
  }, [navigate]);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log(`[FRONTEND] Provisioning tenant: ${siteName}`);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/setup`, 
        { site_name: siteName, tagline },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const { token: newToken, user: newUser } = res.data;
      
      // Update token and user locally
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      
      // Force refresh of CMS data for the new tenant
      await fetchAllData();
      
      console.log(`[FRONTEND] Setup complete. Navigating to Dashboard.`);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('[FRONTEND ERROR] Setup failed:', err);
      setError(err.response?.data?.error || 'Inisialisasi gagal. Periksa ketersediaan subdomain.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col justify-center items-center py-12 px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <img src={universeLogo} alt="UNI-VERSE" className="h-12 w-auto object-contain" />
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">Pengaturan Awal</h2>
        <p className="mt-2 text-sm text-gray-500 font-medium tracking-wide">Konfigurasikan informasi dasar website Anda.</p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-zinc-900/50 backdrop-blur-xl py-10 px-8 border border-zinc-800 rounded-[2.5rem] shadow-2xl">
          <form className="space-y-6" onSubmit={handleSetup}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs font-bold p-4 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest ml-1 mb-2">Nama Website</label>
              <div className="relative group">
                <input 
                  required 
                  type="text" 
                  value={siteName} 
                  onChange={e => setSiteName(e.target.value)} 
                  className="appearance-none block w-full px-5 py-4 bg-zinc-950 border border-zinc-800 text-white rounded-2xl placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all font-medium pl-12" 
                  placeholder="Misal: Universitas Telkom" 
                />
                <Type className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-amber-400 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest ml-1 mb-2">Slogan</label>
              <div className="relative group">
                <input 
                  type="text" 
                  value={tagline} 
                  onChange={e => setTagline(e.target.value)} 
                  className="appearance-none block w-full px-5 py-4 bg-zinc-950 border border-zinc-800 text-white rounded-2xl placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all font-medium pl-12" 
                  placeholder="Menuju generasi berikutnya" 
                />
                <AlignLeft className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-amber-400 transition-colors" />
              </div>
            </div>


            <div className="pt-4">
              <button 
                disabled={loading}
                type="submit" 
                className="group w-full flex justify-center items-center gap-2 py-5 px-4 bg-amber-400 text-black text-sm font-black rounded-2xl hover:bg-amber-300 transition-all shadow-xl shadow-amber-400/10 active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Menginisialisasi...' : 'Selesaikan & Buka Konsol'}
                {!loading && <Rocket className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-8 text-center text-xs font-bold text-zinc-700 uppercase tracking-widest">
            Identitas Terverifikasi • Sistem Siap
        </p>
      </div>
    </div>
  );
}
