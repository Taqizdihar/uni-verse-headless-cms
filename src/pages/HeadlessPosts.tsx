// File: src/pages/HeadlessPosts.tsx
import React from 'react';
import { useHeadlessCms } from '@/context/HeadlessCmsContext';
import { Card, CardContent } from '@/components/ui/Card';
import { FileText, CheckCircle2, Clock } from 'lucide-react';

export function HeadlessPosts() {
  const { posts } = useHeadlessCms();

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-gray-400" />
          Standard Posts List
        </h2>
        <p className="text-gray-500 mt-1">Manage and view standard articles connected via standard REST data structures.</p>
      </div>

      <Card className="border border-gray-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-xs text-gray-500 bg-gray-50 uppercase tracking-wider font-bold border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-4 w-16">ID</th>
                  <th scope="col" className="px-6 py-4">Title & Excerpt</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right pr-6">Data Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      #{post.id}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 mb-1">{post.title}</p>
                      <p className="text-gray-500 text-xs truncate max-w-sm">{post.excerpt}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {post.status === 'published' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right pr-6">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                        REST API Ready
                      </span>
                    </td>
                  </tr>
                ))}
                
                {posts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500 italic">
                      No posts available within the system.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Visualizer for Post Structure */}
      <div className="bg-gray-900 rounded-lg p-5 font-mono text-xs text-blue-400 overflow-x-auto shadow-inner">
        <p className="text-gray-500 mb-2">// Active Posts Array (Structure sent to frontend clients)</p>
        <pre>{JSON.stringify(posts, null, 2)}</pre>
      </div>
    </div>
  );
}
