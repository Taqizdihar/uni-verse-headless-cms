// src/templates/TravelTemplate.tsx
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
  Compass, 
  Map, 
  Camera, 
  Globe, 
  Plane, 
  Star, 
  ChevronRight, 
  Share2, 
  Info, 
  MapPin, 
  Tent, 
  Sun, 
  Wind,
  Navigation,
  Backpack,
  Binoculars
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

export default function TravelTemplate({ 
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
  const siteName = settings?.site_name || 'Global Explorer';
  const content = pageData?.content || {};
  const pageType = pageData?.page_type || 'home';
    const footerCfg = settings?.global_options?.footer_config || {};

  
  if (postData) {
    return (
      <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
        <TravelNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} currentSlug={currentSlug} />
        </main>
        <TravelFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
             <section style={{ height: '85vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                {content.hero_image && <img src={fixImg(content.hero_image)} alt="Expedition" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,74,110,0.8), rgba(12,74,110,0.3))' }} />
                <div style={{ position: 'relative', zIndex: 1, padding: '0 4vw', maxWidth: '1100px' }}>
                   <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 2rem', background: 'var(--primary-color)', color: '#FFF', borderRadius: '5px', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '4rem', transform: 'rotate(-2deg)' }}>
                      <Globe size={18} className="animate-spin-slow" /> Discovering Hidden Gems Globally
                   </div>
                   {content.headline && (
                     <h1 style={{ fontSize: 'clamp(3.5rem, 8vw, 7.5rem)', fontWeight: 950, color: '#FFF', lineHeight: 0.9, letterSpacing: '-0.04em', textShadow: '0 20px 40px rgba(0,0,0,0.2)', marginBottom: '3.5rem' }}>
                        {content.headline}
                     </h1>
                   )}
                   {content.sub_headline && (
                     <p style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.8)', maxWidth: '800px', margin: '0 auto 5rem', lineHeight: 1.6, fontWeight: 500 }}>
                        {content.sub_headline}
                     </p>
                   )}
                   <Link to={`/preview/${subdomain}/contact`} style={{ display: 'inline-block', padding: '1.2rem 4rem', background: 'var(--secondary-color)', color: '#FFF', fontWeight: 900, textTransform: 'uppercase', textDecoration: 'none', letterSpacing: '0.2rem', boxShadow: '10px 10px 0 var(--text-color)', fontSize: '0.85rem' }}>
                      START JOURNEY
                   </Link>
                </div>
                <style dangerouslySetInnerHTML={{ __html: `@keyframes spin-slow { to { transform: rotate(360deg); } } .animate-spin-slow { animation: spin-slow 20s linear infinite; }` }} />
             </section>
             <div style={{ padding: '6rem 4vw', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem', background: 'var(--text-color)', color: '#FFF' }}>
                {[
                  { i: Map, t: 'Curated Maps', d: 'Expert Route Planning' },
                  { i: Camera, t: 'visual Archive', d: 'Premium Memory Capture' },
                  { i: Backpack, t: 'Full Protocol', d: 'Gear & Safety Standards' },
                  { i: Navigation, t: 'Real-time Link', d: 'Global Tracking Sync' }
                ].map((item: any, i) => (
                  <div key={i} style={{ borderLeft: '2px solid var(--secondary-color)', paddingLeft: '2.5rem' }}>
                     {item.i && <item.i size={32} color="var(--primary-color)" style={{ marginBottom: '1.5rem' }} />}
                     <h4 style={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '0.5rem', letterSpacing: '0.2em' }}>{item.t}</h4>
                     <p style={{ fontSize: '0.8rem', opacity: 0.4, fontWeight: 700 }}>{item.d}</p>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'profile':
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '10rem', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                   <div style={{ position: 'absolute', top: '-4rem', left: '-4rem', width: '200px', height: '200px', background: 'var(--secondary-color)22', borderRadius: '50%' }} />
                   <h2 style={{ fontSize: '5rem', fontWeight: 950, color: 'var(--text-color)', lineHeight: 0.9 }}>Explorer<br />Charter.</h2>
                </div>
                <div 
                  style={{ fontSize: '1.3rem', lineHeight: 1.8, opacity: 0.7, whiteSpace: 'pre-wrap' }}
                  dangerouslySetInnerHTML={{ __html: content.about_us || '' }}
                />
             </div>
          </div>
        );

      case 'gallery':
        const galleryImages = Array.isArray(content.images) ? content.images : [];
        return (
          <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '10rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ marginBottom: '10rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                   {content.gallery_title && <h1 style={{ fontSize: '5rem', fontWeight: 950, color: 'var(--text-color)' }}>{content.gallery_title}</h1>}
                   {content.description && <p style={{ fontSize: '1.25rem', opacity: 0.4, marginTop: '2rem', maxWidth: '700px' }}>{content.description}</p>}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 900, opacity: 0.2, textTransform: 'uppercase', letterSpacing: '0.4em' }}>VISUAL_ARCHIVE_NODE_88</div>
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', gap: '4rem' }}>
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} style={{ borderRadius: '2rem', overflow: 'hidden', height: '650px', position: 'relative', border: '5px solid #F1F5F9', boxShadow: '0 40px 80px rgba(12,74,110,0.05)' }} className="group">
                     <img src={fixImg(img)} alt={`Discovery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.8s' }} className="group-hover:scale-110" />
                     <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--text-color), transparent)', opacity: 0, transition: 'all 0.4s' }} className="group-hover:opacity-60" />
                  </div>
                ))}
             </div>
          </div>
        );

      case 'news':
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '8rem', marginBottom: '12rem', background: '#F8FAFC', borderRadius: '3rem', overflow: 'hidden', border: '1px solid #F1F5F9' }}>
                <div style={{ padding: '8rem' }}>
                   <div style={{ display: 'inline-flex', padding: '1rem 3rem', background: 'var(--text-color)', color: '#FFF', fontWeight: 900, fontSize: '0.75rem', borderRadius: '5px', marginBottom: '3rem', textTransform: 'uppercase', letterSpacing: '0.3em' }}>EXPEDITION LOGS</div>
                   <h1 style={{ fontSize: '5rem', fontWeight: 950, lineHeight: 0.9, color: 'var(--text-color)', marginBottom: '3rem' }}>{pageData.title}</h1>
                   <div style={{ fontSize: '1.3rem', opacity: 0.6, lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: content.summary || '' }} />
                </div>
                <img src={fixImg(content.featured_image)} alt="Expedition context" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>

             <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', marginBottom: '8rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 950, textTransform: 'uppercase' }}>Recent Frontiers</h2>
                <div style={{ height: '4px', flex: 1, background: 'var(--primary-color)' }} />
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '5rem' }}>
                {posts.map((post) => (
                  <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <article style={{ background: '#FFF', borderRadius: '2rem', overflow: 'hidden', transition: 'all 0.4s' }} className="group">
                        <div style={{ height: '350px', position: 'relative' }}>
                           <img src={fixImg(post.content?.featured_image)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                           <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', background: 'var(--primary-color)', color: '#FFF', padding: '0.5rem 1.5rem', fontWeight: 900, fontSize: '0.75rem' }}>DISCOVER</div>
                        </div>
                        <div style={{ padding: '3.5rem', border: '2px solid #F1F5F9', borderTop: 'none', borderRadius: '0 0 2rem 2rem' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                              <span style={{ fontWeight: 900, color: 'var(--secondary-color)', fontSize: '0.8rem', textTransform: 'uppercase' }}>{post.category}</span>
                              <span style={{ fontSize: '0.7rem', opacity: 0.3, fontWeight: 900 }}>{new Date(post.created_at).toLocaleDateString()}</span>
                           </div>
                           <h3 style={{ fontSize: '2.2rem', fontWeight: 950, color: 'var(--text-color)', marginBottom: '2.5rem', lineHeight: 1.1 }}>{post.title}</h3>
                           <p style={{ opacity: 0.5, fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '3.5rem' }}>{post.excerpt || post.content?.summary}</p>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 900, fontSize: '0.9rem', color: 'var(--text-color)', borderBottom: '2px solid var(--secondary-color)', paddingBottom: '0.5rem', width: 'fit-content' }}>
                              ELEVATE EXPERIENCE <ChevronRight size={18} className="group-hover:translate-x-4 transition-transform" />
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
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15rem', alignItems: 'center' }}>
                <div>
                   <h1 style={{ fontSize: '6rem', fontWeight: 950, color: 'var(--text-color)', lineHeight: 0.9, marginBottom: '8rem' }}>Direct Line to<br />the Wild.</h1>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
                      {content.email && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, opacity: 0.3, textTransform: 'uppercase', letterSpacing: '0.3rem', marginBottom: '2rem' }}>Digital_Beacon</span>
                           <b style={{ fontSize: '2.2rem', color: 'var(--secondary-color)' }}>{content.email}</b>
                        </div>
                      )}
                      {content.phone && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, opacity: 0.3, textTransform: 'uppercase', letterSpacing: '0.3rem', marginBottom: '2rem' }}>Priority_Freq</span>
                           <b style={{ fontSize: '2.5rem', color: 'var(--primary-color)', fontWeight: 900 }}>{content.phone}</b>
                        </div>
                      )}
                   </div>
                </div>
                <div>
                   {mapsUrl && (
                     <div style={{ width: '100%', height: '800px', borderRadius: '4rem', overflow: 'hidden', border: '15px solid #F1F5F9', boxShadow: '0 50px 100px rgba(12,74,110,0.1)' }}>
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
             <div style={{ fontSize: '1.3rem', lineHeight: 2, opacity: 0.6 }} dangerouslySetInnerHTML={{ __html: content.body || '' }} />
          </div>
        );
    }
  };

  return (
    <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
      <TravelNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <TravelFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
    </div>
  );
}

function TravelNavbar({ settings, siteName, navPages, currentSlug, subdomain }: any) {
  return (
    <nav style={{ height: '110px', padding: '0 4vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.85)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(30px)', borderBottom: '6px solid var(--primary-color)' }}>
      <Link to={`/preview/${subdomain}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ width: '56px', height: '56px', background: 'var(--primary-color)', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '10px 10px 0 var(--text-color)' }}>
           <Compass size={32} color="#FFF" />
        </div>
        {settings?.logo_url ? (
          <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '40px', width: 'auto' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
             <span style={{ fontWeight: 950, fontSize: '1.8rem', color: 'var(--text-color)', letterSpacing: '-0.04em', textTransform: 'uppercase', fontStyle: 'italic', borderBottom: '4px solid var(--secondary-color)', lineHeight: 0.9 }}>{siteName}</span>
             <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--primary-color)', letterSpacing: '0.4rem', marginTop: '0.5rem' }}>GLOBAL_ACCESS</span>
          </div>
        )}
      </Link>
      <div style={{ display: 'flex', gap: '3vw', alignItems: 'center' }}>
        {navPages.map((nav: any) => {
          const isActive = currentSlug === nav.slug?.replace(/^\/+/, '');
          return (
            <Link 
              key={nav.slug} 
              to={`/preview/${subdomain}/${nav.slug?.replace(/^\/+/, '')}`} 
              style={{ 
                textDecoration: 'none', 
                color: isActive ? 'var(--primary-color)' : 'inherit', 
                fontSize: '0.85rem', 
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                opacity: isActive ? 1 : 0.4,
                transition: 'all 0.3s'
              }}>
              {nav.title}
            </Link>
          );
        })}
        <Link to={`/preview/${subdomain}/contact`} style={{ padding: '1rem 3rem', background: 'var(--primary-color)', color: '#FFF', borderRadius: '5px', fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', textDecoration: 'none', boxShadow: '8px 8px 0 var(--text-color)' }}>
           ENROL
        </Link>
      </div>
    </nav>
  );
}

function TravelFooter({ settings, siteName, footerCfg }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <footer style={{ background: '#0C4A6E', color: '#FFF', padding: '15rem 4vw 6rem', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '10rem', right: '10vw', opacity: 0.05, transform: 'rotate(15deg)' }}><Binoculars size={500} /></div>
      <div style={{ maxWidth: '1800px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr', gap: '10rem', position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '4rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--primary-color)', borderRadius: '5px' }} />
            <span style={{ fontWeight: 950, fontSize: '1.8rem', color: '#FFF', letterSpacing: '-0.04em', textTransform: 'uppercase', fontStyle: 'italic' }}>{siteName}</span>
          </div>
          <p style={{ opacity: 0.4, lineHeight: 2, fontSize: '1rem', marginBottom: '5rem', maxWidth: '450px', fontWeight: 500 }}>{footerCfg.short_description || footerCfg.footer_description}</p>
          <div style={{ display: 'flex', gap: '2rem' }}>
             {(footerCfg.social_links || []).map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', transition: 'all 0.4s' }} onMouseOver={e => { e.currentTarget.style.background = 'var(--primary-color)'; e.currentTarget.style.transform = 'translateY(-10px) rotate(15deg)'; }} onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'none'; }}>
                   <SocialIcon type={social.icon} size={28} />
                </a>
             ))}
          </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em', marginBottom: '4rem', color: 'var(--primary-color)' }}>Explorer Path</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((ln: any, i: number) => (
                 <a key={i} href={ln.url} style={{ textDecoration: 'none', color: 'inherit', fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.4 }}>{ln.label}</a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em', marginBottom: '4rem', color: 'var(--primary-color)' }}>Registry</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', opacity: 0.1, fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.3rem' }}>
              <span>Explorer_Charter</span>
              <span>Coordinate_Hub</span>
              <span>Risk_Protocol</span>
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em', marginBottom: '4rem', color: 'var(--primary-color)' }}>Signal Relay</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', fontSize: '1.25rem' }}>
              {contact.phone && <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}><Phone size={24} color="var(--primary-color)" /> <b>{contact.phone}</b></div>}
              {contact.whatsapp && <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}><MessageCircle size={24} color="var(--primary-color)" /> <b>CHANNEL</b></div>}
              {contact.email && <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}><Mail size={24} style={{ opacity: 0.2 }} /> <b style={{ fontSize: '1rem', opacity: 0.5 }}>{contact.email}</b></div>}
              
              {footerCfg.location_embed_link && (
                <div style={{ width: '100%', height: '220px', borderRadius: '2.5rem', overflow: 'hidden', marginTop: '2rem', border: '5px solid rgba(255,255,255,0.05)', filter: 'grayscale(1) contrast(1.2)' }}>
                   <iframe src={footerCfg.location_embed_link.includes('<iframe') ? footerCfg.location_embed_link.match(/src="([^"]+)"/)?.[1] : footerCfg.location_embed_link} width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>
                </div>
              )}
           </div>
        </div>
      </div>
      <div style={{ maxWidth: '1800px', margin: '15rem auto 0', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.03)', fontSize: '0.9rem', opacity: 0.1, textAlign: 'center', fontWeight: 950, letterSpacing: '1.5em', textTransform: 'uppercase' }}>
         © {new Date().getFullYear()} {siteName.toUpperCase()} - SOVEREIGN_EXPLORER_INITIATIVE.
      </div>
    </footer>
  );
}
