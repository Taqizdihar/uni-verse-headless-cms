// src/templates/RetroTemplate.tsx
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
  Gamepad2, 
  Radio, 
  Music, 
  Monitor, 
  Zap, 
  Heart, 
  Share2, 
  Info, 
  MapPin, 
  ChevronRight, 
  Joystick, 
  Palette, 
  Terminal,
  Cpu,
  Power,
  ChevronDown
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

export default function RetroTemplate({ 
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
  const siteName = settings?.site_name || 'Retro Grid';
  const content = pageData?.content || {};
  const pageType = pageData?.page_type || 'home';
  const p = palette || { 
    primary: themeColor || '#F472B6', 
    secondary: '#2DD4BF', 
    surface: '#0D0D1A', 
    text: '#FFFFFF', 
    name: '80s Vintage' 
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
      <div style={{ ...vars, background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Courier New', monospace" }}>
        <div className="scanlines" />
        <RetroNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} p={p} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} palette={p} currentSlug={currentSlug} />
        </main>
        <RetroFooter settings={settings} siteName={siteName} footerCfg={footerCfg} p={p} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
             <section style={{ height: '90vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="absolute inset-0 bg-grid opacity-20" />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40vh', background: 'linear-gradient(to top, var(--primary)33, transparent)', clipPath: 'polygon(0 100%, 100% 100%, 50% 0)' }} />
                
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 4vw' }}>
                   <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', color: 'var(--secondary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: '0.8rem', marginBottom: '4rem', padding: '0.5rem 1.5rem', border: '2px border var(--secondary)', boxShadow: '0 0 20px var(--secondary)55' }}>
                      <Power size={18} className="animate-pulse" /> SYSTEM_LOADED: READY
                   </div>
                   {content.headline && (
                     <h1 style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', lineHeight: 1, letterSpacing: '0.1em', marginBottom: '4rem', textShadow: '4px 4px 0 var(--secondary), -4px -4px 0 white' }}>
                        {content.headline}
                     </h1>
                   )}
                   {content.sub_headline && (
                     <p style={{ fontSize: '1.25rem', color: 'var(--text-main)', maxWidth: '800px', margin: '0 auto 6rem', lineHeight: 1.6, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.8 }}>
                        {content.sub_headline}
                     </p>
                   )}
                   <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center' }}>
                      <Link to={`/preview/${subdomain}/contact`} style={{ padding: '1.5rem 4rem', background: 'var(--primary)', color: 'black', fontWeight: 900, textTransform: 'uppercase', textDecoration: 'none', letterSpacing: '0.3em', boxShadow: '5px 5px 0 var(--secondary), 10px 10px 0 black' }}>
                         INSERT COIN
                      </Link>
                   </div>
                </div>

                <div style={{ position: 'absolute', top: '10rem', right: '4vw', textAlign: 'right' }}>
                   <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '0.2em' }}>HI_SCORE: 99999</div>
                   <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--secondary)', letterSpacing: '0.2em' }}>PLAYER_1: SOVEREIGN</div>
                </div>
             </section>
             <div style={{ padding: '4rem 4vw', background: 'black', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem', borderTop: '4px solid var(--primary)', borderBottom: '4px solid var(--primary)' }}>
                {[
                  { i: Gamepad2, t: 'Play Mode' },
                  { i: Radio, t: 'Tape Deck' },
                  { i: Music, t: 'Synth Loop' },
                  { i: Monitor, t: 'CRT View' }
                ].map((item, i) => (
                  <div key={i} style={{ textAlign: 'center', color: 'var(--primary)' }}>
                     <item.i size={32} style={{ marginBottom: '1.5rem' }} />
                     <h4 style={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.4em' }}>{item.t}</h4>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'profile':
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '10rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '10rem', alignItems: 'center' }}>
                <div style={{ padding: '6rem', background: 'black', border: '4px solid var(--primary)', position: 'relative', boxShadow: '15px 15px 0 var(--secondary)' }}>
                   <div style={{ fontSize: '8rem', fontWeight: 900, color: 'var(--primary)', opacity: 0.1, position: 'absolute', top: -20, left: -20 }}>BIOS</div>
                   <h2 style={{ fontSize: '4.5rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', lineHeight: 0.9, position: 'relative', zIndex: 1 }}>Hardware<br />Profile.</h2>
                </div>
                <div 
                  style={{ fontSize: '1.2rem', lineHeight: 2, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'pre-wrap' }}
                  dangerouslySetInnerHTML={{ __html: content.about_us || '' }}
                />
             </div>
          </div>
        );

      case 'gallery':
        const galleryImages = Array.isArray(content.images) ? content.images : [];
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ textAlign: 'center', marginBottom: '10rem' }}>
                {content.gallery_title && <h1 style={{ fontSize: '5rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--secondary)', textShadow: '4px 4px 0 var(--primary)' }}>{content.gallery_title}</h1>}
                {content.description && <p style={{ fontSize: '1.1rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.4em', marginTop: '2.5rem' }}>{content.description}</p>}
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '3rem' }}>
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} style={{ border: '4px solid var(--primary)', background: 'black', padding: '1rem', boxShadow: '10px 10px 0 var(--secondary)' }} className="group">
                     <div style={{ height: '450px', overflow: 'hidden' }}>
                        <img src={fixImg(img)} alt={`Buffer ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.5) saturate(1.5)', transition: 'all 0.4s' }} className="group-hover:scale-105" />
                     </div>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'news':
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '8rem', marginBottom: '12rem', background: 'black', border: '4px solid var(--primary)', boxShadow: '20px 20px 0 var(--secondary)' }}>
                <div style={{ padding: '6rem' }}>
                   <div style={{ display: 'inline-flex', padding: '0.4rem 1.2rem', background: 'var(--primary)', color: 'black', fontWeight: 900, fontSize: '0.75rem', marginBottom: '3rem', textTransform: 'uppercase' }}>NEW_SIGNAL_DETECTED</div>
                   <h1 style={{ fontSize: '4.5rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--primary)', lineHeight: 1, marginBottom: '3rem' }}>{pageData.title}</h1>
                   <div style={{ fontSize: '1.2rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: content.summary || '' }} />
                </div>
                <img src={fixImg(content.featured_image)} alt="Signal" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'hue-rotate(45deg)' }} />
             </div>

             <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', marginBottom: '8rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--primary)' }}>Broadcast Stream</h2>
                <div style={{ height: '2px', flex: 1, background: 'var(--primary)33' }} />
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '5rem' }}>
                {posts.map((post) => (
                  <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <article style={{ borderBottom: '2px solid var(--primary)33', paddingBottom: '3rem' }} className="group">
                        <div style={{ height: '300px', border: '4px solid var(--primary)', background: 'black', padding: '0.5rem', marginBottom: '3rem', position: 'relative' }}>
                           <img src={fixImg(post.content?.featured_image)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                           <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'var(--secondary)', color: 'black', padding: '0.2rem 1rem', fontSize: '0.7rem', fontWeight: 900 }}>LOADED_0%</div>
                        </div>
                        <span style={{ fontWeight: 900, color: 'var(--secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '1.5rem', display: 'block' }}>{post.category}</span>
                        <h3 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '2rem', lineHeight: 1.1 }}>{post.title}</h3>
                        <p style={{ color: 'var(--text-main)', fontSize: '1rem', textTransform: 'uppercase', opacity: 0.6, marginBottom: '3rem' }}>{post.excerpt || post.content?.summary}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 900, fontSize: '0.85rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                           ACCESS_TERMINAL <ChevronRight size={18} className="group-hover:translate-x-4 transition-transform" />
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
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12rem', alignItems: 'center' }}>
                <div>
                   <h1 style={{ fontSize: '6rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', lineHeight: 0.9, letterSpacing: '0.1em', marginBottom: '6rem' }}>Link Up.<br />Protocol.</h1>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
                      {content.email && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '2rem' }}>Signal_Inbox</span>
                           <b style={{ fontSize: '2.2rem', textTransform: 'uppercase', color: 'var(--primary)', borderBottom: '4px solid var(--secondary)' }}>{content.email}</b>
                        </div>
                      )}
                      {content.phone && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '2rem' }}>Voice_Freq</span>
                           <b style={{ fontSize: '2.5rem', textTransform: 'uppercase', color: 'var(--primary)' }}>{content.phone}</b>
                        </div>
                      )}
                   </div>
                </div>
                <div>
                   {mapsUrl && (
                     <div style={{ width: '100%', height: '750px', border: '10px solid var(--primary)', background: 'black', padding: '1.5rem', boxShadow: '20px 20px 0 var(--secondary)' }}>
                        <iframe src={mapsUrl} width="100%" height="100%" style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg) brightness(0.8)' }} allowFullScreen loading="lazy"></iframe>
                     </div>
                   )}
                </div>
             </div>
          </div>
        );

      default:
        return (
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '12rem 4vw' }}>
             <div style={{ fontSize: '1.2rem', lineHeight: 2, textTransform: 'uppercase' }} dangerouslySetInnerHTML={{ __html: content.body || '' }} />
          </div>
        );
    }
  };

  return (
    <div style={{ ...vars, background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Courier New', monospace" }}>
      <div className="scanlines" />
      <RetroNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} p={p} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <RetroFooter settings={settings} siteName={siteName} footerCfg={footerCfg} p={p} />
      <style dangerouslySetInnerHTML={{ __html: `
        .scanlines {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          z-index: 1000;
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }
        .bg-grid {
          background-image: 
            linear-gradient(to right, var(--primary)11 1px, transparent 1px),
            linear-gradient(to bottom, var(--primary)11 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}} />
    </div>
  );
}

function RetroNavbar({ settings, siteName, navPages, currentSlug, p, subdomain }: any) {
  return (
    <nav style={{ height: '110px', padding: '0 4vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'black', position: 'sticky', top: 0, zIndex: 100, borderBottom: '4px solid var(--primary)', boxShadow: '0 10px 30px var(--primary)33' }}>
      <Link to={`/preview/${subdomain}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ width: '56px', height: '56px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '6px 6px 0 var(--secondary)' }}>
           <Terminal size={32} color="black" />
        </div>
        {settings?.logo_url ? (
          <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '44px', width: 'auto', filter: 'brightness(1) contrast(1.5)' }} />
        ) : (
          <span style={{ fontWeight: 900, fontSize: '2rem', color: 'var(--primary)', letterSpacing: '0.2em', textTransform: 'uppercase', textShadow: '2px 2px 0 var(--secondary)' }}>{siteName}</span>
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
                color: isActive ? 'black' : 'var(--primary)', 
                background: isActive ? 'var(--primary)' : 'transparent',
                padding: '0.8rem 1.5rem',
                fontSize: '0.75rem', 
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                border: '2px solid var(--primary)',
                boxShadow: isActive ? '4px 4px 0 var(--secondary)' : 'none',
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

function RetroFooter({ settings, siteName, footerCfg, p }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <footer style={{ background: 'black', borderTop: '8px solid var(--primary)', padding: '15rem 4vw 6rem', position: 'relative' }}>
      <div className="absolute inset-x-0 top-0 h-4 bg-grid opacity-10" />
      <div style={{ maxWidth: '1800px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr', gap: '10rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '4rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--secondary)' }} />
            <span style={{ fontWeight: 950, fontSize: '2rem', color: 'var(--primary)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{siteName}</span>
          </div>
          <p style={{ opacity: 0.5, lineHeight: 1.8, fontSize: '0.9rem', marginBottom: '5rem', maxWidth: '400px', textTransform: 'uppercase', color: 'var(--text-main)' }}>{footerCfg.short_description || footerCfg.footer_description}</p>
          <div style={{ display: 'flex', gap: '2rem' }}>
             {(footerCfg.social_links || []).map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ width: '56px', height: '56px', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', transition: 'all 0.4s', boxShadow: '5px 5px 0 var(--secondary)' }} onMouseOver={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'black'; }} onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--primary)'; }}>
                   <SocialIcon type={social.icon} size={24} />
                </a>
             ))}
          </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '4rem', color: 'var(--secondary)' }}>Map_Directory</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((ln: any, i: number) => (
                 <a key={i} href={ln.url} style={{ textDecoration: 'none', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.6 }}>{ln.label}</a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '4rem', color: 'var(--secondary)' }}>Comms_Relay</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', opacity: 0.2, fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--primary)' }}>
              <span>User_Access</span>
              <span>Data_Transfer</span>
              <span>Grid_Capacity</span>
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '4rem', color: 'var(--secondary)' }}>Direct_Signal</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', fontSize: '1.2rem', color: 'var(--primary)' }}>
              {contact.phone && <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}><Phone size={22} /> <b>{contact.phone}</b></div>}
              {contact.whatsapp && <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}><MessageCircle size={22} color="var(--secondary)" /> <b>CHANNEL</b></div>}
              {contact.email && <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}><Mail size={22} style={{ opacity: 0.3 }} /> <b style={{ fontSize: '1rem', opacity: 0.5 }}>{contact.email}</b></div>}
              
              {footerCfg.location_embed_link && (
                <div style={{ width: '100%', height: '220px', border: '4px solid var(--primary)', background: 'black', padding: '0.5rem', marginTop: '2rem', filter: 'invert(1) hue-rotate(180deg)', boxShadow: '10px 10px 0 var(--secondary)' }}>
                   <iframe src={footerCfg.location_embed_link.includes('<iframe') ? footerCfg.location_embed_link.match(/src="([^"]+)"/)?.[1] : footerCfg.location_embed_link} width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>
                </div>
              )}
           </div>
        </div>
      </div>
      <div style={{ maxWidth: '1800px', margin: '12rem auto 0', paddingTop: '4rem', borderTop: '2px solid var(--primary)33', fontSize: '0.8rem', opacity: 0.1, textAlign: 'center', fontWeight: 900, letterSpacing: '1.2em', textTransform: 'uppercase', color: 'var(--primary)' }}>
         © {new Date().getFullYear()} {siteName.toUpperCase()} - SOVEREIGN_DATA_CORE_DETECTED.
      </div>
    </footer>
  );
}
