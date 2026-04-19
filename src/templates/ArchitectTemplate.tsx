// src/templates/ArchitectTemplate.tsx
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
  Maximize, 
  Ruler, 
  Box, 
  Globe, 
  ChevronRight, 
  Share2, 
  Info, 
  MapPin,
  Clock,
  Layers,
  Layout
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
  return <Icon size={size} strokeWidth={1} />;
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

export default function ArchitectTemplate({ 
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
  const siteName = settings?.site_name || 'Architect Studio';
  const content = pageData?.content || {};
  const pageType = pageData?.page_type || 'home';
    const footerCfg = settings?.global_options?.footer_config || {};

  
  if (postData) {
    return (
      <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
        <ArchitectNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} currentSlug={currentSlug} />
        </main>
        <ArchitectFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
             <section style={{ padding: '0', position: 'relative', height: '90vh' }}>
                {content.hero_image && <img src={fixImg(content.hero_image)} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.8), transparent)', display: 'flex', alignItems: 'center', padding: '0 10vw' }}>
                   <div style={{ maxWidth: '800px', color: '#FFF' }}>
                      {content.headline && <h1 style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.06em', textTransform: 'uppercase', marginBottom: '2rem' }}>{content.headline}</h1>}
                      {content.sub_headline && <p style={{ fontSize: '1.25rem', fontWeight: 300, opacity: 0.7, maxWidth: '500px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>{content.sub_headline}</p>}
                   </div>
                </div>
             </section>
             <div style={{ padding: '5vw 10vw', borderBottom: '1px solid #EEE' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.5em', textTransform: 'uppercase', opacity: 0.3 }}>Structural / Perspective / Scale</span>
             </div>
          </div>
        );

      case 'profile':
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '10rem 4rem' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 2fr', gap: '8vw' }}>
                <div style={{ borderTop: '4px solid var(--text-color)', paddingTop: '2rem' }}>
                   <h2 style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em' }}>Principles_Report</h2>
                </div>
                <div 
                  style={{ fontSize: '2rem', fontWeight: 300, lineHeight: 1.5, opacity: 0.9, whiteSpace: 'pre-wrap', letterSpacing: '-0.02em' }}
                  className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.about_us || '' }}
                />
             </div>
          </div>
        );

      case 'gallery':
        const galleryImages = Array.isArray(content.images) ? content.images : [];
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4rem' }} className="animate-in fade-in duration-700">
             <header style={{ marginBottom: '8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                <div>
                  {content.gallery_title && <h1 style={{ fontSize: '6rem', fontWeight: 900, letterSpacing: '-0.05em', textTransform: 'uppercase', lineHeight: 0.9 }}>{content.gallery_title}</h1>}
                  {content.description && <div className="rich-text-content" style={{ fontSize: '1rem', opacity: 0.4, marginTop: '2rem', textTransform: 'uppercase', letterSpacing: '0.2em' }} dangerouslySetInnerHTML={{ __html: content.description }} />}
                </div>
                <div style={{ fontSize: '4rem', fontWeight: 100, opacity: 0.1 }}>{galleryImages.length < 10 ? `0${galleryImages.length}` : galleryImages.length}</div>
             </header>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '2px', background: 'var(--text-color)11' }}>
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} style={{ aspectRatio: '4/3', overflow: 'hidden', position: 'relative' }} className="group">
                     <img src={fixImg(img)} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'filter 0.6s' }} />
                     <div style={{ position: 'absolute', inset: 0, background: 'var(--primary-color)88', opacity: 0, transition: 'opacity 0.4s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="group-hover:opacity-100">
                        <Maximize color="#FFF" size={40} strokeWidth={1} />
                     </div>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'news':
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4rem' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem', marginBottom: '10rem', height: '600px' }}>
                <img src={fixImg(content.featured_image)} alt="Featured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: '1px solid #EEE', paddingLeft: '4rem' }}>
                   <span style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase', opacity: 0.3, marginBottom: '2rem' }}>Publication_Main</span>
                   <h1 style={{ fontSize: '4rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '2rem' }}>{pageData.title}</h1>
                   <div style={{ fontSize: '1.1rem', opacity: 0.6, lineHeight: 1.7 }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.summary || '' }} />
                </div>
             </div>

             <h2 style={{ fontSize: '1rem', fontWeight: 900, letterSpacing: '0.5em', textTransform: 'uppercase', marginBottom: '4rem', padding: '1rem 0', borderTop: '4px solid #000', display: 'inline-block' }}>Archive_List</h2>
             
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '5rem' }}>
                {posts.map((post) => (
                  <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <article>
                        <div style={{ aspectRatio: '16/9', overflow: 'hidden', marginBottom: '2rem', border: '1px solid #EEE' }}>
                           <img src={fixImg(post.content?.featured_image)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }} onMouseOver={e => e.currentTarget.style.filter = 'none'} onMouseOut={e => e.currentTarget.style.filter = 'grayscale(100%)'} />
                        </div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', opacity: 0.3 }}>{post.category}</span>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0.75rem 0 1.5rem', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>{post.title}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                           ACCESS_DOC <ChevronRight size={16} />
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
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12rem 4rem' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10rem' }}>
                <div>
                   <h1 style={{ fontSize: '7rem', fontWeight: 900, letterSpacing: '-0.06em', textTransform: 'uppercase', lineHeight: 0.9, marginBottom: '6rem' }}>Request_Contact</h1>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
                      {content.email && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', opacity: 0.3, marginBottom: '1.5rem' }}>Protocol_Relay</span>
                           <b style={{ fontSize: '2.5rem', fontWeight: 300 }}>{content.email}</b>
                        </div>
                      )}
                      {content.phone && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', opacity: 0.3, marginBottom: '1.5rem' }}>Voice_Signal</span>
                           <b style={{ fontSize: '2.5rem', fontWeight: 300 }}>{content.phone}</b>
                        </div>
                      )}
                   </div>
                </div>
                <div>
                   {mapsLink && (
                     <div style={{ width: '100%', height: '700px', border: '1px solid #000', padding: '1rem' }}>
                        <iframe src={mapsLink} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
                     </div>
                   )}
                </div>
             </div>
          </div>
        );

      default:
        return (
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '10rem 4rem' }}>
             <div style={{ fontSize: '1.2rem', lineHeight: 1.8 }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.body || '' }} />
          </div>
        );
    }
  };

  return (
    <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
      <ArchitectNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <ArchitectFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
    </div>
  );
}

function ArchitectNavbar({ settings, siteName, navPages, currentSlug, subdomain }: any) {
  return (
    <nav style={{ height: '100px', padding: '0 4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-color)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #E5E5E5' }}>
      <Link to={`/preview/${subdomain}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {settings?.logo_url ? (
          <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '32px', width: 'auto' }} />
        ) : (
          <div style={{ width: '40px', height: '40px', border: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={20} strokeWidth={1} />
          </div>
        )}
        <span style={{ fontWeight: 900, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.4em' }}>{siteName}</span>
      </Link>
      <div style={{ display: 'flex', gap: '4rem' }}>
        {navPages.map((nav: any) => {
          const isActive = currentSlug === nav.slug?.replace(/^\/+/, '');
          return (
            <Link 
              key={nav.slug} 
              to={`/preview/${subdomain}/${nav.slug?.replace(/^\/+/, '')}`} 
              style={{ 
                textDecoration: 'none', 
                color: 'inherit', 
                fontSize: '0.7rem', 
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.4em',
                opacity: isActive ? 1 : 0.3,
                borderBottom: isActive ? '2px solid var(--text-color)' : 'none',
                paddingBottom: '0.5rem',
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

function ArchitectFooter({ settings, siteName, footerCfg }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <footer style={{ background: 'var(--bg-color)', borderTop: '4px solid #000', padding: '10rem 4rem 4rem' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr', gap: '8rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
            {settings?.logo_url && <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '36px', width: 'auto' }} />}
            <span style={{ fontWeight: 900, fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.5em' }}>{siteName}</span>
          </div>
          <p style={{ opacity: 0.3, lineHeight: 1.8, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '3rem' }}>{footerCfg.short_description || footerCfg.footer_description}</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
             {(footerCfg.social_links || []).map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ color: 'inherit', opacity: 0.2, transition: 'all 0.4s' }} onMouseOver={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(-5px)'; }} onMouseOut={e => { e.currentTarget.style.opacity = '0.2'; e.currentTarget.style.transform = 'none'; }}>
                   <SocialIcon type={social.icon} size={24} />
                </a>
             ))}
          </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em', marginBottom: '3rem', opacity: 0.3, borderBottom: '1px solid #EEE', paddingBottom: '1rem' }}>Sitemap</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((ln: any, i: number) => (
                 <a key={i} href={ln.url} style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>{ln.label}</a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em', marginBottom: '3rem', opacity: 0.3, borderBottom: '1px solid #EEE', paddingBottom: '1rem' }}>Legal</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', opacity: 0.4, fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              <span>Privacy_Policy</span>
              <span>Terms_of_Use</span>
              <span>Structural_SLA</span>
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em', marginBottom: '3rem', opacity: 0.3, borderBottom: '1px solid #EEE', paddingBottom: '1rem' }}>Relay_Line</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              {contact.phone && <div style={{ display: 'flex', gap: '1rem' }}>VOICE. <b>{contact.phone}</b></div>}
              {contact.whatsapp && <div style={{ display: 'flex', gap: '1rem' }}>DATA_WA. <b>{contact.whatsapp}</b></div>}
              {contact.email && <div style={{ display: 'flex', gap: '1rem' }}>SIGNAL. <b>{contact.email}</b></div>}
              {contact.service_hours && <div style={{ display: 'flex', gap: '1rem', opacity: 0.3 }}>{contact.service_hours}</div>}
              
              {footerCfg.location_embed_link && (
                <div style={{ width: '100%', height: '180px', border: '1px solid #EEE', overflow: 'hidden', padding: '0.5rem', filter: 'grayscale(100%) brightness(1.2)' }}>
                   <iframe src={footerCfg.location_embed_link.includes('<iframe') ? footerCfg.location_embed_link.match(/src="([^"]+)"/)?.[1] : footerCfg.location_embed_link} width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>
                </div>
              )}
           </div>
        </div>
      </div>
      <div style={{ maxWidth: '1600px', margin: '8rem auto 0', paddingTop: '3rem', borderTop: '1px solid #EEE', fontSize: '0.65rem', opacity: 0.2, textAlign: 'center', letterSpacing: '0.8em', textTransform: 'uppercase' }}>
         Monolith_Structural_Authority / {new Date().getFullYear()} / Protocol_Enabled
      </div>
    </footer>
  );
}
