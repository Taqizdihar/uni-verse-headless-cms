// src/templates/corporate/CorporateTemplate.tsx
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
  ArrowRight,
  Shield,
  Briefcase,
  Users
} from 'lucide-react';
import UnifiedPostLayout from '../../components/UnifiedPostLayout';

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

export default function CorporateTemplate({ 
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
  const siteName = settings?.site_name || 'Corporate';
  const content = pageData?.content || {};
  const pageType = pageData?.page_type || 'home';
    const footerCfg = settings?.global_options?.footer_config || {};

  
  if (postData) {
    return (
      <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
        <CorporateNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} currentSlug={currentSlug} />
        </main>
        <CorporateFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
             <section style={{ 
               padding: '10rem 4rem', 
               background: `linear-gradient(135deg, var(--secondary-color) 0%, #000 100%)`, 
               color: '#FFFFFF',
               position: 'relative',
               overflow: 'hidden'
             }}>
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '40%', height: '80%', background: 'var(--primary-color)', filter: 'blur(150px)', opacity: 0.15, borderRadius: '50%' }} />
                <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                   {content.headline && (
                     <h1 style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.05em', marginBottom: '2rem' }}>
                       {content.headline}
                     </h1>
                   )}
                   {content.sub_headline && (
                     <p style={{ fontSize: '1.25rem', opacity: 0.6, maxWidth: '700px', lineHeight: 1.6 }}>
                        {content.sub_headline}
                     </p>
                   )}
                </div>
             </section>
             {content.hero_image && (
               <div style={{ maxWidth: '1300px', margin: '-5rem auto 0', padding: '0 2rem' }}>
                  <img src={fixImg(content.hero_image)} alt="Hero" style={{ width: '100%', height: '600px', objectFit: 'cover', borderRadius: '2rem', boxShadow: '0 40px 100px rgba(0,0,0,0.15)' }} />
               </div>
             )}
          </div>
        );

      case 'profile':
        return (
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '10rem 2rem' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem', alignItems: 'start' }}>
                <div>
                   <div style={{ width: '80px', height: '4px', background: 'var(--primary-color)', marginBottom: '2rem' }} />
                   <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em' }}>Our Legacy & Vision</h2>
                </div>
                <div 
                  style={{ fontSize: '1.15rem', lineHeight: 1.9, opacity: 0.8, whiteSpace: 'pre-wrap' }}
                  className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.about_us || '' }}
                />
             </div>
          </div>
        );

      case 'gallery':
        const galleryImages = Array.isArray(content.images) ? content.images : [];
        return (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 2rem' }} className="animate-in fade-in duration-700">
             <header style={{ marginBottom: '5rem', borderLeft: '8px solid var(--primary-color)', paddingLeft: '2rem' }}>
                {content.gallery_title && <h1 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>{content.gallery_title}</h1>}
                {content.description && <div className="rich-text-content" style={{ fontSize: '1.2rem', opacity: 0.6, marginTop: '1rem' }} dangerouslySetInnerHTML={{ __html: content.description }} />}
             </header>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} style={{ borderRadius: '1.25rem', overflow: 'hidden', height: '400px', background: '#F5F5F7', border: '1px solid #E5E5E7' }}>
                     <img src={fixImg(img)} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                  </div>
                ))}
             </div>
          </div>
        );

      case 'news':
        return (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 2rem' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem', marginBottom: '8rem' }}>
                <div style={{ borderRadius: '2.5rem', overflow: 'hidden', height: '500px' }}>
                   <img src={fixImg(content.featured_image)} alt="Featured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                   <span style={{ color: 'var(--primary-color)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.5rem' }}>Top Highlight</span>
                   <h1 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '2rem', letterSpacing: '-0.03em' }}>{pageData.title}</h1>
                   <p style={{ fontSize: '1.1rem', opacity: 0.6, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: content.summary || '' }} />
                </div>
             </div>

             <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '4rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Briefcase size={32} color="var(--primary-color)" /> Corporate Insights
             </h2>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2.5rem' }}>
                {posts.map((post) => (
                  <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <article style={{ background: '#F8F9FB', borderRadius: '1.5rem', border: '1px solid #E8EBF0', padding: '1rem', transition: 'all 0.3s ease' }} onMouseOver={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.06)'; }} onMouseOut={e => { e.currentTarget.style.background = '#F8F9FB'; e.currentTarget.style.boxShadow = 'none'; }}>
                        <div style={{ borderRadius: '1rem', overflow: 'hidden', height: '240px', marginBottom: '1.5rem' }}>
                           <img src={fixImg(post.content?.featured_image)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '0.5rem 1rem 1rem' }}>
                           <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.25 }}>{post.title}</h3>
                           <div className="rich-text-content" style={{ opacity: 0.6, fontSize: '0.95rem', marginBottom: '1.5rem' }} dangerouslySetInnerHTML={{ __html: post.excerpt || post.content?.summary || '' }} />
                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', fontWeight: 800, fontSize: '0.85rem' }}>
                              DETAIL REPORT <ArrowRight size={16} />
                           </div>
                        </div>
                     </article>
                  </Link>
                ))}
             </div>
          </div>
        );

      case 'contact':
        const mapsUrl = content.maps_link?.includes('<iframe') ? content.maps_link.match(/src="([^"]+)"/)?.[1] : content.maps_link;
        return (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '10rem 2rem' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem' }}>
                <div>
                   <h1 style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1, marginBottom: '3rem', letterSpacing: '-0.05em' }}>Inquiry Center.</h1>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                      {content.email && (
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                           <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary-color)' }} />
                           <div>
                              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Corporate Liaison</span>
                              <b style={{ fontSize: '1.5rem' }}>{content.email}</b>
                           </div>
                        </div>
                      )}
                      {content.phone && (
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                           <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary-color)' }} />
                           <div>
                              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em' }}>International Line</span>
                              <b style={{ fontSize: '1.5rem' }}>{content.phone}</b>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
                <div>
                   {mapsUrl && (
                     <div style={{ width: '100%', height: '550px', borderRadius: '2rem', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.1)', border: '1px solid #E5E5E7' }}>
                        <iframe src={mapsUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
                     </div>
                   )}
                </div>
             </div>
          </div>
        );

      default:
        return (
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '8rem 2rem' }}>
             <div style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.body || '' }} />
          </div>
        );
    }
  };

  return (
    <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
      <CorporateNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <CorporateFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
    </div>
  );
}

function CorporateNavbar({ settings, siteName, navPages, currentSlug, subdomain }: any) {
  return (
    <nav style={{ height: '80px', padding: '0 4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--secondary-color)', color: '#FFFFFF', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #FFFFFF15' }}>
      <Link to={`/preview/${subdomain}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {settings?.logo_url && <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '36px', width: 'auto' }} />}
        <span style={{ fontWeight: 900, fontSize: '1.4rem', color: 'var(--primary-color)', letterSpacing: '-0.04em' }}>{siteName}</span>
      </Link>
      <div style={{ display: 'flex', gap: '2.5rem' }}>
        {navPages.map((nav: any) => {
          const isActive = currentSlug === nav.slug?.replace(/^\/+/, '');
          return (
            <Link 
              key={nav.slug} 
              to={`/preview/${subdomain}/${nav.slug?.replace(/^\/+/, '')}`} 
              style={{ 
                textDecoration: 'none', 
                color: isActive ? 'var(--primary-color)' : '#FFFFFF88', 
                fontSize: '0.85rem', 
                fontWeight: isActive ? 800 : 500,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
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

function CorporateFooter({ settings, siteName, footerCfg }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <footer style={{ background: 'var(--secondary-color)', color: '#FFFFFF', padding: '8rem 4rem 4rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
            {settings?.logo_url && <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '48px', width: 'auto' }} />}
            <span style={{ fontWeight: 900, fontSize: '2rem', color: 'var(--primary-color)', letterSpacing: '-0.04em' }}>{siteName}</span>
          </div>
          <p style={{ opacity: 0.5, lineHeight: 1.8, fontSize: '1rem', marginBottom: '3rem', maxWidth: '400px' }}>{footerCfg.short_description || footerCfg.footer_description}</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
             {(footerCfg.social_links || []).map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#FFFFFF10', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', transition: 'all 0.3s' }} onMouseOver={e => { e.currentTarget.style.background = 'var(--primary-color)'; e.currentTarget.style.color = 'var(--secondary-color)'; }} onMouseOut={e => { e.currentTarget.style.background = '#FFFFFF10'; e.currentTarget.style.color = '#FFFFFF'; }}>
                   <SocialIcon type={social.icon} size={22} />
                </a>
             ))}
          </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary-color)', marginBottom: '2.5rem' }}>Navigation</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((ln: any, i: number) => (
                 <a key={i} href={ln.url} style={{ textDecoration: 'none', color: '#FFFFFFCC', fontSize: '0.95rem' }}>{ln.label}</a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary-color)', marginBottom: '2.5rem' }}>Legal</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', opacity: 0.7 }}>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Cookie Policy</span>
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary-color)', marginBottom: '2.5rem' }}>Connect Directly</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.95rem' }}>
              {contact.phone && <div style={{ display: 'flex', gap: '1rem' }}><Phone size={18} color="var(--primary-color)" /> <b>{contact.phone}</b></div>}
              {contact.whatsapp && <div style={{ display: 'flex', gap: '1rem' }}><MessageCircle size={18} color="var(--primary-color)" /> <b>{contact.whatsapp}</b></div>}
              {contact.email && <div style={{ display: 'flex', gap: '1rem' }}><Mail size={18} color="var(--primary-color)" /> <b>{contact.email}</b></div>}
              {contact.service_hours && <div style={{ display: 'flex', gap: '1rem' }}><Clock size={18} color="var(--primary-color)" /> <span style={{ opacity: 0.6 }}>{contact.service_hours}</span></div>}
              
              {footerCfg.location_embed_link && (
                <div style={{ width: '100%', height: '140px', borderRadius: '1.5rem', overflow: 'hidden', marginTop: '1rem', filter: 'grayscale(100%) brightness(0.8)' }}>
                   <iframe src={footerCfg.location_embed_link.includes('<iframe') ? footerCfg.location_embed_link.match(/src="([^"]+)"/)?.[1] : footerCfg.location_embed_link} width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>
                </div>
              )}
           </div>
        </div>
      </div>
      <div style={{ maxWidth: '1400px', margin: '6rem auto 0', paddingTop: '3rem', borderTop: '1px solid #FFFFFF15', fontSize: '0.9rem', opacity: 0.3, textAlign: 'center' }}>
         © {new Date().getFullYear()} {siteName}. Globally Optimized Infrastructure.
      </div>
    </footer>
  );
}
