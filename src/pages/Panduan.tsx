import React from 'react';
import { BookOpen, Bot } from 'lucide-react';

export function Panduan() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-3">Pusat Panduan & Dokumentasi</h1>
        <p className="text-zinc-500 text-lg max-w-3xl leading-relaxed">
          Akses berbagai dokumen panduan untuk mengelola konten dan mengintegrasikan landing page Anda dengan UNI-VERSE.
        </p>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 flex flex-col hover:border-amber-400 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
          
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
            <BookOpen className="w-7 h-7" />
          </div>
          
          <h2 className="text-xl font-bold text-zinc-900 mb-3">Guidebook Penggunaan CMS</h2>
          <p className="text-zinc-500 leading-relaxed flex-grow mb-8">
            Panduan komprehensif langkah demi langkah bagi Admin dan anggota tim untuk mengelola konten, mengatur menu, dan memahami fitur-fitur operasional di panel UNI-VERSE.
          </p>
          
          <a 
            href="https://drive.google.com/file/d/1ZaUlAvkTbGGBH8zTmLKxSJhAPoPO7ik7/view?usp=sharing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3.5 bg-amber-400 text-zinc-950 font-bold rounded-xl hover:bg-amber-500 transition-colors shadow-sm w-full sm:w-auto self-start"
          >
            Buka Guidebook (PDF)
          </a>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 flex flex-col hover:border-indigo-400 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>

          <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            <Bot className="w-7 h-7" />
          </div>
          
          <h2 className="text-xl font-bold text-zinc-900 mb-3">Instruksi Master AI (Vibe Coding)</h2>
          <p className="text-zinc-500 leading-relaxed flex-grow mb-8">
            Koneksi landing page Anda ke CMS UNI-VERSE ini membutuhkan beberapa hal teknis, sehingga Anda sangat disarankan untuk menggunakan metode Vibe Coding untuk menghubungkan keduanya. File ini adalah cetak biru instruksi sistem agar AI Agent pilihan Anda dapat membangun frontend tanpa error.
          </p>
          
          <a 
            href="https://drive.google.com/file/d/1SzAV2VMSLJKbfM5VwkRgreYlmts65HsJ/view?usp=sharing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3.5 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 border border-indigo-100 hover:border-indigo-200 transition-colors shadow-sm w-full sm:w-auto self-start"
          >
            Unduh Panduan AI (.md)
          </a>
        </div>

      </div>
    </div>
  );
}
