// src/templates/LegalTemplate.tsx
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
  Scale, 
  Shield, 
  Gavel, 
  Briefcase, 
  ChevronRight, 
  Award, 
  MapPin,
  FileText,
  UserCheck,
  Globe
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

export default function LegalTemplate({ 
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
  const siteName = settings?.site_name || 'Legal Chambers';
  const content = pageData?.content || {};
  const pageType = pageData?.page_type || 'home';
  const p = palette || { 
    primary: themeColor || '#1E3A8A', 
    secondary: '#B45309', 
    surface: '#FFFFFF', 
    text: '#0F172A', 
    name: 'Legal' 
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
      <div style={{ ...vars, background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Playfair Display', serif" }}>
        <LegalNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} p={p} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} palette={p} currentSlug={currentSlug} />
        </main>
        <LegalFooter settings={settings} siteName={siteName} footerCfg={footerCfg} p={p} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
             <section style={{ padding: '12rem 4vw', textAlign: 'center', background: 'var(--primary)05', borderBottom: '1px solid #EEE' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                   <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', color: 'var(--secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', fontSize: '0.8rem', marginBottom: '3.5rem' }}>
                      <Scale size={20} /> Prestige. Integrity. Results.
                   </div>
                   {content.headline && (
                     <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.1, marginBottom: '3rem' }}>
                        {content.headline}
                     </h1>
                   )}
                   {content.sub_headline && (
                     <p style={{ fontSize: '1.4rem', opacity: 0.6, maxWidth: '800px', margin: '0 auto 5rem', fontFamily: "'Inter', sans-serif" }}>
                        {content.sub_headline}
                     </p>
                   )}
                   <Link to={`/preview/${subdomain}/contact`} style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 3.5rem', background: 'var(--primary)', color: '#FFF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.85rem', textDecoration: 'none' }}>
                      SCHEDULE CONSULTATION <ArrowRight size={20} />
                   </Link>
                </div>
             </section>
             {content.hero_image && (
               <div style={{ padding: '6rem 4vw' }}>
                  <img src={fixImg(content.hero_image)} alt="Hero" style={{ width: '100%', height: '650px', objectFit: 'cover', border: '15px solid #FFF', boxShadow: '0 40px 80px rgba(0,0,0,0.1)' }} />
               </div>
             )}
             <div style={{ padding: '6rem 4vw', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem', background: '#FFF' }}>
                {[
                  { i: Shield, t: 'Litigation Support' },
                  { i: Gavel, t: 'Corporate Counsel' },
                  { i: Briefcase, t: 'Wealth Preservation' },
                  { i: Award, t: 'Proven Excellence' }
                ].map((item, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                     <item.i size={40} color="var(--secondary)" style={{ marginBottom: '2rem' }} />
                     <h4 style={{ fontWeight: 800, fontSize: '1.1rem', textTransform: 'uppercase', color: 'var(--primary)' }}>{item.t}</h4>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'profile':
        return (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '10rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8rem', alignItems: 'start' }}>
                <div style={{ borderLeft: '10px solid var(--secondary)', paddingLeft: '4rem' }}>
                   <h2 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>THE<br />COUNCIL.</h2>
                </div>
                <div 
                  style={{ fontSize: '1.2rem', lineHeight: 2, opacity: 0.8, fontFamily: "'Inter', sans-serif", whiteSpace: 'pre-wrap' }}
                  dangerouslySetInnerHTML={{ __html: content.about_us || '' }}
                />
             </div>
          </div>
        );

      case 'gallery':
        const galleryImages = Array.isArray(content.images) ? content.images : [];
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ textAlign: 'center', marginBottom: '8rem', borderBottom: '2px solid #EEE', paddingBottom: '4rem' }}>
                {content.gallery_title && <h1 style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>{content.gallery_title}</h1>}
                {content.description && <p style={{ fontSize: '1.25rem', opacity: 0.5, marginTop: '1.5rem', fontFamily: "'Inter', sans-serif" }}>{content.description}</p>}
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '4rem' }}>
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} style={{ aspectRatio: '1/1', overflow: 'hidden', border: '1px solid #EEE', padding: '1.5rem', background: '#F9F9F9' }}>
                     <img src={fixImg(img)} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
             </div>
          </div>
        );

      case 'news':
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '6rem', marginBottom: '10rem', background: 'var(--primary)', color: '#FFF' }}>
                <div style={{ padding: '6rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: '0.85rem', marginBottom: '2.5rem' }}>
                      <FileText size={20} /> LEGAL_JOURNAL: UPDATED
                   </div>
                   <h1 style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '3rem' }}>{pageData.title}</h1>
                   <div style={{ fontSize: '1.25rem', opacity: 0.8, lineHeight: 1.8, fontFamily: "'Inter', sans-serif" }} dangerouslySetInnerHTML={{ __html: content.summary || '' }} />
                </div>
                <img src={fixImg(content.featured_image)} alt="Featured" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(0.3) contrast(1.1)' }} />
             </div>

             <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', marginBottom: '6rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)' }}>Law In Practice</h2>
                <div style={{ height: '1px', flex: 1, background: '#EEE' }} />
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '5rem' }}>
                {posts.map((post) => (
                  <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <article style={{ borderBottom: '1px solid #EEE', paddingBottom: '4rem' }} className="group">
                        <div style={{ height: '320px', overflow: 'hidden', marginBottom: '3rem' }}>
                           <img src={fixImg(post.content?.featured_image)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'grayscale 0.5s' }} className="group-hover:grayscale" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                           <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--secondary)', textTransform: 'uppercase' }}>{post.category}</span>
                           <span style={{ fontSize: '0.75rem', opacity: 0.3, fontWeight: 700 }}>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '2rem' }}>{post.title}</h3>
                        <p style={{ opacity: 0.5, fontSize: '1rem', lineHeight: 1.6, fontFamily: "'Inter', sans-serif", marginBottom: '3rem' }}>{post.excerpt || post.content?.summary}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary)' }}>
                           REVIEW BRIEF <ChevronRight size={18} className="group-hover:translate-x-4 transition-transform" />
                        </div>
                     </article>
                  </Link>
                ))}
             </div>
          </div>
        );

      case 'contact':
        const mapsFrame = content.maps_link?.includes('<iframe') ? content.maps_link.match(/src="([^"]+)"/)?.[1] : content.maps_link;
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '10rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10rem', alignItems: 'center' }}>
                <div>
                   <h1 style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1, marginBottom: '6rem' }}>The<br />Council Hall.</h1>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
                      {content.email && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.5rem' }}>Official Correspondence</span>
                           <b style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>{content.email}</b>
                        </div>
                      )}
                      {content.phone && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.5rem' }}>Direct Chambers</span>
                           <b style={{ fontSize: '2.2rem', color: 'var(--primary)' }}>{content.phone}</b>
                        </div>
                      )}
                   </div>
                </div>
                <div>
                   {mapsFrame && (
                     <div style={{ width: '100%', height: '700px', border: '15px solid #F9F9F9', boxShadow: '0 40px 80px rgba(0,0,0,0.05)' }}>
                        <iframe src={mapsFrame} width="100%" height="100%" style={{ border: 0, filter: 'sepia(0.2) contrast(1.1)' }} allowFullScreen loading="lazy"></iframe>
                     </div>
                   )}
                </div>
             </div>
          </div>
        );

      default:
        return (
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '10rem 4vw' }}>
             <div style={{ fontSize: '1.25rem', lineHeight: 2, fontFamily: "'Inter', sans-serif" }} dangerouslySetInnerHTML={{ __html: content.body || '' }} />
          </div>
        );
    }
  };

  return (
    <div style={{ ...vars, background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Playfair Display', serif" }}>
      <LegalNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} p={p} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <LegalFooter settings={settings} siteName={siteName} footerCfg={footerCfg} p={p} />
    </div>
  );
}

function LegalNavbar({ settings, siteName, navPages, currentSlug, p, subdomain }: any) {
  return (
    <nav style={{ height: '110px', padding: '0 4vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.95)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)', borderBottom: '1px solid #EEE' }}>
      <Link to={`/preview/${subdomain}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
        {settings?.logo_url ? (
          <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '48px', width: 'auto' }} />
        ) : (
          <>
            <span style={{ fontWeight: 800, fontSize: '1.8rem', textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.1em' }}>{siteName}</span>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--secondary)', letterSpacing: '0.4em' }}>Legal Council</span>
          </>
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
                color: isActive ? 'var(--secondary)' : 'var(--primary)', 
                fontSize: '0.8rem', 
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                borderBottom: isActive ? '2px solid var(--secondary)' : 'none',
                paddingBottom: '4px',
                opacity: isActive ? 1 : 0.5,
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

function LegalFooter({ settings, siteName, footerCfg, p }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <footer style={{ background: '#FFF', borderTop: '4px solid var(--primary)', padding: '12rem 4vw 4vw' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr', gap: '8rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3.5rem' }}>
            {settings?.logo_url && <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '44px', width: 'auto' }} />}
            <span style={{ fontWeight: 800, fontSize: '2rem', textTransform: 'uppercase', color: 'var(--primary)' }}>{siteName}</span>
          </div>
          <p style={{ opacity: 0.5, lineHeight: 1.8, fontSize: '1rem', fontStyle: 'italic', marginBottom: '4rem', maxWidth: '400px' }}>{footerCfg.short_description || footerCfg.footer_description}</p>
          <div style={{ display: 'flex', gap: '2rem' }}>
             {(footerCfg.social_links || []).map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', opacity: 0.3, transition: 'all 0.4s' }} onMouseOver={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'var(--secondary)'; }} onMouseOut={e => { e.currentTarget.style.opacity = '0.3'; e.currentTarget.style.color = 'var(--primary)'; }}>
                   <SocialIcon type={social.icon} size={24} />
                </a>
             ))}
          </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '3.5rem', color: 'var(--secondary)' }}>Practices</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((ln: any, i: number) => (
                 <a key={i} href={ln.url} style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5 }}>{ln.label}</a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '3.5rem', color: 'var(--secondary)' }}>The Council</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', opacity: 0.2, fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              <span>Privacy_Council</span>
              <span>Bar_Compliance</span>
              <span>Regional_Node</span>
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '3.5rem', color: 'var(--secondary)' }}>Chambers Hub</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontSize: '1.1rem' }}>
              {contact.phone && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><Phone size={20} color="var(--secondary)" /> <b>{contact.phone}</b></div>}
              {contact.whatsapp && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><MessageCircle size={20} color="#22C55E" /> <b>{contact.whatsapp}</b></div>}
              {contact.email && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><Mail size={20} style={{ opacity: 0.4 }} /> <b>{contact.email}</b></div>}
              
              {footerCfg.location_embed_link && (
                <div style={{ width: '100%', height: '180px', border: '1px solid #EEE', marginTop: '1.5rem', filter: 'grayscale(1) sepia(0.2)' }}>
                   <iframe src={footerCfg.location_embed_link.includes('<iframe') ? footerCfg.location_embed_link.match(/src="([^"]+)"/)?.[1] : footerCfg.location_embed_link} width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>
                </div>
              )}
           </div>
        </div>
      </div>
      <div style={{ maxWidth: '1600px', margin: '8rem auto 0', paddingTop: '4rem', borderTop: '1px solid #EEE', fontSize: '0.8rem', opacity: 0.2, textAlign: 'center', fontWeight: 800, letterSpacing: '0.6em', textTransform: 'uppercase' }}>
         © {new Date().getFullYear()} {siteName.toUpperCase()} - ALL_LEGAL_RIGHTS_RESERVED.
      </div>
    </footer>
  );
}
