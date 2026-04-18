// File: src/pages/Comments.tsx
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Check, Ban, Trash2, MessageSquare, User, Mail, ExternalLink } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { useSearch } from '@/context/SearchContext';

export function Comments() {
  const { comments, approveComment, markCommentAsSpam, deleteComment } = useCMS();
  const { searchQuery } = useSearch();
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Approved'>('All');

  const filteredComments = useMemo(() => {
    return comments
      .filter(comment => {
        if (activeTab === 'All') return true;
        return comment.status === activeTab;
      })
      .filter(comment => {
        const query = searchQuery.toLowerCase();
        return (
          comment.authorName.toLowerCase().includes(query) ||
          comment.authorEmail.toLowerCase().includes(query) ||
          comment.content.toLowerCase().includes(query) ||
          comment.postTitle.toLowerCase().includes(query)
        );
      });
  }, [comments, activeTab, searchQuery]);

  const tabs: ('All' | 'Pending' | 'Approved')[] = ['All', 'Pending', 'Approved'];
  const tabLabels: Record<string, string> = { All: 'Semua', Pending: 'Menunggu', Approved: 'Disetujui' };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-brand-black">Komentar</h2>
          <p className="text-gray-500 mt-1">Kelola dan moderasi komentar pengunjung di seluruh platform Anda.</p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl self-start">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab 
                  ? 'bg-white text-brand-black shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tabLabels[tab] || tab}
              {tab !== 'All' && (
                <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[10px] ${
                  tab === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}>
                  {comments.filter(c => c.status === tab).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <Card className="border-none shadow-sm shadow-gray-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-[10px] text-gray-400 uppercase bg-gray-50/50 font-bold tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">Penulis</th>
                  <th scope="col" className="px-6 py-4">Komentar</th>
                  <th scope="col" className="px-6 py-4">Sebagai Respons Untuk</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right pr-6">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredComments.length > 0 ? (
                  filteredComments.map((comment) => (
                    <tr key={comment.id} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                             <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-brand-black">{comment.authorName}</p>
                            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                              <Mail className="w-3 h-3" />
                              {comment.authorEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-gray-600 line-clamp-2 leading-relaxed italic">
                          "{comment.content}"
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">{comment.date}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-blue-600 font-bold hover:underline cursor-pointer">
                           <span className="truncate max-w-[120px]">{comment.postTitle}</span>
                           <ExternalLink className="w-3 h-3" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          comment.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                          comment.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          {comment.status === 'Approved' ? 'Disetujui' : comment.status === 'Pending' ? 'Menunggu' : 'Spam'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          {comment.status !== 'Approved' && (
                            <button 
                              onClick={() => approveComment(comment.id)}
                              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-all"
                              title="Setujui"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {comment.status !== 'Spam' && (
                            <button 
                              onClick={() => markCommentAsSpam(comment.id)}
                              className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-md transition-all"
                              title="Tandai sebagai Spam"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => { if(window.confirm('Hapus komentar ini?')) deleteComment(comment.id); }}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                            title="Hapus"
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
                       Tidak ada komentar.
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
