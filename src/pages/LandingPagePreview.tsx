import React from 'react';
import { useCMS } from '../context/CMSContext';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export function LandingPagePreview() {
  const { settings, layoutBlocks, pages } = useCMS();

  // Helper to get nested content safely
  const getPageContent = (pageType: string) => {
    const page = pages.find((p: any) => p.page_type === pageType);
    if (!page) return null;
    
    let content = page.content;
    if (typeof content === 'string') {
      try {
        content = JSON.parse(content);
      } catch (e) {
        console.error('Failed to parse page content', e);
        return null;
      }
    }
    return content;
  };

  // Theme Styles mapping
  const template = settings?.active_template || 'minimalist';
  const themeClasses = {
    minimalist: 'bg-white text-gray-900 font-sans',
    corporate: 'bg-slate-50 text-slate-900 font-serif',
    creative: 'bg-zinc-950 text-zinc-100 font-mono'
  }[template as keyof typeof themeClasses] || 'bg-white';

  const sectionClasses = {
    minimalist: 'py-20 px-6 max-w-5xl mx-auto',
    corporate: 'py-24 px-8 max-w-7xl mx-auto border-b border-slate-200 last:border-0',
    creative: 'py-32 px-10 border-b border-zinc-800 last:border-0'
  }[template as keyof typeof themeClasses];

  // Component Blocks
  const HeroSection = ({ content }: { content: any }) => {
    if (!content) return null;
    return (
      <section className={sectionClasses}>
        <div className={`flex flex-col ${template === 'corporate' ? 'items-center text-center' : ''}`}>
          {content.hero_image_url && (
            <img 
              src={content.hero_image_url} 
              alt="Hero" 
              className={`mb-8 object-cover shadow-2xl ${template === 'creative' ? 'rounded-none grayscale' : 'rounded-3xl'}`} 
              style={{ width: '100%', maxHeight: '500px' }}
            />
          )}
          <h1 className={`font-black mb-6 ${template === 'minimalist' ? 'text-6xl tracking-tight' : template === 'corporate' ? 'text-5xl text-blue-900' : 'text-7xl italic text-indigo-500 underline'}`}>
            {content.headline || 'Welcome to Our Universe'}
          </h1>
          <p className={`text-xl mb-10 max-w-2xl ${template === 'creative' ? 'text-zinc-400' : 'text-gray-600'}`}>
            {content.sub_headline || 'Building the future of headless commerce.'}
          </p>
          <button className={`flex items-center group ${template === 'minimalist' ? 'bg-black text-white px-8 py-4 rounded-full' : template === 'corporate' ? 'bg-blue-600 text-white px-6 py-3 rounded-lg' : 'border-2 border-indigo-500 text-indigo-500 px-10 py-4'}`}>
            Jelajahi <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    );
  };

  const ContactSection = ({ content }: { content: any }) => {
    if (!content) return null;
    return (
      <section className={sectionClasses}>
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 p-12 ${template === 'creative' ? 'bg-zinc-900 border border-zinc-800' : template === 'corporate' ? 'bg-blue-900 text-white rounded-2xl' : 'bg-gray-50 rounded-3xl'}`}>
          <div>
            <h2 className="text-3xl font-bold mb-4">Hubungi Kami</h2>
            <p className="opacity-70 mb-8">Kami siap membantu Anda meningkatkan kehadiran digital.</p>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="mr-4 text-indigo-400" />
                <span>{content.email || 'hello@headless.cms'}</span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-4 text-indigo-400" />
                <span>{content.phone_number || '+1 (555) 000-0000'}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-4 text-indigo-400" />
                <span>{content.address || '123 Cloud St, Serverless City'}</span>
              </div>
              {content.maps_link && (
                <div className="mt-4">
                  <a href={content.maps_link} target="_blank" rel="noreferrer" className="text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 underline underline-offset-4">
                    Lihat di Google Maps →
                  </a>
                </div>
              )}
            </div>
          </div>
          <form className="space-y-4">
            <input type="text" placeholder="Nama Anda" className={`w-full p-4 border ${template === 'creative' ? 'bg-black border-zinc-700' : 'bg-white border-gray-200'} rounded-xl outline-none focus:ring-2 focus:ring-indigo-500`} />
            <textarea placeholder="Pesan" rows={4} className={`w-full p-4 border ${template === 'creative' ? 'bg-black border-zinc-700' : 'bg-white border-gray-200'} rounded-xl outline-none focus:ring-2 focus:ring-indigo-500`}></textarea>
            <button className="w-full bg-indigo-500 text-white p-4 rounded-xl font-bold hover:bg-indigo-600 transition-colors">Kirim Pesan</button>
          </form>
        </div>
      </section>
    );
  };

  const AboutSection = ({ content }: { content: any }) => {
    if (!content) return null;
    return (
      <section className={sectionClasses}>
        <div className="max-w-3xl">
          <span className="text-indigo-500 font-bold tracking-widest uppercase mb-4 block">Kisah Kami</span>
          <h2 className={`text-4xl font-black mb-8 ${template === 'corporate' ? 'text-blue-900' : ''}`}>Di Balik Desain</h2>
          <div className={`text-xl leading-relaxed whitespace-pre-wrap ${template === 'creative' ? 'text-zinc-400 border-l-4 border-indigo-500 pl-8' : 'text-gray-600 italic font-serif'}`}>
            {content.about_us || content.about_company || 'Creating seamless digital experiences for a connected world.'}
          </div>
        </div>
      </section>
    );
  };

  const renderBlock = (block: any, idx: number) => {
    const d = block.data || {};
    switch (block.type) {
      case 'hero':
        return <HeroSection key={`hero-${idx}`} content={getPageContent('home')} />;
      case 'contact':
        return <ContactSection key={`contact-${idx}`} content={getPageContent('contact')} />;
      case 'profile':
        return <AboutSection key={`profile-${idx}`} content={getPageContent('profile')} />;

      case 'contacts':
        return (
          <section key={`contacts-${idx}`} className={sectionClasses}>
            <h2 className="text-3xl font-bold mb-6">{d.title || 'Contact Us'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(d.phone_numbers || []).length > 0 && (
                <div><Phone className="w-5 h-5 mb-2 text-indigo-500" /><p className="font-bold text-xs uppercase text-gray-400 mb-1">Phone</p>{d.phone_numbers.map((p: string, i: number) => <p key={i} className="text-sm">{p}</p>)}</div>
              )}
              {(d.emails || []).length > 0 && (
                <div><Mail className="w-5 h-5 mb-2 text-indigo-500" /><p className="font-bold text-xs uppercase text-gray-400 mb-1">Email</p>{d.emails.map((e: string, i: number) => <p key={i} className="text-sm">{e}</p>)}</div>
              )}
              {(d.addresses || []).length > 0 && (
                <div><MapPin className="w-5 h-5 mb-2 text-indigo-500" /><p className="font-bold text-xs uppercase text-gray-400 mb-1">Address</p>{d.addresses.map((a: string, i: number) => <p key={i} className="text-sm">{a}</p>)}</div>
              )}
            </div>
            {d.working_hours && <p className="mt-4 text-sm text-gray-500">🕒 {d.working_hours}</p>}
          </section>
        );

      case 'features':
        return (
          <section key={`features-${idx}`} className={sectionClasses}>
            <h2 className="text-3xl font-bold mb-2">{d.title || 'Features'}</h2>
            {d.subtitle && <p className="text-gray-500 mb-8">{d.subtitle}</p>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(d.items || []).map((item: any, i: number) => (
                <div key={i} className="p-6 rounded-2xl border border-gray-200 text-center">
                  {item.icon_url && <img src={item.icon_url} alt="" className="w-12 h-12 mx-auto mb-4 object-contain" />}
                  <h3 className="font-bold mb-2">{item.title || 'Feature'}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case 'faq':
        return (
          <section key={`faq-${idx}`} className={sectionClasses}>
            <h2 className="text-3xl font-bold mb-2">{d.title || 'FAQ'}</h2>
            {d.subtitle && <p className="text-gray-500 mb-8">{d.subtitle}</p>}
            <div className="space-y-4 max-w-3xl">
              {(d.items || []).map((item: any, i: number) => (
                <div key={i} className="p-5 rounded-xl border border-gray-200">
                  <h4 className="font-bold mb-2">{item.question || 'Question'}</h4>
                  <p className="text-sm text-gray-500">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case 'testimonials':
        return (
          <section key={`testimonials-${idx}`} className={sectionClasses}>
            <h2 className="text-3xl font-bold mb-8">{d.title || 'Testimonials'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(d.items || []).map((item: any, i: number) => (
                <div key={i} className="p-6 rounded-2xl border border-gray-200">
                  <p className="text-sm italic text-gray-600 mb-4">"{item.content}"</p>
                  <div className="flex items-center gap-3">
                    {item.author_image && <img src={item.author_image} alt="" className="w-10 h-10 rounded-full object-cover" />}
                    <div>
                      <p className="font-bold text-sm">{item.author_name}</p>
                      <p className="text-xs text-gray-400">{item.author_role}</p>
                    </div>
                    {item.rating && <span className="ml-auto text-amber-500 text-sm">{'★'.repeat(item.rating)}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'partners':
        return (
          <section key={`partners-${idx}`} className={sectionClasses}>
            <h2 className="text-3xl font-bold mb-8 text-center">{d.title || 'Our Partners'}</h2>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {(d.logos || []).map((logo: any, i: number) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  {logo.logo_url ? <img src={logo.logo_url} alt={logo.partner_name || ''} className="h-16 object-contain" /> : <div className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">Logo</div>}
                  {logo.partner_name && <span className="text-xs font-bold text-gray-500">{logo.partner_name}</span>}
                </div>
              ))}
            </div>
          </section>
        );

      case 'team':
        return (
          <section key={`team-${idx}`} className={sectionClasses}>
            <h2 className="text-3xl font-bold mb-2">{d.title || 'Our Team'}</h2>
            {d.subtitle && <p className="text-gray-500 mb-8">{d.subtitle}</p>}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {(d.members || []).map((m: any, i: number) => (
                <div key={i} className="text-center">
                  {m.photo_url ? <img src={m.photo_url} alt={m.name || ''} className="w-24 h-24 rounded-full object-cover mx-auto mb-3" /> : <div className="w-24 h-24 rounded-full bg-gray-100 mx-auto mb-3" />}
                  <p className="font-bold text-sm">{m.name || 'Name'}</p>
                  <p className="text-xs text-gray-400">{m.role}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case 'gallery':
        return (
          <section key={`gallery-${idx}`} className={sectionClasses}>
            <h2 className="text-3xl font-bold mb-2">{d.title || 'Gallery'}</h2>
            {d.subtitle && <p className="text-gray-500 mb-8">{d.subtitle}</p>}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(d.images || []).map((img: any, i: number) => (
                <div key={i} className="rounded-xl overflow-hidden">
                  {img.url ? <img src={img.url} alt={img.alt_text || ''} className="w-full aspect-square object-cover" /> : <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-300">No image</div>}
                  {img.caption && <p className="text-xs text-gray-500 mt-2 text-center">{img.caption}</p>}
                </div>
              ))}
            </div>
          </section>
        );

      case 'cta-banner':
        return (
          <section key={`cta-${idx}`} className="relative py-20 px-6 text-center overflow-hidden" style={{ backgroundColor: d.background_color || '#000' }}>
            {d.background_image_url && <img src={d.background_image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />}
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl font-black text-white mb-4">{d.headline || 'Ready to Start?'}</h2>
              {d.sub_headline && <p className="text-white/70 mb-8">{d.sub_headline}</p>}
              {d.button_text && (
                <a href={d.button_link || '#'} className="inline-block bg-white text-black px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity">{d.button_text}</a>
              )}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 ${themeClasses}`}>
      {/* Dynamic Navigation Bar based on settings */}
      <nav className={`py-6 px-10 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md ${template === 'creative' ? 'bg-zinc-950/80 border-b border-zinc-800' : 'bg-white/80 border-b border-gray-100'}`}>
        <div className={`text-2xl font-black tracking-tighter ${template === 'corporate' ? 'text-blue-700' : ''}`}>
          {settings?.site_name || 'UNI-INSIDE'}
        </div>
        <div className="space-x-8 font-medium">
          <a href="#" className="hover:text-indigo-500 transition-colors">Profil</a>
          <a href="#" className="hover:text-indigo-500 transition-colors">Katalog</a>
          <a href="#" className="hover:text-indigo-500 transition-colors">Hubungi</a>
        </div>
      </nav>

      <main>
        {layoutBlocks && layoutBlocks.length > 0 ? (
          layoutBlocks.map(renderBlock)
        ) : (
          <div className="flex items-center justify-center h-[60vh] text-center p-20">
            <div>
              <h2 className="text-4xl font-bold mb-4 opacity-20">Belum Ada Konten</h2>
              <p className="text-gray-400">Harap konfigurasi matriks struktural di Pengatur Tata Letak.</p>
            </div>
          </div>
        )}
      </main>

      {/* Dynamic Footer */}
      <footer className={`py-20 px-10 text-center ${template === 'creative' ? 'bg-zinc-900' : 'bg-gray-50'}`}>
        <p className="opacity-50">
          &copy; {new Date().getFullYear()} {settings?.site_name || 'Uni-Inside CMS'}. Semua hak dilindungi.
        </p>
      </footer>
    </div>
  );
}
