// src/templates/FintechTemplate.tsx
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
  TrendingUp, 
  Wallet, 
  Landmark, 
  Lock, 
  Globe, 
  ChevronRight, 
  CheckCircle, 
  BarChart2, 
  Briefcase, 
  Share2,
  Activity,
  Cpu,
  Zap
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

export default function FintechTemplate({ 
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
  const siteName = settings?.site_name || 'Fintech Institutional';
  const content = pageData?.content || {};
  const pageType = pageData?.page_type || 'home';
    const footerCfg = settings?.global_options?.footer_config || {};

  
  if (postData) {
    return (
      <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
        <FintechNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} currentSlug={currentSlug} />
        </main>
        <FintechFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
             <section style={{ padding: '10rem 4vw', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
                <div>
                   <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.4rem 1.2rem', background: 'var(--primary-color)0A', border: '1px solid var(--primary-color)22', borderRadius: '12px', color: 'var(--primary-color)', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em', marginBottom: '3rem' }}>
                      <Lock size={14} /> ISO 27001 Certified Security
                   </div>
                   {content.headline && (
                     <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '2.5rem', color: 'var(--primary-color)' }}>
                        {content.headline}
                     </h1>
                   )}
                   {content.sub_headline && (
                     <p style={{ fontSize: '1.25rem', opacity: 0.7, maxWidth: '600px', lineHeight: 1.6, marginBottom: '4rem' }}>
                        {content.sub_headline}
                     </p>
                   )}
                   <div style={{ display: 'flex', gap: '4rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                         <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--secondary-color)' }}>256-bit</span>
                         <span style={{ fontSize: '0.75rem', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase' }}>Encryption</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                         <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-color)' }}>Real-time</span>
                         <span style={{ fontSize: '0.75rem', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase' }}>Tracking</span>
                      </div>
                   </div>
                </div>
                {content.hero_image && (
                  <div style={{ position: 'relative' }}>
                     <div style={{ position: 'absolute', inset: '-1rem', border: '2px solid var(--primary-color)11', borderRadius: '2rem' }} />
                     <img src={fixImg(content.hero_image)} alt="Hero" style={{ width: '100%', height: '650px', objectFit: 'cover', borderRadius: '1.5rem', boxShadow: '0 40px 80px rgba(0,0,0,0.1)' }} />
                  </div>
                )}
             </section>
             <div style={{ background: 'var(--primary-color)05', padding: '6rem 4vw', borderY: '1px solid var(--primary-color)11' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem' }}>
                   {[
                     { i: TrendingUp, t: 'Wealth Growth', d: 'Compound yield optimization.' },
                     { i: BarChart2, t: 'Advanced Analytics', d: 'Proprietary insight models.' },
                     { i: ShieldCheck, t: 'Risk Protection', d: 'Institutional grade safety.' },
                     { i: Globe, t: 'Global Access', d: 'Sovereign asset mobility.' }
                   ].map((item, i) => (
                     <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'start' }}>
                        <item.i size={32} color="var(--secondary-color)" />
                        <div>
                           <h4 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.t}</h4>
                           <p style={{ fontSize: '0.85rem', opacity: 0.5 }}>{item.d}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        );

      case 'profile':
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '10rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10rem', alignItems: 'center' }}>
                <div style={{ background: 'var(--primary-color)05', padding: '6rem', borderRadius: '3rem', border: '1px solid var(--primary-color)11' }}>
                   <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'var(--secondary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '3rem' }}>
                      <Briefcase size={40} color="#FFF" />
                   </div>
                   <h2 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary-color)', lineHeight: 1 }}>Institutional<br />Foundations.</h2>
                </div>
                <div 
                  style={{ fontSize: '1.2rem', lineHeight: 1.8, opacity: 0.7, whiteSpace: 'pre-wrap' }}
                  className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.about_us || '' }}
                />
             </div>
          </div>
        );

      case 'gallery':
        const galleryImages = Array.isArray(content.images) ? content.images : [];
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '8rem' }}>
                <div>
                   {content.gallery_title && <h1 style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--primary-color)' }}>{content.gallery_title}</h1>}
                   {content.description && <div className="rich-text-content" style={{ fontSize: '1.1rem', opacity: 0.4, marginTop: '1rem' }} dangerouslySetInnerHTML={{ __html: content.description }} />}
                </div>
                <div style={{ display: 'flex', gap: '2rem' }}>
                   <div style={{ width: '40px', height: '10px', background: 'var(--secondary-color)', borderRadius: '100px' }} />
                   <div style={{ width: '20px', height: '10px', background: 'var(--primary-color)22', borderRadius: '100px' }} />
                </div>
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '3rem' }}>
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} style={{ height: '450px', borderRadius: '2rem', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid #EEE' }}>
                     <img src={fixImg(img)} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
             </div>
          </div>
        );

      case 'news':
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '6rem', marginBottom: '8rem', background: '#FFF', border: '1px solid #EEE', borderRadius: '3rem', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.05)' }}>
                <div style={{ padding: '6rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--secondary-color)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.75rem', marginBottom: '2rem' }}>
                      <Activity size={18} /> MARKET_SIGNAL: ACCESSED
                   </div>
                   <h1 style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '2.5rem', color: 'var(--primary-color)' }}>{pageData.title}</h1>
                   <div style={{ fontSize: '1.2rem', opacity: 0.6, lineHeight: 1.7 }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.summary || '' }} />
                </div>
                <img src={fixImg(content.featured_image)} alt="Featured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>

             <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: '6rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--primary-color)' }}>Institutional Updates</h2>
                <div style={{ height: '2px', flex: 1, background: '#EEE' }} />
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '4rem' }}>
                {posts.map((post) => (
                  <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <article style={{ background: '#FFF', border: '1px solid #EEE', borderRadius: '2rem', padding: '2.5rem', transition: 'all 0.4s' }} className="group hover:border-[var(--secondary-color)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)]">
                        <div style={{ height: '250px', borderRadius: '1.5rem', overflow: 'hidden', marginBottom: '2.5rem' }}>
                           <img src={fixImg(post.content?.featured_image)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="group-hover:scale-105" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                           <span style={{ fontWeight: 900, fontSize: '0.7rem', color: 'var(--secondary-color)', textTransform: 'uppercase' }}>{post.category}</span>
                           <span style={{ fontSize: '0.7rem', opacity: 0.3, fontWeight: 900 }}>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <h3 style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--primary-color)', marginBottom: '1.5rem', lineHeight: 1.2 }}>{post.title}</h3>
                        <div className="rich-text-content" style={{ fontSize: '0.95rem', opacity: 0.5, lineHeight: 1.6, marginBottom: '2.5rem' }} dangerouslySetInnerHTML={{ __html: post.excerpt || post.content?.summary || '' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 900, fontSize: '0.8rem', color: 'var(--primary-color)' }}>
                           ANALYZE REPORT <ChevronRight size={18} className="group-hover:translate-x-4 transition-transform" />
                        </div>
                     </article>
                  </Link>
                ))}
             </div>
          </div>
        );

      case 'contact':
        const mapFrame = content.maps_link?.includes('<iframe') ? content.maps_link.match(/src="([^"]+)"/)?.[1] : content.maps_link;
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '10rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10rem', alignItems: 'center' }}>
                <div>
                   <h1 style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--primary-color)', lineHeight: 1, marginBottom: '5rem' }}>Establish<br />Gateway.</h1>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                      {content.email && (
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                           <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--primary-color)05', border: '1px solid var(--primary-color)11', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Mail size={24} color="var(--primary-color)" />
                           </div>
                           <div>
                              <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Institutional Relay</span>
                              <b style={{ fontSize: '1.6rem', color: 'var(--primary-color)' }}>{content.email}</b>
                           </div>
                        </div>
                      )}
                      {content.phone && (
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                           <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--secondary-color)0A', border: '1px solid var(--secondary-color)22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Phone size={24} color="var(--secondary-color)" />
                           </div>
                           <div>
                              <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Voice Signal</span>
                              <b style={{ fontSize: '1.8rem' }}>{content.phone}</b>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
                <div>
                   {mapFrame && (
                     <div style={{ width: '100%', height: '650px', borderRadius: '3rem', overflow: 'hidden', border: '8px solid #F8F8F8', boxShadow: '0 40px 80px rgba(0,0,0,0.1)' }}>
                        <iframe src={mapFrame} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
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
      <FintechNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <FintechFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
    </div>
  );
}

function FintechNavbar({ settings, siteName, navPages, currentSlug, subdomain }: any) {
  return (
    <nav style={{ height: '90px', padding: '0 4vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.85)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(15px)', borderBottom: '1px solid #EEE' }}>
      <Link to={`/preview/${subdomain}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {settings?.logo_url ? (
          <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '40px', width: 'auto' }} />
        ) : (
          <div style={{ display: 'flex', items: 'center', gap: '1rem' }}>
             <Landmark size={32} color="var(--primary-color)" />
             <span style={{ fontWeight: 900, fontSize: '1.5rem', textTransform: 'uppercase', color: 'var(--primary-color)', letterSpacing: '-0.02em' }}>{siteName}</span>
          </div>
        )}
      </Link>
      <div style={{ display: 'flex', gap: '2vw' }}>
        {navPages.map((nav: any) => {
          const isActive = currentSlug === nav.slug?.replace(/^\/+/, '');
          return (
            <Link 
              key={nav.slug} 
              to={`/preview/${subdomain}/${nav.slug?.replace(/^\/+/, '')}`} 
              style={{ 
                textDecoration: 'none', 
                fontSize: '0.75rem', 
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                background: isActive ? 'var(--primary-color)' : 'transparent',
                color: isActive ? '#FFF' : 'inherit',
                padding: '0.6rem 1.5rem',
                borderRadius: '12px',
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

function FintechFooter({ settings, siteName, footerCfg }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <footer style={{ background: '#FFF', borderTop: '1px solid #EEE', padding: '12rem 4vw 4vw' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr', gap: '8rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
            {settings?.logo_url && <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '40px', width: 'auto' }} />}
            <span style={{ fontWeight: 900, fontSize: '2rem', textTransform: 'uppercase', color: 'var(--primary-color)' }}>{siteName}</span>
          </div>
          <p style={{ opacity: 0.4, lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '4rem', maxWidth: '400px' }}>{footerCfg.short_description || footerCfg.footer_description}</p>
          <div style={{ padding: '2rem', background: 'var(--primary-color)05', borderRadius: '1.5rem', border: '1px solid var(--primary-color)0A' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--secondary-color)', fontWeight: 900, fontSize: '0.7rem', marginBottom: '1rem' }}><Lock size={14} /> SECURITY PROTOCOL</div>
             <p style={{ fontSize: '0.8rem', opacity: 0.5, lineHeight: 1.6 }}>Multi-layered institutional encryption enabled for all active node transactions.</p>
          </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '3rem', opacity: 0.3 }}>Wealth Map</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((ln: any, i: number) => (
                 <a key={i} href={ln.url} style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6 }}>{ln.label}</a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '3rem', opacity: 0.3 }}>Asset Signals</h4>
           <div style={{ display: 'flex', gap: '1.5rem' }}>
              {(footerCfg.social_links || []).map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#F8F8F8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit', transition: 'all 0.4s' }} onMouseOver={e => { e.currentTarget.style.background = 'var(--primary-color)'; e.currentTarget.style.color = '#FFF'; e.currentTarget.style.transform = 'translateY(-5px)'; }} onMouseOut={e => { e.currentTarget.style.background = '#F8F8F8'; e.currentTarget.style.color = 'inherit'; e.currentTarget.style.transform = 'none'; }}>
                   <SocialIcon type={social.icon} size={24} />
                </a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '3rem', opacity: 0.3 }}>Registry Hub</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontSize: '1rem' }}>
              {contact.phone && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><Phone size={18} color="var(--primary-color)" /> <b>{contact.phone}</b></div>}
              {contact.whatsapp && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><MessageCircle size={18} color="var(--secondary-color)" /> <b>{contact.whatsapp}</b></div>}
              {contact.email && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><Mail size={18} style={{ opacity: 0.4 }} /> <b>{contact.email}</b></div>}
              {contact.service_hours && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', opacity: 0.3 }}><TrendingUp size={18} /> <span>{contact.service_hours}</span></div>}
              
              {footerCfg.location_embed_link && (
                <div style={{ width: '100%', height: '180px', borderRadius: '1rem', overflow: 'hidden', marginTop: '1.5rem', border: '1px solid #EEE' }}>
                   <iframe src={footerCfg.location_embed_link.includes('<iframe') ? footerCfg.location_embed_link.match(/src="([^"]+)"/)?.[1] : footerCfg.location_embed_link} width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>
                </div>
              )}
           </div>
        </div>
      </div>
      <div style={{ maxWidth: '1600px', margin: '8rem auto 0', paddingTop: '4rem', borderTop: '1px solid #EEE', fontSize: '0.8rem', opacity: 0.2, fontWeight: 900, textAlign: 'center', letterSpacing: '0.5em', textTransform: 'uppercase' }}>
         © {new Date().getFullYear()} {siteName.toUpperCase()} / INSTITUTIONAL_SOVEREIGN_RESERVE.
      </div>
    </footer>
  );
}
