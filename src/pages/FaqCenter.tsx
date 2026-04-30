import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HelpCircle, ChevronDown, Loader2 } from 'lucide-react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

function FaqItem({ faq }: { faq: FAQ }) {
  return (
    <details 
      className="group bg-[#ffffff] rounded-lg shadow-md overflow-hidden"
    >
      <summary 
        className="flex items-center justify-between p-5 w-full text-left outline-none cursor-pointer select-none transition-colors hover:bg-zinc-50 list-none [&::-webkit-details-marker]:hidden"
      >
        <div className="flex items-center gap-3 pr-4 min-w-0">
          <div className="p-2 rounded-xl transition-colors flex-shrink-0 group-open:bg-amber-100 group-open:text-amber-600 bg-amber-50 text-amber-500">
            <HelpCircle className="w-5 h-5" />
          </div>
          <span className="text-base font-bold text-amber-600 leading-snug">{faq.question}</span>
        </div>
        <div className="flex-shrink-0 text-zinc-400 transition-transform duration-300 group-open:rotate-180">
          <ChevronDown className="w-5 h-5" />
        </div>
      </summary>
      
      <div className="p-6 border-t border-zinc-100 bg-white">
        <div 
          className="prose prose-sm max-w-none text-zinc-600 leading-relaxed text-left"
          style={{ overflowWrap: 'break-word', wordBreak: 'normal' }}
          dangerouslySetInnerHTML={{ __html: faq.answer }}
        />
        {faq.category && (
          <div className="mt-4 pt-3 border-t border-zinc-100 inline-block">
            <span className="px-3 py-1 bg-zinc-100 text-zinc-500 text-[10px] font-black uppercase tracking-widest rounded-full">
              {faq.category}
            </span>
          </div>
        )}
      </div>
    </details>
  );
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
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
        <p className="mt-4 text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">Memuat Pusat FAQ...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto space-y-8">
      {/* Header - consistent with Halaman / Postingan modules */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Pusat Bantuan & FAQ</h2>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Temukan jawaban untuk pertanyaan umum terkait pengelolaan platform.</p>
        </div>
      </div>

      {faqs.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-zinc-200 rounded-[2rem] py-24 text-center">
          <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-10 h-10 text-zinc-200" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900">Belum ada FAQ yang tersedia</h3>
          <p className="text-zinc-500 mt-2 font-medium italic">FAQ akan muncul setelah Super Admin menambahkan konten.</p>
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          {faqs.map((faq) => (
            <FaqItem key={faq.id} faq={faq} />
          ))}
        </div>
      )}
    </div>
  );
}
