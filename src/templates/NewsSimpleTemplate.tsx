// src/templates/NewsSimpleTemplate.tsx
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
  Calendar, 
  Tag, 
  ChevronRight, 
  Share2, 
  Printer,
  Newspaper,
  TrendingUp,
  ExternalLink,
  MapPin,
  Clock
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

export default function NewsSimpleTemplate({ 
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
  const siteName = settings?.site_name || 'News Portal';
  const content = pageData?.content || {};
  const pageType = pageData?.page_type || 'home';
  const p = palette || { 
    primary: themeColor || '#DC2626', 
    secondary: '#18181B', 
    surface: '#FFFFFF', 
    text: '#27272A', 
    name: 'News' 
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
        <NewsTicker siteName={siteName} />
        <NewsNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} p={p} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} palette={p} currentSlug={currentSlug} />
        </main>
        <NewsFooter settings={settings} siteName={siteName} footerCfg={footerCfg} p={p} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
             <section style={{ padding: '6rem 4vw', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '6rem', alignItems: 'start', borderBottom: '1px solid #EEE' }}>
                <div>
                   <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2rem', fontSize: '0.8rem', marginBottom: '2.5rem' }}>
                      <TrendingUp size={18} /> TERKINI DAN TERPERCAYA
                   </div>
                   {content.headline && (
                     <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', fontWeight: 900, fontFamily: "'Playfair Display', serif", lineHeight: 1.1, marginBottom: '3rem', color: '#000' }}>
                        {content.headline}
                     </h1>
                   )}
                   {content.sub_headline && (
                     <p style={{ fontSize: '1.25rem', opacity: 0.6, lineHeight: 1.6, maxWidth: '800px', marginBottom: '4rem' }}>
                        {content.sub_headline}
                     </p>
                   )}
                   <Link to={`/preview/${subdomain}/news`} style={{ borderBottom: '4px solid var(--primary)', paddingBottom: '8px', textDecoration: 'none', color: '#000', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.85rem' }}>
                      LIHAT SEMUA BERITA <ArrowRight size={20} style={{ marginLeft: '1rem' }} />
                   </Link>
                </div>
                {content.hero_image && (
                  <div style={{ position: 'relative' }}>
                     <img src={fixImg(content.hero_image)} alt="Hero" style={{ width: '100%', height: '700px', objectFit: 'cover' }} />
                     <div style={{ position: 'absolute', bottom: 0, left: 0, background: '#000', color: '#FFF', padding: '1rem 2rem', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase' }}>HEADLINE EDITION</div>
                  </div>
                )}
             </section>
             <div style={{ padding: '4rem 4vw', background: '#F9FAFB', borderBottom: '1px solid #EEE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 900, fontSize: '0.75rem', opacity: 0.4, textTransform: 'uppercase' }}>FOKUS HARI INI:</span>
                <div style={{ display: 'flex', gap: '4rem' }}>
                   {['POLITIK', 'EKONOMI', 'TEKNOLOGI', 'HIBURAN', 'OLAHRAGA'].map((cat, i) => (
                     <span key={i} style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', color: 'rgba(0,0,0,0.5)' }}>{cat}</span>
                   ))}
                </div>
             </div>
          </div>
        );

      case 'profile':
        return (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '10rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
                <h2 style={{ fontSize: '4rem', fontWeight: 900, fontFamily: "'Playfair Display', serif", textTransform: 'uppercase', marginBottom: '2rem' }}>Dibalik Redaksi.</h2>
                <div style={{ width: '80px', height: '4px', background: 'var(--primary)', margin: '0 auto' }} />
             </div>
             <div 
               style={{ fontSize: '1.25rem', lineHeight: 2, opacity: 0.8, color: '#333', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}
               dangerouslySetInnerHTML={{ __html: content.about_us || '' }}
             />
          </div>
        );

      case 'gallery':
        const galleryImages = Array.isArray(content.images) ? content.images : [];
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ borderBottom: '4px solid #000', paddingBottom: '3rem', marginBottom: '6rem' }}>
                {content.gallery_title && <h1 style={{ fontSize: '5rem', fontWeight: 900, fontFamily: "'Playfair Display', serif" }}>{content.gallery_title}</h1>}
                {content.description && <p style={{ fontSize: '1.2rem', opacity: 0.5, marginTop: '2rem' }}>{content.description}</p>}
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} style={{ height: '500px', overflow: 'hidden', position: 'relative' }}>
                     <img src={fixImg(img)} alt={`Journal ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                     <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', width: '3rem', height: '1px', background: '#FFF' }} />
                  </div>
                ))}
             </div>
          </div>
        );

      case 'news':
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '6rem', marginBottom: '10rem' }}>
                <div style={{ padding: '0 4rem 4rem 0', borderRight: '1px solid #EEE' }}>
                   <div style={{ display: 'inline-flex', padding: '0.4rem 1rem', background: 'var(--primary)', color: '#FFF', fontWeight: 900, fontSize: '0.75rem', marginBottom: '3rem' }}>SOROTAN UTAMA</div>
                   <h1 style={{ fontSize: '4.5rem', fontWeight: 900, fontFamily: "'Playfair Display', serif", lineHeight: 1.1, marginBottom: '2.5rem' }}>{pageData.title}</h1>
                   <div style={{ fontSize: '1.3rem', opacity: 0.6, lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: content.summary || '' }} />
                </div>
                <img src={fixImg(content.featured_image)} alt="Featured" style={{ width: '100%', height: '600px', objectFit: 'cover' }} />
             </div>

             <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '6rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>INDEKS BERITA</h2>
                <div style={{ height: '2px', flex: 1, background: '#000' }} />
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '5rem' }}>
                {posts.map((post) => (
                  <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <article style={{ borderBottom: '1px solid #EEE', paddingBottom: '3rem' }} className="group">
                        <div style={{ height: '300px', overflow: 'hidden', marginBottom: '2.5rem' }}>
                           <img src={fixImg(post.content?.featured_image)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'grayscale 0.5s' }} className="group-hover:grayscale" />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.75rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '1.5rem' }}>
                           <Tag size={12} /> {post.category?.toUpperCase() || 'UMUM'}
                        </div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: "'Playfair Display', serif", marginBottom: '1.5rem', lineHeight: 1.2 }}>{post.title}</h3>
                        <p style={{ opacity: 0.5, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>{post.excerpt || post.content?.summary}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 900, fontSize: '0.8rem', color: '#000' }}>
                           BACA SELENGKAPNYA <ChevronRight size={18} className="group-hover:translate-x-4 transition-transform" />
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
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '10rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10rem', alignItems: 'center' }}>
                <div>
                   <h1 style={{ fontSize: '5rem', fontWeight: 900, fontFamily: "'Playfair Display', serif", lineHeight: 1, marginBottom: '6rem' }}>Kantor Redaksi.</h1>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
                      {content.email && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.4, letterSpacing: '0.2em', marginBottom: '1.5rem' }}>Email Redaksi</span>
                           <b style={{ fontSize: '2rem', borderBottom: '4px solid var(--primary)' }}>{content.email}</b>
                        </div>
                      )}
                      {content.phone && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.4, letterSpacing: '0.2em', marginBottom: '1.5rem' }}>Hotline Berita</span>
                           <b style={{ fontSize: '2.5rem' }}>{content.phone}</b>
                        </div>
                      )}
                   </div>
                </div>
                <div>
                   {mapsUrl && (
                     <div style={{ width: '100%', height: '700px', border: '20px solid #F9FAFB' }}>
                        <iframe src={mapsUrl} width="100%" height="100%" style={{ border: 0, filter: 'grayscale(1)' }} allowFullScreen loading="lazy"></iframe>
                     </div>
                   )}
                </div>
             </div>
          </div>
        );

      default:
        return (
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '10rem 4vw' }}>
             <div style={{ fontSize: '1.2rem', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: content.body || '' }} />
          </div>
        );
    }
  };

  return (
    <div style={{ ...vars, background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
      <NewsTicker siteName={siteName} />
      <NewsNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} p={p} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <NewsFooter settings={settings} siteName={siteName} footerCfg={footerCfg} p={p} />
    </div>
  );
}

function NewsTicker({ siteName }: any) {
  return (
    <div style={{ background: '#000', color: '#FFF', padding: '0.6rem 4vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
       <div>EDISI: {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}</div>
       <div style={{ display: 'flex', gap: '3rem', opacity: 0.5 }}>
          <span>{siteName} Digital Edition</span>
          <span>Antigravity_Node_V.26</span>
       </div>
    </div>
  );
}

function NewsNavbar({ settings, siteName, navPages, currentSlug, p, subdomain }: any) {
  return (
    <nav style={{ height: '110px', padding: '0 4vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.95)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)', borderBottom: '4px solid #000' }}>
      <Link to={`/preview/${subdomain}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {settings?.logo_url ? (
          <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '56px', width: 'auto' }} />
        ) : (
          <span style={{ fontWeight: 900, fontSize: '2.5rem', textTransform: 'uppercase', fontFamily: "'Playfair Display', serif", borderBottom: '6px solid var(--primary)', lineHeight: 1 }}>{siteName}</span>
        )}
      </Link>
      <div style={{ display: 'flex', gap: '2.5vw' }}>
        {navPages.map((nav: any) => {
          const isActive = currentSlug === nav.slug?.replace(/^\/+/, '');
          return (
            <Link 
              key={nav.slug} 
              to={`/preview/${subdomain}/${nav.slug?.replace(/^\/+/, '')}`} 
              style={{ 
                textDecoration: 'none', 
                color: isActive ? 'var(--primary)' : 'inherit', 
                fontSize: '0.85rem', 
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
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

function NewsFooter({ settings, siteName, footerCfg, p }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <footer style={{ background: '#000', color: '#FFF', padding: '12rem 4vw 4vw' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr', gap: '8rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3.5rem' }}>
            <span style={{ fontWeight: 900, fontSize: '2.2rem', textTransform: 'uppercase', fontFamily: "'Playfair Display', serif", borderBottom: '4px solid #FFF' }}>{siteName}</span>
          </div>
          <p style={{ opacity: 0.4, lineHeight: 1.8, fontSize: '1rem', marginBottom: '4rem', maxWidth: '400px' }}>{footerCfg.short_description || footerCfg.footer_description}</p>
          <div style={{ display: 'flex', gap: '2.5rem' }}>
             {(footerCfg.social_links || []).map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ color: '#FFF', opacity: 0.3, transition: 'all 0.4s' }} onMouseOver={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'var(--primary)'; }} onMouseOut={e => { e.currentTarget.style.opacity = '0.3'; e.currentTarget.style.color = '#FFF'; }}>
                   <SocialIcon type={social.icon} size={24} />
                </a>
             ))}
          </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '3.5rem', opacity: 0.3 }}>Kanal Berita</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((ln: any, i: number) => (
                 <a key={i} href={ln.url} style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5 }}>{ln.label}</a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '3.5rem', opacity: 0.3 }}>Layanan</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', opacity: 0.2, fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <span>Redaksi_Syarat</span>
              <span>Privasi_Node</span>
              <span>Hak_Cipta_V.26</span>
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '3.5rem', opacity: 0.3 }}>Markas Redaksi</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', fontSize: '1rem' }}>
              {contact.phone && <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}><Phone size={18} color="var(--primary)" /> <b>{contact.phone}</b></div>}
              {contact.whatsapp && <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}><MessageCircle size={18} color="#22C55E" /> <b>{contact.whatsapp}</b></div>}
              {contact.email && <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}><Mail size={18} style={{ opacity: 0.3 }} /> <b style={{ fontSize: '0.85rem' }}>{contact.email}</b></div>}
              
              {footerCfg.location_embed_link && (
                <div style={{ width: '100%', height: '180px', border: '5px solid #111', marginTop: '1.5rem', filter: 'grayscale(1) invert(1)' }}>
                   <iframe src={footerCfg.location_embed_link.includes('<iframe') ? footerCfg.location_embed_link.match(/src="([^"]+)"/)?.[1] : footerCfg.location_embed_link} width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>
                </div>
              )}
           </div>
        </div>
      </div>
      <div style={{ maxWidth: '1600px', margin: '8rem auto 0', paddingTop: '4rem', borderTop: '1px solid #111', fontSize: '0.8rem', opacity: 0.1, textAlign: 'center', fontWeight: 900, letterSpacing: '0.8em', textTransform: 'uppercase' }}>
         © {new Date().getFullYear()} {siteName.toUpperCase()} - MENGEDUKASI & MENGINSPIRASI.
      </div>
    </footer>
  );
}
