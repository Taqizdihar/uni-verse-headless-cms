// src/templates/NGOTemplate.tsx
import React from 'react';
import UnifiedPostLayout from '../components/UnifiedPostLayout';
import { Link } from 'react-router-dom';
import { 
  Clock, 
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
  Users, 
  Globe, 
  HandHeart, 
  Sparkles, 
  MapPin, 
  ChevronRight, 
  Share2, 
  Quote, 
  Sun,
  Activity,
  Smile,
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

export default function NGOTemplate({ 
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
  const siteName = settings?.site_name || 'Humanity Foundation';
  const content = pageData?.content || {};
  const pageType = pageData?.page_type || 'home';
    const footerCfg = settings?.global_options?.footer_config || {};

  
  if (postData) {
    return (
      <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Outfit', sans-serif" }}>
        <NGOTopBar />
        <NGONavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} currentSlug={currentSlug} />
        </main>
        <NGOFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
             <section style={{ padding: '10rem 4vw', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8rem', alignItems: 'center', background: 'linear-gradient(to bottom right, #F0FDF4, #FFF)' }}>
                <div>
                   <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', padding: '0.6rem 2rem', background: '#FFF', borderRadius: '100px', color: 'var(--primary-color)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2rem', fontSize: '0.75rem', marginBottom: '3.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                      <Sparkles size={16} color="var(--secondary-color)" /> Power of Giving
                   </div>
                   {content.headline && (
                     <h1 style={{ fontSize: 'clamp(3.5rem, 8vw, 6.5rem)', fontWeight: 900, color: 'var(--text-color)', lineHeight: 0.9, letterSpacing: '-0.05em', marginBottom: '3.5rem', fontStyle: 'italic' }}>
                        {content.headline}
                     </h1>
                   )}
                   {content.sub_headline && (
                     <p style={{ fontSize: '1.4rem', opacity: 0.6, maxWidth: '700px', lineHeight: 1.6, marginBottom: '5rem' }}>
                        {content.sub_headline}
                     </p>
                   )}
                   <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
                      <Link to={`/preview/${subdomain}/contact`} style={{ padding: '1.5rem 4rem', background: 'var(--primary-color)', color: '#FFF', borderRadius: '3rem', fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase', textDecoration: 'none', boxShadow: '0 25px 50px -12px var(--primary-color)44' }}>
                         JOIN THE MISSION
                      </Link>
                      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                         <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#FFF', border: '5px solid var(--secondary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><HandHeart size={32} color="var(--secondary-color)" /></div>
                         <b style={{ textTransform: 'uppercase', fontSize: '0.8rem', opacity: 0.4 }}>Direct<br />Impact Fund</b>
                      </div>
                   </div>
                </div>
                {content.hero_image && (
                  <div style={{ position: 'relative' }}>
                     <div style={{ position: 'absolute', inset: '-3rem', border: '2px dashed var(--primary-color)33', borderRadius: '50%', animation: 'spin-slow 60s linear infinite' }} />
                     <img src={fixImg(content.hero_image)} alt="Impact" style={{ width: '100%', height: '700px', objectFit: 'cover', borderRadius: '4rem', boxShadow: '0 50px 100px rgba(0,0,0,0.1)', position: 'relative', zIndex: 1 }} />
                  </div>
                )}
             </section>
             <div style={{ padding: '6rem 4vw', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem', background: '#FFF' }}>
                {[
                  { i: Users, t: 'Community Uplift' },
                  { i: Globe, t: 'Global Reach' },
                  { i: Activity, t: 'Active Relief' },
                  { i: Heart, t: 'Pure Humanity' }
                ].map((item: any, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '3rem', borderRadius: '3rem', background: 'var(--bg-color)', border: '1px solid #F0FDF4' }}>
                     {item.i && <item.i size={48} color="var(--primary-color)" style={{ marginBottom: '2rem' }} />}
                     <h4 style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '1rem' }}>{item.t}</h4>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'profile':
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '10rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '10rem', alignItems: 'center' }}>
                <div style={{ padding: '6rem', borderRadius: '5rem', background: 'var(--text-color)', color: '#FFF', position: 'relative', overflow: 'hidden' }}>
                   <HandHeart size={120} style={{ position: 'absolute', bottom: '-2rem', right: '-2rem', opacity: 0.1 }} />
                   <h2 style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em', fontStyle: 'italic' }}>Pure<br />Humanity.</h2>
                </div>
                <div 
                  style={{ fontSize: '1.4rem', lineHeight: 1.8, opacity: 0.7, whiteSpace: 'pre-wrap' }}
                  dangerouslySetInnerHTML={{ __html: content.about_us || '' }}
                />
             </div>
          </div>
        );

      case 'gallery':
        const galleryImages = Array.isArray(content.images) ? content.images : [];
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
                {content.gallery_title && <h1 style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--text-color)', letterSpacing: '-0.05em' }}>{content.gallery_title}</h1>}
                {content.description && <p style={{ fontSize: '1.25rem', opacity: 0.4, marginTop: '2rem', maxWidth: '700px', margin: '2rem auto 0' }}>{content.description}</p>}
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '3rem' }}>
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} style={{ borderRadius: '4rem', overflow: 'hidden', height: '500px', border: '15px solid #FFF', boxShadow: '0 30px 60px rgba(0,0,0,0.05)' }}>
                     <img src={fixImg(img)} alt={`Impact ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
             </div>
          </div>
        );

      case 'news':
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '8rem', marginBottom: '10rem', background: 'var(--text-color)', color: '#FFF', borderRadius: '5rem', overflow: 'hidden' }}>
                <div style={{ padding: '6rem' }}>
                   <div style={{ display: 'inline-flex', padding: '0.4rem 1.5rem', background: 'var(--primary-color)', color: '#FFF', fontWeight: 900, fontSize: '0.75rem', borderRadius: '100px', marginBottom: '3rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>IMPACT_UPDATES</div>
                   <h1 style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em', marginBottom: '3rem' }}>{pageData.title}</h1>
                   <div style={{ fontSize: '1.3rem', opacity: 0.6, lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: content.summary || '' }} />
                </div>
                <img src={fixImg(content.featured_image)} alt="Featured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>

             <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', marginBottom: '6rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, fontStyle: 'italic' }}>Stories from the Field</h2>
                <div style={{ height: '4px', flex: 1, background: 'var(--primary-color)33', borderRadius: '10px' }} />
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '5rem' }}>
                {posts.map((post) => (
                  <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <article style={{ background: '#FFF', border: '1px solid #F1F5F9', borderRadius: '4rem', padding: '2.5rem', transition: 'all 0.4s' }} className="group hover:shadow-2xl">
                        <div style={{ height: '300px', borderRadius: '3rem', overflow: 'hidden', marginBottom: '3rem' }}>
                           <img src={fixImg(post.content?.featured_image)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.6s' }} className="group-hover:scale-110" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                           <span style={{ fontWeight: 900, color: 'var(--primary-color)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{post.category}</span>
                           <span style={{ fontSize: '0.75rem', opacity: 0.3, fontWeight: 800 }}>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem', lineHeight: 1.1 }}>{post.title}</h3>
                        <p style={{ opacity: 0.5, fontSize: '1rem', lineHeight: 1.6, marginBottom: '3rem' }}>{post.excerpt || post.content?.summary}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 900, fontSize: '0.85rem', color: 'var(--text-color)' }}>
                           READ IMPACT STORY <ChevronRight size={18} className="group-hover:translate-x-4 transition-transform" />
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
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '10rem', alignItems: 'center' }}>
                <div>
                   <h1 style={{ fontSize: '5.5rem', fontWeight: 900, color: 'var(--text-color)', lineHeight: 0.85, letterSpacing: '-0.05em', marginBottom: '6rem', fontStyle: 'italic' }}>Join the Mission.</h1>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
                      {content.email && (
                        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                           <div style={{ width: '72px', height: '72px', borderRadius: '2rem', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Mail size={32} color="var(--primary-color)" />
                           </div>
                           <div>
                              <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, opacity: 0.3, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Humanity Relay</span>
                              <b style={{ fontSize: '2rem' }}>{content.email}</b>
                           </div>
                        </div>
                      )}
                      {content.phone && (
                        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                           <div style={{ width: '72px', height: '72px', borderRadius: '2rem', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Phone size={32} color="var(--secondary-color)" />
                           </div>
                           <div>
                              <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, opacity: 0.3, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Rapid Response</span>
                              <b style={{ fontSize: '2.2rem' }}>{content.phone}</b>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
                <div style={{ padding: '1rem', borderRadius: '5rem', border: '2px dashed var(--primary-color)33' }}>
                   {mapsUrl && (
                     <div style={{ width: '100%', height: '700px', borderRadius: '4rem', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.1)' }}>
                        <iframe src={mapsUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
                     </div>
                   )}
                </div>
             </div>
          </div>
        );

      default:
        return (
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '10rem 4vw' }}>
             <div style={{ fontSize: '1.25rem', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: content.body || '' }} />
          </div>
        );
    }
  };

  return (
    <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Outfit', sans-serif" }}>
      <NGOTopBar />
      <NGONavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <NGOFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin-slow { animation: spin-slow 15s linear infinite; }
      `}} />
    </div>
  );
}

function NGOTopBar() {
  return (
    <div style={{ background: 'var(--text-color)', color: '#FFF', padding: '0.7rem 4vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
       <div style={{ display: 'flex', gap: '3rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Sun size={14} color="#FBBF24" /> Lives Impacted: 2.5M+</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Globe size={14} color="#38BDF8" /> active in 42 countries</span>
       </div>
       <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.5 }}>Official_Strategic_Humanity_Node</div>
    </div>
  );
}

function NGONavbar({ settings, siteName, navPages, currentSlug, subdomain }: any) {
  return (
    <nav style={{ height: '100px', padding: '0 4vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.85)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)', borderBottom: '1px solid #F1F5F9' }}>
      <Link to={`/preview/${subdomain}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {settings?.logo_url ? (
          <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '48px', width: 'auto' }} />
        ) : (
          <div style={{ display: 'flex', items: 'center', gap: '1.25rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '18px', background: 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
              <Heart size={28} />
            </div>
            <span style={{ fontWeight: 900, fontSize: '1.8rem', color: 'var(--text-color)', letterSpacing: '-0.04em' }}>{siteName}</span>
          </div>
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
                fontWeight: isActive ? 900 : 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                opacity: isActive ? 1 : 0.4,
                transition: 'all 0.3s'
              }}>
              {nav.title}
            </Link>
          );
        })}
        <Link to={`/preview/${subdomain}/contact`} style={{ padding: '0.8rem 2.5rem', background: 'var(--secondary-color)', color: '#FFF', borderRadius: '1.5rem', fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', textDecoration: 'none', boxShadow: '0 15px 30px -5px var(--secondary-color)33' }}>
           DONATE
        </Link>
      </div>
    </nav>
  );
}

function NGOFooter({ settings, siteName, footerCfg }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <footer style={{ background: '#FFF', borderTop: '4px solid var(--primary-color)', padding: '12rem 4vw 4vw' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr', gap: '8rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3.5rem' }}>
            <span style={{ fontWeight: 900, fontSize: '2rem', color: 'var(--text-color)' }}>{siteName}</span>
          </div>
          <p style={{ opacity: 0.4, lineHeight: 1.8, fontSize: '1rem', marginBottom: '4rem', maxWidth: '400px', fontWeight: 500 }}>{footerCfg.short_description || footerCfg.footer_description}</p>
          
          <div style={{ padding: '2.5rem', background: '#F8FAFC', borderRadius: '2.5rem', display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '4rem' }}>
             <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                <Sparkles size={24} color="#FBBF24" />
             </div>
             <div><b style={{ fontSize: '1.5rem', display: 'block' }}>98%</b><span style={{ fontSize: '0.75rem', opacity: 0.4, fontWeight: 900, textTransform: 'uppercase' }}>Direct Impact Fund</span></div>
          </div>

          <div style={{ display: 'flex', gap: '2rem' }}>
             {(footerCfg.social_links || []).map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', opacity: 0.3, transition: 'all 0.4s' }} onMouseOver={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(-5px) rotate(12deg)'; }} onMouseOut={e => { e.currentTarget.style.opacity = '0.3'; e.currentTarget.style.transform = 'none'; }}>
                   <SocialIcon type={social.icon} size={26} />
                </a>
             ))}
          </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '3.5rem', opacity: 0.3 }}>Missions</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((ln: any, i: number) => (
                 <a key={i} href={ln.url} style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.4 }}>{ln.label}</a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '3.5rem', opacity: 0.3 }}>Governance</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', opacity: 0.2, fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              <span>Transparency_Portal</span>
              <span>Humanity_Charter</span>
              <span>Regional_Nodes</span>
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '3.5rem', opacity: 0.3 }}>Humanity Link</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', fontSize: '1.1rem' }}>
              {contact.phone && <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}><Phone size={20} color="var(--secondary-color)" /> <b>{contact.phone}</b></div>}
              {contact.whatsapp && <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}><MessageCircle size={20} color="#22C55E" /> <b>CHANNEL</b></div>}
              {contact.email && <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}><Mail size={20} style={{ opacity: 0.3 }} /> <b style={{ fontSize: '0.85rem' }}>{contact.email}</b></div>}
              
              {footerCfg.location_embed_link && (
                <div style={{ width: '100%', height: '220px', borderRadius: '3rem', overflow: 'hidden', marginTop: '1.5rem', border: '8px solid #F8FAFC' }}>
                   <iframe src={footerCfg.location_embed_link.includes('<iframe') ? footerCfg.location_embed_link.match(/src="([^"]+)"/)?.[1] : footerCfg.location_embed_link} width="100%" height="100%" style={{ border: 0, filter: 'grayscale(0.5)' }} loading="lazy"></iframe>
                </div>
              )}
           </div>
        </div>
      </div>
      <div style={{ maxWidth: '1600px', margin: '8rem auto 0', paddingTop: '4rem', borderTop: '1px solid #F1F5F9', fontSize: '0.8rem', opacity: 0.2, textAlign: 'center', fontWeight: 900, letterSpacing: '0.6em', textTransform: 'uppercase' }}>
         © {new Date().getFullYear()} {siteName.toUpperCase()} - PURE_HUMANITY_INITIATIVE.
      </div>
    </footer>
  );
}
