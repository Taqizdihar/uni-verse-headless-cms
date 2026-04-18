// src/templates/BeautyTemplate.tsx
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
  Heart, 
  Sparkles, 
  Moon, 
  Sun, 
  Flower2, 
  Wind, 
  Droplets, 
  ChevronRight, 
  Share2, 
  Info, 
  MapPin,
  Clock
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

export default function BeautyTemplate({ 
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
  const siteName = settings?.site_name || 'Beauty Wellness';
  const content = pageData?.content || {};
  const pageType = pageData?.page_type || 'home';
  const p = palette || { 
    primary: themeColor || '#FCE7F3', 
    secondary: '#FBCFE8', 
    surface: '#FFFFFF', 
    text: '#500724', 
    name: 'Spa & Wellness' 
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
        <BeautyNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} p={p} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} palette={p} currentSlug={currentSlug} />
        </main>
        <BeautyFooter settings={settings} siteName={siteName} footerCfg={footerCfg} p={p} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
             <section style={{ padding: '8rem 2rem', textAlign: 'center', background: 'var(--primary)', color: 'var(--text-main)', borderRadius: '0 0 5rem 5rem' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                   <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                      <Sparkles size={24} style={{ opacity: 0.4 }} />
                   </div>
                   {content.headline && <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontStyle: 'italic', fontWeight: 300, marginBottom: '2rem', lineHeight: 1.2 }}>{content.headline}</h1>}
                   {content.sub_headline && <p style={{ fontSize: '1.2rem', opacity: 0.6, maxWidth: '600px', margin: '0 auto' }}>{content.sub_headline}</p>}
                </div>
             </section>
             {content.hero_image && (
               <div style={{ maxWidth: '1100px', margin: '-4rem auto 8rem', padding: '0 2rem' }}>
                  <img src={fixImg(content.hero_image)} alt="Hero" style={{ width: '100%', height: '600px', objectFit: 'cover', borderRadius: '3rem', boxShadow: '0 30px 60px rgba(80,7,36,0.1)' }} />
               </div>
             )}
          </div>
        );

      case 'profile':
        return (
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '10rem 2rem' }} className="animate-in fade-in duration-700">
             <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <Flower2 size={40} style={{ color: 'var(--secondary)', marginBottom: '1.5rem' }} />
                <h2 style={{ fontSize: '3rem', fontStyle: 'italic', fontWeight: 300 }}>The Essence of Purity</h2>
             </div>
             <div 
               style={{ fontSize: '1.25rem', lineHeight: 2, opacity: 0.8, whiteSpace: 'pre-wrap', textAlign: 'center' }}
               dangerouslySetInnerHTML={{ __html: content.about_us || '' }}
             />
          </div>
        );

      case 'gallery':
        const galleryImages = Array.isArray(content.images) ? content.images : [];
        return (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 2rem' }} className="animate-in fade-in duration-700">
             <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                {content.gallery_title && <h1 style={{ fontSize: '4rem', fontStyle: 'italic', fontWeight: 300, marginBottom: '1rem' }}>{content.gallery_title}</h1>}
                {content.description && <p style={{ fontSize: '1.1rem', opacity: 0.5 }}>{content.description}</p>}
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} style={{ borderRadius: '10rem 10rem 2rem 2rem', overflow: 'hidden', height: '450px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                     <img src={fixImg(img)} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
             </div>
          </div>
        );

      case 'news':
        return (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 2rem' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center', marginBottom: '10rem' }}>
                <div style={{ height: '600px', borderRadius: '30rem 30rem 0 0', overflow: 'hidden' }}>
                   <img src={fixImg(content.featured_image)} alt="Featured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                   <span style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--secondary)', marginBottom: '1.5rem', display: 'block' }}>Wellness Journal</span>
                   <h1 style={{ fontSize: '3.5rem', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.1, marginBottom: '2rem' }}>{pageData.title}</h1>
                   <div style={{ fontSize: '1.1rem', opacity: 0.6, lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: content.summary || '' }} />
                </div>
             </div>

             <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                   <div style={{ height: '1px', width: '100px', background: 'var(--text-main)11' }} />
                   <h2 style={{ fontSize: '2rem', fontStyle: 'italic', fontWeight: 300 }}>Recent Articles</h2>
                   <div style={{ height: '1px', width: '100px', background: 'var(--text-main)11' }} />
                </div>
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '4rem' }}>
                {posts.map((post) => (
                  <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <article style={{ textAlign: 'center' }}>
                        <div style={{ aspectRatio: '1', borderRadius: '50%', overflow: 'hidden', marginBottom: '2.5rem', border: '8px solid var(--primary)' }}>
                           <img src={fixImg(post.content?.featured_image)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <h3 style={{ fontSize: '1.6rem', fontStyle: 'italic', fontWeight: 300, marginBottom: '1rem' }}>{post.title}</h3>
                        <p style={{ opacity: 0.5, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>{post.excerpt || post.content?.summary}</p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--secondary)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                           DISCOVER <ArrowRight size={16} />
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
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '10rem 2rem' }} className="animate-in fade-in duration-700">
             <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
                <h1 style={{ fontSize: '5rem', fontStyle: 'italic', fontWeight: 300, marginBottom: '2rem' }}>Visit the Sanctuary.</h1>
                <p style={{ fontSize: '1.2rem', opacity: 0.5 }}>Find your moment of peace in our botanical heart.</p>
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                   {content.email && (
                     <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <Mail size={24} color="var(--text-main)" />
                        </div>
                        <div>
                           <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Digital Ether</span>
                           <b style={{ fontSize: '1.4rem', fontWeight: 300, fontStyle: 'italic' }}>{content.email}</b>
                        </div>
                     </div>
                   )}
                   {content.phone && (
                     <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <Phone size={24} color="var(--text-main)" />
                        </div>
                        <div>
                           <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Voice Signal</span>
                           <b style={{ fontSize: '1.4rem', fontWeight: 300, fontStyle: 'italic' }}>{content.phone}</b>
                        </div>
                     </div>
                   )}
                </div>
                <div>
                   {mapsLink && (
                     <div style={{ width: '100%', height: '600px', borderRadius: '15rem 15rem 2rem 2rem', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.06)' }}>
                        <iframe src={mapsLink} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
                     </div>
                   )}
                </div>
             </div>
          </div>
        );

      default:
        return (
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '8rem 2rem' }}>
             <div style={{ fontSize: '1.2rem', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: content.body || '' }} />
          </div>
        );
    }
  };

  return (
    <div style={{ ...vars, background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
      <BeautyNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} p={p} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <BeautyFooter settings={settings} siteName={siteName} footerCfg={footerCfg} p={p} />
    </div>
  );
}

function BeautyNavbar({ settings, siteName, navPages, currentSlug, p, subdomain }: any) {
  return (
    <nav style={{ height: '100px', padding: '0 4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-color)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--primary)' }}>
      <Link to={`/preview/${subdomain}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {settings?.logo_url ? (
          <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '40px', width: 'auto' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <Flower2 size={28} color="var(--secondary)" />
             <span style={{ fontWeight: 300, fontSize: '1.6rem', fontStyle: 'italic', letterSpacing: '-0.02em' }}>{siteName}</span>
          </div>
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
                fontSize: '0.75rem', 
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                opacity: isActive ? 1 : 0.3,
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

function BeautyFooter({ settings, siteName, footerCfg, p }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <footer style={{ background: 'var(--bg-color)', borderTop: '1px solid var(--primary)', padding: '10rem 4rem 4rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr', gap: '6rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            {settings?.logo_url && <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '40px', width: 'auto' }} />}
            <span style={{ fontWeight: 300, fontSize: '2rem', fontStyle: 'italic' }}>{siteName}</span>
          </div>
          <p style={{ opacity: 0.4, lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '3rem', maxWidth: '350px' }}>{footerCfg.short_description || footerCfg.footer_description}</p>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '2.5rem', opacity: 0.3 }}>Reflections</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((ln: any, i: number) => (
                 <a key={i} href={ln.url} style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.95rem', opacity: 0.6 }}>{ln.label}</a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '2.5rem', opacity: 0.3 }}>Presence</h4>
           <div style={{ display: 'flex', gap: '1.5rem' }}>
              {(footerCfg.social_links || []).map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ color: 'inherit', opacity: 0.3, transition: 'all 0.4s' }} onMouseOver={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'var(--secondary)'; }} onMouseOut={e => { e.currentTarget.style.opacity = '0.3'; e.currentTarget.style.color = 'inherit'; }}>
                   <SocialIcon type={social.icon} size={26} />
                </a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '2.5rem', opacity: 0.3 }}>Sanctuary Connect</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.95rem' }}>
              {contact.phone && <div style={{ display: 'flex', gap: '1rem', opacity: 0.6 }}><Phone size={18} /> <b>{contact.phone}</b></div>}
              {contact.whatsapp && <div style={{ display: 'flex', gap: '1rem', opacity: 0.6 }}><MessageCircle size={18} /> <b>{contact.whatsapp}</b></div>}
              {contact.email && <div style={{ display: 'flex', gap: '1rem', opacity: 0.6 }}><Mail size={18} /> <b>{contact.email}</b></div>}
              {contact.service_hours && <div style={{ display: 'flex', gap: '1rem', opacity: 0.3 }}><Clock size={18} /> <span>{contact.service_hours}</span></div>}
              
              {footerCfg.location_embed_link && (
                <div style={{ width: '100%', height: '160px', borderRadius: '8rem 8rem 1rem 1rem', overflow: 'hidden', marginTop: '1.5rem', border: '1px solid var(--primary)' }}>
                   <iframe src={footerCfg.location_embed_link.includes('<iframe') ? footerCfg.location_embed_link.match(/src="([^"]+)"/)?.[1] : footerCfg.location_embed_link} width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>
                </div>
              )}
           </div>
        </div>
      </div>
      <div style={{ maxWidth: '1400px', margin: '8rem auto 0', paddingTop: '3rem', borderTop: '1px solid var(--primary)', fontSize: '0.8rem', opacity: 0.3, textAlign: 'center', fontStyle: 'italic' }}>
         © {new Date().getFullYear()} {siteName}. Pure Essence Preservation.
      </div>
    </footer>
  );
}
