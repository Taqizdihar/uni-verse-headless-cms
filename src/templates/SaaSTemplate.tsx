// src/templates/SaaSTemplate.tsx
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
  Rocket, 
  Cpu, 
  BarChart3, 
  Zap, 
  Shield, 
  ChevronRight, 
  Globe, 
  Layers, 
  CheckCircle2,
  Server,
  Terminal,
  Activity,
  ChevronDown
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

export default function SaaSTemplate({ 
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
  const siteName = settings?.site_name || 'Cloud SaaS';
  const content = pageData?.content || {};
  const pageType = pageData?.page_type || 'home';
  const p = { 
    primary: palette?.primary || themeColor || '#6366F1', 
    secondary: palette?.secondary || '#EC4899', 
    surface: '#0F172A', 
    text: '#F8FAFC', 
    name: 'NextGen SaaS' 
  };
  const footerCfg = settings?.global_options?.footer_config || {};

  
  if (postData) {
    return (
      <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
        <SaaSNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} currentSlug={currentSlug} />
        </main>
        <SaaSFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
             <section style={{ padding: '12rem 4vw', textAlign: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'var(--primary-color)', opacity: 0.1, filter: 'blur(150px)', borderRadius: '50%' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                   <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--primary-color)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '4rem' }}>
                      <Activity size={18} /> Engine v4.0 Active
                   </div>
                   {content.headline && (
                     <h1 style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)', fontWeight: 950, color: '#FFF', lineHeight: 0.9, letterSpacing: '-0.05em', marginBottom: '4rem' }}>
                        {content.headline}
                     </h1>
                   )}
                   {content.sub_headline && (
                     <p style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.5)', maxWidth: '800px', margin: '0 auto 6rem', lineHeight: 1.6 }}>
                        {content.sub_headline}
                     </p>
                   )}
                   <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                      <Link to={`/preview/${subdomain}/contact`} style={{ padding: '1.2rem 4rem', background: 'var(--primary-color)', color: '#FFF', fontWeight: 900, textTransform: 'uppercase', textDecoration: 'none', letterSpacing: '0.2em', borderRadius: '100px', fontSize: '0.85rem', boxShadow: '0 20px 40px var(--primary-color)44' }}>
                         LAUNCH PLATFORM
                      </Link>
                   </div>
                </div>
                {content.hero_image && (
                  <div style={{ marginTop: '8rem', position: 'relative' }}>
                     <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-color), transparent)', zIndex: 2 }} />
                     <img src={fixImg(content.hero_image)} alt="App Interface" style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', borderRadius: '4rem', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 50px 100px rgba(0,0,0,0.5)', transform: 'scale(1.05)' }} />
                  </div>
                )}
             </section>
             <div style={{ padding: '6rem 4vw', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem', background: 'rgba(255,255,255,0.02)', borderY: '1px solid rgba(255,255,255,0.05)' }}>
                {[
                  { i: Shield, t: 'Military Grade', d: 'Enterprise Security' },
                  { i: Zap, t: 'Instant Sync', d: 'Zero Latency Pipeline' },
                  { i: BarChart3, t: 'Predictive Ops', d: 'AI Driven Insights' },
                  { i: Server, t: 'Edge Ready', d: 'Global Infra Node' }
                ].map((item: any, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                     <div style={{ width: '64px', height: '64px', margin: '0 auto 2.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                        {item.i && <item.i size={28} />}
                     </div>
                     <h4 style={{ fontWeight: 900, fontSize: '0.9rem', marginBottom: '0.75rem', color: '#FFF' }}>{item.t}</h4>
                     <p style={{ fontSize: '0.8rem', opacity: 0.4, fontWeight: 700 }}>{item.d}</p>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'profile':
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '10rem', alignItems: 'center' }}>
                <div style={{ padding: '5rem', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', borderRadius: '4rem', boxShadow: '0 40px 80px var(--primary-color)33' }}>
                   <h2 style={{ fontSize: '5rem', fontWeight: 950, color: '#FFF', lineHeight: 0.9, letterSpacing: '-0.04em' }}>Neural<br />Fabric.</h2>
                </div>
                <div 
                  style={{ fontSize: '1.3rem', lineHeight: 1.8, opacity: 0.5, whiteSpace: 'pre-wrap' }}
                  dangerouslySetInnerHTML={{ __html: content.about_us || '' }}
                />
             </div>
          </div>
        );

      case 'gallery':
        const galleryImages = Array.isArray(content.images) ? content.images : [];
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '10rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ textAlign: 'center', marginBottom: '10rem' }}>
                {content.gallery_title && <h1 style={{ fontSize: '5rem', fontWeight: 950, color: '#FFF' }}>{content.gallery_title}</h1>}
                {content.description && <p style={{ fontSize: '1.3rem', opacity: 0.3, marginTop: '2rem', maxWidth: '700px', margin: '2rem auto 0' }}>{content.description}</p>}
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '3rem' }}>
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} style={{ borderRadius: '2.5rem', overflow: 'hidden', height: '400px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }} className="group">
                     <img src={fixImg(img)} alt={`Protocol ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4, transition: 'all 0.6s' }} className="group-hover:opacity-100 group-hover:scale-105" />
                  </div>
                ))}
             </div>
          </div>
        );

      case 'news':
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '8rem', marginBottom: '12rem', background: 'rgba(255,255,255,0.02)', borderRadius: '4rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ padding: '8rem' }}>
                   <div style={{ display: 'inline-flex', padding: '0.5rem 1.5rem', background: 'var(--secondary-color)', color: '#FFF', fontWeight: 900, fontSize: '0.75rem', borderRadius: '100px', marginBottom: '3rem', textTransform: 'uppercase', letterSpacing: '0.2rem' }}>GEN_RELEASE_4.0</div>
                   <h1 style={{ fontSize: '5rem', fontWeight: 950, lineHeight: 0.9, color: '#FFF', marginBottom: '3rem' }}>{pageData.title}</h1>
                   <div style={{ fontSize: '1.3rem', opacity: 0.4, lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: content.summary || '' }} />
                </div>
                <img src={fixImg(content.featured_image)} alt="Update context" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
             </div>

             <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', marginBottom: '8rem' }}>
                <h2 style={{ fontSize: '2.25rem', fontWeight: 950, textTransform: 'uppercase', color: '#FFF' }}>Version Logs</h2>
                <div style={{ height: '2px', flex: 1, background: 'rgba(255,255,255,0.05)' }} />
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '4rem' }}>
                {posts.map((post) => (
                  <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <article style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '3rem', padding: '4rem', transition: 'all 0.4s' }} className="group hover:border-[var(--primary-color)]33 hover:-translate-y-4">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                           <span style={{ fontWeight: 900, color: 'var(--primary-color)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2rem' }}>{post.category}</span>
                           <span style={{ fontSize: '0.7rem', opacity: 0.3, fontWeight: 900 }}>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <h3 style={{ fontSize: '2.25rem', fontWeight: 950, color: '#FFF', marginBottom: '2.5rem', lineHeight: 1.1 }}>{post.title}</h3>
                        <p style={{ opacity: 0.4, fontSize: '1rem', lineHeight: 1.6, marginBottom: '3.5rem' }}>{post.excerpt || post.content?.summary}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 900, fontSize: '0.85rem', color: 'var(--primary-color)' }}>
                           PULL LOGS <ChevronRight size={18} className="group-hover:translate-x-4 transition-transform" />
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
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '12rem', alignItems: 'center' }}>
                <div>
                   <h1 style={{ fontSize: '6rem', fontWeight: 950, color: '#FFF', lineHeight: 0.9, letterSpacing: '-0.04em', marginBottom: '8rem' }}>Neural Support<br />Relay.</h1>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
                      {content.email && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, opacity: 0.3, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '2rem' }}>Encrypted_Mail</span>
                           <b style={{ fontSize: '2.2rem', color: 'var(--primary-color)' }}>{content.email}</b>
                        </div>
                      )}
                      {content.phone && (
                        <div>
                           <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, opacity: 0.3, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '2rem' }}>Priority_Freq</span>
                           <b style={{ fontSize: '2.5rem', color: '#FFF' }}>{content.phone}</b>
                        </div>
                      )}
                   </div>
                </div>
                <div>
                   {mapsUrl && (
                     <div style={{ width: '100%', height: '800px', borderRadius: '4rem', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.05)', boxShadow: '0 50px 100px rgba(0,0,0,0.4)', filter: 'invert(1) hue-rotate(180deg) brightness(0.6)' }}>
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
             <div style={{ fontSize: '1.3rem', lineHeight: 2, opacity: 0.4 }} dangerouslySetInnerHTML={{ __html: content.body || '' }} />
          </div>
        );
    }
  };

  return (
    <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
      <SaaSNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <SaaSFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
    </div>
  );
}

function SaaSNavbar({ settings, siteName, navPages, currentSlug, subdomain }: any) {
  return (
    <nav style={{ height: '110px', padding: '0 4vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(15,23,42,0.85)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(30px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <Link to={`/preview/${subdomain}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px var(--primary-color)33' }}>
           <Layers size={28} color="#FFF" />
        </div>
        {settings?.logo_url ? (
          <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '36px', width: 'auto', filter: 'brightness(1) contrast(1.5)' }} />
        ) : (
          <span style={{ fontWeight: 950, fontSize: '1.8rem', color: '#FFF', letterSpacing: '-0.04em', textTransform: 'uppercase' }}>{siteName}</span>
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
        <Link to={`/preview/${subdomain}/contact`} style={{ padding: '1rem 2.8rem', background: 'var(--primary-color)', color: '#FFF', borderRadius: '100px', fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', textDecoration: 'none', boxShadow: '0 15px 30px var(--primary-color)44' }}>
           SIGN UP
        </Link>
      </div>
    </nav>
  );
}

function SaaSFooter({ settings, siteName, footerCfg }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <footer style={{ background: '#080C16', color: '#FFF', padding: '15rem 4vw 6rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: '1800px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr', gap: '10rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '4rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--primary-color)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Layers size={22} color="#FFF" /></div>
            <span style={{ fontWeight: 950, fontSize: '1.8rem', color: '#FFF', letterSpacing: '-0.04em', textTransform: 'uppercase' }}>{siteName}</span>
          </div>
          <p style={{ opacity: 0.3, lineHeight: 2, fontSize: '1rem', marginBottom: '5rem', maxWidth: '450px' }}>{footerCfg.short_description || footerCfg.footer_description}</p>
          <div style={{ display: 'flex', gap: '2rem' }}>
             {(footerCfg.social_links || []).map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', transition: 'all 0.4s' }} onMouseOver={e => { e.currentTarget.style.background = 'var(--primary-color)'; e.currentTarget.style.transform = 'translateY(-10px)'; }} onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'none'; }}>
                   <SocialIcon type={social.icon} size={24} />
                </a>
             ))}
          </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '4rem', opacity: 0.2 }}>Nexus</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((ln: any, i: number) => (
                 <a key={i} href={ln.url} style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.3 }}>{ln.label}</a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '4rem', opacity: 0.2 }}>Integrity</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', opacity: 0.1, fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              <span>Security_Log</span>
              <span>Neural_Rights</span>
              <span>SLA_Node</span>
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '4rem', opacity: 0.2 }}>Support Relay</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', fontSize: '1.2rem' }}>
              {contact.phone && <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}><Zap size={22} color="var(--primary-color)" /> <b>{contact.phone}</b></div>}
              {contact.whatsapp && <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}><MessageCircle size={22} color="var(--secondary-color)" /> <b>CHANNEL</b></div>}
              {contact.email && <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}><Mail size={22} style={{ opacity: 0.2 }} /> <b style={{ fontSize: '1rem', opacity: 0.5 }}>{contact.email}</b></div>}
              
              <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-start' }}>
                 <div style={{ height: '40px', padding: '0 2rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', fontWeight: 900, color: 'var(--primary-color)' }}>
                    <Server size={18} /> CLUSTER_01_ACTIVE
                 </div>
              </div>
           </div>
        </div>
      </div>
      <div style={{ maxWidth: '1800px', margin: '12rem auto 0', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.03)', fontSize: '0.85rem', opacity: 0.1, textAlign: 'center', fontWeight: 950, letterSpacing: '1.2em', textTransform: 'uppercase' }}>
         © {new Date().getFullYear()} {siteName.toUpperCase()} - SENTIENT_SOVEREIGN_CORE.
      </div>
    </footer>
  );
}
