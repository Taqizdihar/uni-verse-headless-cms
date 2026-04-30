import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HelpCircle, ChevronDown, Loader2 } from 'lucide-react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export function FaqCenter() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/public/faqs`);
        setFaqs(res.data);
      } catch (err) {
        console.error('Failed to fetch FAQs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 border-4 text-emerald-500 animate-spin" />
        <p className="mt-4 text-zinc-500 font-bold uppercase tracking-widest text-xs">Memuat Pusat FAQ...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8 max-w-7xl mx-auto pb-20 px-4 md:px-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-emerald-500/10 rounded-2xl">
          <HelpCircle className="w-8 h-8 text-emerald-500" />
        </div>
        <div>
           <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Pusat Bantuan & FAQ</h2>
           <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mt-1">Temukan jawaban untuk pertanyaan umum terkait pengelolaan platform.</p>
        </div>
      </div>

      {faqs.length === 0 ? (
        <div className="p-12 text-center text-zinc-500 font-medium bg-white dark:bg-zinc-900/50 rounded-[2rem] border border-zinc-200 dark:border-zinc-800">
          Belum ada FAQ yang tersedia.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => {
            const isLastOdd = index === faqs.length - 1 && faqs.length % 2 !== 0;
            return (
              <details 
                key={faq.id} 
                className={`group bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all ${isLastOdd ? 'md:col-span-2 md:w-1/2 md:mx-auto' : ''}`}
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <div className="flex items-center gap-4 pr-4">
                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-400 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-colors">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-bold text-zinc-900 dark:text-white">{faq.question}</span>
                  </div>
                  <div className="flex-shrink-0 text-zinc-400 group-open:rotate-180 transition-transform duration-300">
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </summary>
                
                <div className="px-6 pb-6 pt-2 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed border-t border-zinc-100 dark:border-zinc-800/50 mt-2">
                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none prose-a:text-emerald-500"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                  {faq.category && (
                    <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/50 inline-block">
                      <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                        {faq.category}
                      </span>
                    </div>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}
