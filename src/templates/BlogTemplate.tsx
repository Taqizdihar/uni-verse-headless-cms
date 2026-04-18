// src/templates/BlogTemplate.tsx
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
  Clock, 
  User, 
  Calendar,
  BookOpen,
  Hash,
  Bookmark
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

export default function BlogTemplate({ 
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
  const siteName = settings?.site_name || 'Blog Echo';
  const content = pageData?.content || {};
  const pageType = pageData?.page_type || 'home';
  const p = palette || { 
    primary: themeColor || '#4F46E5', 
    secondary: '#1F2937', 
    surface: '#FFFFFF', 
    text: '#111827', 
    name: 'Journal' 
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
      <div style={{ ...vars, background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Charter', 'Georgia', serif" }}>
        <BlogNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} p={p} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} palette={p} currentSlug={currentSlug} />
        </main>
        <BlogFooter settings={settings} siteName={siteName} footerCfg={footerCfg} p={p} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
             <section style={{ padding: '6rem 2rem', borderBottom: '1px solid var(--text-main)0a' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                   {content.headline && <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '2rem' }}>{content.headline}</h1>}
                   {content.sub_headline && <p style={{ fontSize: '1.4rem', opacity: 0.5, lineHeight: 1.6, maxWidth: '700px', margin: '0 auto' }}>{content.sub_headline}</p>}
                </div>
             </section>
             {content.hero_image && (
               <div style={{ maxWidth: '1200px', margin: '4rem auto 8rem', padding: '0 2rem' }}>
                  <img src={fixImg(content.hero_image)} alt="Hero" style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
               </div>
             )}
          </div>
        );

      case 'profile':
        return (
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '8rem 2rem' }} className="animate-in fade-in duration-700">
             <div style={{ paddingBottom: '3rem', borderBottom: '1px solid var(--text-main)11', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>The Editor's Note</h1>
             </div>
             <div 
               style={{ fontSize: '1.25rem', lineHeight: 2, opacity: 0.9, whiteSpace: 'pre-wrap' }}
               dangerouslySetInnerHTML={{ __html: content.about_us || '' }}
             />
          </div>
        );

      case 'gallery':
        const galleryImages = Array.isArray(content.images) ? content.images : [];
        return (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 2rem' }} className="animate-in fade-in duration-700">
             <div style={{ marginBottom: '6rem' }}>
                {content.gallery_title && <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '1.5rem' }}>{content.gallery_title}</h1>}
                {content.description && <p style={{ fontSize: '1.2rem', opacity: 0.5 }}>{content.description}</p>}
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '4rem' }}>
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} style={{ aspectRatio: '1', overflow: 'hidden', borderBottom: '4px solid var(--primary)' }}>
                     <img src={fixImg(img)} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
             </div>
          </div>
        );

      case 'news':
        return (
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '8rem 2rem' }} className="animate-in fade-in duration-700">
             <div style={{ borderBottom: '1px solid var(--text-main)11', paddingBottom: '6rem', marginBottom: '6rem' }}>
                <div style={{ height: '500px', overflow: 'hidden', marginBottom: '4rem' }}>
                   <img src={fixImg(content.featured_image)} alt="Featured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h1 style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '2.5rem' }}>{pageData.title}</h1>
                <div style={{ fontSize: '1.4rem', lineHeight: 1.8, opacity: 0.7 }} dangerouslySetInnerHTML={{ __html: content.summary || '' }} />
             </div>

             <h2 style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', opacity: 0.3, marginBottom: '4rem' }}>Recent Publications</h2>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
                {posts.map((post) => (
                  <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem' }}>
                     <article style={{ display: 'contents' }}>
                        <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                           <img src={fixImg(post.content?.featured_image)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
                              <Bookmark size={14} /> {post.category}
                           </div>
                           <h3 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.2 }}>{post.title}</h3>
                           <p style={{ opacity: 0.5, fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>{post.excerpt || post.content?.summary}</p>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 900, fontSize: '0.8rem' }}>
                              READ STORY <ArrowRight size={16} />
                           </div>
                        </div>
                     </article>
                  </Link>
                ))}
             </div>
          </div>
        );

      case 'contact':
        const mapUrl = content.maps_link?.includes('<iframe') ? content.maps_link.match(/src="([^"]+)"/)?.[1] : content.maps_link;
        return (
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '10rem 2rem' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem' }}>
                <div>
                   <h1 style={{ fontSize: '4.5rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '4rem' }}>Letter to<br />the Editor.</h1>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
                      {content.email && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.3, marginBottom: '0.5rem' }}>E-Post</span>
                           <b style={{ fontSize: '1.5rem', textDecoration: 'underline', textDecorationColor: 'var(--primary)' }}>{content.email}</b>
                        </div>
                      )}
                      {content.phone && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.3, marginBottom: '0.5rem' }}>Voice Line</span>
                           <b style={{ fontSize: '1.5rem' }}>{content.phone}</b>
                        </div>
                      )}
                   </div>
                </div>
                <div>
                   {mapUrl && (
                     <div style={{ width: '100%', height: '550px', border: '1px solid var(--text-main)11', padding: '0.5rem' }}>
                        <iframe src={mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
                     </div>
                   )}
                </div>
             </div>
          </div>
        );

      default:
        return (
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '8rem 2rem' }}>
             <div style={{ fontSize: '1.3rem', lineHeight: 1.9 }} dangerouslySetInnerHTML={{ __html: content.body || '' }} />
          </div>
        );
    }
  };

  return (
    <div style={{ ...vars, background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Charter', 'Georgia', serif" }}>
      <BlogNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} p={p} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <BlogFooter settings={settings} siteName={siteName} footerCfg={footerCfg} p={p} />
    </div>
  );
}

function BlogNavbar({ settings, siteName, navPages, currentSlug, p, subdomain }: any) {
  return (
    <nav style={{ height: '90px', padding: '0 4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-color)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--text-main)0a' }}>
      <Link to={`/preview/${subdomain}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {settings?.logo_url ? (
          <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '36px', width: 'auto' }} />
        ) : (
          <span style={{ fontWeight: 900, fontSize: '1.8rem', letterSpacing: '-0.03em' }}>{siteName}</span>
        )}
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
                color: 'inherit', 
                fontSize: '0.8rem', 
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                opacity: isActive ? 1 : 0.4,
                borderBottom: isActive ? '3px solid var(--primary)' : 'none',
                paddingBottom: '0.25rem',
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

function BlogFooter({ settings, siteName, footerCfg, p }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <footer style={{ background: 'var(--bg-color)', borderTop: '1px solid var(--text-main)0a', padding: '10rem 4rem 4rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr', gap: '6rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            {settings?.logo_url && <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '40px', width: 'auto' }} />}
            <span style={{ fontWeight: 900, fontSize: '2.2rem', letterSpacing: '-0.04em' }}>{siteName}</span>
          </div>
          <p style={{ opacity: 0.5, lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '3rem', maxWidth: '400px', fontStyle: 'italic' }}>{footerCfg.short_description || footerCfg.footer_description}</p>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '3rem', opacity: 0.3 }}>Archives</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((ln: any, i: number) => (
                 <a key={i} href={ln.url} style={{ textDecoration: 'none', color: 'inherit', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6 }}>{ln.label}</a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '3rem', opacity: 0.3 }}>Syndication</h4>
           <div style={{ display: 'flex', gap: '2rem' }}>
              {(footerCfg.social_links || []).map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ color: 'inherit', opacity: 0.4, transition: 'all 0.4s' }} onMouseOver={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'var(--primary)'; }} onMouseOut={e => { e.currentTarget.style.opacity = '0.4'; e.currentTarget.style.color = 'inherit'; }}>
                   <SocialIcon type={social.icon} size={28} />
                </a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '3rem', opacity: 0.3 }}>The Portal</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontSize: '1.1rem', fontStyle: 'italic' }}>
              {contact.phone && <div style={{ display: 'flex', gap: '1rem' }}><Phone size={18} style={{ opacity: 0.4 }} /> <b>{contact.phone}</b></div>}
              {contact.whatsapp && <div style={{ display: 'flex', gap: '1rem' }}><MessageCircle size={18} style={{ opacity: 0.4 }} /> <b>{contact.whatsapp}</b></div>}
              {contact.email && <div style={{ display: 'flex', gap: '1rem' }}><Mail size={18} style={{ opacity: 0.4 }} /> <b>{contact.email}</b></div>}
              {contact.service_hours && <div style={{ display: 'flex', gap: '1rem', opacity: 0.3 }}><Clock size={18} /> <span>{contact.service_hours}</span></div>}
              
              {footerCfg.location_embed_link && (
                <div style={{ width: '100%', height: '180px', borderRadius: '3rem', overflow: 'hidden', marginTop: '1.5rem', border: '1px solid var(--text-main)11', filter: 'grayscale(100%)' }}>
                   <iframe src={footerCfg.location_embed_link.includes('<iframe') ? footerCfg.location_embed_link.match(/src="([^"]+)"/)?.[1] : footerCfg.location_embed_link} width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>
                </div>
              )}
           </div>
        </div>
      </div>
      <div style={{ maxWidth: '1400px', margin: '8rem auto 0', paddingTop: '4rem', borderTop: '1px solid var(--text-main)0a', fontSize: '0.8rem', opacity: 0.3, textAlign: 'center', fontStyle: 'italic', letterSpacing: '0.2em' }}>
         © {new Date().getFullYear()} {siteName.toUpperCase()} / PRINTED_IN_UNI_VERSE
      </div>
    </footer>
  );
}
