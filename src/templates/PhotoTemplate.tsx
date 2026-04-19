// src/templates/PhotoTemplate.tsx
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
  Camera, 
  Eye, 
  MapPin, 
  Maximize, 
  ChevronDown,
  Aperture,
  Layers,
  Zap,
  ChevronRight,
  Minus
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

export default function PhotoTemplate({ 
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
  const siteName = settings?.site_name || 'Visual Portfolio';
  const content = pageData?.content || {};
  const pageType = pageData?.page_type || 'home';
  const p = { 
    primary: palette?.primary || themeColor || '#FFFFFF', 
    secondary: '#FFFFFF', 
    surface: '#080808', 
    text: '#F4F4F5', 
    name: 'Photography Dark' 
  };
  const footerCfg = settings?.global_options?.footer_config || {};

  
  if (postData) {
    return (
      <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
        <PhotoNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} currentSlug={currentSlug} />
        </main>
        <PhotoFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
             <section style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
                {content.hero_image && <img src={fixImg(content.hero_image)} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 8vw' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', color: 'var(--primary-color)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8em', fontSize: '0.75rem', marginBottom: '4rem' }}>
                      <Aperture size={20} className="animate-spin-slow" /> VISUAL FIDELITY NODE
                   </div>
                   {content.headline && (
                     <h1 style={{ fontSize: 'clamp(3.5rem, 8vw, 8rem)', fontWeight: 200, textTransform: 'uppercase', lineHeight: 0.9, letterSpacing: '-0.02em', marginBottom: '4rem' }}>
                        {content.headline}
                     </h1>
                   )}
                   {content.sub_headline && (
                     <p style={{ fontSize: '1.1rem', opacity: 0.5, maxWidth: '600px', lineHeight: 1.8, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                        {content.sub_headline}
                     </p>
                   )}
                </div>
                <div style={{ position: 'absolute', bottom: '4rem', right: '4vw', display: 'flex', gap: '6rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.7rem', fontWeight: 900, opacity: 0.2, textTransform: 'uppercase', letterSpacing: '0.5em' }}>
                       SCROLL <ChevronDown size={14} />
                    </div>
                </div>
                <style dangerouslySetInnerHTML={{ __html: `@keyframes spin-slow { to { transform: rotate(360deg); } } .animate-spin-slow { animation: spin-slow 15s linear infinite; }` }} />
             </section>
             <div style={{ padding: '8rem 4vw', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem', background: '#000' }}>
                {[
                  { l: 'FOCAL_LENGTH', v: '35mm' },
                  { l: 'APERTURE_STOP', v: 'f/1.2' },
                  { l: 'SHUTTER_SYNC', v: '1/8000' },
                  { l: 'ISO_RANGE', v: 'BASE_100' }
                ].map((s, i) => (
                  <div key={i} style={{ padding: '3rem', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
                     <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 900, opacity: 0.2, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '1.5rem' }}>{s.l}</label>
                     <b style={{ fontSize: '2rem', fontWeight: 300, color: 'var(--primary-color)' }}>{s.v}</b>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'profile':
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '15rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '10rem', alignItems: 'start' }}>
                <div style={{ borderLeft: '1px solid var(--primary-color)', paddingLeft: '5rem' }}>
                   <h2 style={{ fontSize: '4rem', fontWeight: 200, textTransform: 'uppercase', letterSpacing: '0.2em', lineHeight: 1 }}>THE ART<br />OF VISION.</h2>
                </div>
                <div 
                  style={{ fontSize: '1.3rem', lineHeight: 2, opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'pre-wrap' }}
                  dangerouslySetInnerHTML={{ __html: content.about_us || '' }}
                />
             </div>
          </div>
        );

      case 'gallery':
        const galleryImages = Array.isArray(content.images) ? content.images : [];
        return (
          <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '10rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ marginBottom: '10rem', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '5rem' }}>
                {content.gallery_title && <h1 style={{ fontSize: '6rem', fontWeight: 200, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>{content.gallery_title}</h1>}
                {content.description && <p style={{ fontSize: '1.1rem', opacity: 0.3, textTransform: 'uppercase', letterSpacing: '0.3em', marginTop: '2.5rem' }}>{content.description}</p>}
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', gap: '3px' }}>
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} style={{ height: '700px', overflow: 'hidden', filter: 'grayscale(1)', transition: 'all 0.8s' }} className="hover:grayscale-0 group">
                     <img src={fixImg(img)} alt={`Frame ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 1.2s' }} className="group-hover:scale-105" />
                  </div>
                ))}
             </div>
          </div>
        );

      case 'news':
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '10rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '8rem', marginBottom: '12rem' }}>
                <div style={{ borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: '8rem' }}>
                   <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', color: 'var(--primary-color)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: '0.75rem', marginBottom: '4rem' }}><Layers size={18} /> EDITORIAL_FEED</div>
                   <h1 style={{ fontSize: '5rem', fontWeight: 200, textTransform: 'uppercase', lineHeight: 1, marginBottom: '4rem' }}>{pageData.title}</h1>
                   <div style={{ fontSize: '1.25rem', opacity: 0.3, lineHeight: 2, textTransform: 'uppercase', letterSpacing: '0.1em' }} dangerouslySetInnerHTML={{ __html: content.summary || '' }} />
                </div>
                <img src={fixImg(content.featured_image)} alt="Featured" style={{ width: '100%', height: '700px', objectFit: 'cover', filter: 'grayscale(1)' }} />
             </div>

             <div style={{ display: 'flex', alignItems: 'center', gap: '4rem', marginBottom: '8rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 200, textTransform: 'uppercase', letterSpacing: '0.3em' }}>VISUAL_LOGS</h2>
                <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.05)' }} />
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '6rem' }}>
                {posts.map((post) => (
                  <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <article className="group">
                        <div style={{ height: '400px', overflow: 'hidden', marginBottom: '3.5rem', filter: 'grayscale(1)', transition: 'all 0.6s' }} className="group-hover:grayscale-0">
                           <img src={fixImg(post.content?.featured_image)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                           <span style={{ fontWeight: 900, color: 'var(--primary-color)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2rem' }}>{post.category}</span>
                           <span style={{ fontSize: '0.7rem', opacity: 0.2, fontWeight: 900 }}>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <h3 style={{ fontSize: '2.5rem', fontWeight: 200, textTransform: 'uppercase', marginBottom: '2.5rem', lineHeight: 1 }}>{post.title}</h3>
                        <p style={{ opacity: 0.3, fontSize: '1rem', lineHeight: 1.6, textTransform: 'uppercase', marginBottom: '3.5rem' }}>{post.excerpt || post.content?.summary}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 900, fontSize: '0.8rem', color: 'var(--primary-color)', letterSpacing: '0.2em' }}>
                           VIEW_SERIES <ArrowRight size={20} className="group-hover:translate-x-6 transition-transform" />
                        </div>
                     </article>
                  </Link>
                ))}
             </div>
          </div>
        );

      case 'contact':
        const mapsLink = content.maps_link?.includes('<iframe') ? content.maps_link.match(/src="([^"]+)"/)?.[1] : content.maps_link;
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '15rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15rem', alignItems: 'center' }}>
                <div>
                   <h1 style={{ fontSize: '7rem', fontWeight: 200, textTransform: 'uppercase', lineHeight: 0.85, letterSpacing: '-0.02em', marginBottom: '8rem' }}>Direct<br />Signal.</h1>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
                      {content.email && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, opacity: 0.2, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '2rem' }}>Digital Gateway</span>
                           <b style={{ fontSize: '2.2rem', fontWeight: 200, borderBottom: '1px solid var(--primary-color)', paddingBottom: '1rem' }}>{content.email}</b>
                        </div>
                      )}
                      {content.phone && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, opacity: 0.2, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '2rem' }}>Voice Protocol</span>
                           <b style={{ fontSize: '2.5rem', fontWeight: 200 }}>{content.phone}</b>
                        </div>
                      )}
                   </div>
                </div>
                <div>
                   {mapsLink && (
                     <div style={{ width: '100%', height: '800px', border: '1px solid rgba(255,255,255,0.05)', filter: 'grayscale(1) invert(0.9) contrast(1.2)' }}>
                        <iframe src={mapsLink} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
                     </div>
                   )}
                </div>
             </div>
          </div>
        );

      default:
        return (
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '15rem 4vw' }}>
             <div style={{ fontSize: '1.25rem', lineHeight: 2, opacity: 0.4 }} dangerouslySetInnerHTML={{ __html: content.body || '' }} />
          </div>
        );
    }
  };

  return (
    <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
      <PhotoNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <PhotoFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
    </div>
  );
}

function PhotoNavbar({ settings, siteName, navPages, currentSlug, subdomain }: any) {
  return (
    <nav style={{ height: '100px', padding: '0 4vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(8,8,8,0.8)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
      <Link to={`/preview/${subdomain}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {settings?.logo_url ? (
          <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '32px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
        ) : (
          <span style={{ fontWeight: 200, fontSize: '2rem', textTransform: 'uppercase', color: '#FFF', letterSpacing: '0.4em' }}>{siteName}</span>
        )}
      </Link>
      <div style={{ display: 'flex', gap: '4vw' }}>
        {navPages.map((nav: any) => {
          const isActive = currentSlug === nav.slug?.replace(/^\/+/, '');
          return (
            <Link 
              key={nav.slug} 
              to={`/preview/${subdomain}/${nav.slug?.replace(/^\/+/, '')}`} 
              style={{ 
                textDecoration: 'none', 
                color: isActive ? 'var(--primary-color)' : 'inherit', 
                fontSize: '0.75rem', 
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                opacity: isActive ? 1 : 0.2,
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

function PhotoFooter({ settings, siteName, footerCfg }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <footer style={{ background: '#000', color: '#FFF', padding: '15rem 4vw 6rem', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
      <div style={{ maxWidth: '1800px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr', gap: '10rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '4rem' }}>
            <span style={{ fontWeight: 200, fontSize: '2.5rem', textTransform: 'uppercase', color: '#FFF', letterSpacing: '0.4em' }}>{siteName}</span>
          </div>
          <p style={{ opacity: 0.2, lineHeight: 2, fontSize: '0.9rem', marginBottom: '5rem', maxWidth: '400px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{footerCfg.short_description || footerCfg.footer_description}</p>
          <div style={{ display: 'flex', gap: '2.5rem' }}>
             {(footerCfg.social_links || []).map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ color: '#FFF', opacity: 0.1, transition: 'all 0.4s' }} onMouseOver={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'var(--primary-color)'; e.currentTarget.style.transform = 'translateY(-10px) rotate(10deg)'; }} onMouseOut={e => { e.currentTarget.style.opacity = '0.1'; e.currentTarget.style.color = '#FFF'; e.currentTarget.style.transform = 'none'; }}>
                   <SocialIcon type={social.icon} size={28} />
                </a>
             ))}
          </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em', marginBottom: '4rem', opacity: 0.1 }}>Expeditions</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((ln: any, i: number) => (
                 <a key={i} href={ln.url} style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.2 }}>{ln.label}</a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em', marginBottom: '4rem', opacity: 0.1 }}>Signal Hub</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', opacity: 0.1, fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
              <span>Visual_Archive</span>
              <span>Metadata_Link</span>
              <span>Rights_Node</span>
           </div>
        </div>

        <div style={{ textAlign: 'right' }}>
           <h4 style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em', marginBottom: '4rem', opacity: 0.1 }}>Studio Link</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', fontSize: '1.2rem' }}>
              {contact.phone && <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'flex-end' }}> <b>{contact.phone}</b> <Phone size={20} style={{ opacity: 0.1 }} /></div>}
              {contact.whatsapp && <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'flex-end' }}> <b>WASH_COMM</b> <MessageCircle size={20} style={{ opacity: 0.1 }} /></div>}
              {contact.email && <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'flex-end' }}> <b style={{ fontSize: '1rem', opacity: 0.4 }}>{contact.email}</b> <Mail size={20} style={{ opacity: 0.1 }} /></div>}
              
              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                 <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary-color)', boxShadow: '0 0 20px var(--primary-color)' }} />
                 </div>
              </div>
           </div>
        </div>
      </div>
      <div style={{ maxWidth: '1800px', margin: '12rem auto 0', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.03)', fontSize: '0.75rem', opacity: 0.1, textAlign: 'center', fontWeight: 900, letterSpacing: '1em', textTransform: 'uppercase' }}>
         © {new Date().getFullYear()} {siteName.toUpperCase()} - VISUAL_SOVEREIGNTY_PROTOCOL.
      </div>
    </footer>
  );
}
