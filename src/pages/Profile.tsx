import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Camera, Save, Key, ShieldCheck, Loader2 } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

export function Profile() {
  const { user, setUser, token } = useCMS();
  const [profile, setProfile] = useState({ name: '', email: '', profile_picture_url: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [showPassForm, setShowPassForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const headers = { 
    'Authorization': `Bearer ${token || localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/profile`, { headers });
        setProfile(res.data);
      } catch (err) {
        console.error('Fetch profile error:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
        name: profile.name,
        email: profile.email
      }, { headers });
      
      // Update local user context
      const updatedUser = { ...user, name: profile.name, email: profile.email };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Gagal memperbarui profil.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/upload-avatar`, formData, {
        headers: { 
          ...headers, 
          'Content-Type': 'multipart/form-data' 
        }
      });
      const newUrl = res.data.url;
      setProfile(prev => ({ ...prev, profile_picture_url: newUrl }));
      
      // Update local context
      const updatedUser = { ...user, profile_picture_url: newUrl };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setMessage({ type: 'success', text: 'Foto profil berhasil diunggah!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Gagal mengunggah foto.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setMessage({ type: 'error', text: 'Konfirmasi kata sandi tidak cocok.' });
      return;
    }
    setIsChangingPass(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/user/change-password`, {
        currentPassword: passwords.current,
        newPassword: passwords.new
      }, { headers });
      
      setMessage({ type: 'success', text: 'Kata sandi berhasil diubah!' });
      setPasswords({ current: '', new: '', confirm: '' });
      setShowPassForm(false);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Gagal mengubah kata sandi.' });
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 w-full max-w-[1200px] space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Profil Saya</h2>
          <p className="text-zinc-500 font-medium italic mt-1">Kelola identitas digital dan keamanan akun Anda.</p>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 shadow-sm ${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? <ShieldCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          <span className="text-sm font-bold">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Row 1: Left (Photo) & Right (Identity) */}
        {/* Profile Card */}
        <Card className="lg:col-span-1 border-none shadow-2xl bg-white overflow-hidden rounded-xl flex flex-col">
          <div className="h-32 bg-amber-400 relative">
             <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-xl bg-zinc-100 border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden">
                    {profile.profile_picture_url ? (
                      <img src={profile.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-zinc-300" />
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-2.5 bg-zinc-900 text-white rounded-xl shadow-lg cursor-pointer hover:bg-zinc-800 transition-all border-2 border-white group-hover:scale-110">
                    <Camera className="w-5 h-5" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading} />
                  </label>
                </div>
             </div>
          </div>
          <CardContent className="pt-20 pb-8 text-center flex-1 flex flex-col justify-center">
            <h3 className="text-xl font-black text-zinc-900">{profile.name}</h3>
            <p className="text-zinc-500 font-medium text-sm">{profile.email}</p>
            <div className="mt-6 flex justify-center gap-2">
               <span className="px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-zinc-200">
                 {user?.role || 'Administrator'}
               </span>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form - Basic Identity */}
        <Card className="lg:col-span-2 border-none shadow-2xl bg-white rounded-xl flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-amber-500" /> Identitas Dasar
            </CardTitle>
            <CardDescription>Perbarui informasi publik dan kontak Anda.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                  <div className="relative group">
                    <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-amber-500 transition-colors" />
                    <input 
                      type="text" 
                      value={profile.name}
                      onChange={e => setProfile({...profile, name: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-bold text-zinc-900" 
                      placeholder="Nama Anda"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Alamat Email</label>
                  <div className="relative group">
                    <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-amber-500 transition-colors" />
                    <input 
                      type="email" 
                      value={profile.email}
                      onChange={e => setProfile({...profile, email: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-bold text-zinc-900" 
                      placeholder="email@contoh.com"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button 
                  disabled={isSaving}
                  type="submit" 
                  className="flex items-center gap-2 px-8 py-3 bg-zinc-900 text-white rounded-xl font-black text-sm hover:bg-zinc-800 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Row 2: Account Security (Full Width) */}
        <Card className="lg:col-span-3 border-none shadow-2xl bg-white overflow-hidden rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <div>
              <CardTitle className="flex items-center gap-2 font-black">
                <Key className="w-5 h-5 text-zinc-400" /> Keamanan Akun
              </CardTitle>
              <CardDescription>Kelola otentikasi dan integritas data Anda.</CardDescription>
            </div>
            <button 
              onClick={() => setShowPassForm(!showPassForm)}
              className={`text-xs font-black uppercase tracking-widest underline underline-offset-4 transition-colors ${showPassForm ? 'text-red-500' : 'text-amber-500'}`}
            >
              {showPassForm ? 'Batalkan' : 'Ubah Sandi'}
            </button>
          </CardHeader>
          {showPassForm && (
            <CardContent className="pt-0 animate-in fade-in slide-in-from-top-4">
              <form onSubmit={handlePasswordChange} className="p-6 bg-zinc-50 rounded-xl border border-zinc-100 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Sandi Saat Ini</label>
                      <input 
                        required
                        type="password" 
                        value={passwords.current}
                        onChange={e => setPasswords({...passwords, current: e.target.value})}
                        className="w-full px-5 py-3 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-bold text-zinc-900" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Sandi Baru</label>
                      <input 
                        required
                        type="password" 
                        value={passwords.new}
                        onChange={e => setPasswords({...passwords, new: e.target.value})}
                        className="w-full px-5 py-3 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-bold text-zinc-900" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Konfirmasi Sandi</label>
                      <input 
                        required
                        type="password" 
                        value={passwords.confirm}
                        onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                        className="w-full px-5 py-3 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-bold text-zinc-900" 
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      disabled={isChangingPass}
                      type="submit" 
                      className="flex items-center gap-2 px-8 py-3 bg-amber-400 text-zinc-950 rounded-xl font-black text-sm hover:bg-amber-300 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                    >
                      {isChangingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                      Konfirmasi Perubahan Sandi
                    </button>
                  </div>
              </form>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
