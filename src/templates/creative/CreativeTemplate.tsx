// src/templates/creative/CreativeTemplate.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  Linkedin, 
  Twitter, 
  MessageCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ArrowUpRight,
  Zap,
  Globe,
  Compass
} from 'lucide-react';
import UnifiedPostLayout from '../../components/UnifiedPostLayout';

const BASE_URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL}`;
const fixImg = (url: string) => url && url.startsWith("/uploads") ? `${BASE_URL}${url}` : url;

const SocialIcon = ({ type, size = 24 }: { type: string, size?: number }) => {
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

export default function CreativeTemplate({ 
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
  const siteName = settings?.site_name || 'Creative Studio';
  const content = pageData?.content || {};
  const pageType = pageData?.page_type || 'home';
    const footerCfg = settings?.global_options?.footer_config || {};

  
  if (postData) {
    return (
      <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Outfit', sans-serif" }}>
        <CreativeNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} currentSlug={currentSlug} />
        </main>
        <CreativeFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
             <section style={{ padding: '12rem 4rem 8rem', position: 'relative' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                   {content.headline && (
                     <h1 style={{ fontSize: 'clamp(4rem, 12vw, 9rem)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.06em', marginBottom: '4rem' }}>
                       {content.headline}
                     </h1>
                   )}
                   <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 2fr', gap: '4rem', alignItems: 'end' }}>
                      <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '1px solid var(--text-color)22', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'spin 10s linear infinite' }}>
                         <Zap size={40} color="var(--primary-color)" />
                         <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                      </div>
                      {content.sub_headline && (
                        <p style={{ fontSize: '2rem', fontWeight: 300, opacity: 0.5, lineHeight: 1.3, maxWidth: '800px' }}>
                           {content.sub_headline}
                        </p>
                      )}
                   </div>
                </div>
             </section>
             {content.hero_image && (
               <div style={{ padding: '0 4rem 8rem' }}>
                  <img src={fixImg(content.hero_image)} alt="Hero" style={{ width: '100%', height: '85vh', objectFit: 'cover', borderRadius: '4rem' }} />
               </div>
             )}
          </div>
        );

      case 'profile':
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12rem 4rem' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '8rem' }}>
                <h1 style={{ fontSize: '6rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.05em' }}>The <span style={{ color: 'var(--primary-color)' }}>DNA</span> of our Works.</h1>
                <div 
                  style={{ fontSize: '1.5rem', lineHeight: 1.6, opacity: 0.8, whiteSpace: 'pre-wrap', fontWeight: 300 }}
                  dangerouslySetInnerHTML={{ __html: content.about_us || '' }}
                />
             </div>
          </div>
        );

      case 'gallery':
        const galleryImages = Array.isArray(content.images) ? content.images : [];
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '10rem 4rem' }} className="animate-in fade-in duration-700">
             {content.gallery_title && <h1 style={{ fontSize: '8rem', fontWeight: 900, letterSpacing: '-0.05em', marginBottom: '6rem' }}>{content.gallery_title}</h1>}
             <div style={{ columns: '3 400px', columnGap: '2rem' }}>
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} style={{ marginBottom: '2rem', breakInside: 'avoid', borderRadius: '3rem', overflow: 'hidden', background: '#111' }}>
                     <img src={fixImg(img)} alt={`Gallery ${i}`} style={{ width: '100%', display: 'block', transition: 'all 0.4s' }} />
                  </div>
                ))}
             </div>
          </div>
        );

      case 'news':
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '10rem 4rem' }} className="animate-in fade-in duration-700">
             <div style={{ marginBottom: '10rem' }}>
                <div style={{ height: '70vh', borderRadius: '4rem', overflow: 'hidden', marginBottom: '6rem' }}>
                   <img src={fixImg(content.featured_image)} alt="Featured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h1 style={{ fontSize: '8rem', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.9, marginBottom: '2rem' }}>{pageData.title}</h1>
                <p style={{ fontSize: '1.5rem', opacity: 0.5, maxWidth: '800px' }} dangerouslySetInnerHTML={{ __html: content.summary || '' }} />
             </div>

             <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '5rem' }}>
                <div style={{ height: '2px', flex: 1, background: 'var(--text-color)11' }} />
                <h2 style={{ fontSize: '4rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Case Studies</h2>
                <div style={{ height: '2px', flex: 1, background: 'var(--text-color)11' }} />
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', gap: '6rem' }}>
                {posts.map((post) => (
                  <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <article className="group">
                        <div style={{ aspectRatio: '1', borderRadius: '4rem', overflow: 'hidden', marginBottom: '3rem', background: '#111' }}>
                           <img src={fixImg(post.content?.featured_image)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s' }} className="group-hover:scale-110" />
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.3em' }}>{post.category}</span>
                        <h3 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '1rem', letterSpacing: '-0.03em' }}>{post.title}</h3>
                        <p style={{ opacity: 0.4, fontSize: '1.1rem', marginTop: '1.5rem', maxWidth: '450px' }}>{post.excerpt || post.content?.summary}</p>
                     </article>
                  </Link>
                ))}
             </div>
          </div>
        );

      case 'contact':
        const mapsIframe = content.maps_link?.includes('<iframe') ? content.maps_link.match(/src="([^"]+)"/)?.[1] : content.maps_link;
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12rem 4rem' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10rem', alignItems: 'center' }}>
                <div>
                   <h1 style={{ fontSize: '8rem', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.06em', marginBottom: '6rem' }}>Connect<br />with us.</h1>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                      {content.email && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', opacity: 0.3, marginBottom: '1rem' }}>Electronic Mail</span>
                           <a href={`mailto:${content.email}`} style={{ fontSize: '2.5rem', fontWeight: 300, color: 'inherit', textDecoration: 'none', borderBottom: '2px solid var(--primary-color)' }}>{content.email}</a>
                        </div>
                      )}
                      {content.phone && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', opacity: 0.3, marginBottom: '1rem' }}>Direct Line</span>
                           <b style={{ fontSize: '2.5rem', fontWeight: 300 }}>{content.phone}</b>
                        </div>
                      )}
                   </div>
                </div>
                <div>
                   {mapsIframe && (
                     <div style={{ width: '100%', height: '700px', borderRadius: '5rem', overflow: 'hidden', filter: 'invert(1) hue-rotate(180deg) brightness(0.8)' }}>
                        <iframe src={mapsIframe} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
                     </div>
                   )}
                </div>
             </div>
          </div>
        );

      default:
        return (
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '10rem 4rem' }}>
             <div style={{ fontSize: '1.5rem', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: content.body || '' }} />
          </div>
        );
    }
  };

  return (
    <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Outfit', sans-serif" }}>
      <CreativeNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <CreativeFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
    </div>
  );
}

function CreativeNavbar({ settings, siteName, navPages, currentSlug, subdomain }: any) {
  return (
    <nav style={{ height: '100px', padding: '0 4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' }}>
      <Link to={`/preview/${subdomain}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {settings?.logo_url && <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '40px', width: 'auto' }} />}
        <span style={{ fontWeight: 900, fontSize: '1.8rem', letterSpacing: '-0.05em' }}>{siteName}</span>
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
                color: isActive ? 'var(--primary-color)' : 'var(--text-color)', 
                fontSize: '0.8rem', 
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                opacity: isActive ? 1 : 0.4,
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

function CreativeFooter({ settings, siteName, footerCfg }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <footer style={{ background: '#050505', color: '#FFFFFF', padding: '12rem 4rem 4rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: '1000px', height: '1000px', background: 'var(--primary-color)', filter: 'blur(200px)', opacity: 0.1, top: '-500px', right: '-500px', borderRadius: '50%' }} />
      <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '8rem', position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
            {settings?.logo_url && <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '56px', width: 'auto' }} />}
            <span style={{ fontWeight: 900, fontSize: '2.5rem', letterSpacing: '-0.05em' }}>{siteName}</span>
          </div>
          <p style={{ opacity: 0.4, lineHeight: 1.6, fontSize: '1.2rem', marginBottom: '4rem', maxWidth: '450px' }}>{footerCfg.short_description || footerCfg.footer_description}</p>
          <div style={{ display: 'flex', gap: '2rem' }}>
             {(footerCfg.social_links || []).map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ color: 'inherit', opacity: 0.3, transition: 'all 0.4s ease' }} onMouseOver={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'var(--primary-color)'; }} onMouseOut={e => { e.currentTarget.style.opacity = '0.3'; e.currentTarget.style.color = 'inherit'; }}>
                   <SocialIcon type={social.icon} size={30} />
                </a>
             ))}
          </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '3rem', opacity: 0.3 }}>Menu</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((ln: any, i: number) => (
                 <a key={i} href={ln.url} style={{ textDecoration: 'none', color: 'inherit', fontSize: '1.1rem', fontWeight: 300, opacity: 0.6 }}>{ln.label}</a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '3rem', opacity: 0.3 }}>Studio</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', opacity: 0.6, fontWeight: 300, fontSize: '1.1rem' }}>
              <span>Privacy</span>
              <span>Credits</span>
              <span>Terms</span>
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '3rem', opacity: 0.3 }}>Contact</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontSize: '1.1rem' }}>
              {contact.phone && <div><span style={{ display: 'block', fontSize: '0.6rem', fontWeight: 900, opacity: 0.3, letterSpacing: '0.1em' }}>PHONE</span> <b>{contact.phone}</b></div>}
              {contact.whatsapp && <div><span style={{ display: 'block', fontSize: '0.6rem', fontWeight: 900, opacity: 0.3, letterSpacing: '0.1em' }}>WHATSAPP</span> <b>{contact.whatsapp}</b></div>}
              {contact.email && <div><span style={{ display: 'block', fontSize: '0.6rem', fontWeight: 900, opacity: 0.3, letterSpacing: '0.1em' }}>EMAIL</span> <b>{contact.email}</b></div>}
              {contact.service_hours && <div><span style={{ display: 'block', fontSize: '0.6rem', fontWeight: 900, opacity: 0.3, letterSpacing: '0.1em' }}>AVAILABILITY</span> <span style={{ opacity: 0.5 }}>{contact.service_hours}</span></div>}
              
              {footerCfg.location_embed_link && (
                <div style={{ width: '100%', height: '180px', borderRadius: '2rem', overflow: 'hidden', marginTop: '1rem', filter: 'grayscale(100%) invert(1)' }}>
                   <iframe src={footerCfg.location_embed_link.includes('<iframe') ? footerCfg.location_embed_link.match(/src="([^"]+)"/)?.[1] : footerCfg.location_embed_link} width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>
                </div>
              )}
           </div>
        </div>
      </div>
      <div style={{ maxWidth: '1600px', margin: '10rem auto 0', paddingTop: '4rem', borderTop: '1px solid #FFFFFF10', fontSize: '0.75rem', opacity: 0.2, textAlign: 'center', letterSpacing: '0.5em' }}>
         STRICT_STYLING / UNIVERSAL_SYNC / MOD_AGENT
      </div>
    </footer>
  );
}
