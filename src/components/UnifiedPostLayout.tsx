import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Clock, MapPin, Calendar } from 'lucide-react';

interface UnifiedPostLayoutProps {
  postData: any;
  palette?: any;
  currentSlug?: string;
}

const fixImg = (url: string) => {
    const BASE_URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL}`;
    return url && url.startsWith('/uploads') ? `${BASE_URL}${url}` : url;
};

export default function UnifiedPostLayout({ postData, palette }: UnifiedPostLayoutProps) {
  const navigate = useNavigate();
  const p = palette || { 
      primary: 'var(--primary, #fbbf24)', 
      secondary: 'var(--secondary, #18181b)', 
      surface: 'var(--bg-color, #ffffff)', 
      text: 'var(--text-main, #27272a)' 
  };
  
  const type = postData?.category?.toLowerCase() === 'event' ? 'event' : (postData?.post_type || postData?.page_type || 'news');
  const c = postData?.content || {};

  const handleBack = (e: React.MouseEvent) => {
      e.preventDefault();
      navigate(-1);
  };
  
  if (type === 'event') {
    return (
      <article style={{ maxWidth: '900px', margin: '0 auto', padding: '6rem 2rem', fontFamily: 'inherit' }}>
         <a href="#" onClick={handleBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: p.primary, textDecoration: 'none', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            &larr; Kembali
         </a>
         {c.featured_image && (
             <img src={fixImg(c.featured_image)} alt={postData.title} style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover', borderRadius: '1.5rem', marginBottom: '3rem', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
         )}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
               <span style={{ display: 'inline-block', padding: '0.4rem 1rem', background: p.primary, color: p.surface, borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>Acara Khusus</span>
               <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', color: p.text, marginBottom: '1.5rem', margin: 0 }}>{postData.title}</h1>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', background: `${p.text}08`, padding: '2.5rem', borderRadius: '1.5rem', border: `1px solid ${p.text}11` }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 800, color: `${p.text}88`, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                     <Calendar size={18} color={p.primary} /> Tanggal & Waktu
                  </span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: p.text, paddingLeft: '1.75rem' }}>{c.event_date ? new Date(c.event_date).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' }) : 'Menunggu Jadwal'}</span>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 800, color: `${p.text}88`, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                     <MapPin size={18} color={p.primary} /> Lokasi Acara
                  </span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: p.text, paddingLeft: '1.75rem' }}>{c.event_location || 'Akan diumumkan'}</span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center' }}>
                  {c.registration_link && (
                     <a href={c.registration_link} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', justifyContent: 'center', width: '100%', padding: '1rem 2.5rem', background: p.primary, color: p.surface, borderRadius: '99px', fontSize: '0.9rem', fontWeight: 800, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: `0 10px 30px ${p.primary}44`, transition: 'transform 0.2s', marginTop: '1rem' }} onMouseOver={(e)=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={(e)=>e.currentTarget.style.transform='translateY(0)'}>
                        Daftar Sekarang
                     </a>
                  )}
               </div>
            </div>

            <div style={{ fontSize: '1.1rem', lineHeight: 1.8, color: `${p.text}cc`, marginTop: '1rem' }} className="prose prose-lg max-w-none prose-invert" dangerouslySetInnerHTML={{ __html: c.event_description || c.body || '' }} />
         </div>
      </article>
    );
  }

  // News Layout
  return (
    <article style={{ maxWidth: '850px', margin: '0 auto', padding: '6rem 2rem', fontFamily: 'inherit' }}>
       <a href="#" onClick={handleBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: p.primary, textDecoration: 'none', marginBottom: '3rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          &larr; Kembali
       </a>
       <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          {postData.category && <span style={{ display: 'inline-block', padding: '0.4rem 1.25rem', border: `2px solid ${p.primary}`, color: p.primary, borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem' }}>{postData.category}</span>}
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.03em', color: p.text, marginBottom: '2rem', margin: '0 auto', maxWidth: '95%' }}>{postData.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.9rem', color: `${p.text}88`, fontWeight: 600 }}>
             {c.author && <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={16} /> Ditulis oleh {c.author}</span>}
             <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} /> {postData.created_at ? new Date(postData.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' }) : new Date().toLocaleDateString('id-ID')}</span>
          </div>
       </header>
       {c.featured_image && (
           <img src={fixImg(c.featured_image)} alt={postData.title} style={{ width: '100%', height: 'auto', maxHeight: '550px', objectFit: 'cover', borderRadius: '1.5rem', marginBottom: '4rem', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }} />
       )}
       <div 
           className="prose prose-lg max-w-none opacity-90 transition-opacity"
           style={{ color: p.text, lineHeight: 1.9, fontSize: '1.15rem' }}
           dangerouslySetInnerHTML={{ __html: c.body || c.main_content || (typeof c === 'string' ? c : '') }}
       />
    </article>
  );
}
