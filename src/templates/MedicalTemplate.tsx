// src/templates/MedicalTemplate.tsx
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
  Heart, 
  Activity, 
  Clock, 
  MapPin, 
  User, 
  ChevronRight, 
  PhoneCall, 
  Calendar,
  ShieldCheck,
  Stethoscope,
  PlusCircle,
  Sticker
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

export default function MedicalTemplate({ 
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
  const siteName = settings?.site_name || 'Care Medical';
  const content = pageData?.content || {};
  const pageType = pageData?.page_type || 'home';
    const footerCfg = settings?.global_options?.footer_config || {};

  
  if (postData) {
    return (
      <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
        <MedicalTopBar footerCfg={footerCfg} />
        <MedicalNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} currentSlug={currentSlug} />
        </main>
        <MedicalFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
             <section style={{ padding: '8rem 4vw', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center', background: 'linear-gradient(to right, #F0F9FF, #FFF)' }}>
                <div>
                   <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1.5rem', background: '#FFF', border: '1px solid #E0F2FE', borderRadius: '100px', color: 'var(--primary-color)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                      <ShieldCheck size={16} /> Accredited Healthcare Provider
                   </div>
                   {content.headline && (
                     <h1 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 900, color: 'var(--text-color)', lineHeight: 1.1, marginBottom: '2.5rem' }}>
                        {content.headline}
                     </h1>
                   )}
                   {content.sub_headline && (
                     <p style={{ fontSize: '1.25rem', opacity: 0.6, maxWidth: '600px', lineHeight: 1.6, marginBottom: '4rem' }}>
                        {content.sub_headline}
                     </p>
                   )}
                   <div style={{ display: 'flex', gap: '4rem' }}>
                      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                         <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--primary-color)11', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}><Activity size={24} /></div>
                         <div><b style={{ fontSize: '1.5rem', display: 'block' }}>24/7</b><span style={{ fontSize: '0.75rem', opacity: 0.4, fontWeight: 700, textTransform: 'uppercase' }}>Available</span></div>
                      </div>
                      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                         <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--secondary-color)11', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary-color)' }}><User size={24} /></div>
                         <div><b style={{ fontSize: '1.5rem', display: 'block' }}>Expert</b><span style={{ fontSize: '0.75rem', opacity: 0.4, fontWeight: 700, textTransform: 'uppercase' }}>Specialists</span></div>
                      </div>
                   </div>
                </div>
                {content.hero_image && (
                  <div style={{ position: 'relative' }}>
                     <div style={{ position: 'absolute', inset: '-2rem', background: 'var(--primary-color)', borderRadius: '4rem', opacity: 0.05, transform: 'rotate(-3deg)' }} />
                     <img src={fixImg(content.hero_image)} alt="Hero" style={{ width: '100%', height: '650px', objectFit: 'cover', borderRadius: '3rem', position: 'relative', zIndex: 1 }} />
                  </div>
                )}
             </section>
             <div style={{ padding: '6rem 4vw', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3rem', background: '#FFF' }}>
                {[
                  { i: Stethoscope, t: 'General Consult' },
                  { i: Heart, t: 'Cardio Wellness' },
                  { i: PlusCircle, t: 'Emergency Care' },
                  { i: Activity, t: 'Diagnostics' }
                ].map((item, i) => (
                  <div key={i} style={{ padding: '3rem', borderRadius: '2rem', border: '1px solid #F1F5F9', textAlign: 'center', transition: 'all 0.4s' }} className="group hover:border-[var(--primary-color)] hover:shadow-xl hover:shadow-[var(--primary-color)]05">
                     <item.i size={40} color="var(--primary-color)" style={{ marginBottom: '2rem' }} />
                     <h4 style={{ fontWeight: 800, fontSize: '1.1rem', textTransform: 'uppercase' }}>{item.t}</h4>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'profile':
        return (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '10rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem', alignItems: 'center' }}>
                <div style={{ padding: '4rem', borderRadius: '3rem', background: 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))', color: '#FFF' }}>
                   <Heart size={64} style={{ marginBottom: '3rem' }} />
                   <h2 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1 }}>Care with<br />Expertise.</h2>
                </div>
                <div 
                  style={{ fontSize: '1.2rem', lineHeight: 1.8, opacity: 0.7, whiteSpace: 'pre-wrap' }}
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
                {content.gallery_title && <h1 style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--primary-color)' }}>{content.gallery_title}</h1>}
                {content.description && <p style={{ fontSize: '1.2rem', opacity: 0.4, marginTop: '1.5rem' }}>{content.description}</p>}
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2.5rem' }}>
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} style={{ borderRadius: '2.5rem', overflow: 'hidden', height: '450px', border: '8px solid #F8FAFC', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                     <img src={fixImg(img)} alt={`Medical ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
             </div>
          </div>
        );

      case 'news':
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '6rem', marginBottom: '8rem', background: '#FFF', border: '1px solid #F1F5F9', borderRadius: '3rem', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.03)' }}>
                <div style={{ padding: '6rem' }}>
                   <div style={{ display: 'inline-flex', padding: '0.4rem 1.5rem', background: 'var(--secondary-color)', color: '#FFF', fontWeight: 700, fontSize: '0.75rem', borderRadius: '100px', marginBottom: '2.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>MEDICAL BULLETIN</div>
                   <h1 style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '2.5rem' }}>{pageData.title}</h1>
                   <div style={{ fontSize: '1.2rem', opacity: 0.6, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: content.summary || '' }} />
                </div>
                <img src={fixImg(content.featured_image)} alt="Featured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>

             <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '6rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Health Insights</h2>
                <div style={{ height: '4px', flex: 1, background: '#F1F5F9', borderRadius: '10px' }} />
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '4rem' }}>
                {posts.map((post) => (
                  <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <article style={{ background: '#FFF', borderRadius: '2.5rem', border: '1px solid #F1F5F9', padding: '2rem', transition: 'all 0.4s' }} className="group hover:border-[var(--primary-color)] hover:shadow-xl hover:shadow-[var(--primary-color)]05">
                        <div style={{ height: '280px', borderRadius: '1.5rem', overflow: 'hidden', marginBottom: '2.5rem' }}>
                           <img src={fixImg(post.content?.featured_image)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s' }} className="group-hover:scale-105" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                           <span style={{ fontWeight: 800, color: 'var(--primary-color)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{post.category}</span>
                           <span style={{ fontSize: '0.7rem', opacity: 0.3, fontWeight: 700 }}>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <h3 style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.2 }}>{post.title}</h3>
                        <p style={{ fontSize: '0.95rem', opacity: 0.5, lineHeight: 1.6, marginBottom: '2.5rem' }}>{post.excerpt || post.content?.summary}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary-color)' }}>
                           READ ARTICLE <ChevronRight size={18} className="group-hover:translate-x-4 transition-transform" />
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
                   <h1 style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--primary-color)', lineHeight: 1, marginBottom: '6rem' }}>Clinical<br />Handshake.</h1>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                      {content.email && (
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                           <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Mail size={24} color="var(--primary-color)" />
                           </div>
                           <div>
                              <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, opacity: 0.3, textTransform: 'uppercase' }}>Health Relay</span>
                              <b style={{ fontSize: '1.8rem' }}>{content.email}</b>
                           </div>
                        </div>
                      )}
                      {content.phone && (
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                           <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Phone size={24} color="var(--secondary-color)" />
                           </div>
                           <div>
                              <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, opacity: 0.3, textTransform: 'uppercase' }}>Rapid Voice</span>
                              <b style={{ fontSize: '2rem' }}>{content.phone}</b>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
                <div>
                   {mapsUrl && (
                     <div style={{ width: '100%', height: '700px', borderRadius: '3.5rem', overflow: 'hidden', border: '12px solid #F8FAFC', boxShadow: '0 40px 80px rgba(0,0,0,0.05)' }}>
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
    <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
      <MedicalTopBar footerCfg={footerCfg} />
      <MedicalNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <MedicalFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
    </div>
  );
}

function MedicalTopBar({ footerCfg }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <div style={{ background: 'var(--primary-color)', color: '#FFF', padding: '0.6rem 4vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700 }}>
       <div style={{ display: 'flex', gap: '2.5rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><PhoneCall size={14} /> {contact.phone}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={14} /> {contact.email}</span>
       </div>
       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={14} /> {contact.service_hours}
       </div>
    </div>
  );
}

function MedicalNavbar({ settings, siteName, navPages, currentSlug, subdomain }: any) {
  return (
    <nav style={{ height: '90px', padding: '0 4vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.85)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)', borderBottom: '1px solid #F1F5F9' }}>
      <Link to={`/preview/${subdomain}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {settings?.logo_url ? (
          <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '40px', width: 'auto' }} />
        ) : (
          <div style={{ display: 'flex', items: 'center', gap: '1rem' }}>
             <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={24} color="#FFF" />
             </div>
             <span style={{ fontWeight: 900, fontSize: '1.6rem', color: 'var(--primary-color)', letterSpacing: '-0.02em' }}>{siteName}</span>
          </div>
        )}
      </Link>
      <div style={{ display: 'flex', gap: '1.5vw' }}>
        {navPages.map((nav: any) => {
          const isActive = currentSlug === nav.slug?.replace(/^\/+/, '');
          return (
            <Link 
              key={nav.slug} 
              to={`/preview/${subdomain}/${nav.slug?.replace(/^\/+/, '')}`} 
              style={{ 
                textDecoration: 'none', 
                color: isActive ? '#FFF' : 'inherit', 
                fontSize: '0.8rem', 
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                background: isActive ? 'var(--primary-color)' : 'transparent',
                padding: '0.6rem 1.8rem',
                borderRadius: '100px',
                opacity: isActive ? 1 : 0.5,
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

function MedicalFooter({ settings, siteName, footerCfg }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <footer style={{ background: '#FFF', borderTop: '1px solid #F1F5F9', padding: '12rem 4vw 4vw' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr', gap: '8rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
            {settings?.logo_url && <img src={fixImg(settings.logo_url)} alt="Logo" style={{ height: '40px', width: 'auto' }} />}
            <span style={{ fontWeight: 900, fontSize: '2rem', color: 'var(--primary-color)' }}>{siteName}</span>
          </div>
          <p style={{ opacity: 0.4, lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '4rem', maxWidth: '400px' }}>{footerCfg.short_description || footerCfg.footer_description}</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
             {(footerCfg.social_links || []).map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ width: '52px', height: '52px', borderRadius: '16px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', transition: 'all 0.4s' }} onMouseOver={e => { e.currentTarget.style.background = 'var(--primary-color)'; e.currentTarget.style.color = '#FFF'; e.currentTarget.style.transform = 'translateY(-5px)'; }} onMouseOut={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = 'var(--primary-color)'; e.currentTarget.style.transform = 'none'; }}>
                   <SocialIcon type={social.icon} size={22} />
                </a>
             ))}
          </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '3.5rem', opacity: 0.3 }}>Directories</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((ln: any, i: number) => (
                 <a key={i} href={ln.url} style={{ textDecoration: 'none', color: 'inherit', fontSize: '1rem', fontWeight: 700, opacity: 0.4 }}>{ln.label}</a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '3.5rem', opacity: 0.3 }}>Compliance</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', opacity: 0.2, fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <span>Privacy_Council</span>
              <span>Patient_Rights</span>
              <span>Regional_Node</span>
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '3.5rem', opacity: 0.3 }}>Chambers Hub</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontSize: '1.1rem' }}>
              {contact.phone && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><Phone size={20} color="var(--primary-color)" /> <b>{contact.phone}</b></div>}
              {contact.whatsapp && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><MessageCircle size={20} color="var(--secondary-color)" /> <b>{contact.whatsapp}</b></div>}
              {contact.email && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><Mail size={20} style={{ opacity: 0.3 }} /> <b>{contact.email}</b></div>}
              
              {footerCfg.location_embed_link && (
                <div style={{ width: '100%', height: '180px', borderRadius: '1.5rem', overflow: 'hidden', marginTop: '1.5rem', border: '5px solid #F8FAFC' }}>
                   <iframe src={footerCfg.location_embed_link.includes('<iframe') ? footerCfg.location_embed_link.match(/src="([^"]+)"/)?.[1] : footerCfg.location_embed_link} width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>
                </div>
              )}
           </div>
        </div>
      </div>
      <div style={{ maxWidth: '1600px', margin: '8rem auto 0', paddingTop: '4rem', borderTop: '1px solid #F1F5F9', fontSize: '0.75rem', opacity: 0.2, textAlign: 'center', fontWeight: 900, letterSpacing: '0.5em', textTransform: 'uppercase' }}>
         © {new Date().getFullYear()} {siteName.toUpperCase()} FOUNDATION / MEDICAL_SOVEREIGN_RESERVE.
      </div>
    </footer>
  );
}
