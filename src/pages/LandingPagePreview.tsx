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

  const renderBlock = (block: any) => {
    switch (block.type) {
      case 'hero':
        return <HeroSection key="hero" content={getPageContent('home')} />;
      case 'contact':
        return <ContactSection key="contact" content={getPageContent('contact')} />;
      case 'profile':
        return <AboutSection key="profile" content={getPageContent('profile')} />;
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
