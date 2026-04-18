// src/templates/CyberTemplate.tsx
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
  Zap, 
  Cpu, 
  Terminal, 
  Shield, 
  Share2, 
  Info, 
  MapPin, 
  ChevronRight, 
  Activity, 
  Eye, 
  Radar,
  Lock,
  Wifi,
  Database
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

export default function CyberTemplate({ 
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
  const siteName = settings?.site_name || 'Cyber Protocol';
  const content = pageData?.content || {};
  const pageType = pageData?.page_type || 'home';
  const p = palette || { 
    primary: themeColor || '#FF00FF', 
    secondary: '#00FFFF', 
    surface: '#050505', 
    text: '#FFFFFF', 
    name: 'Cyberpunk' 
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
      <div style={{ ...vars, background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Space Mono', monospace", position: 'relative', overflow: 'hidden' }}>
        <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/p6-dark.png')]" />
        <div className="fixed inset-0 pointer-events-none z-[9999] bg-gradient-to-b from-transparent via-white/5 to-transparent h-1 w-full animate-scanline" />
        <CyberNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} p={p} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} palette={p} currentSlug={currentSlug} />
        </main>
        <CyberFooter settings={settings} siteName={siteName} footerCfg={footerCfg} p={p} />
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
             <section style={{ padding: '10rem 4vw', position: 'relative', overflow: 'hidden' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
                   <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 1.5rem', border: '1px solid var(--primary)', background: 'var(--primary)11', color: 'var(--primary)', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.4em', marginBottom: '4rem', boxShadow: '0 0 20px var(--primary)33' }}>
                      <Activity size={14} className="animate-pulse" /> SYSTEM_ONLINE
                   </div>
                   {content.headline && (
                     <h1 style={{ fontSize: 'clamp(3.5rem, 10vw, 8.5rem)', fontWeight: 900, lineHeight: 0.8, textTransform: 'uppercase', letterSpacing: '-0.05em', marginBottom: '3rem', fontStyle: 'italic' }} className="glitch" data-text={content.headline}>
                        {content.headline}
                     </h1>
                   )}
                   {content.sub_headline && (
                     <p style={{ fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', maxWidth: '800px', borderLeft: '10px solid var(--secondary)', paddingLeft: '3rem', opacity: 0.8 }}>
                        {content.sub_headline}
                     </p>
                   )}
                </div>
                <div style={{ position: 'absolute', bottom: '-10rem', right: '-10rem', fontSize: '30vw', fontWeight: 900, color: 'var(--primary)08', pointerEvents: 'none', fontStyle: 'italic', textTransform: 'uppercase' }}>{siteName}</div>
                {content.hero_image && (
                  <div style={{ position: 'absolute', right: 0, top: '10%', width: '50%', height: '80%', opacity: 0.15, pointerEvents: 'none', clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}>
                     <img src={fixImg(content.hero_image)} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.5)' }} />
                  </div>
                )}
             </section>
             <div style={{ background: 'var(--secondary)0a', height: '1px', width: '100%' }} />
          </div>
        );

      case 'profile':
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '10rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: '8rem', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                   <div style={{ padding: '2rem', border: '5px solid var(--primary)', background: 'var(--primary)11' }}>
                      <h2 style={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em', marginBottom: '1rem' }}>CORE_LOGS</h2>
                      <div style={{ height: '4px', background: 'var(--primary)', width: '60%' }} />
                   </div>
                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                      <span style={{ fontSize: '0.6rem', border: '1px solid #333', padding: '4px 8px' }}>NODE_01</span>
                      <span style={{ fontSize: '0.6rem', border: '1px solid #333', padding: '4px 8px' }}>NEURAL_MAP</span>
                      <span style={{ fontSize: '0.6rem', border: '1px solid #333', padding: '4px 8px' }}>ACCESS_GRANTED</span>
                   </div>
                </div>
                <div 
                  style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.1, textTransform: 'uppercase', whiteSpace: 'pre-wrap', opacity: 0.9 }}
                  dangerouslySetInnerHTML={{ __html: content.about_us || '' }}
                />
             </div>
          </div>
        );

      case 'gallery':
        const galleryImages = Array.isArray(content.images) ? content.images : [];
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '8rem', borderBottom: '2px solid var(--secondary)22', paddingBottom: '4rem' }}>
                <div>
                   {content.gallery_title && <h1 style={{ fontSize: '5rem', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase' }}>{content.gallery_title}</h1>}
                   {content.description && <p style={{ fontSize: '1rem', opacity: 0.4, fontWeight: 900, marginTop: '2rem' }}>// {content.description}</p>}
                </div>
                <div style={{ display: 'flex', items: 'center', gap: '2rem' }}>
                   <Radar className="animate-pulse text-[var(--secondary)]" size={60} />
                </div>
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }}>
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} style={{ border: '1px solid #333', position: 'relative', height: '400px', overflow: 'hidden' }} className="group">
                     <img src={fixImg(img)} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) brightness(0.5)', transition: 'all 0.5s' }} className="group-hover:filter-none group-hover:scale-110" />
                     <div style={{ position: 'absolute', inset: 0, border: '5px solid var(--primary)', opacity: 0, transition: 'opacity 0.3s' }} className="group-hover:opacity-100" />
                     <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: '#000', padding: '4px 12px', fontSize: '0.6rem', fontWeight: 900, border: '1px solid var(--secondary)' }}>SCAN_ID_{i.toString().padStart(3,'0')}</div>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'news':
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '6rem', marginBottom: '10rem', height: '600px', border: '1px solid var(--secondary)22', background: 'var(--secondary)05' }}>
                <div style={{ padding: '6rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--secondary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '2rem' }}>
                      <Wifi size={20} className="animate-pulse" /> SIGNAL_STREAM
                   </div>
                   <h1 style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1.1, textTransform: 'uppercase', fontStyle: 'italic', marginBottom: '2rem' }}>{pageData.title}</h1>
                   <div style={{ fontSize: '1.2rem', fontWeight: 900, opacity: 0.6, lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: content.summary || '' }} />
                </div>
                <div style={{ borderLeft: '1px solid var(--secondary)22' }}>
                   <img src={fixImg(content.featured_image)} alt="Featured" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.2)' }} />
                </div>
             </div>

             <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '6rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em', borderRight: '10px solid var(--primary)', paddingRight: '2rem' }}>NEXUS_BYTES</h2>
                <div style={{ height: '2px', flex: 1, background: 'var(--primary)22' }} />
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '4rem' }}>
                {posts.map((post) => (
                  <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <article style={{ border: '1px solid #333', background: '#000', transition: 'all 0.4s' }} className="group hover:border-[var(--primary)] hover:shadow-[0_0_40px_var(--primary)22]">
                        <div style={{ height: '280px', position: 'relative' }}>
                           <img src={fixImg(post.content?.featured_image)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1)', transition: 'filter 0.5s' }} className="group-hover:filter-none" />
                           <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--primary)', color: '#000', padding: '4px 12px', fontWeight: 900, fontSize: '0.7rem' }}>{post.category}</div>
                        </div>
                        <div style={{ padding: '2.5rem' }}>
                           <div style={{ display: 'flex', items: 'center', gap: '1rem', opacity: 0.3, marginBottom: '1rem' }}>
                              <Database size={14} /> <span style={{ fontSize: '0.6rem', fontWeight: 900 }}>DATA_PACKET_v2</span>
                           </div>
                           <h3 style={{ fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', marginBottom: '1.5rem' }}>{post.title}</h3>
                           <p style={{ fontSize: '0.9rem', opacity: 0.5, fontWeight: 900, marginBottom: '2.5rem', lineHeight: 1.6 }}>{post.excerpt || post.content?.summary}</p>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 900, fontSize: '0.8rem', color: 'var(--secondary)' }}>
                              DECRYPT_LOG <ChevronRight size={18} className="group-hover:translate-x-4 transition-transform" />
                           </div>
                        </div>
                     </article>
                  </Link>
                ))}
             </div>
          </div>
        );

      case 'contact':
        const mapUrl = content.maps_link?.includes('<iframe') ? content.maps_link.match(/src="([^"]+)"/)?.[1] : content.maps_link;
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10rem' }}>
                <div>
                   <h1 style={{ fontSize: '7rem', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', lineHeight: 0.9, letterSpacing: '-0.06em', marginBottom: '6rem' }}>Signal_Targeting.</h1>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
                      {content.email && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.6em', color: 'var(--primary)', marginBottom: '1.5rem' }}>PACKET_PATH</span>
                           <b style={{ fontSize: '2.2rem', fontWeight: 900 }}>{content.email}</b>
                        </div>
                      )}
                      {content.phone && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.6em', color: 'var(--secondary)', marginBottom: '1.5rem' }}>AUDIO_RELAY</span>
                           <b style={{ fontSize: '2.2rem', fontWeight: 900 }}>{content.phone}</b>
                        </div>
                      )}
                   </div>
                </div>
                <div style={{ position: 'relative' }}>
                   <div style={{ position: 'absolute', inset: '-20px', border: '2px solid var(--primary)', opacity: 0.2 }} />
                   {mapUrl && (
                     <div style={{ width: '100%', height: '700px', border: '5px solid #111', background: '#000', padding: '1rem' }}>
                        <iframe src={mapUrl} width="100%" height="100%" style={{ border: 0, filter: 'grayscale(1) invert(1) contrast(3)' }} allowFullScreen loading="lazy"></iframe>
                     </div>
                   )}
                </div>
             </div>
          </div>
        );

      default:
        return (
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '10rem 4vw', fontFamily: 'monospace' }}>
             <div style={{ fontSize: '1.2rem', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: content.body || '' }} />
          </div>
        );
    }
  };

  return (
    <div style={{ ...vars, background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Space Mono', monospace", position: 'relative', overflow: 'hidden' }}>
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/p6-dark.png')]" />
      <div className="fixed inset-0 pointer-events-none z-[9999] bg-gradient-to-b from-transparent via-white/5 to-transparent h-1 w-full animate-scanline" />
      <CyberNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} p={p} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <CyberFooter settings={settings} siteName={siteName} footerCfg={footerCfg} p={p} />
      <style dangerouslySetInnerHTML={{ __html: styles }} />
    </div>
  );
}

function CyberNavbar({ settings, siteName, navPages, currentSlug, p, subdomain }: any) {
  return (
    <nav style={{ height: '110px', padding: '0 4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.8)', borderBottom: '2px solid var(--primary)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' }}>
      <Link to={`/preview/${subdomain}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ width: '50px', height: '50px', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(45deg)', background: 'var(--primary)11' }}>
          <Terminal size={24} color="var(--primary)" style={{ transform: 'rotate(-45deg)' }} />
        </div>
        <span style={{ fontWeight: 900, fontSize: '2rem', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.1em' }} className="glitch" data-text={siteName}>{siteName}</span>
      </Link>
      <div style={{ display: 'flex', height: '110px' }}>
        {navPages.map((nav: any) => {
          const isActive = currentSlug === nav.slug?.replace(/^\/+/, '');
          return (
            <Link 
              key={nav.slug} 
              to={`/preview/${subdomain}/${nav.slug?.replace(/^\/+/, '')}`} 
              style={{ 
                textDecoration: 'none', 
                color: 'inherit', 
                padding: '0 3rem',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.85rem', 
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                background: isActive ? 'var(--primary)11' : 'transparent',
                borderBottom: isActive ? '5px solid var(--primary)' : 'none',
                opacity: isActive ? 1 : 0.4,
                transition: 'all 0.3s'
              }}>
              {nav.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function CyberFooter({ settings, siteName, footerCfg, p }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <footer style={{ background: '#050505', borderTop: '2px solid var(--secondary)', padding: '12rem 4rem 4rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(to right, rgba(0,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
      <div style={{ maxWidth: '1700px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr', gap: '8rem', position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '4rem' }}>
            <div style={{ width: '60px', height: '60px', border: '2px solid var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Cpu size={36} color="var(--secondary)" />
            </div>
            <span style={{ fontWeight: 900, fontSize: '2.5rem', fontStyle: 'italic', textTransform: 'uppercase' }}>{siteName}</span>
          </div>
          <p style={{ opacity: 0.3, lineHeight: 1.8, fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4rem' }}>{footerCfg.short_description || footerCfg.footer_description}</p>
          <div style={{ display: 'flex', gap: '2rem' }}>
             {(footerCfg.social_links || []).map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ width: '60px', height: '60px', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', transition: 'all 0.4s' }} onMouseOver={e => { e.currentTarget.style.color = 'var(--secondary)'; e.currentTarget.style.borderColor = 'var(--secondary)'; e.currentTarget.style.boxShadow = '0 0 20px var(--secondary)33'; }} onMouseOut={e => { e.currentTarget.style.color = '#666'; e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.boxShadow = 'none'; }}>
                   <SocialIcon type={social.icon} size={28} />
                </a>
             ))}
          </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8em', marginBottom: '4rem', color: 'var(--secondary)' }}>ROOT_DIRECT</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((ln: any, i: number) => (
                 <a key={i} href={ln.url} style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', opacity: 0.4 }}>{ln.label}</a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8em', marginBottom: '4rem', color: 'var(--primary)' }}>VOID_INIT</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', opacity: 0.3, fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
              <span>NEURAL_LEGALS</span>
              <span>VOID_TERMS</span>
              <span>PROTOCOL_ZERO</span>
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8em', marginBottom: '4rem', color: 'var(--secondary)' }}>NEXUS_COORD</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase' }}>
              {contact.phone && <div style={{ borderLeft: '4px solid var(--secondary)', paddingLeft: '2rem' }}>AUDIO. <b style={{ color: '#DDD' }}>{contact.phone}</b></div>}
              {contact.whatsapp && <div style={{ borderLeft: '4px solid var(--secondary)', paddingLeft: '2rem' }}>RELAY. <b style={{ color: '#DDD' }}>{contact.whatsapp}</b></div>}
              {contact.email && <div style={{ borderLeft: '4px solid var(--secondary)', paddingLeft: '2rem' }}>NODES. <b style={{ color: '#DDD' }}>{contact.email}</b></div>}
              {contact.service_hours && <div style={{ opacity: 0.2 }}>UPTIME: {contact.service_hours}</div>}
              
              {footerCfg.location_embed_link && (
                <div style={{ width: '100%', height: '180px', border: '1px solid #222', padding: '10px', background: '#000', marginTop: '1rem' }}>
                   <iframe src={footerCfg.location_embed_link.includes('<iframe') ? footerCfg.location_embed_link.match(/src="([^"]+)"/)?.[1] : footerCfg.location_embed_link} width="100%" height="100%" style={{ border: 0, filter: 'grayscale(1) invert(1) brightness(0.4)' }} loading="lazy"></iframe>
                </div>
              )}
           </div>
        </div>
      </div>
      <div style={{ maxWidth: '1700px', margin: '10rem auto 0', paddingTop: '4rem', borderTop: '1px solid #111', fontSize: '0.8rem', fontWeight: 900, textAlign: 'center', letterSpacing: '1.2em', textTransform: 'uppercase', opacity: 0.2 }}>
         Neural_Protocol_Established / {new Date().getFullYear()} / V.01
      </div>
    </footer>
  );
}

const styles = `
@keyframes scanline {
  0% { transform: translateY(-100vh); }
  100% { transform: translateY(100vh); }
}
.animate-scanline { animation: scanline 8s linear infinite; }
.glitch:hover::before {
  content: attr(data-text);
  position: absolute;
  left: -4px;
  text-shadow: 4px 0 var(--primary);
  background: black;
  overflow: hidden;
  clip-path: inset(0 0 0 0);
  animation: noise-1 3s infinite linear alternate-reverse;
}
@keyframes noise-1 {
  0% { clip-path: inset(41% 0 14% 0); }
  50% { clip-path: inset(11% 0 54% 0); }
  100% { clip-path: inset(81% 0 1% 0); }
}
`;
