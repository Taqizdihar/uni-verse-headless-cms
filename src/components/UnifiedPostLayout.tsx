import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Clock, MapPin, Calendar } from 'lucide-react';

interface UnifiedPostLayoutProps {
  postData: any;
  palette?: any;
  currentSlug?: string;
  settings?: any;
  navPages?: any[];
  subdomain?: string;
}

const fixImg = (url: string) => {
    const BASE_URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL}`;
    return url && url.startsWith('/uploads') ? `${BASE_URL}${url}` : url;
};

export default function UnifiedPostLayout({ postData, palette, settings, navPages, subdomain }: UnifiedPostLayoutProps) {
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
      const newsPage = (navPages || []).find((pg: any) => pg.page_type === 'news');
      if (newsPage && subdomain) {
          navigate(`/preview/${subdomain}/${newsPage.slug?.replace(/^\/+/, '')}`);
      } else {
          navigate(-1);
      }
  };
  
  if (type === 'event') {
    const hasAgenda = c.agenda && Array.isArray(c.agenda) && c.agenda.length > 0;
    const hasSpeakers = c.speakers && Array.isArray(c.speakers) && c.speakers.length > 0;

    return (
      <article style={{ maxWidth: '1000px', margin: '0 auto', padding: '6rem 2rem', fontFamily: 'inherit' }}>
         <a href="#" onClick={handleBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: p.primary, textDecoration: 'none', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            &larr; Kembali
         </a>
         {c.featured_image && (
             <img src={fixImg(c.featured_image)} alt={postData.title} style={{ width: '100%', height: 'auto', maxHeight: '550px', objectFit: 'cover', borderRadius: '2rem', marginBottom: '4rem', boxShadow: '0 30px 60px rgba(0,0,0,0.12)' }} />
         )}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <div>
               <span style={{ display: 'inline-block', padding: '0.4rem 1.25rem', background: p.primary, color: p.surface, borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.5rem' }}>Event</span>
               <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.04em', color: p.text, marginBottom: '2rem', margin: 0 }}>{postData.title}</h1>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', background: `${p.text}05`, padding: '3rem', borderRadius: '2rem', border: `1px solid ${p.text}0a` }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', fontWeight: 800, color: `${p.text}66`, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                     <Calendar size={20} color={p.primary} strokeWidth={2.5} /> Tanggal & Waktu
                  </span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: p.text }}>{c.event_date || 'Akan Datang'}</span>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', fontWeight: 800, color: `${p.text}66`, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                     <MapPin size={20} color={p.primary} strokeWidth={2.5} /> Lokasi Acara
                  </span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: p.text }}>{c.location || 'Segera Diumumkan'}</span>
               </div>
            </div>

            <div style={{ fontSize: '1.2rem', lineHeight: 1.8, color: `${p.text}ee` }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: c.body || '' }} />

            {/* Agenda & Speakers Section */}
            {(hasAgenda || hasSpeakers) && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', marginTop: '2rem', paddingTop: '4rem', borderTop: `1px solid ${p.text}11` }}>
                 {hasAgenda && (
                   <div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', letterSpacing: '-0.02em' }}>
                         <Clock size={24} color={p.primary} strokeWidth={2.5} /> Agenda Acara
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
                         {/* Visual Timeline Line */}
                         <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', background: `${p.primary}22`, zIndex: 0 }}></div>
                         
                         {c.agenda.map((item: any, i: number) => (
                            <div key={i} style={{ display: 'flex', gap: '2rem', position: 'relative', zIndex: 1 }}>
                               <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: p.primary, border: `4px solid ${p.surface}`, marginTop: '4px', boxShadow: '0 0 0 4px white' }}></div>
                               <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: '0.85rem', fontWeight: 900, color: p.primary, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{item.time}</div>
                                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: p.text, lineHeight: 1.4 }}>{item.activity}</div>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                 )}
                 
                 {hasSpeakers && (
                   <div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', letterSpacing: '-0.02em' }}>
                         <User size={24} color={p.primary} strokeWidth={2.5} /> Narasumber
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                         {c.speakers.map((item: any, i: number) => (
                            <div key={i} style={{ padding: '1.5rem', background: `${p.text}03`, borderRadius: '1.5rem', border: `1px solid ${p.text}08` }}>
                               <div style={{ fontSize: '1.15rem', fontWeight: 800, color: p.text, marginBottom: '0.25rem' }}>{item.name}</div>
                               <div style={{ fontSize: '0.9rem', color: `${p.text}66`, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.role}</div>
                            </div>
                         ))}
                      </div>
                   </div>
                 )}
              </div>
            )}

            {c.registration_link && (
               <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                  <a href={c.registration_link} target="_blank" rel="noreferrer" style={{ display: 'inline-block', padding: '1.5rem 4rem', background: p.primary, color: p.surface, borderRadius: '99px', fontSize: '1.1rem', fontWeight: 900, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em', boxShadow: `0 20px 50px ${p.primary}44`, transition: 'all 0.3s' }} onMouseOver={(e)=>e.currentTarget.style.transform='translateY(-5px) scale(1.02)'} onMouseOut={(e)=>e.currentTarget.style.transform='translateY(0) scale(1)'}>
                     Daftar Sekarang &rarr;
                  </a>
               </div>
            )}
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
       <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
          {postData.category && <span style={{ display: 'inline-block', padding: '0.4rem 1.25rem', border: `2px solid ${p.primary}`, color: p.primary, borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem' }}>{postData.category}</span>}
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.03em', color: p.text, marginBottom: '2rem', margin: '0 auto', maxWidth: '95%' }}>{postData.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.9rem', color: `${p.text}88`, fontWeight: 600 }}>
             {c.author && <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={16} /> Ditulis oleh {c.author}</span>}
          </div>
       </header>

       {c.featured_image && (
           <img src={fixImg(c.featured_image)} alt={postData.title} style={{ width: '100%', height: 'auto', maxHeight: '550px', objectFit: 'cover', borderRadius: '1.5rem', marginBottom: '4rem', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }} />
       )}

       {/* Excerpt Section */}
       {(postData.excerpt || c.excerpt) && (
         <div 
           className="rich-text-content"
           style={{ fontSize: '1.4rem', fontWeight: 600, color: p.text, opacity: 0.8, lineHeight: 1.6, marginBottom: '3rem', borderLeft: `4px solid ${p.primary}`, paddingLeft: '2rem', fontStyle: 'italic' }}
           dangerouslySetInnerHTML={{ __html: postData.excerpt || c.excerpt }}
         />
       )}

       {/* Main Content */}
       <div 
           className="prose prose-lg max-w-none opacity-90 transition-opacity rich-text-content"
           style={{ color: p.text, lineHeight: 1.9, fontSize: '1.15rem' }}
           dangerouslySetInnerHTML={{ __html: c.body || c.main_content || (typeof c === 'string' ? c : '') }}
       />
    </article>
  );
}
