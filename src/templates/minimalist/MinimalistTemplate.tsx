// src/templates/minimalist/MinimalistTemplate.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  Linkedin, 
  Twitter, 
  MessageSquare, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import UnifiedPostLayout from '../../components/UnifiedPostLayout';

const BASE_URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL}`;
const fixImg = (url: string) => url && url.startsWith('/uploads') ? `${BASE_URL}${url}` : url;

const SocialIcon = ({ type, size = 20 }: { type: string; size?: number }) => {
  const icons: Record<string, any> = {
    instagram: Instagram,
    facebook: Facebook,
    youtube: Youtube,
    linkedin: Linkedin,
    twitter: Twitter,
    whatsapp: MessageCircle,
    tiktok: MessageSquare,
  };
  const Icon = icons[type.toLowerCase()] || MessageCircle;
  return <Icon size={size} />;
};

interface BrandingPalette {
  name: string;
  primary: string;
  secondary: string;
  surface: string;
  text: string;
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

export default function MinimalistTemplate({
  pageData,
  postData,
  posts = [],
  settings,
  navPages = [],
  palette,
  currentSlug,
  subdomain,
  themeColor
}: TemplateProps) {
  const siteName = settings?.site_name || 'Uni-Inside';
  const content = pageData?.content || {};
  const pageType = pageData?.page_type || 'home';
  const p = palette || { 
    primary: themeColor || '#FBBF24', 
    secondary: '#18181B', 
    surface: '#FFFFFF', 
    text: '#27272A', 
    name: 'Default' 
  };
  const footerCfg = settings?.global_options?.footer_config || {};

  const vars = {
    '--primary': p.primary,
    '--secondary': p.secondary,
    '--bg-color': p.surface,
    '--text-main': p.text,
  } as React.CSSProperties;

  // Render Post Detail if postData exists
  if (postData) {
    return (
      <div style={{ ...vars, background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
        <MinimalistNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} p={p} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} palette={p} currentSlug={currentSlug} />
        </main>
        <MinimalistFooter settings={settings} siteName={siteName} footerCfg={footerCfg} p={p} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {content.hero_image && (
              <div style={{ width: '100%', height: '70vh', overflow: 'hidden' }}>
                <img src={fixImg(content.hero_image)} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '6rem 2rem' }}>
              {content.headline && (
                <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.05em', marginBottom: '2rem' }}>
                  {content.headline}
                </h1>
              )}
              {content.sub_headline && (
                <p style={{ fontSize: '1.25rem', lineHeight: 1.6, opacity: 0.7, maxWidth: '600px' }}>
                  {content.sub_headline}
                </p>
              )}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '8rem 2rem' }} className="animate-in fade-in duration-700">
            <h2 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary)', marginBottom: '1.5rem' }}>About Us</h2>
            <div 
              style={{ fontSize: '1.25rem', lineHeight: 1.8, opacity: 0.9, whiteSpace: 'pre-wrap' }}
              dangerouslySetInnerHTML={{ __html: content.about_us || '' }}
            />
          </div>
        );

      case 'gallery':
        const galleryImages = Array.isArray(content.images) ? content.images : [];
        return (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem' }} className="animate-in fade-in duration-700">
            {content.gallery_title && <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.03em' }}>{content.gallery_title}</h1>}
            {content.description && <p style={{ fontSize: '1.1rem', opacity: 0.6, marginBottom: '4rem', maxWidth: '700px' }}>{content.description}</p>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {galleryImages.map((img: string, i: number) => (
                <div key={i} style={{ borderRadius: '1.5rem', overflow: 'hidden', aspectRatio: '1', background: 'var(--text-main)08' }}>
                  <img src={fixImg(img)} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                </div>
              ))}
            </div>
          </div>
        );

      case 'news':
        return (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem' }} className="animate-in fade-in duration-700">
             {content.featured_image && (
               <div style={{ width: '100%', height: '50vh', borderRadius: '2rem', overflow: 'hidden', marginBottom: '4rem' }}>
                  <img src={fixImg(content.featured_image)} alt="Featured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               </div>
             )}
             <div style={{ maxWidth: '800px', marginBottom: '6rem' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '2rem', letterSpacing: '-0.04em' }}>{pageData.title}</h1>
                <div style={{ fontSize: '1.2rem', lineHeight: 1.7, opacity: 0.8 }} dangerouslySetInnerHTML={{ __html: content.body || content.main_content || '' }} />
             </div>

             <div style={{ borderTop: '1px solid var(--text-main)11', paddingTop: '6rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '3rem' }}>Latest Updates</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '3rem' }}>
                   {posts.map((post) => (
                      <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                         <article className="group">
                            <div style={{ aspectRatio: '16/9', borderRadius: '1.5rem', overflow: 'hidden', marginBottom: '1.5rem', background: 'var(--text-main)08' }}>
                               <img src={fixImg(post.content?.featured_image)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s' }} className="group-hover:scale-105" />
                            </div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary)' }}>{post.category}</span>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.5rem 0 1rem', lineHeight: 1.2 }}>{post.title}</h3>
                            <p style={{ opacity: 0.6, fontSize: '0.95rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.excerpt || post.content?.summary}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.85rem' }}>
                               READ MORE <ArrowRight size={16} />
                            </div>
                         </article>
                      </Link>
                   ))}
                </div>
             </div>
          </div>
        );

      case 'contact':
        const mapsSrc = content.maps_link?.includes('<iframe') ? content.maps_link.match(/src="([^"]+)"/)?.[1] : content.maps_link;
        return (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 2rem' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem' }}>
                <div>
                   <h1 style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1, marginBottom: '3rem', letterSpacing: '-0.05em' }}>Get in touch.</h1>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                      {content.email && (
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                           <div style={{ width: '60px', height: '60px', borderRadius: '1.5rem', background: 'var(--primary)', color: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Mail size={24} />
                           </div>
                           <div>
                              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.5, letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Email Us</span>
                              <b style={{ fontSize: '1.25rem' }}>{content.email}</b>
                           </div>
                        </div>
                      )}
                      {content.phone && (
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                           <div style={{ width: '60px', height: '60px', borderRadius: '1.5rem', background: 'var(--primary)', color: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Phone size={24} />
                           </div>
                           <div>
                              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.5, letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Call Us</span>
                              <b style={{ fontSize: '1.25rem' }}>{content.phone}</b>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
                <div>
                   {mapsSrc && (
                     <div style={{ width: '100%', height: '500px', borderRadius: '2.5rem', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
                        <iframe src={mapsSrc} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
                     </div>
                   )}
                </div>
             </div>
          </div>
        );

      default:
        return (
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '6rem 2rem' }}>
             <div dangerouslySetInnerHTML={{ __html: content.body || '' }} />
          </div>
        );
    }
  };

  return (
    <div style={{ ...vars, background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      <MinimalistNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} p={p} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <MinimalistFooter settings={settings} siteName={siteName} footerCfg={footerCfg} p={p} />
    </div>
  );
}

function MinimalistNavbar({ settings, siteName, navPages, currentSlug, p, subdomain }: any) {
  return (
    <nav style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4rem', position: 'sticky', top: 0, zIndex: 100, background: `${p.surface}cc`, backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--text-main)0a' }}>
      <Link to={`/preview/${subdomain}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {settings?.logo_url && <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '32px', width: 'auto' }} />}
        <span style={{ fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.03em' }}>{siteName}</span>
      </Link>
      <div style={{ display: 'flex', gap: '3rem' }}>
        {navPages.map((nav: any) => {
          const isActive = currentSlug === nav.slug?.replace(/^\/+/, '');
          return (
            <Link 
              key={nav.slug} 
              to={`/preview/${subdomain}/${nav.slug?.replace(/^\/+/, '')}`} 
              style={{ 
                textDecoration: 'none', 
                color: isActive ? 'var(--primary)' : 'var(--text-main)', 
                fontSize: '0.85rem', 
                fontWeight: isActive ? 800 : 500,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
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

function MinimalistFooter({ settings, siteName, footerCfg, p }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <footer style={{ background: 'var(--bg-color)', borderTop: '1px solid var(--text-main)0a', padding: '8rem 4rem 4rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr', gap: '4rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            {settings?.logo_url && <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '40px', width: 'auto' }} />}
            <span style={{ fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.04em' }}>{siteName}</span>
          </div>
          <p style={{ opacity: 0.5, lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '2.5rem', maxWidth: '300px' }}>{footerCfg.short_description || footerCfg.footer_description}</p>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '2rem', opacity: 0.4 }}>Quick Links</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((link: any, i: number) => (
                <a key={i} href={link.url} style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.95rem', opacity: 0.7 }}>{link.label}</a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '2rem', opacity: 0.4 }}>Social Media</h4>
           <div style={{ display: 'flex', gap: '1.5rem' }}>
              {(footerCfg.social_links || []).map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ color: 'inherit', opacity: 0.6 }} onMouseOver={e => e.currentTarget.style.color = 'var(--primary)'} onMouseOut={e => e.currentTarget.style.color = 'inherit'}>
                  <SocialIcon type={social.icon} size={24} />
                </a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '2rem', opacity: 0.4 }}>Hubungi Kami</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {contact.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Phone size={18} style={{ opacity: 0.4 }} /> <b>{contact.phone}</b></div>}
              {contact.whatsapp && <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><MessageCircle size={18} style={{ opacity: 0.4 }} /> <b>{contact.whatsapp}</b></div>}
              {contact.email && <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Mail size={18} style={{ opacity: 0.4 }} /> <b>{contact.email}</b></div>}
              {contact.service_hours && <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Clock size={18} style={{ opacity: 0.4 }} /> <span>{contact.service_hours}</span></div>}
              
              {footerCfg.location_embed_link && (
                <div style={{ width: '100%', height: '120px', borderRadius: '1rem', overflow: 'hidden', marginTop: '1rem' }}>
                   <iframe src={footerCfg.location_embed_link.includes('<iframe') ? footerCfg.location_embed_link.match(/src="([^"]+)"/)?.[1] : footerCfg.location_embed_link} width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>
                </div>
              )}
           </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '6rem auto 0', paddingTop: '3rem', borderTop: '1px solid var(--text-main)0a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', opacity: 0.4 }}>
         <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
         <div style={{ display: 'flex', gap: '2rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
         </div>
      </div>
    </footer>
  );
}
