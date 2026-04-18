// src/templates/RestoTemplate.tsx
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
  Utensils, 
  UtensilsCrossed, 
  Clock, 
  MapPin, 
  Coffee, 
  Star, 
  ChevronRight, 
  PhoneCall, 
  Calendar,
  Waves,
  Grape,
  Wind
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

export default function RestoTemplate({ 
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
  const siteName = settings?.site_name || 'Epicurean Resto';
  const content = pageData?.content || {};
  const pageType = pageData?.page_type || 'home';
  const p = palette || { 
    primary: themeColor || '#F59E0B', 
    secondary: '#78350F', 
    surface: '#FFFAED', 
    text: '#451A03', 
    name: 'Restaurant' 
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
        <RestoNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} p={p} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} palette={p} currentSlug={currentSlug} />
        </main>
        <RestoFooter settings={settings} siteName={siteName} footerCfg={footerCfg} p={p} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
             <section style={{ height: '85vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                {content.hero_image && <img src={fixImg(content.hero_image)} alt="Ambiance" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
                <div style={{ position: 'relative', zIndex: 1, padding: '0 4vw', maxWidth: '1000px' }}>
                   <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', color: '#FFF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6em', fontSize: '0.75rem', marginBottom: '4rem' }}>
                      <Star size={18} fill="currentColor" /> Michelin Standard Experience
                   </div>
                   {content.headline && (
                     <h1 style={{ fontSize: 'clamp(3.5rem, 9vw, 8.5rem)', color: '#FFF', fontWeight: 300, italic: true, lineHeight: 1.1, marginBottom: '3.5rem', fontStyle: 'italic' }}>
                        {content.headline}
                     </h1>
                   )}
                   {content.sub_headline && (
                     <p style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', marginBottom: '5rem', fontWeight: 400 }}>
                        {content.sub_headline}
                     </p>
                   )}
                   <Link to={`/preview/${subdomain}/contact`} style={{ display: 'inline-block', padding: '1.2rem 4rem', background: 'var(--primary)', color: '#FFF', textTransform: 'uppercase', fontWeight: 900, textDecoration: 'none', letterSpacing: '0.2em', borderRadius: '100px', fontSize: '0.8rem', boxShadow: '0 30px 60px rgba(0,0,0,0.3)' }}>
                      RESERVE TABLE
                   </Link>
                </div>
             </section>
             <div style={{ padding: '6rem 4vw', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem', background: 'var(--bg-color)', borderBottom: '1px solid var(--secondary)11' }}>
                {[
                  { i: UtensilsCrossed, t: 'Finest Dining' },
                  { i: Grape, t: 'Wine Selection' },
                  { i: Coffee, t: 'Artisan Brews' },
                  { i: Wind, t: 'Open Air' }
                ].map((item, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '3rem', border: '1px solid var(--secondary)11', borderRadius: '4rem' }}>
                     <item.i size={32} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                     <h4 style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.2rem' }}>{item.t}</h4>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'profile':
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '10rem', alignItems: 'center' }}>
                <div style={{ padding: '6rem', borderRadius: '8rem', background: 'var(--secondary)', color: 'var(--bg-color)', position: 'relative' }}>
                   <div style={{ fontSize: '10rem', position: 'absolute', top: -40, left: -20, opacity: 0.1, fontStyle: 'italic' }}>Art</div>
                   <h2 style={{ fontSize: '5rem', fontWeight: 300, fontStyle: 'italic', lineHeight: 1, position: 'relative', zIndex: 1 }}>Culinary<br />Legacy.</h2>
                </div>
                <div 
                  style={{ fontSize: '1.4rem', lineHeight: 2, opacity: 0.7, fontStyle: 'italic', whiteSpace: 'pre-wrap', color: 'var(--text-main)', fontFamily: "'Inter', sans-serif" }}
                  dangerouslySetInnerHTML={{ __html: content.about_us || '' }}
                />
             </div>
          </div>
        );

      case 'gallery':
        const galleryImages = Array.isArray(content.images) ? content.images : [];
        return (
          <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '10rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ textAlign: 'center', marginBottom: '10rem' }}>
                {content.gallery_title && <h1 style={{ fontSize: '6rem', fontWeight: 300, fontStyle: 'italic', color: 'var(--secondary)' }}>{content.gallery_title}</h1>}
                {content.description && <p style={{ fontSize: '1.3rem', opacity: 0.4, marginTop: '2rem', maxWidth: '700px', margin: '2rem auto 0', fontStyle: 'italic' }}>{content.description}</p>}
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', gap: '4rem' }}>
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} style={{ borderRadius: '6rem', overflow: 'hidden', height: '650px', border: '15px solid #FFF', boxShadow: '0 30px 60px rgba(120,53,15,0.05)' }} className="group">
                     <img src={fixImg(img)} alt={`Menu Item ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.8s' }} className="group-hover:scale-110" />
                  </div>
                ))}
             </div>
          </div>
        );

      case 'news':
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '8rem', marginBottom: '12rem', background: '#FFF', borderRadius: '6rem', overflow: 'hidden', border: '1px solid var(--secondary)11' }}>
                <div style={{ padding: '8rem' }}>
                   <div style={{ display: 'inline-flex', padding: '0.4rem 1.5rem', background: 'var(--primary)', color: '#FFF', fontWeight: 900, fontSize: '0.75rem', borderRadius: '100px', marginBottom: '3rem', textTransform: 'uppercase', letterSpacing: '0.2rem' }}>CHEF'S SIGNATURE</div>
                   <h1 style={{ fontSize: '5rem', fontWeight: 300, fontStyle: 'italic', lineHeight: 1, marginBottom: '3rem' }}>{pageData.title}</h1>
                   <div style={{ fontSize: '1.4rem', opacity: 0.6, lineHeight: 1.8, fontStyle: 'italic', fontFamily: "'Inter', sans-serif" }} dangerouslySetInnerHTML={{ __html: content.summary || '' }} />
                </div>
                <img src={fixImg(content.featured_image)} alt="Featured dish" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>

             <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', marginBottom: '8rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 300, fontStyle: 'italic' }}>Warta Rasa</h2>
                <div style={{ height: '1px', flex: 1, background: 'var(--secondary)22' }} />
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '6rem' }}>
                {posts.map((post) => (
                  <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <article style={{ textAlign: 'center' }} className="group">
                        <div style={{ height: '550px', borderRadius: '5.5rem', overflow: 'hidden', marginBottom: '3.5rem', transition: 'all 0.4s' }} className="group-hover:rounded-[2rem]">
                           <img src={fixImg(post.content?.featured_image)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.8s' }} className="group-hover:scale-110" />
                        </div>
                        <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2rem', marginBottom: '1.5rem', display: 'block' }}>{post.category}</span>
                        <h3 style={{ fontSize: '2.2rem', fontWeight: 300, fontStyle: 'italic', marginBottom: '2rem', lineHeight: 1.1 }}>{post.title}</h3>
                        <p style={{ opacity: 0.4, fontSize: '1rem', lineHeight: 1.6, marginBottom: '3rem', fontStyle: 'italic', fontFamily: "'Inter', sans-serif" }}>{post.excerpt || post.content?.summary}</p>
                        <div style={{ color: 'var(--secondary)', fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                           EXPLORE DISH
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
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15rem', alignItems: 'center' }}>
                <div>
                   <h1 style={{ fontSize: '6rem', fontWeight: 300, fontStyle: 'italic', color: 'var(--secondary)', lineHeight: 0.9, marginBottom: '8rem' }}>Reserve your<br />experience.</h1>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
                      {content.email && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, opacity: 0.3, textTransform: 'uppercase', letterSpacing: '0.3rem', marginBottom: '2rem' }}>Priority Email</span>
                           <b style={{ fontSize: '2.2rem', fontStyle: 'italic', color: 'var(--text-main)' }}>{content.email}</b>
                        </div>
                      )}
                      {content.phone && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, opacity: 0.3, textTransform: 'uppercase', letterSpacing: '0.3rem', marginBottom: '2rem' }}>Direct Line</span>
                           <b style={{ fontSize: '2.5rem', color: 'var(--text-main)', fontWeight: 200 }}>{content.phone}</b>
                        </div>
                      )}
                   </div>
                </div>
                <div>
                   {mapsUrl && (
                     <div style={{ width: '100%', height: '800px', borderRadius: '8rem', overflow: 'hidden', border: '2px solid var(--secondary)11', boxShadow: '0 50px 100px rgba(120,53,15,0.05)' }}>
                        <iframe src={mapsUrl} width="100%" height="100%" style={{ border: 0, filter: 'sepia(0.2) contrast(1.1)' }} allowFullScreen loading="lazy"></iframe>
                     </div>
                   )}
                </div>
             </div>
          </div>
        );

      default:
        return (
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '12rem 4vw' }}>
             <div style={{ fontSize: '1.4rem', lineHeight: 2, opacity: 0.6, fontStyle: 'italic' }} dangerouslySetInnerHTML={{ __html: content.body || '' }} />
          </div>
        );
    }
  };

  return (
    <div style={{ ...vars, background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Playfair Display', serif" }}>
      <RestoNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} p={p} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <RestoFooter settings={settings} siteName={siteName} footerCfg={footerCfg} p={p} />
    </div>
  );
}

function RestoNavbar({ settings, siteName, navPages, currentSlug, p, subdomain }: any) {
  return (
    <nav style={{ height: '120px', padding: '0 6vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,250,237,0.85)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--secondary)11' }}>
      <Link to={`/preview/${subdomain}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {settings?.logo_url ? (
          <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '60px', width: 'auto' }} />
        ) : (
          <>
             <span style={{ fontWeight: 300, fontSize: '2.2rem', color: 'var(--text-main)', letterSpacing: '0.3em', textTransform: 'uppercase', fontStyle: 'italic' }}>{siteName}</span>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', marginTop: '0.5rem' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--primary)' }} />
                <UtensilsCrossed size={12} color="var(--primary)" />
                <div style={{ flex: 1, height: '1px', background: 'var(--primary)' }} />
             </div>
          </>
        )}
      </Link>
      <div style={{ display: 'flex', gap: '4vw', alignItems: 'center' }}>
        {navPages.map((nav: any) => {
          const isActive = currentSlug === nav.slug?.replace(/^\/+/, '');
          return (
            <Link 
              key={nav.slug} 
              to={`/preview/${subdomain}/${nav.slug?.replace(/^\/+/, '')}`} 
              style={{ 
                textDecoration: 'none', 
                color: isActive ? 'var(--primary)' : 'inherit', 
                fontSize: '0.8rem', 
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                opacity: isActive ? 1 : 0.3,
                transition: 'all 0.3s'
              }}>
              {nav.title}
            </Link>
          );
        })}
        <Link to={`/preview/${subdomain}/contact`} style={{ padding: '0.8rem 2.8rem', background: 'var(--secondary)', color: 'var(--bg-color)', borderRadius: '100px', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', textDecoration: 'none', letterSpacing: '0.2em', boxShadow: '0 15px 30px var(--secondary)33' }}>
           RESERVE
        </Link>
      </div>
    </nav>
  );
}

function RestoFooter({ settings, siteName, footerCfg, p }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <footer style={{ background: '#FFF', borderTop: '4px solid var(--primary)', padding: '15rem 4vw 6rem' }}>
      <div style={{ maxWidth: '1800px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr', gap: '10rem' }}>
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '4rem' }}>
            <span style={{ fontWeight: 300, fontSize: '2.2rem', color: 'var(--text-main)', letterSpacing: '0.3em', textTransform: 'uppercase', fontStyle: 'italic' }}>{siteName}</span>
            <div style={{ width: '100px', height: '1px', background: 'var(--primary)', marginTop: '0.5rem' }} />
          </div>
          <p style={{ opacity: 0.4, lineHeight: 2, fontSize: '1rem', marginBottom: '5rem', maxWidth: '450px', fontStyle: 'italic', color: 'var(--text-main)' }}>{footerCfg.short_description || footerCfg.footer_description}</p>
          <div style={{ display: 'flex', gap: '2.5rem' }}>
             {(footerCfg.social_links || []).map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ color: 'var(--secondary)', opacity: 0.2, transition: 'all 0.4s' }} onMouseOver={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-10px)'; }} onMouseOut={e => { e.currentTarget.style.opacity = '0.2'; e.currentTarget.style.color = 'var(--secondary)'; e.currentTarget.style.transform = 'none'; }}>
                   <SocialIcon type={social.icon} size={28} />
                </a>
             ))}
          </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em', marginBottom: '4rem', opacity: 0.2 }}>Experience</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((ln: any, i: number) => (
                 <a key={i} href={ln.url} style={{ textDecoration: 'none', color: 'inherit', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.4 }}>{ln.label}</a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em', marginBottom: '4rem', opacity: 0.2 }}>Journal</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', opacity: 0.1, fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
              <span>Epicurean_Rights</span>
              <span>Reserve_Protocol</span>
              <span>Regional_Node</span>
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em', marginBottom: '4rem', opacity: 0.2 }}>Dining Hub</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', fontSize: '1.2rem', fontStyle: 'italic' }}>
              {contact.phone && <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}><Phone size={22} color="var(--primary)" /> <b>{contact.phone}</b></div>}
              {contact.whatsapp && <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}><MessageCircle size={22} color="var(--primary)" /> <b>CHANNEL</b></div>}
              {contact.email && <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}><Mail size={22} style={{ opacity: 0.2 }} /> <b style={{ fontSize: '0.95rem', opacity: 0.5 }}>{contact.email}</b></div>}
              
              {footerCfg.location_embed_link && (
                <div style={{ width: '100%', height: '240px', borderRadius: '4rem', overflow: 'hidden', marginTop: '2rem', border: '1px solid var(--secondary)11', filter: 'sepia(0.3) saturate(1.2)' }}>
                   <iframe src={footerCfg.location_embed_link.includes('<iframe') ? footerCfg.location_embed_link.match(/src="([^"]+)"/)?.[1] : footerCfg.location_embed_link} width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>
                </div>
              )}
           </div>
        </div>
      </div>
      <div style={{ maxWidth: '1800px', margin: '12rem auto 0', paddingTop: '4rem', borderTop: '1px solid var(--secondary)11', fontSize: '0.85rem', opacity: 0.1, textAlign: 'center', fontWeight: 900, letterSpacing: '1.2em', textTransform: 'uppercase' }}>
         © {new Date().getFullYear()} {siteName.toUpperCase()} - EPICUREAN_SOVEREIGN_RESERVE.
      </div>
    </footer>
  );
}
