import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout as LayoutIcon, Mail, Lock, User, ShieldPlus, ArrowRight, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useCMS } from '../context/CMSContext';

export function Register() {
  const navigate = useNavigate();
  const { setToken, setUser } = useCMS();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      console.log('Sending data to backend...', { name, email, password });
      
      // 1. Register
      const regRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, 
        { name, email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      console.log('Registration success:', regRes.data);

      // 2. Immediate Login following registration
      const loginRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
      
      const { token, user } = loginRes.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);

      console.log('Provisioning complete. Redirecting to tenant setup.');
      navigate('/setup');
    } catch (err: any) {
      console.error('[FRONTEND ERROR] Provisioning failed:', err);
      const errMsg = err.response?.data?.error || 'Pendaftaran gagal. Silakan periksa data yang dimasukkan.';
      setError(errMsg);
      alert('Pendaftaran Gagal: ' + errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col justify-center items-center py-12 px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
          <div className="p-3 bg-amber-400 rounded-2xl text-black group-hover:scale-110 transition-transform">
              <LayoutIcon className="w-8 h-8" />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter uppercase">Uni-Inside</span>
        </Link>
        <h2 className="text-3xl font-black text-white tracking-tight">Buat Akun</h2>
        <p className="mt-2 text-sm text-gray-500 font-medium tracking-wide">Daftar sebagai administrator utama.</p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[440px]">
        <div className="bg-zinc-900/50 backdrop-blur-xl py-10 px-8 border border-zinc-800 rounded-[2.5rem] shadow-2xl">
          <form className="space-y-6" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs font-bold p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest ml-1 mb-2">Nama Lengkap</label>
              <div className="relative group">
                <input 
                  required 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="appearance-none block w-full px-5 py-4 bg-zinc-950 border border-zinc-800 text-white rounded-2xl placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all font-medium pl-12" 
                  placeholder="Misal: Budi Santoso"
                />
                <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-amber-400 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest ml-1 mb-2">Email</label>
              <div className="relative group">
                <input 
                  required 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="appearance-none block w-full px-5 py-4 bg-zinc-950 border border-zinc-800 text-white rounded-2xl placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all font-medium pl-12" 
                  placeholder="admin@uniinside.com"
                />
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-amber-400 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest ml-1 mb-2">Kata Sandi</label>
              <div className="relative group">
                <input 
                  required 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="appearance-none block w-full px-5 py-4 bg-zinc-950 border border-zinc-800 text-white rounded-2xl placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all font-medium pl-12" 
                  placeholder="••••••••"
                />
                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-amber-400 transition-colors" />
              </div>
            </div>

            <div>
              <button 
                disabled={loading}
                type="submit" 
                className="group w-full flex justify-center items-center gap-2 py-4 px-4 bg-amber-400 text-black text-sm font-black rounded-2xl hover:bg-amber-300 transition-all shadow-xl shadow-amber-400/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Memproses...' : 'Selesaikan Pendaftaran'}
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </form>
          <div className="mt-8 pt-8 border-t border-zinc-800 text-center text-sm">
            <span className="text-zinc-500 font-medium">Sudah memiliki akun? </span>
            <Link to="/login" className="font-bold text-amber-400 hover:text-amber-300 transition-all underline decoration-zinc-800 underline-offset-4">Masuk ke konsol</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
