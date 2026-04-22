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
  ArrowRight,
  Image as ImageIcon
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
    const footerCfg = settings?.global_options?.footer_config || {};

  
  // Render Post Detail if postData exists
  if (postData) {
    return (
      <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
        <MinimalistNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} currentSlug={currentSlug} settings={settings} navPages={navPages} subdomain={subdomain} />
        </main>
        <MinimalistFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
              <div>
                {(content.headline || content.hero_title) && (
                  <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.05em', marginBottom: '1.5rem' }}>
                    {content.headline || content.hero_title}
                  </h1>
                )}
                {(content.sub_headline || content.hero_subtitle) && (
                  <p style={{ fontSize: '1.25rem', lineHeight: 1.6, opacity: 0.7, maxWidth: '500px' }}>
                    {content.sub_headline || content.hero_subtitle}
                  </p>
                )}
              </div>
              <div style={{ aspectRatio: '1/1', borderRadius: '3rem', overflow: 'hidden', background: 'var(--text-color)05', boxShadow: '0 30px 100px rgba(0,0,0,0.05)' }}>
                {content.hero_image ? (
                  <img src={fixImg(content.hero_image)} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
                    <ImageIcon size={48} />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 2rem' }} className="animate-in fade-in duration-700">
            <div style={{ maxWidth: '800px' }}>
              <h2 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>About Us</h2>
              <div 
                style={{ fontSize: '1.25rem', lineHeight: 1.8, opacity: 0.9, whiteSpace: 'pre-wrap' }}
                className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.about_us || '' }}
              />
            </div>
          </div>
        );
// ... existing gallery and news cases ...
      case 'gallery':
        const galleryImages = Array.isArray(content.images) ? content.images : [];
        return (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem' }} className="animate-in fade-in duration-700">
            {content.gallery_title && <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.03em' }}>{content.gallery_title}</h1>}
            {content.description && <div className="rich-text-content" style={{ fontSize: '1.1rem', opacity: 0.6, marginBottom: '4rem', maxWidth: '700px' }} dangerouslySetInnerHTML={{ __html: content.description }} />}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {galleryImages.map((img: string, i: number) => (
                <div key={i} style={{ borderRadius: '1.5rem', overflow: 'hidden', aspectRatio: '1', background: 'var(--text-color)08' }}>
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
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
                  {content.article_title || pageData.title}
                </h1>
                {content.summary && (
                  <div 
                    style={{ fontSize: '1.25rem', lineHeight: 1.6, opacity: 0.7, marginBottom: '2.5rem', fontStyle: 'italic' }} 
                    className="rich-text-content" 
                    dangerouslySetInnerHTML={{ __html: content.summary }} 
                  />
                )}
                <div 
                  style={{ fontSize: '1.15rem', lineHeight: 1.8, opacity: 0.9 }} 
                  className="rich-text-content" 
                  dangerouslySetInnerHTML={{ __html: content.main_content || content.body || '' }} 
                />
             </div>

             <div style={{ borderTop: '1px solid var(--text-color)11', paddingTop: '4rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '3rem' }}>
                   {posts.map((post) => (
                      <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                         <article className="group">
                            <div style={{ aspectRatio: '16/9', borderRadius: '1.5rem', overflow: 'hidden', marginBottom: '1.5rem', background: 'var(--text-color)08' }}>
                               <img src={fixImg(post.content?.featured_image)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s' }} className="group-hover:scale-105" />
                            </div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary-color)' }}>{post.category}</span>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.5rem 0 1rem', lineHeight: 1.2 }}>{post.title}</h3>
                            <div className="rich-text-content" style={{ opacity: 0.6, fontSize: '0.95rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: post.excerpt || post.content?.summary || '' }} />
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
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '6rem' }}>
                <div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                      {content.email && (
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                           <div style={{ width: '60px', height: '60px', borderRadius: '1.5rem', background: 'var(--primary-color)', color: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                           <div style={{ width: '60px', height: '60px', borderRadius: '1.5rem', background: 'var(--primary-color)', color: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
             <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.body || '' }} />
          </div>
        );
    }
  };

  return (
    <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      <MinimalistNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <MinimalistFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
    </div>
  );
}

function MinimalistNavbar({ settings, siteName, navPages, currentSlug, subdomain }: any) {
  return (
    <nav style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4rem', position: 'sticky', top: 0, zIndex: 100, background: `${'var(--bg-color)'}cc`, backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--text-color)0a' }}>
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
                color: isActive ? 'var(--primary-color)' : 'var(--text-color)', 
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

function MinimalistFooter({ settings, siteName, footerCfg }: any) {
  const contact = footerCfg.contact_info || {};
  const hasSocial = footerCfg.social_links && footerCfg.social_links.length > 0;
  const mapsSrc = footerCfg.location_embed_link?.includes('<iframe') ? footerCfg.location_embed_link.match(/src="([^"]+)"/)?.[1] : footerCfg.location_embed_link;

  return (
    <footer style={{ background: 'var(--secondary-color)', color: 'var(--bg-color)', padding: '6rem 4rem 4rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem' }}>
        {/* Column 1: Identity & Social */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            {settings?.logo_url && <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '40px', width: 'auto' }} />}
            <span style={{ fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.04em' }}>{siteName}</span>
          </div>
          {hasSocial && (
            <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem' }}>
              {footerCfg.social_links.map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ color: 'inherit', opacity: 0.8, transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--primary-color)'} onMouseOut={e => e.currentTarget.style.color = 'inherit'}>
                  <SocialIcon type={social.icon} size={22} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Tautan Cepat */}
        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '2rem', opacity: 0.6 }}>Tautan Cepat</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((link: any, i: number) => (
                <a key={i} href={link.url} style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.95rem', opacity: 0.8 }}>{link.label}</a>
              ))}
           </div>
        </div>

        {/* Column 3: Hubungi Kami */}
        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '2rem', opacity: 0.6 }}>Hubungi Kami</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {contact.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Phone size={16} style={{ opacity: 0.6 }} /> <span style={{ fontSize: '0.95rem' }}>{contact.phone}</span></div>}
              {contact.whatsapp && <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><MessageCircle size={16} style={{ opacity: 0.6 }} /> <span style={{ fontSize: '0.95rem' }}>{contact.whatsapp}</span></div>}
              {contact.email && <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Mail size={16} style={{ opacity: 0.6 }} /> <span style={{ fontSize: '0.95rem' }}>{contact.email}</span></div>}
              {contact.service_hours && <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Clock size={16} style={{ opacity: 0.6 }} /> <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{contact.service_hours}</span></div>}
           </div>
        </div>

        {/* Column 4: Location (Maps) */}
        {mapsSrc && (
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '2rem', opacity: 0.6 }}>Lokasi</h4>
            <div style={{ width: '100%', height: '180px', borderRadius: '1.5rem', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
               <iframe src={mapsSrc} width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>
            </div>
          </div>
        )}
      </div>

      <div style={{ maxWidth: '1400px', margin: '6rem auto 0', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', opacity: 0.6 }}>
         <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
         <div style={{ display: 'flex', gap: '2rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
         </div>
      </div>
    </footer>
  );
}
