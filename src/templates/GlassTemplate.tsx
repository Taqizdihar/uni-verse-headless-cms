// src/templates/GlassTemplate.tsx
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
  Sun, 
  Cloud, 
  Waves, 
  Sparkles, 
  Layers, 
  Eye, 
  Share2, 
  Info, 
  MapPin, 
  ChevronRight, 
  Globe, 
  Zap,
  MousePointer2
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

export default function GlassTemplate({ 
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
  const siteName = settings?.site_name || 'Glass Clarity';
  const content = pageData?.content || {};
  const pageType = pageData?.page_type || 'home';
  const p = palette || { 
    primary: themeColor || '#6366F1', 
    secondary: '#EC4899', 
    surface: '#FFFFFF', 
    text: '#1E293B', 
    name: 'Glassmorphism' 
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
        <GlassNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} p={p} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} palette={p} currentSlug={currentSlug} />
        </main>
        <GlassFooter settings={settings} siteName={siteName} footerCfg={footerCfg} p={p} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
             <section style={{ padding: '12rem 4vw', textAlign: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '10%', left: '10%', width: '40vw', height: '40vw', background: 'var(--primary)', filter: 'blur(120px)', opacity: 0.1, borderRadius: '50%', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '30vw', height: '30vw', background: 'var(--secondary)', filter: 'blur(120px)', opacity: 0.1, borderRadius: '50%', pointerEvents: 'none' }} />
                
                <div style={{ position: 'relative', zIndex: 10 }}>
                   <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 2rem', background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '100px', backdropFilter: 'blur(20px)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '3.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
                      <Sparkles size={16} /> Refining Digital Clarity
                   </div>
                   {content.headline && (
                     <h1 style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1, letterSpacing: '-0.03em', marginBottom: '2.5rem' }}>
                        {content.headline}
                     </h1>
                   )}
                   {content.sub_headline && (
                     <p style={{ fontSize: '1.4rem', opacity: 0.5, maxWidth: '800px', margin: '0 auto 5rem' }}>
                        {content.sub_headline}
                     </p>
                   )}
                </div>
             </section>
             {content.hero_image && (
               <div style={{ padding: '0 4vw 10rem', position: 'relative', zIndex: 10 }}>
                  <div style={{ background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(40px)', padding: '2rem', borderRadius: '4rem', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 40px 100px rgba(0,0,0,0.05)' }}>
                     <img src={fixImg(content.hero_image)} alt="Hero" style={{ width: '100%', height: '700px', objectFit: 'cover', borderRadius: '2.5rem' }} />
                  </div>
               </div>
             )}
          </div>
        );

      case 'profile':
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '10rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem', alignItems: 'center' }}>
                <div style={{ padding: '6rem', background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(40px)', borderRadius: '4rem', border: '1px solid rgba(255,255,255,0.4)', position: 'relative' }}>
                   <div style={{ position: 'absolute', top: '2rem', left: '2rem', width: '60px', height: '60px', borderRadius: '20px', background: 'linear-gradient(45deg, var(--primary), var(--secondary))', opacity: 0.1 }} />
                   <h2 style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1 }}>Deep Clarity.<br /><span style={{ color: 'var(--primary)' }}>Pure vision.</span></h2>
                </div>
                <div 
                  style={{ fontSize: '1.25rem', lineHeight: 2, opacity: 0.6, whiteSpace: 'pre-wrap' }}
                  dangerouslySetInnerHTML={{ __html: content.about_us || '' }}
                />
             </div>
          </div>
        );

      case 'gallery':
        const galleryImages = Array.isArray(content.images) ? content.images : [];
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
                {content.gallery_title && <h1 style={{ fontSize: '5rem', fontWeight: 800, marginBottom: '1.5rem' }}>{content.gallery_title}</h1>}
                {content.description && <p style={{ fontSize: '1.2rem', opacity: 0.4 }}>{content.description}</p>}
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '3rem' }}>
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} style={{ aspectRatio: '4/5', borderRadius: '3rem', overflow: 'hidden', padding: '1.5rem', background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)' }} className="group">
                     <img src={fixImg(img)} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2rem', transition: 'all 0.6s' }} className="group-hover:scale-105 group-hover:rotate-1" />
                  </div>
                ))}
             </div>
          </div>
        );

      case 'news':
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '6rem', marginBottom: '10rem', background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '4rem', overflow: 'hidden' }}>
                <div style={{ padding: '6rem' }}>
                   <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', marginBottom: '2rem' }}>
                      <Waves size={20} /> FLUID_SIGNAL_ACQUIRED
                   </div>
                   <h1 style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '2rem' }}>{pageData.title}</h1>
                   <div style={{ fontSize: '1.2rem', opacity: 0.6, lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: content.summary || '' }} />
                </div>
                <img src={fixImg(content.featured_image)} alt="Featured" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(1.1) contrast(1.1)' }} />
             </div>

             <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '6rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Crystal Stream</h2>
                <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, rgba(255,255,255,0), var(--primary)44, rgba(255,255,255,0))' }} />
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '3rem' }}>
                {posts.map((post) => (
                  <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <article style={{ background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)', borderRadius: '3.5rem', padding: '2rem', transition: 'all 0.4s' }} className="group hover:bg-white/60 hover:-translate-y-2">
                        <div style={{ height: '300px', borderRadius: '2.5rem', overflow: 'hidden', marginBottom: '2.5rem' }}>
                           <img src={fixImg(post.content?.featured_image)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="group-hover:scale-105" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', items: 'center', marginBottom: '1.5rem' }}>
                           <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.8rem' }}>{post.category}</span>
                           <span style={{ fontSize: '0.75rem', opacity: 0.3, fontWeight: 700 }}>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.2 }}>{post.title}</h3>
                        <p style={{ opacity: 0.5, fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>{post.excerpt || post.content?.summary}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary)' }}>
                           READ JOURNAL <ChevronRight size={18} className="group-hover:translate-x-4 transition-transform" />
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
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem', alignItems: 'center' }}>
                <div>
                   <h1 style={{ fontSize: '6rem', fontWeight: 800, lineHeight: 0.9, marginBottom: '6rem', letterSpacing: '-0.04em' }}>Ambient<br />Pulse.</h1>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                      {content.email && (
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                           <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Mail size={28} color="var(--primary)" />
                           </div>
                           <div>
                              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, opacity: 0.3, textTransform: 'uppercase' }}>Fluid Relay</span>
                              <b style={{ fontSize: '1.8rem' }}>{content.email}</b>
                           </div>
                        </div>
                      )}
                      {content.phone && (
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                           <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Phone size={28} color="var(--secondary)" />
                           </div>
                           <div>
                              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, opacity: 0.3, textTransform: 'uppercase' }}>Waves Connection</span>
                              <b style={{ fontSize: '1.8rem' }}>{content.phone}</b>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
                <div style={{ position: 'relative' }}>
                   <div style={{ position: 'absolute', inset: '-2rem', background: 'var(--primary)', filter: 'blur(60px)', opacity: 0.1, borderRadius: '4rem', zIndex: -1 }} />
                   {mapsUrl && (
                     <div style={{ width: '100%', height: '650px', borderRadius: '4rem', border: '8px solid rgba(255,255,255,0.5)', overflow: 'hidden', padding: '1rem', background: 'rgba(255,255,255,0.2)' }}>
                        <iframe src={mapsUrl} width="100%" height="100%" style={{ border: 0, borderRadius: '3rem', filter: 'contrast(1.1) brightness(1.1)' }} allowFullScreen loading="lazy"></iframe>
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
    <div style={{ ...vars, background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif", position: 'relative' }}>
      <GlassNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} p={p} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <GlassFooter settings={settings} siteName={siteName} footerCfg={footerCfg} p={p} />
    </div>
  );
}

function GlassNavbar({ settings, siteName, navPages, currentSlug, p, subdomain }: any) {
  return (
    <nav style={{ height: '110px', padding: '0 4vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.6)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(30px)' }}>
      <Link to={`/preview/${subdomain}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(45deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <Layers size={24} color="#FFF" />
        </div>
        <span style={{ fontWeight: 800, fontSize: '1.8rem', letterSpacing: '-0.04em' }}>{siteName}</span>
      </Link>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {navPages.map((nav: any) => {
          const isActive = currentSlug === nav.slug?.replace(/^\/+/, '');
          return (
            <Link 
              key={nav.slug} 
              to={`/preview/${subdomain}/${nav.slug?.replace(/^\/+/, '')}`} 
              style={{ 
                textDecoration: 'none', 
                color: 'inherit', 
                fontSize: '0.85rem', 
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                background: isActive ? 'rgba(255,255,255,0.6)' : 'transparent',
                padding: '0.6rem 1.8rem',
                borderRadius: '12px',
                border: isActive ? '1px solid rgba(255,255,255,0.8)' : '1px solid transparent',
                opacity: isActive ? 1 : 0.4,
                transition: 'all 0.4s'
              }}>
              {nav.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function GlassFooter({ settings, siteName, footerCfg, p }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <footer style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(50px)', borderTop: '1px solid rgba(255,255,255,0.6)', padding: '12rem 4vw 4vw' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr', gap: '8rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
            {settings?.logo_url && <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '40px', width: 'auto' }} />}
            <span style={{ fontWeight: 800, fontSize: '2.2rem' }}>{siteName}</span>
          </div>
          <p style={{ opacity: 0.4, lineHeight: 1.8, fontSize: '1rem', marginBottom: '4rem', maxWidth: '400px' }}>{footerCfg.short_description || footerCfg.footer_description}</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
             {(footerCfg.social_links || []).map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit', transition: 'all 0.4s' }} onMouseOver={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'translateY(-8px) rotate(8deg)'; }} onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.4)'; e.currentTarget.style.transform = 'none'; }}>
                   <SocialIcon type={social.icon} size={24} />
                </a>
             ))}
          </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '3rem', opacity: 0.3 }}>Refractions</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((ln: any, i: number) => (
                 <a key={i} href={ln.url} style={{ textDecoration: 'none', color: 'inherit', fontSize: '1rem', fontWeight: 700, opacity: 0.5 }}>{ln.label}</a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '3rem', opacity: 0.3 }}>Optics</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', opacity: 0.2, fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase' }}>
              <span>CLARITY_PACT</span>
              <span>SYSTEM_ROOT</span>
              <span>NODE_PROTOCOL</span>
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '3rem', opacity: 0.3 }}>Prism Hub</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontSize: '1.1rem' }}>
              {contact.phone && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><Waves size={20} color="var(--primary)" /> <b>{contact.phone}</b></div>}
              {contact.whatsapp && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><MessageCircle size={20} color="var(--secondary)" /> <b>{contact.whatsapp}</b></div>}
              {contact.email && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><Mail size={20} style={{ opacity: 0.3 }} /> <b>{contact.email}</b></div>}
              {contact.service_hours && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', opacity: 0.2 }}><Sparkles size={20} /> <span>{contact.service_hours}</span></div>}
              
              {footerCfg.location_embed_link && (
                <div style={{ width: '100%', height: '200px', borderRadius: '2.5rem', overflow: 'hidden', marginTop: '1.5rem', border: '5px solid rgba(255,255,255,0.4)' }}>
                   <iframe src={footerCfg.location_embed_link.includes('<iframe') ? footerCfg.location_embed_link.match(/src="([^"]+)"/)?.[1] : footerCfg.location_embed_link} width="100%" height="100%" style={{ border: 0, filter: 'grayscale(1) brightness(1.2) contrast(0.8)' }} loading="lazy"></iframe>
                </div>
              )}
           </div>
        </div>
      </div>
      <div style={{ maxWidth: '1600px', margin: '8rem auto 0', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.4)', fontSize: '0.8rem', opacity: 0.2, textAlign: 'center', fontWeight: 800, letterSpacing: '0.5em', textTransform: 'uppercase' }}>
         © {new Date().getFullYear()} {siteName.toUpperCase()} LABS / ALL_REFRACTIONS_SECURED.
      </div>
    </footer>
  );
}
