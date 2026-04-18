// src/templates/PortfolioTemplate.tsx
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
  Code,
  Palette,
  Terminal,
  Cpu,
  Bookmark,
  ChevronRight,
  ExternalLink,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL}`;
const fixImg = (url: string) => url && url.startsWith("/uploads") ? `${BASE_URL}${url}` : url;

const SocialIcon = ({ type, size = 20 }: { type: string, size?: number }) => {
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

export default function PortfolioTemplate({ 
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
  const siteName = settings?.site_name || 'Creative Portfolio';
  const content = pageData?.content || {};
  const pageType = pageData?.page_type || 'home';
  const p = palette || { 
    primary: themeColor || '#6366F1', 
    secondary: '#18181B', 
    surface: '#FFFFFF', 
    text: '#09090B', 
    name: 'Portfolio' 
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
        <PortfolioNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} p={p} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} palette={p} currentSlug={currentSlug} />
        </main>
        <PortfolioFooter settings={settings} siteName={siteName} footerCfg={footerCfg} p={p} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
             <section style={{ padding: '10rem 4vw', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8rem', alignItems: 'center' }}>
                <div>
                   <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1.5rem', background: 'var(--primary)11', color: 'var(--primary)', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.2em', borderRadius: '10px', marginBottom: '3rem' }}>
                      <Sparkles size={16} /> Open for Collaboration
                   </div>
                   {content.headline && (
                     <h1 style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1, marginBottom: '3rem' }}>
                        {content.headline}
                     </h1>
                   )}
                   {content.sub_headline && (
                     <p style={{ fontSize: '1.25rem', opacity: 0.5, maxWidth: '700px', lineHeight: 1.6, marginBottom: '4rem' }}>
                        {content.sub_headline}
                     </p>
                   )}
                   <div style={{ display: 'flex', gap: '4rem' }}>
                      <div style={{ textAlign: 'center' }}>
                         <b style={{ fontSize: '2.5rem', display: 'block' }}>120+</b>
                         <span style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.3, textTransform: 'uppercase' }}>Completed Projects</span>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                         <b style={{ fontSize: '2.5rem', display: 'block' }}>10k</b>
                         <span style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.3, textTransform: 'uppercase' }}>Code Commits</span>
                      </div>
                   </div>
                </div>
                {content.hero_image && (
                   <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', inset: '-2rem', border: '1px solid var(--primary)33', borderRadius: '2rem', transform: 'rotate(4deg)' }} />
                      <img src={fixImg(content.hero_image)} alt="Hero" style={{ width: '100%', height: '650px', objectFit: 'cover', borderRadius: '2rem', position: 'relative', zIndex: 1 }} />
                   </div>
                )}
             </section>
             <div style={{ padding: '6rem 4vw', background: '#F9FAFB', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem' }}>
                {[
                  { i: Code, t: 'Architecture' },
                  { i: Palette, t: 'UI Design' },
                  { i: Terminal, t: 'Engine' },
                  { i: Cpu, t: 'Integration' }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                     <div style={{ width: '56px', height: '56px', borderRadius: '15px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}><item.i size={24} /></div>
                     <h4 style={{ fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase' }}>{item.t}</h4>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'profile':
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '10rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '10rem', alignItems: 'center' }}>
                <div style={{ padding: '5rem', background: 'var(--primary)', color: '#FFF', borderRadius: '3rem', position: 'relative', overflow: 'hidden' }}>
                   <div style={{ fontSize: '6rem', fontWeight: 900, opacity: 0.1, position: 'absolute', top: -10, left: -20 }}>WHO_AM_I</div>
                   <h2 style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1, position: 'relative', zIndex: 1 }}>Crafting<br />Legacy.</h2>
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
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }}>
                <div>
                   {content.gallery_title && <h1 style={{ fontSize: '4.5rem', fontWeight: 900 }}>{content.gallery_title}</h1>}
                   {content.description && <p style={{ fontSize: '1.1rem', opacity: 0.4, marginTop: '2rem' }}>{content.description}</p>}
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 900, opacity: 0.2, textTransform: 'uppercase', letterSpacing: '0.4em' }}>TOTAL_ASSETS_{galleryImages.length}</div>
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '3rem' }}>
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} style={{ borderRadius: '2rem', overflow: 'hidden', height: '500px', position: 'relative' }} className="group">
                     <img src={fixImg(img)} alt={`Creation ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.6s' }} className="group-hover:scale-110" />
                     <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', opacity: 0, transition: 'all 0.4s' }} className="group-hover:opacity-100" />
                  </div>
                ))}
             </div>
          </div>
        );

      case 'news':
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8rem', marginBottom: '10rem', background: '#F9FAFB', borderRadius: '3rem', overflow: 'hidden', border: '1px solid #F1F5F9' }}>
                <div style={{ padding: '6rem' }}>
                   <div style={{ display: 'inline-flex', padding: '0.4rem 1.2rem', background: 'var(--primary)', color: '#FFF', fontWeight: 800, fontSize: '0.7rem', borderRadius: '5px', marginBottom: '3rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>CREATOR_LOGS</div>
                   <h1 style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '3rem' }}>{pageData.title}</h1>
                   <div style={{ fontSize: '1.2rem', opacity: 0.6, lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: content.summary || '' }} />
                </div>
                <img src={fixImg(content.featured_image)} alt="Featured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>

             <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: '6rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase' }}>Recent Musings</h2>
                <div style={{ height: '2px', flex: 1, background: '#F1F5F9' }} />
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '4rem' }}>
                {posts.map((post) => (
                  <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <article style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '3.5rem' }} className="group">
                        <div style={{ height: '320px', borderRadius: '1.5rem', overflow: 'hidden', marginBottom: '2.5rem' }}>
                           <img src={fixImg(post.content?.featured_image)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s' }} className="group-hover:scale-110" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                           <span style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{post.category}</span>
                           <span style={{ fontSize: '0.7rem', opacity: 0.3, fontWeight: 800 }}>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.2 }}>{post.title}</h3>
                        <p style={{ opacity: 0.5, fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>{post.excerpt || post.content?.summary}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 900, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                           DIVE DEEPER <ChevronRight size={18} className="group-hover:translate-x-4 transition-transform" />
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
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10rem', alignItems: 'center' }}>
                <div>
                   <h1 style={{ fontSize: '6rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 0.9, marginBottom: '6rem' }}>Let's Build.<br />Legacy.</h1>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
                      {content.email && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, opacity: 0.2, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.5rem' }}>Transmission</span>
                           <b style={{ fontSize: '2rem', borderBottom: '3px solid var(--primary)' }}>{content.email}</b>
                        </div>
                      )}
                      {content.phone && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, opacity: 0.2, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.5rem' }}>Rapid Link</span>
                           <b style={{ fontSize: '2.5rem' }}>{content.phone}</b>
                        </div>
                      )}
                   </div>
                </div>
                <div>
                   {mapsUrl && (
                     <div style={{ width: '100%', height: '700px', borderRadius: '3rem', overflow: 'hidden', border: '1px solid #F1F5F9', boxShadow: '0 40px 80px rgba(0,0,0,0.05)' }}>
                        <iframe src={mapsUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
                     </div>
                   )}
                </div>
             </div>
          </div>
        );

      default:
        return (
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '10rem 4vw' }}>
             <div style={{ fontSize: '1.2rem', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: content.body || '' }} />
          </div>
        );
    }
  };

  return (
    <div style={{ ...vars, background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
      <PortfolioNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} p={p} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <PortfolioFooter settings={settings} siteName={siteName} footerCfg={footerCfg} p={p} />
    </div>
  );
}

function PortfolioNavbar({ settings, siteName, navPages, currentSlug, p, subdomain }: any) {
  return (
    <nav style={{ height: '100px', padding: '0 4vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.8)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)', borderBottom: '1px solid #F1F5F9' }}>
      <Link to={`/preview/${subdomain}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {settings?.logo_url ? (
          <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '44px', width: 'auto' }} />
        ) : (
          <span style={{ fontWeight: 950, fontSize: '1.8rem', textTransform: 'uppercase', color: 'var(--text-main)', letterSpacing: '-0.04em' }}>{siteName}</span>
        )}
      </Link>
      <div style={{ display: 'flex', gap: '3vw' }}>
        {navPages.map((nav: any) => {
          const isActive = currentSlug === nav.slug?.replace(/^\/+/, '');
          return (
            <Link 
              key={nav.slug} 
              to={`/preview/${subdomain}/${nav.slug?.replace(/^\/+/, '')}`} 
              style={{ 
                textDecoration: 'none', 
                color: isActive ? 'var(--primary)' : 'inherit', 
                fontSize: '0.8rem', 
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
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

function PortfolioFooter({ settings, siteName, footerCfg, p }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <footer style={{ background: 'var(--text-main)', color: '#FFF', padding: '12rem 4vw 4vw' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr', gap: '10rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3.5rem' }}>
            <span style={{ fontWeight: 950, fontSize: '2rem', textTransform: 'uppercase', color: '#FFF', letterSpacing: '-0.04em' }}>{siteName}</span>
          </div>
          <p style={{ opacity: 0.4, lineHeight: 1.8, fontSize: '1rem', marginBottom: '4rem', maxWidth: '400px' }}>{footerCfg.short_description || footerCfg.footer_description}</p>
          <div style={{ display: 'flex', gap: '2rem' }}>
             {(footerCfg.social_links || []).map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', transition: 'all 0.4s' }} onMouseOver={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-5px)'; }} onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'none'; }}>
                   <SocialIcon type={social.icon} size={22} />
                </a>
             ))}
          </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '3.5rem', opacity: 0.2 }}>Navigation</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((ln: any, i: number) => (
                 <a key={i} href={ln.url} style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.4 }}>{ln.label}</a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '3.5rem', opacity: 0.2 }}>Resources</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', opacity: 0.2, fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <span>Case_Studies</span>
              <span>Design_Engine</span>
              <span>Legal_Node</span>
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '3.5rem', opacity: 0.2 }}>Signal Relay</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', fontSize: '1.1rem' }}>
              {contact.phone && <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}><Phone size={20} color="var(--primary)" /> <b>{contact.phone}</b></div>}
              {contact.whatsapp && <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}><MessageCircle size={20} color="#22C55E" /> <b>CHANNEL</b></div>}
              {contact.email && <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}><Mail size={20} style={{ opacity: 0.3 }} /> <b style={{ fontSize: '0.9rem' }}>{contact.email}</b></div>}
              
              {footerCfg.location_embed_link && (
                <div style={{ width: '100%', height: '180px', borderRadius: '1.5rem', overflow: 'hidden', marginTop: '1.5rem', border: '5px solid rgba(255,255,255,0.05)', filter: 'grayscale(1)' }}>
                   <iframe src={footerCfg.location_embed_link.includes('<iframe') ? footerCfg.location_embed_link.match(/src="([^"]+)"/)?.[1] : footerCfg.location_embed_link} width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>
                </div>
              )}
           </div>
        </div>
      </div>
      <div style={{ maxWidth: '1600px', margin: '8rem auto 0', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem', opacity: 0.1, textAlign: 'center', fontWeight: 900, letterSpacing: '0.8em', textTransform: 'uppercase' }}>
         © {new Date().getFullYear()} {siteName.toUpperCase()} - CREATIVE_CORE_Sovereign.
      </div>
    </footer>
  );
}
