// File: src/pages/Users.tsx
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Plus, Pencil, Trash2, User as UserIcon, Mail, ShieldCheck } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { useSearch } from '@/context/SearchContext';

export function Users() {
  const { users, addUser, deleteUser } = useCMS();
  const { searchQuery } = useSearch();

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handleAddUser = () => {
    const randomId = Math.floor(Math.random() * 1000);
    addUser({
      name: `New Creator ${randomId}`,
      email: `creator.${randomId}@uni-inside.id`,
      role: 'Content Creative',
      status: 'Active'
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-brand-black text-white';
      case 'Content Creative':
        return 'bg-blue-100 text-blue-700';
      case 'Guest':
        return 'bg-gray-100 text-gray-500';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-brand-black">Pengguna</h2>
          <p className="text-gray-500 mt-1">Kelola anggota tim dan peran mereka.</p>
        </div>
        <button 
          onClick={handleAddUser}
          className="flex items-center gap-2 bg-brand-yellow text-brand-black px-4 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-all shadow-sm group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Tambah Pengguna
        </button>
      </div>

      <Card className="border-none shadow-sm shadow-gray-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-[10px] text-gray-400 uppercase bg-gray-50/50 font-bold tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">Pengguna</th>
                  <th scope="col" className="px-6 py-4">Peran</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4">Login Terakhir</th>
                  <th scope="col" className="px-6 py-4 text-right pr-6">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.user_id || user.id} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                            user.role === 'Admin' ? 'bg-brand-yellow text-brand-black' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {(user.name || 'U').charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-brand-black">{user.name}</p>
                            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getRoleBadgeColor(user.role)}`}>
                          {user.role === 'Admin' && <ShieldCheck className="w-3 h-3" />}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' || !user.status ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className={`text-[10px] font-bold uppercase ${user.status === 'Active' || !user.status ? 'text-green-700' : 'text-gray-400'}`}>
                            {user.status === 'Active' || !user.status ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 font-medium tabular-nums">
                        {user.lastLogin || 'Belum Pernah'}
                      </td>
                      <td className="px-6 py-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { if(window.confirm(`Hapus pengguna ${user.name}?`)) deleteUser(user.user_id || user.id); }}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                        Pengguna tidak ditemukan.
                      </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
