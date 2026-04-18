// src/templates/VlogTemplate.tsx
import React from 'react';
import UnifiedPostLayout from '../components/UnifiedPostLayout';
import { Link } from 'react-router-dom';
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  Linkedin, 
  Twitter, 
  MessageCircle, 
  ArrowRight, 
  Mail, 
  Phone, 
  Play, 
  Heart, 
  Share2, 
  Search, 
  Bell, 
  User, 
  Clock, 
  Eye, 
  MoreVertical,
  ChevronRight,
  TrendingUp,
  Monitor,
  Video
} from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL}`;
const fixImg = (url: string) => url && url.startsWith("/uploads") ? `${BASE_URL}${url}` : url;

const SocialIcon = ({ type, size = 18 }: { type: string, size?: number }) => {
  const icons: Record<string, any> = {
    instagram: Instagram,
    facebook: Facebook,
    youtube: Youtube,
    linkedin: Linkedin,
    twitter: Twitter,
    whatsapp: MessageCircle,
  };
  const Icon = icons[(type || '').toLowerCase()] || MessageCircle;
  return <Icon size={size} />;
};

interface BrandingPalette {
  name: string; primary: string; secondary: string; surface: string; text: string;
}

interface TemplateProps {
  pageData: any;
  postData?: any;
  posts?: any[];
  settings: any;
  themeColor: string;
  navPages?: { title: string; slug: string }[];
  palette?: BrandingPalette;
  currentSlug?: string;
  subdomain?: string;
}

export default function VlogTemplate({ 
  pageData, 
  postData, 
  posts = [], 
  settings, 
  themeColor, 
  navPages = [], 
  palette, 
  currentSlug, 
  subdomain 
}: TemplateProps) {
  const siteName = settings?.site_name || 'Vlog Channel';
  const content = pageData?.content || {};
  const pageType = pageData?.page_type || 'home';
  const p = palette || { 
    primary: themeColor || '#EF4444', 
    secondary: '#18181B', 
    surface: '#0F0F0F', 
    text: '#FFFFFF', 
    name: 'Video Content' 
  };
  const footerCfg = settings?.global_options?.footer_config || {};

  const vars = {
    '--primary': p.primary,
    '--secondary': p.secondary,
    '--bg-color': p.surface,
    '--text-main': p.text,
  } as React.CSSProperties;

  if (postData) {
    return (
      <div style={{ ...vars, background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
        <VlogNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} p={p} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} palette={p} currentSlug={currentSlug} />
        </main>
        <VlogFooter settings={settings} siteName={siteName} footerCfg={footerCfg} p={p} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
             <section style={{ height: '70vh', position: 'relative', overflow: 'hidden' }}>
                {content.hero_image && <img src={fixImg(content.hero_image)} alt="Featured Content" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-color) 10%, transparent 90%)' }} />
                <div style={{ position: 'relative', zIndex: 1, padding: '15vh 6vw', maxWidth: '1200px' }}>
                   <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1.5rem', background: 'var(--primary)', color: '#FFF', borderRadius: '5px', fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '3rem' }}>
                      <TrendingUp size={16} /> LIVE NOW: WORLDWIDE
                   </div>
                   {content.headline && (
                     <h1 style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', fontWeight: 950, color: '#FFF', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '3rem' }}>
                        {content.headline}
                     </h1>
                   )}
                   {content.sub_headline && (
                     <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', maxWidth: '700px', marginBottom: '5rem', lineHeight: 1.6 }}>
                        {content.sub_headline}
                     </p>
                   )}
                   <Link to={`/preview/${subdomain}/news`} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', textDecoration: 'none' }}>
                      <div style={{ width: '80px', height: '80px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                         <Play size={32} fill="currentColor" />
                      </div>
                      <span style={{ fontWeight: 900, fontSize: '0.85rem', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.2rem' }}>Watch Premiere</span>
                   </Link>
                </div>
             </section>
             <div style={{ padding: '4rem 6vw', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem', background: '#121212', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {[
                  { i: Video, t: '4K Ultra HD', d: 'Cinema standard rendering' },
                  { i: Monitor, t: 'Multi-Device', d: 'Sync across all displays' },
                  { i: Eye, t: '1M+ Views', d: 'Active global membership' },
                  { i: Bell, t: 'Instant Alerts', d: 'Priority signal protocol' }
                ].map((item: any, i) => (
                  <div key={i} style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                     <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                        {item.i && <item.i size={20} />}
                     </div>
                     <div>
                        <h4 style={{ fontWeight: 900, fontSize: '0.85rem', color: '#FFF', marginBottom: '0.4rem' }}>{item.t}</h4>
                        <p style={{ fontSize: '0.75rem', opacity: 0.3, fontWeight: 700 }}>{item.d}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'profile':
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '10rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '10rem', alignItems: 'center' }}>
                <div style={{ padding: '6rem', background: '#121212', borderRadius: '3rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                   <div style={{ width: '120px', height: '2px', background: 'var(--primary)', marginBottom: '4rem' }} />
                   <h2 style={{ fontSize: '4.5rem', fontWeight: 950, color: '#FFF', lineHeight: 1, letterSpacing: '-0.04em' }}>Content<br />Chronicle.</h2>
                </div>
                <div 
                  style={{ fontSize: '1.25rem', lineHeight: 1.8, opacity: 0.5, whiteSpace: 'pre-wrap' }}
                  dangerouslySetInnerHTML={{ __html: content.about_us || '' }}
                />
             </div>
          </div>
        );

      case 'gallery':
        const galleryImages = Array.isArray(content.images) ? content.images : [];
        return (
          <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
                {content.gallery_title && <h1 style={{ fontSize: '4.5rem', fontWeight: 950, color: '#FFF' }}>{content.gallery_title}</h1>}
                {content.description && <p style={{ fontSize: '1.2rem', opacity: 0.3, marginTop: '2rem', maxWidth: '700px', margin: '2rem auto 0' }}>{content.description}</p>}
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '2.5rem' }}>
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} style={{ borderRadius: '2rem', overflow: 'hidden', height: '300px', background: '#121212', position: 'relative' }} className="group">
                     <img src={fixImg(img)} alt={`Frame ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6, transition: 'all 0.6s' }} className="group-hover:opacity-100 group-hover:scale-105" />
                     <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'all 0.4s' }} className="group-hover:opacity-100">
                        <Play size={48} color="#FFF" />
                     </div>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'news':
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '6rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '6rem', marginBottom: '10rem', background: '#121212', borderRadius: '3rem', overflow: 'hidden' }}>
                <div style={{ padding: '6rem' }}>
                   <div style={{ display: 'inline-flex', padding: '0.4rem 1.2rem', background: 'var(--primary)', color: '#FFF', fontWeight: 900, fontSize: '0.7rem', borderRadius: '5px', marginBottom: '3rem', textTransform: 'uppercase', letterSpacing: '0.2rem' }}>CHANNEL SPOTLIGHT</div>
                   <h1 style={{ fontSize: '4.5rem', fontWeight: 950, lineHeight: 1, color: '#FFF', marginBottom: '3rem' }}>{pageData.title}</h1>
                   <div style={{ fontSize: '1.25rem', opacity: 0.4, lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: content.summary || '' }} />
                </div>
                <div style={{ position: 'relative' }}>
                   <img src={fixImg(content.featured_image)} alt="Lead video" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                   <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                         <Play size={40} color="#FFF" fill="#FFF" />
                      </div>
                   </div>
                </div>
             </div>

             <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', marginBottom: '6rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 950, textTransform: 'uppercase' }}>Recent Uploads</h2>
                <div style={{ height: '2px', flex: 1, background: 'rgba(255,255,255,0.05)' }} />
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '3rem' }}>
                {posts.map((post) => (
                  <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <article className="group">
                        <div style={{ position: 'relative', height: '260px', borderRadius: '1.5rem', overflow: 'hidden', background: '#121212', marginBottom: '2.5rem' }}>
                           <img src={fixImg(post.content?.featured_image)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7, transition: 'all 0.6s' }} className="group-hover:opacity-100 group-hover:scale-105" />
                           <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'rgba(0,0,0,0.8)', color: '#FFF', padding: '0.3rem 0.8rem', fontSize: '0.75rem', fontWeight: 900, borderRadius: '5px' }}>12:44</div>
                           <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'all 0.4s' }} className="group-hover:opacity-100">
                              <Play size={40} color="#FFF" fill="#FFF" />
                           </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                           <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                              <User size={20} />
                           </div>
                           <div>
                              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFF', marginBottom: '1rem', lineHeight: 1.3 }}>{post.title}</h3>
                              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.75rem', fontWeight: 900, opacity: 0.3, textTransform: 'uppercase' }}>
                                 <span>{post.category}</span>
                                 <span>•</span>
                                 <span>{new Date(post.created_at).toLocaleDateString()}</span>
                              </div>
                           </div>
                        </div>
                     </article>
                  </Link>
                ))}
             </div>
          </div>
        );

      case 'contact':
        const mapsUrl = content.maps_link?.includes('<iframe') ? content.maps_link.match(/src="([^"]+)"/)?.[1] : content.maps_link;
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '10rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12rem', alignItems: 'center' }}>
                <div>
                   <h1 style={{ fontSize: '5.5rem', fontWeight: 950, color: '#FFF', lineHeight: 1, letterSpacing: '-0.04em', marginBottom: '8rem' }}>Sovereign<br />Direct Link.</h1>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
                      {content.email && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, opacity: 0.3, textTransform: 'uppercase', letterSpacing: '0.3rem', marginBottom: '2rem' }}>Signal_Inbox</span>
                           <b style={{ fontSize: '2.2rem', color: 'var(--primary)' }}>{content.email}</b>
                        </div>
                      )}
                      {content.phone && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, opacity: 0.3, textTransform: 'uppercase', letterSpacing: '0.3rem', marginBottom: '2rem' }}>Voice_Freq</span>
                           <b style={{ fontSize: '2.5rem', color: '#FFF' }}>{content.phone}</b>
                        </div>
                      )}
                   </div>
                </div>
                <div>
                   {mapsUrl && (
                     <div style={{ width: '100%', height: '700px', borderRadius: '3.5rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 50px 100px rgba(0,0,0,0.5)', filter: 'grayscale(1) brightness(0.6)' }}>
                        <iframe src={mapsUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
                     </div>
                   )}
                </div>
             </div>
          </div>
        );

      default:
        return (
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '12rem 4vw' }}>
             <div style={{ fontSize: '1.25rem', lineHeight: 2, opacity: 0.4 }} dangerouslySetInnerHTML={{ __html: content.body || '' }} />
          </div>
        );
    }
  };

  return (
    <div style={{ ...vars, background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
      <VlogNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} p={p} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <VlogFooter settings={settings} siteName={siteName} footerCfg={footerCfg} p={p} />
    </div>
  );
}

function VlogNavbar({ settings, siteName, navPages, currentSlug, p, subdomain }: any) {
  return (
    <nav style={{ height: '80px', padding: '0 4vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(15,15,15,0.85)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(30px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4rem' }}>
        <Link to={`/preview/${subdomain}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Play size={24} color="#FFF" fill="#FFF" />
          </div>
          {settings?.logo_url ? (
            <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '24px', width: 'auto', filter: 'brightness(1) contrast(1.5)' }} />
          ) : (
            <span style={{ fontWeight: 950, fontSize: '1.6rem', color: '#FFF', letterSpacing: '-0.04em', textTransform: 'uppercase', fontStyle: 'italic' }}>{siteName}</span>
          )}
        </Link>
        <div style={{ display: 'flex', gap: '2vw', alignItems: 'center' }}>
          {navPages.map((nav: any) => {
            const isActive = currentSlug === nav.slug?.replace(/^\/+/, '');
            return (
              <Link 
                key={nav.slug} 
                to={`/preview/${subdomain}/${nav.slug?.replace(/^\/+/, '')}`} 
                style={{ 
                  textDecoration: 'none', 
                  color: isActive ? '#FFF' : 'inherit', 
                  fontSize: '0.8rem', 
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  opacity: isActive ? 1 : 0.4,
                  transition: 'all 0.3s'
                }}>
                {nav.title}
              </Link>
            );
          })}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
         <div style={{ width: '400px', height: '44px', background: '#121212', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', padding: '0 2rem' }}>
            <Search size={18} color="rgba(255,255,255,0.2)" />
            <span style={{ marginLeft: '1.5rem', fontSize: '0.85rem', opacity: 0.1, fontWeight: 800 }}>Search signal...</span>
         </div>
         <Link to={`/preview/${subdomain}/contact`} style={{ padding: '0.75rem 2.2rem', background: 'var(--primary)', color: '#FFF', borderRadius: '100px', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', textDecoration: 'none' }}>
            SUBSCRIBE
         </Link>
      </div>
    </nav>
  );
}

function VlogFooter({ settings, siteName, footerCfg, p }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <footer style={{ background: '#000', color: '#FFF', padding: '15rem 4vw 6rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: '1800px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr', gap: '10rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '4rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '10px' }} />
            <span style={{ fontWeight: 950, fontSize: '1.6rem', color: '#FFF', letterSpacing: '-0.04em', textTransform: 'uppercase', fontStyle: 'italic' }}>{siteName}</span>
          </div>
          <p style={{ opacity: 0.3, lineHeight: 2, fontSize: '1rem', marginBottom: '5rem', maxWidth: '450px' }}>{footerCfg.short_description || footerCfg.footer_description}</p>
          <div style={{ display: 'flex', gap: '2rem' }}>
             {(footerCfg.social_links || []).map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', transition: 'all 0.4s' }} onMouseOver={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-10px)'; }} onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'none'; }}>
                   <SocialIcon type={social.icon} size={24} />
                </a>
             ))}
          </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '4rem', opacity: 0.2 }}>Nexus Guide</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((ln: any, i: number) => (
                 <a key={i} href={ln.url} style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.3 }}>{ln.label}</a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '4rem', opacity: 0.2 }}>Registry</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', opacity: 0.1, fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              <span>Signal_Hub</span>
              <span>Usage_Charter</span>
              <span>Global_Node</span>
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '4rem', opacity: 0.2 }}>Channel Direct</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', fontSize: '1.25rem' }}>
              {contact.phone && <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}><Phone size={24} color="var(--primary)" /> <b>{contact.phone}</b></div>}
              {contact.whatsapp && <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}><MessageCircle size={24} color="var(--primary)" /> <b>CHANNEL</b></div>}
              {contact.email && <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}><Mail size={24} style={{ opacity: 0.2 }} /> <b style={{ fontSize: '1rem', opacity: 0.5 }}>{contact.email}</b></div>}
              
              {footerCfg.location_embed_link && (
                <div style={{ width: '100%', height: '220px', borderRadius: '2rem', overflow: 'hidden', marginTop: '2rem', border: '1px solid rgba(255,255,255,0.05)', filter: 'grayscale(1) brightness(0.6)' }}>
                   <iframe src={footerCfg.location_embed_link.includes('<iframe') ? footerCfg.location_embed_link.match(/src="([^"]+)"/)?.[1] : footerCfg.location_embed_link} width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>
                </div>
              )}
           </div>
        </div>
      </div>
      <div style={{ maxWidth: '1800px', margin: '15rem auto 0', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.03)', fontSize: '0.9rem', opacity: 0.1, textAlign: 'center', fontWeight: 950, letterSpacing: '1.5em', textTransform: 'uppercase' }}>
         © {new Date().getFullYear()} {siteName.toUpperCase()} - SOVEREIGN_STREAMING_INITIATIVE.
      </div>
    </footer>
  );
}
