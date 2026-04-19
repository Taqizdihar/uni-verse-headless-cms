// src/templates/EventTemplate.tsx
import React, { useState, useEffect } from 'react';
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
  Ticket, 
  Calendar, 
  MapPin, 
  Users, 
  Mic, 
  Timer, 
  ChevronRight, 
  Share2, 
  Play, 
  Heart, 
  Plus,
  Zap,
  Star,
  Music
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

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 23, minutes: 54, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
         if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
         if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
         if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
         if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
         return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '4rem' }}>
       {[
         { l: 'DAYS', v: timeLeft.days },
         { l: 'HRS', v: timeLeft.hours },
         { l: 'MIN', v: timeLeft.minutes },
         { l: 'SEC', v: timeLeft.seconds }
       ].map((u, i) => (
         <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', minWidth: '100px' }}>
               <span style={{ fontSize: '3rem', fontWeight: 900, color: '#FFF' }}>{String(u.v).padStart(2,'0')}</span>
            </div>
            <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, marginTop: '1rem', opacity: 0.5, letterSpacing: '0.2em' }}>{u.l}</span>
         </div>
       ))}
    </div>
  );
};

export default function EventTemplate({ 
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
  const siteName = settings?.site_name || 'Vibrant Events';
  const content = pageData?.content || {};
  const pageType = pageData?.page_type || 'home';
    const footerCfg = settings?.global_options?.footer_config || {};

  
  if (postData) {
    return (
      <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
        <EventNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
        <main style={{ flex: 1 }}>
          <UnifiedPostLayout postData={postData} currentSlug={currentSlug} />
        </main>
        <EventFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
      </div>
    );
  }

  const renderContent = () => {
    switch (pageType) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
             <section style={{ padding: '10rem 4vw', position: 'relative', overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                   <div style={{ position: 'absolute', top: '10%', right: '-5vw', width: '40vw', height: '40vw', background: 'var(--primary-color)', filter: 'blur(150px)', opacity: 0.15, borderRadius: '50%' }} />
                   <div style={{ position: 'absolute', bottom: '10%', left: '-5vw', width: '35vw', height: '35vw', background: 'var(--secondary-color)', filter: 'blur(150px)', opacity: 0.15, borderRadius: '50%' }} />
                </div>
                <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
                   <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', padding: '0.6rem 2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '3rem' }}>
                      <Zap size={16} color="var(--primary-color)" /> Ready for the show?
                   </div>
                   {content.headline && (
                     <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)', fontWeight: 900, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-0.04em', marginBottom: '2rem' }}>
                        {content.headline}
                     </h1>
                   )}
                   {content.sub_headline && (
                     <p style={{ fontSize: '1.4rem', opacity: 0.6, maxWidth: '700px', margin: '0 auto 4rem' }}>
                        {content.sub_headline}
                     </p>
                   )}
                   <CountdownTimer />
                </div>
             </section>
             {content.hero_image && (
               <div style={{ padding: '0 4vw 10rem' }}>
                  <img src={fixImg(content.hero_image)} alt="Hero" style={{ width: '100%', height: '700px', objectFit: 'cover', borderRadius: '4rem', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }} />
               </div>
             )}
          </div>
        );

      case 'profile':
        return (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '10rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                   <div style={{ position: 'absolute', inset: '-2rem', background: 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))', borderRadius: '3rem', opacity: 0.2, filter: 'blur(40px)' }} />
                   <h2 style={{ fontSize: '4rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1, position: 'relative' }}>Pure Passion. <br /><span style={{ color: 'transparent', WebkitTextStroke: '2px var(--primary-color)' }}>Real Impact.</span></h2>
                </div>
                <div 
                  style={{ fontSize: '1.25rem', lineHeight: 1.8, opacity: 0.7, whiteSpace: 'pre-wrap' }}
                  className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.about_us || '' }}
                />
             </div>
          </div>
        );

      case 'gallery':
        const galleryImages = Array.isArray(content.images) ? content.images : [];
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
                {content.gallery_title && <h1 style={{ fontSize: '5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1.5rem' }}>{content.gallery_title}</h1>}
                {content.description && <div className="rich-text-content" style={{ fontSize: '1.2rem', opacity: 0.5 }} dangerouslySetInnerHTML={{ __html: content.description }} />}
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2rem' }}>
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} style={{ borderRadius: '3rem', overflow: 'hidden', height: '500px', position: 'relative' }} className="group">
                     <img src={fixImg(img)} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="group-hover:scale-110" />
                     <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', opacity: 0, transition: 'opacity 0.3s', display: 'flex', alignItems: 'flex-end', padding: '2rem' }} className="group-hover:opacity-100">
                        <span style={{ color: '#FFF', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>View High-Res</span>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'news':
        return (
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '8rem 4vw' }} className="animate-in fade-in duration-700">
             <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '6rem', marginBottom: '10rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4rem', overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ padding: '6rem' }}>
                   <div style={{ display: 'inline-flex', padding: '0.4rem 1.2rem', background: 'var(--primary-color)', color: '#FFF', borderRadius: '100px', fontWeight: 900, fontSize: '0.75rem', marginBottom: '2rem' }}>FRESH RELEASE</div>
                   <h1 style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1.1, textTransform: 'uppercase', marginBottom: '2rem' }}>{pageData.title}</h1>
                   <div style={{ fontSize: '1.2rem', opacity: 0.6, lineHeight: 1.8 }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.summary || '' }} />
                </div>
                <img src={fixImg(content.featured_image)} alt="Featured" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'hue-rotate(15deg)' }} />
             </div>

             <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '6rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase' }}>Recent Signal</h2>
                <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, var(--primary-color), transparent)' }} />
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '4rem' }}>
                {posts.map((post) => (
                  <Link key={post.id} to={`/preview/${subdomain}/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <article style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '3rem', padding: '2rem' }} className="group">
                        <div style={{ height: '300px', borderRadius: '2rem', overflow: 'hidden', marginBottom: '2.5rem' }}>
                           <img src={fixImg(post.content?.featured_image)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="group-hover:scale-110" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', items: 'center', marginBottom: '1.5rem' }}>
                           <span style={{ fontWeight: 900, color: 'var(--primary-color)', textTransform: 'uppercase', fontSize: '0.75rem' }}>{post.category}</span>
                           <span style={{ fontSize: '0.7rem', opacity: 0.3, fontWeight: 900 }}>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1.5rem' }}>{post.title}</h3>
                        <div className="rich-text-content" style={{ opacity: 0.5, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2.5rem' }} dangerouslySetInnerHTML={{ __html: post.excerpt || post.content?.summary || '' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 900, fontSize: '0.8rem', color: '#FFF' }}>
                           GET TICKET <ChevronRight size={18} className="group-hover:translate-x-4 transition-transform" />
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
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem', alignItems: 'center' }}>
                <div>
                   <h1 style={{ fontSize: '6rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.9, marginBottom: '6rem' }}>Let's Vibe<br />together.</h1>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                      {content.email && (
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                           <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Mail size={32} color="#FFF" />
                           </div>
                           <div>
                              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Signal Protocol</span>
                              <b style={{ fontSize: '1.8rem' }}>{content.email}</b>
                           </div>
                        </div>
                      )}
                      {content.phone && (
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                           <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--secondary-color), var(--primary-color))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Phone size={32} color="#FFF" />
                           </div>
                           <div>
                              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Voice Relay</span>
                              <b style={{ fontSize: '1.8rem' }}>{content.phone}</b>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
                <div>
                   {mapsUrl && (
                     <div style={{ width: '100%', height: '700px', borderRadius: '5rem', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                        <iframe src={mapsUrl} width="100%" height="100%" style={{ border: 0, filter: 'invert(1) hue-rotate(180deg) brightness(0.8)' }} allowFullScreen loading="lazy"></iframe>
                     </div>
                   )}
                </div>
             </div>
          </div>
        );

      default:
        return (
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '10rem 4vw' }}>
             <div style={{ fontSize: '1.25rem', lineHeight: 1.8 }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: content.body || '' }} />
          </div>
        );
    }
  };

  return (
    <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
      <EventNavbar settings={settings} siteName={siteName} navPages={navPages} currentSlug={currentSlug} subdomain={subdomain} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <EventFooter settings={settings} siteName={siteName} footerCfg={footerCfg} />
    </div>
  );
}

function EventNavbar({ settings, siteName, navPages, currentSlug, subdomain }: any) {
  return (
    <nav style={{ height: '100px', padding: '0 4vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(2,6,23,0.8)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <Link to={`/preview/${subdomain}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px var(--primary-color)66' }}>
          <Star size={24} color="#FFF" />
        </div>
        <span style={{ fontWeight: 900, fontSize: '1.8rem', textTransform: 'uppercase', letterSpacing: '-0.05em' }}>{siteName}</span>
      </Link>
      <div style={{ display: 'flex', gap: '3vw' }}>
        {navPages.map((nav: any) => {
          const isActive = currentSlug === nav.slug?.replace(/^\/+/, '');
          return (
            <Link 
              key={nav.slug} 
              to={`/preview/${subdomain}/${nav.slug?.replace(/^\/+/, '')}`} 
              style={{ 
                textDecoration: 'none', 
                color: 'inherit', 
                fontSize: '0.75rem', 
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                background: isActive ? 'var(--primary-color)' : 'transparent',
                padding: '0.6rem 1.5rem',
                borderRadius: '100px',
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

function EventFooter({ settings, siteName, footerCfg }: any) {
  const contact = footerCfg.contact_info || {};
  return (
    <footer style={{ background: '#010411', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '12rem 4vw 4vw', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '30vw', height: '30vw', background: 'var(--primary-color)', filter: 'blur(150px)', opacity: 0.1, borderRadius: '50%' }} />
      <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr', gap: '8rem', position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--secondary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Music size={24} color="#FFF" />
            </div>
            <span style={{ fontWeight: 900, fontSize: '2.5rem', textTransform: 'uppercase' }}>{siteName}</span>
          </div>
          <p style={{ opacity: 0.4, lineHeight: 1.8, fontSize: '1rem', fontStyle: 'italic', marginBottom: '3rem', maxWidth: '400px' }}>{footerCfg.short_description || footerCfg.footer_description}</p>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '3rem', opacity: 0.3 }}>Nexus Map</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {(footerCfg.quick_links || []).slice(0, 5).map((ln: any, i: number) => (
                 <a key={i} href={ln.url} style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6 }}>{ln.label}</a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '3rem', opacity: 0.3 }}>Global Sync</h4>
           <div style={{ display: 'flex', gap: '1.5rem' }}>
              {(footerCfg.social_links || []).map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit', transition: 'all 0.4s' }} onMouseOver={e => { e.currentTarget.style.background = 'var(--primary-color)'; e.currentTarget.style.transform = 'scale(1.2) rotate(12deg)'; }} onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'none'; }}>
                   <SocialIcon type={social.icon} size={24} />
                </a>
              ))}
           </div>
        </div>

        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '3rem', opacity: 0.3 }}>Venue Signal</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontSize: '1.1rem' }}>
              {contact.phone && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><Mic size={18} color="var(--primary-color)" /> <b>{contact.phone}</b></div>}
              {contact.whatsapp && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><MessageCircle size={18} color="var(--secondary-color)" /> <b>{contact.whatsapp}</b></div>}
              {contact.email && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><Mail size={18} style={{ opacity: 0.4 }} /> <b>{contact.email}</b></div>}
              {contact.service_hours && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', opacity: 0.3 }}><Timer size={18} /> <span>{contact.service_hours}</span></div>}
              
              {footerCfg.location_embed_link && (
                <div style={{ width: '100%', height: '180px', borderRadius: '2.5rem', overflow: 'hidden', marginTop: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', filter: 'grayscale(1) invert(1) brightness(0.6)' }}>
                   <iframe src={footerCfg.location_embed_link.includes('<iframe') ? footerCfg.location_embed_link.match(/src="([^"]+)"/)?.[1] : footerCfg.location_embed_link} width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>
                </div>
              )}
           </div>
        </div>
      </div>
      <div style={{ maxWidth: '1600px', margin: '8rem auto 0', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem', opacity: 0.2, textAlign: 'center', fontStyle: 'italic', letterSpacing: '0.4em' }}>
         © {new Date().getFullYear()} {siteName.toUpperCase()} / SYNC_SOVEREIGN_EVENTS.
      </div>
    </footer>
  );
}
