// src/templates/BrutalistTemplate.tsx
import React from 'react';
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
  Box, 
  Eye, 
  Heart, 
  Share2, 
  Info, 
  MapPin, 
  ChevronRight, 
  AlertCircle, 
  Terminal, 
  HardDrive,
  Clock,
  Activity
} from 'lucide-react';
import UnifiedPostLayout from '../components/UnifiedPostLayout';

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

export default function BrutalistTemplate({ 
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
  const siteName = settings?.site_name || 'RAW_SYSTEM';
  const content = pageData?.content || {};
  const pageType = pageData?.page_type || 'home';
    const footerCfg = settings?.global_options?.footer_config || {};

  
  if (postData) {
    return (
      <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Space Mono', monospace", border: '20px solid #000' }}>
        <BrutalistNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} currentSlug={currentSlug} />
        </main>
        <BrutalistFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-500">
             <section style={{ padding: '8rem 4rem', borderBottom: '20px solid #000' }}>
                <div style={{ maxWidth: '1200px' }}>
                   {content.headline && (
                     <h1 style={{ fontSize: 'clamp(4rem, 15vw, 12rem)', fontWeight: 900, lineHeight: 0.8, letterSpacing: '-0.08em', textTransform: 'uppercase', marginBottom: '4rem', wordBreak: 'break-all' }}>
                        {content.headline}
                     </h1>
                   )}
                   <div style={{ display: 'flex', gap: '4rem', alignItems: 'start' }}>
                      <div style={{ width: '100px', height: '100px', background: 'var(--primary-color)', border: '10px solid #000' }} />
                      {content.sub_headline && (
                        <p style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', maxWidth: '800px', background: '#000', color: '#FFF', padding: '1rem' }}>
                           {content.sub_headline}
                        </p>
                      )}
                   </div>
                </div>
             </section>
             {content.hero_image && (
               <div style={{ width: '100%', height: '80vh', borderBottom: '20px solid #000', padding: '40px', background: 'var(--secondary-color)' }}>
                  <img src={fixImg(content.hero_image)} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover', border: '10px solid #000', filter: 'contrast(1.5) grayscale(1)' }} />
               </div>
             )}
          </div>
        );

      case 'profile':
        return (
          <div style={{ padding: '10rem 4rem' }} className="animate-in fade-in duration-500">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem', alignItems: 'start' }}>
                <div style={{ background: '#000', color: 'var(--primary-color)', padding: '2rem', borderLeft: '20px solid var(--secondary-color)' }}>
                   <h2 style={{ fontSize: '3rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.05em' }}>_MANIFESTO</h2>
                </div>
                <div 
                  style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.1, textTransform: 'uppercase', whiteSpace: 'pre-wrap' }}
                  className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.about_us || '' }}
                />
             </div>
          </div>
        );

      case 'gallery':
        const galleryImages = Array.isArray(content.images) ? content.images : [];
        return (
          <div style={{ padding: '8rem 4rem' }} className="animate-in fade-in duration-500">
             <div style={{ background: '#000', color: '#FFF', padding: '4rem', marginBottom: '4rem', borderBottom: '20px solid var(--primary-color)' }}>
                {content.gallery_title && <h1 style={{ fontSize: '8rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.8 }}>{content.gallery_title}</h1>}
                {content.description && <p style={{ fontSize: '1.5rem', marginTop: '2rem', fontWeight: 900 }}>// {content.description}</p>}
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '40px' }}>
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} style={{ border: '10px solid #000', background: 'var(--primary-color)', padding: '20px', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translate(-10px, -10px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
                     <img src={fixImg(img)} alt={`Gallery ${i}`} style={{ width: '100%', height: '400px', objectFit: 'cover', border: '5px solid #000' }} />
                  </div>
                ))}
             </div>
          </div>
        );

      case 'news':
        return (
          <div style={{ padding: '6rem 4rem' }} className="animate-in fade-in duration-500">
             <div style={{ border: '15px solid #000', background: 'var(--secondary-color)', marginBottom: '8rem', display: 'flex' }}>
                <div style={{ flex: 1, padding: '4rem' }}>
                   <span style={{ background: '#000', color: '#FFF', padding: '0.5rem 1rem', fontWeight: 900, textTransform: 'uppercase', fontSize: '1rem', display: 'inline-block', marginBottom: '2rem' }}>TOP_SECURE_FEED</span>
                   <h1 style={{ fontSize: '6rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.9, marginBottom: '2rem' }}>{pageData.title}</h1>
                   <div style={{ fontSize: '1.5rem', fontWeight: 900 }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.summary || '' }} />
                </div>
                <div style={{ width: '40%', borderLeft: '15px solid #000' }}>
                   <img src={fixImg(content.featured_image)} alt="Featured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '60px' }}>
                {posts.map((post) => (
                  <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <article style={{ border: '10px solid #000', transition: 'all 0.2s', background: '#FFF' }} onMouseOver={e => { e.currentTarget.style.boxShadow = '20px 20px 0 #000'; e.currentTarget.style.transform = 'translate(-5px, -5px)'; }} onMouseOut={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                        <div style={{ height: '300px', borderBottom: '10px solid #000' }}>
                           <img src={fixImg(post.content?.featured_image)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '2rem' }}>
                           <span style={{ fontWeight: 900, color: 'var(--primary-color)', background: '#000', padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>{post.category}</span>
                           <h3 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', margin: '1rem 0', lineHeight: 1 }}>{post.title}</h3>
                           <div className="rich-text-content" style={{ fontWeight: 900, opacity: 0.7, marginBottom: '2rem' }} dangerouslySetInnerHTML={{ __html: post.excerpt || post.content?.summary || '' }} />
                           <div style={{ border: '5px solid #000', padding: '0.75rem', textAlign: 'center', fontWeight: 900, background: 'var(--primary-color)' }}>EXTRACT_DATA_NODE.exe</div>
                        </div>
                     </article>
                  </Link>
                ))}
             </div>
          </div>
        );

      case 'contact':
        const mapFrame = content.maps_link?.includes('<iframe') ? content.maps_link.match(/src="([^"]+)"/)?.[1] : content.maps_link;
        return (
          <div style={{ padding: '10rem 4rem' }} className="animate-in fade-in duration-500">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem' }}>
                <div>
                   <h1 style={{ fontSize: '10rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.8, marginBottom: '6rem', letterSpacing: '-0.05em' }}>TARGET<br />SIGNAL.</h1>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                      {content.email && (
                        <div style={{ border: '10px solid #000', padding: '2rem', background: 'var(--primary-color)' }}>
                           <span style={{ fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', borderBottom: '5px solid #000', marginBottom: '1rem', display: 'inline-block' }}>COMMS_RELAY</span>
                           <b style={{ display: 'block', fontSize: '2.5rem', wordBreak: 'break-all' }}>{content.email}</b>
                        </div>
                      )}
                      {content.phone && (
                        <div style={{ border: '10px solid #000', padding: '2rem', background: 'var(--secondary-color)' }}>
                           <span style={{ fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', borderBottom: '5px solid #000', marginBottom: '1rem', display: 'inline-block' }}>VOICE_SIGNAL</span>
                           <b style={{ display: 'block', fontSize: '3rem' }}>{content.phone}</b>
                        </div>
                      )}
                   </div>
                </div>
                <div>
                   {mapFrame && (
                     <div style={{ border: '30px solid #000', height: '800px', background: '#000' }}>
                        <iframe src={mapFrame} width="100%" height="100%" style={{ border: 0, filter: 'contrast(3) grayscale(1) invert(1)' }} allowFullScreen loading="lazy"></iframe>
                     </div>
                   )}
                </div>
             </div>
          </div>
        );

      default:
        return (
          <div style={{ maxWidth: '1000px', padding: '8rem 4rem' }}>
             <div style={{ fontSize: '1.5rem', fontWeight: 900 }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.body || '' }} />
          </div>
        );
    }
  };

  return (
    <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Space Mono', monospace", border: '20px solid #000' }}>
      <BrutalistNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <BrutalistFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
    </div>
  );
}

function BrutalistNavbar({ settings, siteName, navPages, currentSlug, subdomain }: any) {
  return (
    <nav style={{ height: '120px', padding: '0 4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-color)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '20px solid #000' }}>
      <Link to={`/preview/${subdomain}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ width: '60px', height: '60px', background: '#000', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '5px solid #000' }}>
          <Activity size={40} />
        </div>
        <span style={{ fontWeight: 900, fontSize: '2.5rem', textTransform: 'uppercase', letterSpacing: '-0.1em' }}>{siteName}</span>
      </Link>
      <div style={{ display: 'flex', height: '120px' }}>
        {navPages.map((nav: any) => {
          const isActive = currentSlug === nav.slug?.replace(/^\/+/, '');
          return (
            <Link 
              key={nav.slug} 
              to={`/preview/${subdomain}/${nav.slug?.replace(/^\/+/, '')}`} 
              style={{ 
                textDecoration: 'none', 
                color: '#000', 
                padding: '0 3rem',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                fontSize: '1rem', 
                fontWeight: 900,
                textTransform: 'uppercase',
                borderLeft: '10px solid #000',
                background: isActive ? 'var(--primary-color)' : 'transparent',
                transition: 'all 0.2s'
              }}>
              {nav.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function BrutalistFooter({ settings, siteName, footerCfg }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <footer style={{ background: '#FFF', borderTop: '40px solid #000', padding: '12rem 4rem 4rem', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '2rem', right: '4rem', fontSize: '15rem', fontWeight: 900, opacity: 0.05, letterSpacing: '-0.1em' }}>E_N_D</div>
      <div style={{ maxWidth: '1800px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr', gap: '10rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '4rem' }}>
            {settings?.logo_url && <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '60px', width: 'auto', border: '5px solid #000' }} />}
            <span style={{ fontWeight: 900, fontSize: '4rem', letterSpacing: '-0.1em' }}>{siteName}</span>
          </div>
          <p style={{ background: 'var(--primary-color)', border: '5px solid #000', padding: '2rem', fontWeight: 900, textTransform: 'uppercase', fontSize: '1rem', marginBottom: '4rem' }}>{footerCfg.short_description || footerCfg.footer_description}</p>
          <div style={{ display: 'flex', gap: '2rem' }}>
             {(footerCfg.social_links || []).map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ width: '80px', height: '80px', background: 'var(--secondary-color)', border: '8px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
                   <SocialIcon type={social.icon} size={40} />
                </a>
             ))}
          </div>
        </div>

        <div>
           <h4 style={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', background: '#000', color: '#FFF', padding: '0.5rem 1rem', display: 'inline-block', marginBottom: '4rem' }}>MAP_LINKS_ARRAY</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((ln: any, i: number) => (
                 <a key={i} href={ln.url} style={{ textDecoration: 'none', color: '#000', fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', borderBottom: '8px solid var(--primary-color)', paddingBottom: '0.5rem' }}>{ln.label}</a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', background: '#000', color: '#FFF', padding: '0.5rem 1rem', display: 'inline-block', marginBottom: '4rem' }}>LEGAL_INIT</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.5 }}>
              <span>PRIVACY_CHARTER</span>
              <span>TERMS_OF_RAW</span>
              <span>SITE_AUTH_ROOT</span>
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', background: '#000', color: '#FFF', padding: '0.5rem 1rem', display: 'inline-block', marginBottom: '4rem' }}>SYSTEM_TARGET</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase' }}>
              {contact.phone && <div style={{ borderLeft: '15px solid #000', paddingLeft: '2rem' }}>SIGNAL_VOICE: <b>{contact.phone}</b></div>}
              {contact.whatsapp && <div style={{ borderLeft: '15px solid #000', paddingLeft: '2rem' }}>SIGNAL_WA: <b>{contact.whatsapp}</b></div>}
              {contact.email && <div style={{ borderLeft: '15px solid #000', paddingLeft: '2rem' }}>SIGNAL_DATA: <b>{contact.email}</b></div>}
              {contact.service_hours && <div style={{ opacity: 0.3 }}>UPTIME: {contact.service_hours}</div>}
              
              {footerCfg.location_embed_link && (
                <div style={{ width: '100%', height: '200px', border: '15px solid #000', background: '#000', marginTop: '2rem' }}>
                   <iframe src={footerCfg.location_embed_link.includes('<iframe') ? footerCfg.location_embed_link.match(/src="([^"]+)"/)?.[1] : footerCfg.location_embed_link} width="100%" height="100%" style={{ border: 0, filter: 'grayscale(1) contrast(5)' }} loading="lazy"></iframe>
                </div>
              )}
           </div>
        </div>
      </div>
      <div style={{ maxWidth: '1800px', margin: '10rem auto 0', paddingTop: '4rem', borderTop: '15px solid #000', fontSize: '1rem', fontWeight: 900, textAlign: 'center', letterSpacing: '1em' }}>
         SOVEREIGN_RAW_INITIATIVE / {new Date().getFullYear()} / V.01
      </div>
    </footer>
  );
}
