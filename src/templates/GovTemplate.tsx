// src/templates/GovTemplate.tsx
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
  ShieldCheck, 
  MapPin, 
  Building2, 
  Bell, 
  Users, 
  Search,
  Flag,
  FileText,
  Info,
  ChevronRight
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

export default function GovTemplate({ 
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
  const siteName = settings?.site_name || 'Portal Instansi';
  const content = pageData?.content || {};
  const pageType = pageData?.page_type || 'home';
    const footerCfg = settings?.global_options?.footer_config || {};

  
  if (postData) {
    return (
      <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
        <GovHeader settings={settings} siteName={siteName} footerCfg={footerCfg} />
        <GovNavbar navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} currentSlug={currentSlug} />
        </main>
        <GovFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
             <section style={{ height: '600px', position: 'relative', overflow: 'hidden' }}>
                {content.hero_image && <img src={fixImg(content.hero_image)} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #000000AA, transparent)', display: 'flex', alignItems: 'center', padding: '0 8vw' }}>
                   <div style={{ maxWidth: '800px', color: '#FFF' }}>
                      {content.headline && <h1 style={{ fontSize: '4rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1, marginBottom: '2rem' }}>{content.headline}</h1>}
                      {content.sub_headline && <p style={{ fontSize: '1.25rem', opacity: 0.8, lineHeight: 1.6 }}>{content.sub_headline}</p>}
                   </div>
                </div>
             </section>
             <div style={{ background: '#FFF', padding: '4rem 8vw', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', borderBottom: '1px solid #EEE' }}>
                {[
                  { i: ShieldCheck, t: 'Aman & Terpercaya' },
                  { i: Users, t: 'Layanan Terpadu' },
                  { i: FileText, t: 'Transparansi Data' },
                  { i: Info, t: 'Pusat Informasi' }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--primary-color)' }}>
                     <item.i size={32} />
                     <span style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.85rem' }}>{item.t}</span>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'profile':
        return (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8rem', alignItems: 'start' }}>
                <div style={{ borderLeft: '10px solid var(--secondary-color)', paddingLeft: '3rem' }}>
                   <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary-color)' }}>PROFIL LENGKAP INSTANSI.</h2>
                </div>
                <div 
                  style={{ fontSize: '1.15rem', lineHeight: 2, opacity: 0.8 }}
                  className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.about_us || '' }}
                />
             </div>
          </div>
        );

      case 'gallery':
        const galleryImages = Array.isArray(content.images) ? content.images : [];
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ borderBottom: '8px solid var(--primary-color)', paddingBottom: '3rem', marginBottom: '6rem' }}>
                {content.gallery_title && <h1 style={{ fontSize: '4rem', fontWeight: 900 }}>{content.gallery_title}</h1>}
                {content.description && <div className="rich-text-content" style={{ fontSize: '1.25rem', opacity: 0.5, marginTop: '1.5rem' }} dangerouslySetInnerHTML={{ __html: content.description }} />}
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} style={{ aspectRatio: '16/9', border: '5px solid #EEE', overflow: 'hidden' }}>
                     <img src={fixImg(img)} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
             </div>
          </div>
        );

      case 'news':
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '6rem', marginBottom: '10rem', background: '#FFF', border: '1px solid #EEE' }}>
                <div style={{ padding: '6rem' }}>
                   <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', color: 'var(--secondary-color)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '2.5rem' }}>
                      <Bell size={20} className="animate-bounce" /> BERITA UTAMA
                   </div>
                   <h1 style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '2.5rem' }}>{pageData.title}</h1>
                   <div style={{ fontSize: '1.2rem', opacity: 0.6, lineHeight: 1.8 }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.summary || '' }} />
                </div>
                <img src={fixImg(content.featured_image)} alt="Featured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>

             <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: '6rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase' }}>Kumpulan Warta Resmi</h2>
                <div style={{ height: '4px', flex: 1, background: 'var(--primary-color)' }} />
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '4rem' }}>
                {posts.map((post) => (
                  <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <article style={{ background: '#FFF', border: '1px solid #EEE' }} className="group">
                        <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                           <img src={fixImg(post.content?.featured_image)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                           <div style={{ position: 'absolute', bottom: 0, left: 0, background: 'var(--secondary-color)', color: '#FFF', padding: '8px 20px', fontWeight: 900, fontSize: '0.75rem' }}>{post.category}</div>
                        </div>
                        <div style={{ padding: '2.5rem' }}>
                           <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-color)', marginBottom: '1.5rem' }}>{post.title}</h3>
                           <div className="rich-text-content" style={{ fontSize: '0.95rem', opacity: 0.5, lineHeight: 1.6, marginBottom: '2.5rem' }} dangerouslySetInnerHTML={{ __html: post.excerpt || post.content?.summary || '' }} />
                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 900, fontSize: '0.8rem', color: 'var(--secondary-color)' }}>
                              BACA SELENGKAPNYA <ChevronRight size={18} />
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
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '10rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10rem', alignItems: 'center' }}>
                <div>
                   <h1 style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--primary-color)', lineHeight: 1, marginBottom: '5rem' }}>Layanan Hubung Daring.</h1>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
                      {content.email && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.4, letterSpacing: '0.2em', marginBottom: '1rem' }}>Surat Elektronik</span>
                           <b style={{ fontSize: '2rem' }}>{content.email}</b>
                        </div>
                      )}
                      {content.phone && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.4, letterSpacing: '0.2em', marginBottom: '1rem' }}>Layanan Panggilan</span>
                           <b style={{ fontSize: '2.5rem', color: 'var(--secondary-color)' }}>{content.phone}</b>
                        </div>
                      )}
                   </div>
                </div>
                <div>
                   {mapUrl && (
                     <div style={{ width: '100%', height: '700px', border: '15px solid #EEE' }}>
                        <iframe src={mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
                     </div>
                   )}
                </div>
             </div>
          </div>
        );

      default:
        return (
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '10rem 4vw' }}>
             <div style={{ fontSize: '1.2rem', lineHeight: 1.8 }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.body || '' }} />
          </div>
        );
    }
  };

  return (
    <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
      <GovHeader settings={settings} siteName={siteName} footerCfg={footerCfg} />
      <GovNavbar navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <GovFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
    </div>
  );
}

function GovHeader({ settings, siteName, footerCfg }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <header style={{ background: '#FFF', borderBottom: '1px solid #EEE' }}>
      <div style={{ background: '#1E3A8A', color: '#FFF', padding: '0.5rem 4vw', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', display: 'flex', items: 'center', justifyContent: 'space-between', letterSpacing: '0.2em' }}>
         <div style={{ display: 'flex', items: 'center', gap: '1rem' }}><ShieldCheck size={14} color="#FBBF24" /> Situs Resmi Instansi Pemerintah Republik Indonesia</div>
         <div style={{ display: 'flex', gap: '2rem', opacity: 0.6 }}><span>Aksesibilitas</span> <span>Peta Situs</span></div>
      </div>
      <div style={{ padding: '2rem 4vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {settings?.logo_url ? (
              <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '64px', width: 'auto' }} />
            ) : (
              <div style={{ width: '56px', height: '56px', background: '#1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
                <Building2 color="#FFF" size={36} />
              </div>
            )}
            <div>
               <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1E3A8A', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1 }}>{siteName}</h1>
               <span style={{ fontSize: '0.7rem', fontWeight: 900, opacity: 0.3, textTransform: 'uppercase', letterSpacing: '0.4em' }}>Layanan • Integritas • Transparansi</span>
            </div>
         </div>
         <div style={{ display: 'flex', gap: '4rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
               <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 900, opacity: 0.3, textTransform: 'uppercase' }}>Kontak Pengaduan</span>
               <b style={{ color: '#991B1B', fontSize: '1.2rem' }}>{contact.phone || '112'}</b>
            </div>
            <div style={{ width: '48px', height: '48px', background: '#F8F8F8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#AAA' }}>
               <Search size={20} />
            </div>
         </div>
      </div>
      <div style={{ background: '#991B1B', color: '#FFF', padding: '0.8rem 4vw', display: 'flex', items: 'center', borderY: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
         <div style={{ flexShrink: 0, fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', display: 'flex', items: 'center', gap: '1rem', borderRight: '1px solid rgba(255,255,255,0.2)', paddingRight: '2rem', marginRight: '2rem' }}>
            <Bell size={14} className="animate-bounce" /> Pengumuman :
         </div>
         <marquee style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Selamat Datang di Portal Resmi {siteName}. Akses Layanan Publik Kini Lebih Mudah Melalui Integrasi Satu Pintu V.26. Pantau Informasi Terbaru Terkait Kebijakan Strategis di Menu Warta Resmi.
         </marquee>
      </div>
    </header>
  );
}

function GovNavbar({ navPages, currentSlug, subdomain }: any) {
  return (
    <nav style={{ background: '#FFF', borderBottom: '6px solid #1E3A8A', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', height: '64px', padding: '0 4vw' }}>
        {navPages.map((nav: any) => {
          const isActive = currentSlug === nav.slug?.replace(/^\/+/, '');
          return (
            <Link 
              key={nav.slug} 
              to={`/preview/${subdomain}/${nav.slug?.replace(/^\/+/, '')}`} 
              style={{ 
                textDecoration: 'none', 
                color: isActive ? '#FFF' : '#1E3A8A', 
                padding: '0 3rem',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.8rem', 
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                background: isActive ? '#1E3A8A' : 'transparent',
                borderRight: '1px solid #EEE',
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

function GovFooter({ settings, siteName, footerCfg }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <footer style={{ background: '#0F172A', color: '#FFF', padding: '10rem 4vw 4vw' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr', gap: '8rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
            {settings?.logo_url ? <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '44px', width: 'auto', filter: 'brightness(0) invert(1)' }} /> : <Building2 size={36} color="#FFF" />}
            <span style={{ fontWeight: 900, fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{siteName}</span>
          </div>
          <p style={{ opacity: 0.4, lineHeight: 1.8, fontSize: '0.9rem', marginBottom: '4rem', maxWidth: '400px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em' }}>{footerCfg.short_description || footerCfg.footer_description}</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
             {(footerCfg.social_links || []).map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit', transition: 'all 0.4s' }} onMouseOver={e => { e.currentTarget.style.background = '#991B1B'; }} onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}>
                   <SocialIcon type={social.icon} size={20} />
                </a>
             ))}
          </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '3rem', opacity: 0.3, borderBottom: '1px solid #991B1B', paddingBottom: '1rem', display: 'inline-block' }}>Menu Layanan</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((ln: any, i: number) => (
                 <a key={i} href={ln.url} style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5 }}>{ln.label}</a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '3rem', opacity: 0.3, borderBottom: '1px solid #991B1B', paddingBottom: '1rem', display: 'inline-block' }}>Aksesibilitas</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', opacity: 0.3, fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              <span>Kebijakan Privasi</span>
              <span>Syarat Penggunaan</span>
              <span>Peta Situs Utama</span>
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '3rem', opacity: 0.3, borderBottom: '1px solid #991B1B', paddingBottom: '1rem', display: 'inline-block' }}>Hubungi Instansi</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontSize: '0.95rem' }}>
              {contact.phone && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><Phone size={16} color="#991B1B" /> <b>{contact.phone}</b></div>}
              {contact.whatsapp && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><MessageCircle size={16} color="#22C55E" /> <b>{contact.whatsapp}</b></div>}
              {contact.email && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><Mail size={16} color="#991B1B" /> <b style={{ fontSize: '0.8rem' }}>{contact.email}</b></div>}
              
              {footerCfg.location_embed_link && (
                <div style={{ width: '100%', height: '180px', border: '5px solid rgba(255,255,255,0.05)', marginTop: '1.5rem', filter: 'grayscale(1) brightness(0.7)' }}>
                   <iframe src={footerCfg.location_embed_link.includes('<iframe') ? footerCfg.location_embed_link.match(/src="([^"]+)"/)?.[1] : footerCfg.location_embed_link} width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>
                </div>
              )}
           </div>
        </div>
      </div>
      <div style={{ maxWidth: '1600px', margin: '8rem auto 0', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.7rem', opacity: 0.2, textAlign: 'center', fontWeight: 900, letterSpacing: '0.6em', textTransform: 'uppercase' }}>
         © {new Date().getFullYear()} {siteName.toUpperCase()} - PORTAL RESMI PEMERINTAH. HAK CIPTA DILINDUNGI.
      </div>
    </footer>
  );
}
