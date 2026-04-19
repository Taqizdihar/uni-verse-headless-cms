// src/templates/RealEstateTemplate.tsx
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
  Home, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Search, 
  Key, 
  DollarSign, 
  ChevronRight, 
  Share2, 
  Info, 
  Star, 
  Compass,
  Building2,
  ParkingCircle,
  Trees
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

export default function RealEstateTemplate({ 
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
  const siteName = settings?.site_name || 'Prime Real Estate';
  const content = pageData?.content || {};
  const pageType = pageData?.page_type || 'home';
    const footerCfg = settings?.global_options?.footer_config || {};

  
  if (postData) {
    return (
      <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
        <RealEstateNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} currentSlug={currentSlug} />
        </main>
        <RealEstateFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
             <section style={{ height: '85vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                {content.hero_image && <img src={fixImg(content.hero_image)} alt="Luxury Property" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.9), rgba(15,23,42,0.4))' }} />
                <div style={{ position: 'relative', zIndex: 1, padding: '0 4vw', maxWidth: '1200px' }}>
                   <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', padding: '0.6rem 2rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', color: '#FFF', borderRadius: '100px', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '4rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                      <Compass size={18} /> Elite Residencies Center
                   </div>
                   {content.headline && (
                     <h1 style={{ fontSize: 'clamp(3.5rem, 8vw, 7.5rem)', fontWeight: 900, color: '#FFF', lineHeight: 0.95, letterSpacing: '-0.04em', marginBottom: '3.5rem' }}>
                        {content.headline}
                     </h1>
                   )}
                   {content.sub_headline && (
                     <p style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.7)', maxWidth: '800px', margin: '0 auto 5rem', lineHeight: 1.6 }}>
                        {content.sub_headline}
                     </p>
                   )}
                   <div style={{ background: '#FFF', padding: '1rem', borderRadius: '2rem', display: 'flex', gap: '1rem', maxWidth: '800px', margin: '0 auto', boxShadow: '0 40px 80px rgba(0,0,0,0.3)' }}>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 2rem', borderRight: '1px solid #F1F5F9' }}>
                         <Search size={22} color="var(--primary-color)" />
                         <input type="text" placeholder="Search by Neighborhood..." style={{ border: 'none', outline: 'none', fontWeight: 700, fontSize: '1rem', color: 'var(--text-color)', width: '100%' }} />
                      </div>
                      <Link to={`/preview/${subdomain}/contact`} style={{ background: 'var(--primary-color)', color: '#FFF', padding: '1.2rem 3rem', borderRadius: '1.5rem', fontWeight: 900, textTransform: 'uppercase', textDecoration: 'none', fontSize: '0.85rem' }}>
                         BOOK VIEWING
                      </Link>
                   </div>
                </div>
             </section>
             <div style={{ padding: '6rem 4vw', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem', background: '#FFF' }}>
                {[
                  { i: Building2, t: 'Modern Living', d: 'Architectural Excellence' },
                  { i: Star, t: 'Elite Status', d: 'Luxury Specification' },
                  { i: Trees, t: 'Natural Aura', d: 'Green Environments' },
                  { i: Key, t: 'Full Access', d: 'Sovereign Ownership' }
                ].map((item: any, i) => (
                  <div key={i} style={{ padding: '2.5rem', borderRadius: '2rem', background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                     {item.i && <item.i size={32} color="var(--primary-color)" style={{ marginBottom: '1.5rem' }} />}
                     <h4 style={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{item.t}</h4>
                     <p style={{ fontSize: '0.8rem', opacity: 0.4, fontWeight: 700 }}>{item.d}</p>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'profile':
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '10rem', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                   <div style={{ position: 'absolute', top: '-4rem', left: '-4rem', width: '200px', height: '200px', background: 'var(--primary-color)11', borderRadius: '50%' }} />
                   <h2 style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--text-color)', lineHeight: 0.9, position: 'relative', zIndex: 1 }}>Defining<br />Luxury.</h2>
                </div>
                <div 
                  style={{ fontSize: '1.3rem', lineHeight: 1.8, opacity: 0.7, whiteSpace: 'pre-wrap' }}
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
                {content.gallery_title && <h1 style={{ fontSize: '5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>{content.gallery_title}</h1>}
                {content.description && <p style={{ fontSize: '1.25rem', opacity: 0.3, marginTop: '2.5rem', maxWidth: '700px', margin: '2.5rem auto 0' }}>{content.description}</p>}
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', gap: '4rem' }}>
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} style={{ borderRadius: '2.5rem', overflow: 'hidden', height: '650px', position: 'relative', border: '1px solid #F1F5F9', boxShadow: '0 40px 80px rgba(0,0,0,0.05)' }} className="group">
                     <img src={fixImg(img)} alt={`Listing ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.8s' }} className="group-hover:scale-110" />
                     <div style={{ position: 'absolute', bottom: '3rem', left: '3rem', background: '#FFF', padding: '1rem 2rem', borderRadius: '1rem', fontWeight: 900, fontSize: '0.8rem', opacity: 0, transform: 'translateY(20px)', transition: 'all 0.4s' }} className="group-hover:opacity-100 group-hover:translate-y-0">PRIME_ASSET_L0{i+1}</div>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'news':
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '8rem', marginBottom: '12rem', background: '#F8FAFC', borderRadius: '4rem', overflow: 'hidden', border: '1px solid #F1F5F9' }}>
                <div style={{ padding: '8rem' }}>
                   <div style={{ display: 'inline-flex', padding: '0.5rem 1.5rem', background: 'var(--primary-color)', color: '#FFF', fontWeight: 900, fontSize: '0.75rem', borderRadius: '100px', marginBottom: '3rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>EXCLUSIVE LISTINGS</div>
                   <h1 style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.04em', marginBottom: '3rem' }}>{pageData.title}</h1>
                   <div style={{ fontSize: '1.3rem', opacity: 0.6, lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: content.summary || '' }} />
                </div>
                <img src={fixImg(content.featured_image)} alt="Featured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>

             <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', marginBottom: '8rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase' }}>Available Residences</h2>
                <div style={{ height: '2px', flex: 1, background: '#F1F5F9' }} />
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '5rem' }}>
                {posts.map((post) => (
                  <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <article style={{ background: '#FFF', borderRadius: '3rem', border: '1px solid #F1F5F9', overflow: 'hidden', transition: 'all 0.4s' }} className="group hover:shadow-3xl hover:-translate-y-4">
                        <div style={{ height: '350px', position: 'relative' }}>
                           <img src={fixImg(post.content?.featured_image)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                           <div style={{ position: 'absolute', top: '2rem', right: '2rem', background: '#FFF', padding: '0.6rem 1.5rem', borderRadius: '100px', fontWeight: 900, fontSize: '0.85rem', color: 'var(--primary-color)', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>FOR_SALE</div>
                        </div>
                        <div style={{ padding: '3.5rem' }}>
                           <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.75rem', fontWeight: 900, color: 'var(--primary-color)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                              <MapPin size={14} /> {post.category || 'Prime Location'}
                           </div>
                           <h3 style={{ fontSize: '2rem', fontWeight: 950, marginBottom: '2.5rem', lineHeight: 1.1 }}>{post.title}</h3>
                           <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2rem 0', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', marginBottom: '3rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Bed size={20} color="var(--primary-color)" /> <b>3</b></div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Bath size={20} color="var(--primary-color)" /> <b>2</b></div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Square size={20} color="var(--primary-color)" /> <b>2.5k SF</b></div>
                           </div>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontWeight: 900, fontSize: '0.85rem', color: 'var(--text-color)' }}>
                              VIEW FULL SPECS <ChevronRight size={18} className="group-hover:translate-x-4 transition-transform" />
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
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12rem', alignItems: 'center' }}>
                <div>
                   <h1 style={{ fontSize: '6rem', fontWeight: 900, color: 'var(--text-color)', lineHeight: 0.9, letterSpacing: '-0.04em', marginBottom: '8rem' }}>The Keys to<br />Legacy.</h1>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
                      {content.email && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, opacity: 0.3, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '2rem' }}>Digital Concierge</span>
                           <b style={{ fontSize: '2.2rem', paddingBottom: '1rem', borderBottom: '4px solid var(--primary-color)' }}>{content.email}</b>
                        </div>
                      )}
                      {content.phone && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, opacity: 0.3, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '2rem' }}>Direct Line</span>
                           <b style={{ fontSize: '2.5rem' }}>{content.phone}</b>
                        </div>
                      )}
                   </div>
                </div>
                <div>
                   {mapsUrl && (
                     <div style={{ width: '100%', height: '850px', borderRadius: '4rem', overflow: 'hidden', border: '15px solid #F1F5F9', boxShadow: '0 50px 100px rgba(0,0,0,0.1)' }}>
                        <iframe src={mapsUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
                     </div>
                   )}
                </div>
             </div>
          </div>
        );

      default:
        return (
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '12rem 4vw' }}>
             <div style={{ fontSize: '1.3rem', lineHeight: 2, opacity: 0.6 }} dangerouslySetInnerHTML={{ __html: content.body || '' }} />
          </div>
        );
    }
  };

  return (
    <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
      <RealEstateNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <RealEstateFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
    </div>
  );
}

function RealEstateNavbar({ settings, siteName, navPages, currentSlug, subdomain }: any) {
  return (
    <nav style={{ height: '110px', padding: '0 4vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.85)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)', borderBottom: '1px solid #F1F5F9' }}>
      <Link to={`/preview/${subdomain}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ width: '52px', height: '52px', background: 'var(--primary-color)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px -5px var(--primary-color)55' }}>
           <Home size={28} color="#FFF" />
        </div>
        {settings?.logo_url ? (
          <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '40px', width: 'auto' }} />
        ) : (
          <span style={{ fontWeight: 950, fontSize: '1.8rem', color: 'var(--text-color)', letterSpacing: '-0.04em', textTransform: 'uppercase' }}>{siteName}</span>
        )}
      </Link>
      <div style={{ display: 'flex', gap: '3vw', alignItems: 'center' }}>
        {navPages.map((nav: any) => {
          const isActive = currentSlug === nav.slug?.replace(/^\/+/, '');
          return (
            <Link 
              key={nav.slug} 
              to={`/preview/${subdomain}/${nav.slug?.replace(/^\/+/, '')}`} 
              style={{ 
                textDecoration: 'none', 
                color: isActive ? 'var(--primary-color)' : 'inherit', 
                fontSize: '0.85rem', 
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                opacity: isActive ? 1 : 0.4,
                transition: 'all 0.3s'
              }}>
              {nav.title}
            </Link>
          );
        })}
        <Link to={`/preview/${subdomain}/contact`} style={{ padding: '1rem 2.5rem', background: 'var(--secondary-color)', color: '#FFF', borderRadius: '1.25rem', fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', textDecoration: 'none', boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}>
           ENQUIRE
        </Link>
      </div>
    </nav>
  );
}

function RealEstateFooter({ settings, siteName, footerCfg }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <footer style={{ background: 'var(--secondary-color)', color: '#FFF', padding: '15rem 4vw 6rem' }}>
      <div style={{ maxWidth: '1800px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr', gap: '10rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '4rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--primary-color)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Home size={22} color="#FFF" /></div>
            <span style={{ fontWeight: 950, fontSize: '1.8rem', color: '#FFF', letterSpacing: '-0.04em', textTransform: 'uppercase' }}>{siteName}</span>
          </div>
          <p style={{ opacity: 0.4, lineHeight: 2, fontSize: '1rem', marginBottom: '5rem', maxWidth: '450px', fontWeight: 500 }}>{footerCfg.short_description || footerCfg.footer_description}</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
             {(footerCfg.social_links || []).map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', transition: 'all 0.4s' }} onMouseOver={e => { e.currentTarget.style.background = 'var(--primary-color)'; e.currentTarget.style.transform = 'translateY(-10px)'; }} onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'none'; }}>
                   <SocialIcon type={social.icon} size={24} />
                </a>
             ))}
          </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em', marginBottom: '4rem', opacity: 0.2 }}>Residencies</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((ln: any, i: number) => (
                 <a key={i} href={ln.url} style={{ textDecoration: 'none', color: 'inherit', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.4 }}>{ln.label}</a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em', marginBottom: '4rem', opacity: 0.2 }}>Regulatory</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', opacity: 0.1, fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              <span>Brokerage_License</span>
              <span>Regional_Mandate</span>
              <span>Disclosure_Node</span>
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em', marginBottom: '4rem', opacity: 0.2 }}>Concierge Relay</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', fontSize: '1.2rem' }}>
              {contact.phone && <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}><Phone size={22} color="var(--primary-color)" /> <b>{contact.phone}</b></div>}
              {contact.whatsapp && <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}><MessageCircle size={22} color="#22C55E" /> <b>CHANNEL</b></div>}
              {contact.email && <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}><Mail size={22} style={{ opacity: 0.2 }} /> <b style={{ fontSize: '1rem', opacity: 0.5 }}>{contact.email}</b></div>}
              
              {footerCfg.location_embed_link && (
                <div style={{ width: '100%', height: '220px', borderRadius: '2.5rem', overflow: 'hidden', marginTop: '2rem', border: '5px solid rgba(255,255,255,0.05)', filter: 'grayscale(1) invert(1)' }}>
                   <iframe src={footerCfg.location_embed_link.includes('<iframe') ? footerCfg.location_embed_link.match(/src="([^"]+)"/)?.[1] : footerCfg.location_embed_link} width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>
                </div>
              )}
           </div>
        </div>
      </div>
      <div style={{ maxWidth: '1800px', margin: '12rem auto 0', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.03)', fontSize: '0.85rem', opacity: 0.1, textAlign: 'center', fontWeight: 950, letterSpacing: '1em', textTransform: 'uppercase' }}>
         © {new Date().getFullYear()} {siteName.toUpperCase()} - REGISTERED_BROKERAGE_SOVEREIGN.
      </div>
    </footer>
  );
}
