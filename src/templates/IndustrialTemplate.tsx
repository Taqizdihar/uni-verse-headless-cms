// src/templates/IndustrialTemplate.tsx
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
  Factory, 
  HardHat, 
  Settings, 
  ShieldCheck, 
  Drill, 
  Box, 
  Truck, 
  ChevronRight, 
  Share2, 
  Info, 
  MapPin, 
  PhoneCall,
  Activity,
  Cpu,
  Zap,
  Hammer
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

export default function IndustrialTemplate({ 
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
  const siteName = settings?.site_name || 'Industrial Foundry';
  const content = pageData?.content || {};
  const pageType = pageData?.page_type || 'home';
  const p = palette || { 
    primary: themeColor || '#F97316', 
    secondary: '#18181B', 
    surface: '#F4F4F5', 
    text: '#09090B', 
    name: 'Industrial' 
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
      <div style={{ ...vars, background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Space Mono', monospace" }}>
        <IndustrialHeader settings={settings} siteName={siteName} />
        <IndustrialNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} p={p} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} palette={p} currentSlug={currentSlug} />
        </main>
        <IndustrialFooter settings={settings} siteName={siteName} footerCfg={footerCfg} p={p} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
             <section style={{ padding: '10rem 4vw', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8rem', alignItems: 'center', borderBottom: '8px solid var(--text-main)' }}>
                <div style={{ position: 'relative' }}>
                   <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', padding: '0.6rem 2rem', background: 'var(--text-main)', color: '#FFF', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: '0.75rem', marginBottom: '4rem', boxShadow: '8px 8px 0 var(--primary)' }}>
                      <Zap size={16} /> Engineered for precision
                   </div>
                   {content.headline && (
                     <h1 style={{ fontSize: 'clamp(3.5rem, 8vw, 7.5rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.85, letterSpacing: '-0.05em', marginBottom: '3.5rem', fontStyle: 'italic' }}>
                        {content.headline}
                     </h1>
                   )}
                   {content.sub_headline && (
                     <p style={{ fontSize: '1.25rem', opacity: 0.6, maxWidth: '600px', lineHeight: 1.6, textTransform: 'uppercase', letterSpacing: '-0.02em', borderLeft: '8px solid var(--text-main)', paddingLeft: '3rem' }}>
                        {content.sub_headline}
                     </p>
                   )}
                </div>
                {content.hero_image && (
                  <div style={{ position: 'relative', padding: '1rem', border: '4px solid var(--text-main)', background: '#FFF', boxShadow: '20px 20px 0 var(--primary)' }}>
                     <img src={fixImg(content.hero_image)} alt="Hero" style={{ width: '100%', height: '600px', objectFit: 'cover', filter: 'grayscale(1)' }} />
                     <div style={{ position: 'absolute', top: '-2rem', right: '-2rem', width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', border: '4px solid var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldCheck size={40} color="#FFF" />
                     </div>
                  </div>
                )}
             </section>
             <div style={{ background: 'var(--text-main)', padding: '6rem 4vw', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px' }}>
                {[
                  { l: 'Precision Rate', v: '99.98%' },
                  { l: 'Active Patents', v: '142+' },
                  { l: 'Force Output', v: '85k kN' },
                  { l: 'Efficiency', v: '94.2%' }
                ].map((s, i) => (
                  <div key={i} style={{ padding: '3rem', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                     <h4 style={{ color: 'var(--primary)', fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>{s.v}</h4>
                     <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>{s.l}</label>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'profile':
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '10rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '8rem', alignItems: 'center' }}>
                <div style={{ padding: '6rem', background: 'var(--text-main)', color: '#FFF', borderLeft: '12px solid var(--primary)' }}>
                   <Hammer size={64} style={{ marginBottom: '3rem', opacity: 0.2 }} />
                   <h2 style={{ fontSize: '3.5rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1, fontStyle: 'italic' }}>Industrial<br />Foundry.</h2>
                </div>
                <div 
                  style={{ fontSize: '1.25rem', lineHeight: 1.8, opacity: 0.7, textTransform: 'uppercase', fontWeight: 700, whiteSpace: 'pre-wrap' }}
                  dangerouslySetInnerHTML={{ __html: content.about_us || '' }}
                />
             </div>
          </div>
        );

      case 'gallery':
        const galleryImages = Array.isArray(content.images) ? content.images : [];
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ borderLeft: '12px solid var(--primary)', paddingLeft: '4vw', marginBottom: '8rem' }}>
                {content.gallery_title && <h1 style={{ fontSize: '5rem', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic' }}>{content.gallery_title}</h1>}
                {content.description && <p style={{ fontSize: '1.2rem', opacity: 0.5, textTransform: 'uppercase', maxWidth: '600px', marginTop: '1.5rem' }}>{content.description}</p>}
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '3rem' }}>
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} style={{ borderRadius: '4px', overflow: 'hidden', height: '450px', border: '5px solid var(--text-main)', padding: '10px', background: '#FFF' }} className="group">
                     <img src={fixImg(img)} alt={`Unit ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1)', transition: 'all 0.6s' }} className="group-hover:grayscale-0 group-hover:scale-105" />
                  </div>
                ))}
             </div>
          </div>
        );

      case 'news':
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '6rem', marginBottom: '10rem', border: '8px solid var(--text-main)', background: '#FFF' }}>
                <div style={{ padding: '6rem' }}>
                   <div style={{ display: 'inline-flex', padding: '0.4rem 1.2rem', background: 'var(--primary)', color: '#FFF', fontWeight: 900, fontSize: '0.75rem', marginBottom: '2.5rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>OPERATIONAL_LOG</div>
                   <h1 style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1, textTransform: 'uppercase', marginBottom: '2.5rem', fontStyle: 'italic' }}>{pageData.title}</h1>
                   <div style={{ fontSize: '1.2rem', opacity: 0.6, lineHeight: 1.8, textTransform: 'uppercase' }} dangerouslySetInnerHTML={{ __html: content.summary || '' }} />
                </div>
                <img src={fixImg(content.featured_image)} alt="Featured" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1)' }} />
             </div>

             <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '6rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase' }}>Technical Archive</h2>
                <div style={{ height: '4px', flex: 1, background: 'var(--text-main)' }} />
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '4rem' }}>
                {posts.map((post) => (
                  <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <article style={{ background: '#FFF', border: '4px solid var(--text-main)', boxShadow: '12px 12px 0 var(--text-main)' }} className="group hover:shadow-[12px_12px_0_var(--primary)] transition-all">
                        <div style={{ height: '280px', overflow: 'hidden', borderBottom: '4px solid var(--text-main)' }}>
                           <img src={fixImg(post.content?.featured_image)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1)', transition: 'all 0.5s' }} className="group-hover:grayscale-0" />
                        </div>
                        <div style={{ padding: '2.5rem' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                              <span style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{post.category}</span>
                              <span style={{ fontSize: '0.7rem', opacity: 0.3, fontWeight: 900 }}>{new Date(post.created_at).toLocaleDateString()}</span>
                           </div>
                           <h3 style={{ fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1.5rem', lineHeight: 1.1 }}>{post.title}</h3>
                           <p style={{ opacity: 0.5, fontSize: '0.9rem', lineHeight: 1.6, textTransform: 'uppercase', marginBottom: '2.5rem' }}>{post.excerpt || post.content?.summary}</p>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 900, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                              OPEN_LOG <ArrowRight size={18} className="group-hover:translate-x-4 transition-transform" />
                           </div>
                        </div>
                     </article>
                  </Link>
                ))}
             </div>
          </div>
        );

      case 'contact':
        const mapsSrc = content.maps_link?.includes('<iframe') ? content.maps_link.match(/src="([^"]+)"/)?.[1] : content.maps_link;
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '10rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10rem' }}>
                <div>
                   <h1 style={{ fontSize: '6rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.85, marginBottom: '6rem', fontStyle: 'italic' }}>Request<br />Brief.</h1>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                      {content.email && (
                        <div style={{ padding: '3rem', border: '5px solid var(--text-main)', background: '#FFF', boxShadow: '12px 12px 0 var(--text-main)' }}>
                           <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.5rem' }}>Transmission Hub</span>
                           <b style={{ fontSize: '1.8rem' }}>{content.email}</b>
                        </div>
                      )}
                      {content.phone && (
                        <div style={{ padding: '3rem', border: '5px solid var(--text-main)', background: '#FFF', boxShadow: '12px 12px 0 var(--primary)' }}>
                           <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.5rem' }}>Voice Protocol</span>
                           <b style={{ fontSize: '2.2rem' }}>{content.phone}</b>
                        </div>
                      )}
                   </div>
                </div>
                <div>
                   {mapsSrc && (
                     <div style={{ width: '100%', height: '700px', border: '8px solid var(--text-main)', padding: '1rem', background: '#FFF', boxShadow: '20px 20px 0 var(--text-main)' }}>
                        <iframe src={mapsSrc} width="100%" height="100%" style={{ border: 0, filter: 'grayscale(1)' }} allowFullScreen loading="lazy"></iframe>
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
    <div style={{ ...vars, background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Space Mono', monospace" }}>
      <IndustrialHeader settings={settings} siteName={siteName} />
      <IndustrialNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} p={p} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <IndustrialFooter settings={settings} siteName={siteName} footerCfg={footerCfg} p={p} />
    </div>
  );
}

function IndustrialHeader({ settings, siteName }: any) {
  return (
    <div style={{ background: 'var(--text-main)', color: '#FFF', padding: '0.8rem 4vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em' }}>
       <div style={{ display: 'flex', gap: '3rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Settings size={14} color="var(--primary)" /> System_Operational</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><ShieldCheck size={14} color="#22C55E" /> ISO_9001:2015</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><HardHat size={14} color="#FBBF24" /> Safety_Active</span>
       </div>
       <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '3rem' }}>Capacity: 94%</div>
    </div>
  );
}

function IndustrialNavbar({ settings, siteName, navPages, currentSlug, p, subdomain }: any) {
  return (
    <nav style={{ height: '90px', padding: '0 4vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.85)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)', borderBottom: '5px solid var(--text-main)' }}>
      <Link to={`/preview/${subdomain}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ width: '48px', height: '48px', background: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
          <Factory size={28} />
        </div>
        <span style={{ fontWeight: 900, fontSize: '1.8rem', textTransform: 'uppercase', fontStyle: 'italic', color: 'var(--text-main)' }}>{siteName}</span>
      </Link>
      <div style={{ display: 'flex', background: 'var(--text-main)', padding: '4px' }}>
        {navPages.map((nav: any) => {
          const isActive = currentSlug === nav.slug?.replace(/^\/+/, '');
          return (
            <Link 
              key={nav.slug} 
              to={`/preview/${subdomain}/${nav.slug?.replace(/^\/+/, '')}`} 
              style={{ 
                textDecoration: 'none', 
                color: isActive ? '#FFF' : '#777', 
                padding: '0.6rem 2rem',
                fontSize: '0.75rem', 
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                background: isActive ? 'var(--primary)' : 'transparent',
                boxShadow: isActive ? '4px 4px 0px rgba(255,255,255,0.2)' : 'none',
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

function IndustrialFooter({ settings, siteName, footerCfg, p }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <footer style={{ background: 'black', color: '#52525B', padding: '12rem 4vw 4vw', borderTop: '12px solid var(--primary)' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr', gap: '8rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
            <span style={{ fontWeight: 900, fontSize: '2rem', textTransform: 'uppercase', color: 'white', fontStyle: 'italic' }}>{siteName}</span>
          </div>
          <p style={{ opacity: 0.4, lineHeight: 1.8, fontSize: '0.85rem', marginBottom: '4rem', maxWidth: '400px', textTransform: 'uppercase' }}>{footerCfg.short_description || footerCfg.footer_description}</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
             {(footerCfg.social_links || []).map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ color: 'inherit', transition: 'all 0.4s' }} onMouseOver={e => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-5px) skewX(-12deg)'; }} onMouseOut={e => { e.currentTarget.style.color = 'inherit'; e.currentTarget.style.transform = 'none'; }}>
                   <SocialIcon type={social.icon} size={24} />
                </a>
             ))}
          </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '3.5rem', opacity: 0.2 }}>Operational_Hub</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((ln: any, i: number) => (
                 <a key={i} href={ln.url} style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{ln.label}</a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '3.5rem', opacity: 0.2 }}>Technical_Entry</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', opacity: 0.2, fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              <span>Safety_Protocol</span>
              <span>Hardware_Archive</span>
              <span>Technical_Handshake</span>
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '3.5rem', opacity: 0.2 }}>Factory_Map</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', fontSize: '1rem' }}>
              {contact.phone && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><Phone size={18} color="var(--primary)" /> <b>VOICE: {contact.phone}</b></div>}
              {contact.whatsapp && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><MessageCircle size={18} color="#22C55E" /> <b>CHANNEL: {contact.whatsapp}</b></div>}
              {contact.email && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><Mail size={18} /> <b style={{ fontSize: '0.85rem' }}>{contact.email}</b></div>}
              
              {footerCfg.location_embed_link && (
                <div style={{ width: '100%', height: '180px', border: '5px solid rgba(255,255,255,0.05)', marginTop: '1.5rem', filter: 'grayscale(1) brightness(0.6)' }}>
                   <iframe src={footerCfg.location_embed_link.includes('<iframe') ? footerCfg.location_embed_link.match(/src="([^"]+)"/)?.[1] : footerCfg.location_embed_link} width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>
                </div>
              )}
           </div>
        </div>
      </div>
      <div style={{ maxWidth: '1600px', margin: '8rem auto 0', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem', opacity: 0.1, textAlign: 'center', fontWeight: 900, letterSpacing: '0.8em', textTransform: 'uppercase' }}>
         © {new Date().getFullYear()} {siteName.toUpperCase()} - INDUSTRIAL_SOVEREIGN_INFRASTRUCTURE.
      </div>
    </footer>
  );
}
