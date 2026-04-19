// src/templates/EduTemplate.tsx
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
  GraduationCap, 
  Library, 
  BookOpen, 
  Clock, 
  Users, 
  Globe, 
  ChevronRight, 
  Share2, 
  ClipboardList, 
  UserCheck, 
  ExternalLink, 
  MapPin
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

export default function EduTemplate({ 
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
  const siteName = settings?.site_name || 'Academic Institution';
  const content = pageData?.content || {};
  const pageType = pageData?.page_type || 'home';
    const footerCfg = settings?.global_options?.footer_config || {};

  
  if (postData) {
    return (
      <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Charter', 'Georgia', serif" }}>
        <EduNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} currentSlug={currentSlug} />
        </main>
        <EduFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
             <section style={{ padding: '0', position: 'relative', height: '80vh', borderBottom: '10px solid var(--primary-color)' }}>
                {content.hero_image && <img src={fixImg(content.hero_image)} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, var(--primary-color)CC, transparent)', display: 'flex', alignItems: 'center', padding: '0 8vw' }}>
                   <div style={{ maxWidth: '800px', color: '#FFF' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 1rem', border: '1px solid #FFFFFF44', background: '#FFFFFF11', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '2rem' }}>
                         <GraduationCap size={18} /> Accredited Institution
                      </div>
                      {content.headline && <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '2rem' }}>{content.headline}</h1>}
                      {content.sub_headline && <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', lineHeight: 1.6 }}>{content.sub_headline}</p>}
                   </div>
                </div>
             </section>
             <div style={{ background: 'var(--primary-color)', color: '#FFF', padding: '2rem 8vw', display: 'flex', gap: '4rem', overflowX: 'auto' }}>
                <div style={{ flexShrink: 0, display: 'flex', gap: '1rem', alignItems: 'center' }}><Users size={20} /> <span style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Global Alumni</span></div>
                <div style={{ flexShrink: 0, display: 'flex', gap: '1rem', alignItems: 'center' }}><Library size={20} /> <span style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Research Hub</span></div>
                <div style={{ flexShrink: 0, display: 'flex', gap: '1rem', alignItems: 'center' }}><Globe size={20} /> <span style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>World Recognized</span></div>
             </div>
          </div>
        );

      case 'profile':
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '10rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '8rem', alignItems: 'start' }}>
                <div style={{ borderLeft: '10px solid var(--secondary-color)', paddingLeft: '3rem' }}>
                   <h2 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary-color)' }}>Academic Legacy.</h2>
                </div>
                <div 
                  style={{ fontSize: '1.25rem', lineHeight: 2, opacity: 0.8, whiteSpace: 'pre-wrap' }}
                  className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.about_us || '' }}
                />
             </div>
          </div>
        );

      case 'gallery':
        const galleryImages = Array.isArray(content.images) ? content.images : [];
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <header style={{ marginBottom: '6rem', borderBottom: '2px solid #EEE', paddingBottom: '3rem' }}>
                {content.gallery_title && <h1 style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--primary-color)' }}>{content.gallery_title}</h1>}
                {content.description && <div className="rich-text-content" style={{ fontSize: '1.1rem', opacity: 0.5, marginTop: '1rem' }} dangerouslySetInnerHTML={{ __html: content.description }} />}
             </header>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} style={{ aspectRatio: '1', overflow: 'hidden', border: '5px solid #F8F8F8' }}>
                     <img src={fixImg(img)} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
             </div>
          </div>
        );

      case 'news':
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '6rem', marginBottom: '8rem' }}>
                <div style={{ height: '550px', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                   <img src={fixImg(content.featured_image)} alt="Featured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                   <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', color: 'var(--secondary-color)', marginBottom: '1.5rem' }}>Collegiate Broadcast</span>
                   <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '2rem', color: 'var(--primary-color)' }}>{pageData.title}</h1>
                   <div style={{ fontSize: '1.1rem', opacity: 0.6, lineHeight: 1.8 }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.summary || '' }} />
                </div>
             </div>

             <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary-color)' }}>Faculty Highlights</h2>
                <div style={{ height: '2px', flex: 1, background: '#EEE' }} />
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '4rem' }}>
                {posts.map((post) => (
                  <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <article style={{ border: '1px solid #EEE', borderRadius: '0.5rem', overflow: 'hidden' }} className="group">
                        <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                           <img src={fixImg(post.content?.featured_image)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                           <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'var(--primary-color)', color: '#FFF', padding: '4px 12px', fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase' }}>{post.category}</div>
                        </div>
                        <div style={{ padding: '2rem' }}>
                           <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-color)' }}>{post.title}</h3>
                           <div className="rich-text-content" style={{ fontSize: '0.95rem', opacity: 0.5, lineHeight: 1.6, marginBottom: '2rem' }} dangerouslySetInnerHTML={{ __html: post.excerpt || post.content?.summary || '' }} />
                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 900, fontSize: '0.75rem', color: 'var(--secondary-color)' }}>
                              VIEW DETAILS <ChevronRight size={16} />
                           </div>
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
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '10rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem', alignItems: 'center' }}>
                <div>
                   <h1 style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--primary-color)', lineHeight: 1, marginBottom: '4rem' }}>Campus<br />Inquiries.</h1>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                      {content.email && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.3, marginBottom: '1rem' }}>Admissions Hub</span>
                           <b style={{ fontSize: '1.8rem', color: 'var(--primary-color)' }}>{content.email}</b>
                        </div>
                      )}
                      {content.phone && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.3, marginBottom: '1rem' }}>Direct Office</span>
                           <b style={{ fontSize: '1.8rem' }}>{content.phone}</b>
                        </div>
                      )}
                   </div>
                </div>
                <div>
                   {mapsLink && (
                     <div style={{ width: '100%', height: '600px', border: '15px solid #F8F8F8', borderRadius: '1rem', overflow: 'hidden' }}>
                        <iframe src={mapsLink} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
                     </div>
                   )}
                </div>
             </div>
          </div>
        );

      default:
        return (
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '10rem 4vw' }}>
             <div style={{ fontSize: '1.25rem', lineHeight: 1.8 }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.body || '' }} />
          </div>
        );
    }
  };

  return (
    <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Charter', 'Georgia', serif" }}>
      <EduNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <EduFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
    </div>
  );
}

function EduNavbar({ settings, siteName, navPages, currentSlug, subdomain }: any) {
  return (
    <nav style={{ height: '100px', padding: '0 4vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-color)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #EEE' }}>
      <Link to={`/preview/${subdomain}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {settings?.logo_url ? (
          <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '44px', width: 'auto' }} />
        ) : (
          <div style={{ display: 'flex', items: 'center', gap: '1rem' }}>
             <Library size={32} color="var(--primary-color)" />
             <div style={{ lineHeight: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 800, fontSize: '1.4rem', textTransform: 'uppercase', color: 'var(--primary-color)' }}>{siteName}</span>
                <span style={{ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', opacity: 0.3 }}>Center of Excellence</span>
             </div>
          </div>
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
                color: 'inherit', 
                fontSize: '0.75rem', 
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                opacity: isActive ? 1 : 0.4,
                borderBottom: isActive ? '3px solid var(--secondary-color)' : 'none',
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

function EduFooter({ settings, siteName, footerCfg }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <footer style={{ background: '#FDFDFD', borderTop: '1px solid #EEE', padding: '10rem 4vw 4vw' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr', gap: '6rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {settings?.logo_url && <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '44px', width: 'auto' }} />}
            <span style={{ fontWeight: 800, fontSize: '1.8rem', textTransform: 'uppercase', color: 'var(--primary-color)' }}>{siteName}</span>
          </div>
          <p style={{ opacity: 0.5, lineHeight: 1.8, fontSize: '1rem', fontStyle: 'italic', marginBottom: '3rem', maxWidth: '400px' }}>{footerCfg.short_description || footerCfg.footer_description}</p>
        </div>

        <div>
           <h4 style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '2.5rem', opacity: 0.3 }}>Institutional</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((ln: any, i: number) => (
                 <a key={i} href={ln.url} style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6 }}>{ln.label}</a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '2.5rem', opacity: 0.3 }}>Academic Net</h4>
           <div style={{ display: 'flex', gap: '1.5rem' }}>
              {(footerCfg.social_links || []).map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ color: 'inherit', opacity: 0.3, transition: 'all 0.4s' }} onMouseOver={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'var(--primary-color)'; }} onMouseOut={e => { e.currentTarget.style.opacity = '0.3'; e.currentTarget.style.color = 'inherit'; }}>
                   <SocialIcon type={social.icon} size={24} />
                </a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '2.5rem', opacity: 0.3 }}>Campus Contact</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '1rem' }}>
              {contact.phone && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><Phone size={16} style={{ opacity: 0.3 }} /> <b>{contact.phone}</b></div>}
              {contact.whatsapp && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><MessageCircle size={16} style={{ opacity: 0.3 }} /> <b>{contact.whatsapp}</b></div>}
              {contact.email && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><Mail size={16} style={{ opacity: 0.3 }} /> <b>{contact.email}</b></div>}
              {contact.service_hours && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', opacity: 0.3 }}><Clock size={16} /> <span>{contact.service_hours}</span></div>}
              
              {footerCfg.location_embed_link && (
                <div style={{ width: '100%', height: '180px', borderRadius: '0.5rem', overflow: 'hidden', marginTop: '1.5rem', border: '1px solid #EEE' }}>
                   <iframe src={footerCfg.location_embed_link.includes('<iframe') ? footerCfg.location_embed_link.match(/src="([^"]+)"/)?.[1] : footerCfg.location_embed_link} width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>
                </div>
              )}
           </div>
        </div>
      </div>
      <div style={{ maxWidth: '1400px', margin: '8rem auto 0', paddingTop: '4rem', borderTop: '1px solid #EEE', fontSize: '0.7rem', opacity: 0.3, textAlign: 'center', fontStyle: 'italic', letterSpacing: '0.3em' }}>
         © {new Date().getFullYear()} {siteName.toUpperCase()} - ACADEMIC SOVEREIGN COMPLIANCE.
      </div>
    </footer>
  );
}
