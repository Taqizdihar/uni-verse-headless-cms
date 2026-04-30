import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Power, 
  PowerOff,
  UserCheck, 
  ShieldAlert,
  Loader2,
  Calendar,
  Globe
} from 'lucide-react';

interface Tenant {
  tenant_id: number;
  subdomain: string;
  created_at: string;
  status: 'active' | 'suspended';
  admin_id: number;
  admin_name: string;
  admin_email: string;
}

export function TenantManagement() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/superadmin/tenants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTenants(res.data);
    } catch (err) {
      console.error('Failed to fetch tenants:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (tenantId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const confirmMessage = currentStatus === 'active' 
        ? 'Apakah Anda yakin ingin menangguhkan (suspend) tenant ini? Semua user di bawah tenant ini tidak akan bisa login.'
        : 'Apakah Anda yakin ingin mengaktifkan kembali tenant ini?';
        
    if (!window.confirm(confirmMessage)) return;

    setActionLoading(tenantId);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/v1/superadmin/tenants/${tenantId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setTenants(prev => prev.map(t => t.tenant_id === tenantId ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error('Failed to update tenant status:', err);
      alert('Gagal memperbarui status tenant.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleImpersonate = async (adminId: number) => {
    if (!window.confirm('Anda akan mengambil alih sesi user ini. Lanjutkan?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/superadmin/impersonate/${adminId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const { token: impersonateToken, user } = res.data;
      
      // Override local storage with impersonated user
      localStorage.setItem('token', impersonateToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect to their dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Failed to impersonate:', err);
      alert('Gagal melakukan impersonate. Admin mungkin tidak valid.');
    }
  };

  const filteredTenants = tenants.filter(t => 
    t.subdomain?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.admin_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.admin_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-zinc-500 font-bold uppercase tracking-widest text-xs">Memuat Data Tenant...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8 max-w-7xl mx-auto">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className="text-3xl font-black text-white tracking-tight">Manajemen Tenant</h2>
           <p className="text-zinc-400 text-sm font-medium mt-1">Kelola status operasional dan sesi semua startup yang terdaftar.</p>
        </div>
        
        <div className="relative group w-full md:w-80">
          <input 
            type="text"
            placeholder="Cari subdomain atau nama admin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-3 pl-12 bg-zinc-900 border border-zinc-800 text-white rounded-2xl placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium text-sm"
          />
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
        </div>
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-md rounded-[2rem] border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-[10px] uppercase tracking-widest">
                <th className="px-8 py-5 font-black">Tenant & Subdomain</th>
                <th className="px-8 py-5 font-black">Admin Akun</th>
                <th className="px-8 py-5 font-black">Terdaftar Sejak</th>
                <th className="px-8 py-5 font-black">Status</th>
                <th className="px-8 py-5 font-black text-right">Aksi Super Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 text-sm text-zinc-300">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-zinc-500 font-medium">
                    Tidak ada tenant yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredTenants.map((tenant) => (
                  <tr key={tenant.tenant_id} className="hover:bg-zinc-800/20 transition-colors group">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                             <Globe className="w-5 h-5 text-emerald-500" />
                          </div>
                          <div>
                             <p className="font-bold text-white mb-0.5">{tenant.subdomain}</p>
                             <p className="text-xs text-zinc-500 font-mono flex items-center gap-1">
                                {tenant.subdomain}.uni-verse.id
                             </p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <p className="font-bold text-white mb-0.5">{tenant.admin_name || 'Tidak ada Admin'}</p>
                       <p className="text-xs text-zinc-500">{tenant.admin_email || '-'}</p>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2 text-zinc-400">
                         <Calendar className="w-4 h-4" />
                         <span>{new Date(tenant.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                         tenant.status === 'active' 
                           ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                           : 'bg-red-500/10 text-red-400 border-red-500/20'
                       }`}>
                         {tenant.status === 'active' ? (
                           <>
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Aktif
                           </>
                         ) : (
                           <>
                             <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Ditangguhkan
                           </>
                         )}
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center justify-end gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                         {tenant.admin_id && tenant.status === 'active' && (
                           <button
                             onClick={() => handleImpersonate(tenant.admin_id)}
                             className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-cyan-500 text-zinc-300 hover:text-black rounded-xl transition-all text-xs font-bold"
                             title="Impersonate (Masuk sebagai User)"
                           >
                             <UserCheck className="w-4 h-4" />
                             <span className="hidden lg:inline">Impersonate</span>
                           </button>
                         )}
                         
                         <button
                           onClick={() => toggleStatus(tenant.tenant_id, tenant.status)}
                           disabled={actionLoading === tenant.tenant_id}
                           className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-xs font-bold disabled:opacity-50 ${
                             tenant.status === 'active' 
                               ? 'bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white' 
                               : 'bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white'
                           }`}
                         >
                           {actionLoading === tenant.tenant_id ? (
                             <Loader2 className="w-4 h-4 animate-spin" />
                           ) : tenant.status === 'active' ? (
                             <>
                               <PowerOff className="w-4 h-4" />
                               <span className="hidden lg:inline">Suspend</span>
                             </>
                           ) : (
                             <>
                               <Power className="w-4 h-4" />
                               <span className="hidden lg:inline">Aktivasi</span>
                             </>
                           )}
                         </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
