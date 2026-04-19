// src/pages/PublicView.tsx
// Template Routing Engine — resolves a slug to the correct template + data
import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL}`;

class ErrorBoundary extends React.Component<{ fallback: React.ReactNode, children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("Template rendering error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const TemplateRegistry: Record<string, React.LazyExoticComponent<any>> = {
  minimalist: React.lazy(() => import('../templates/minimalist/MinimalistTemplate')),
  corporate: React.lazy(() => import('../templates/corporate/CorporateTemplate')),
  creative: React.lazy(() => import('../templates/creative/CreativeTemplate')),
  portfolio: React.lazy(() => import('../templates/PortfolioTemplate')),
  blog: React.lazy(() => import('../templates/BlogTemplate')),
  newssimple: React.lazy(() => import('../templates/NewsSimpleTemplate')),
  gov: React.lazy(() => import('../templates/GovTemplate')),
  legal: React.lazy(() => import('../templates/LegalTemplate')),
  medical: React.lazy(() => import('../templates/MedicalTemplate')),
  photo: React.lazy(() => import('../templates/PhotoTemplate')),
  realestate: React.lazy(() => import('../templates/RealEstateTemplate')),
  resto: React.lazy(() => import('../templates/RestoTemplate')),
  saas: React.lazy(() => import('../templates/SaaSTemplate')),
  fintech: React.lazy(() => import('../templates/FintechTemplate')),
  industrial: React.lazy(() => import('../templates/IndustrialTemplate')),
  event: React.lazy(() => import('../templates/EventTemplate')),
  ngo: React.lazy(() => import('../templates/NGOTemplate')),
  edu: React.lazy(() => import('../templates/EduTemplate')),
  architect: React.lazy(() => import('../templates/ArchitectTemplate')),
  vlog: React.lazy(() => import('../templates/VlogTemplate')),
  beauty: React.lazy(() => import('../templates/BeautyTemplate')),
  travel: React.lazy(() => import('../templates/TravelTemplate')),
  retro: React.lazy(() => import('../templates/RetroTemplate')),
  brutalist: React.lazy(() => import('../templates/BrutalistTemplate')),
  glass: React.lazy(() => import('../templates/GlassTemplate')),
  cyber: React.lazy(() => import('../templates/CyberTemplate'))
};

interface BrandingPalette {
  name: string;
  primary: string;
  secondary: string;
  surface: string;
  text: string;
}

export function PublicView() {
  const { subdomain, slug } = useParams<{ subdomain: string; slug: string }>();
  const [pageData, setPageData] = useState<any>(null);
  const [postData, setPostData] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [navPages, setNavPages] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [themeColor, setThemeColor] = useState('#fbbf24');
  const [palette, setPalette] = useState<BrandingPalette>({
    name: "Uni-Inside's Color",
    primary: '#FBBF24',
    secondary: '#18181B',
    surface: '#FFFFFF',
    text: '#27272A',
  });

  // Inject CSS variables for the full branding palette
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', palette.primary);
    root.style.setProperty('--secondary-color', palette.secondary);
    root.style.setProperty('--bg-color', palette.surface);
    root.style.setProperty('--text-color', palette.text);
  }, [palette]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setNotFound(false);

      // Normalize the slug: strip leading/trailing slashes
      const cleanSlug = (slug || '').replace(/^\/+|\/+$/g, '').trim();
      console.log('[PublicView] Fetching data for slug:', cleanSlug);

      try {
        // Build URL with absolute isolation: site/:subdomain/:slug
        const fetchUrl = slug 
          ? `${BASE_URL}/api/public/site/${encodeURIComponent(subdomain || '')}/${encodeURIComponent(slug)}`
          : `${BASE_URL}/api/public/site/${encodeURIComponent(subdomain || '')}/home`;

        const res = await fetch(fetchUrl);
        
        console.log('[PublicView] Response status:', res.status);

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          console.warn('[PublicView] Backend returned error:', errData);
          setNotFound(true);
          setLoading(false);
          return;
        }

        const data = await res.json();
        console.log('[PublicView] Backend Response:', data);

        // Extract settings + theme + navbar data
        setSettings(data.settings);
        setNavPages(data.navPages || []);
        const globalOptions = data.settings?.global_options || {};
        
        // Extract branding palette (with fallback to legacy theme_color)
        const savedPalette = globalOptions.branding_palette;
        if (savedPalette) {
          setPalette(savedPalette);
          setThemeColor(savedPalette.primary);
        } else {
          const color = globalOptions.theme_color || '#fbbf24';
          setThemeColor(color);
          setPalette(prev => ({ ...prev, primary: color }));
        }

        const sanitizeImages = (item: any) => {
            if (!item || !item.content) return;
            if (typeof item.content === 'string') {
                try { item.content = JSON.parse(item.content); } catch (e) { return; }
            }
            const contentObj = item.content;
            if (!contentObj) return;

            // Use BASE_URL (env-aware) instead of hardcoded localhost
            const toAbsolute = (url: string) =>
              url && url.startsWith('/uploads') ? `${BASE_URL}${url}` : url;

            if (contentObj.hero_image)     contentObj.hero_image     = toAbsolute(contentObj.hero_image);
            if (contentObj.featured_image) contentObj.featured_image = toAbsolute(contentObj.featured_image);
            if (contentObj.profile_image)  contentObj.profile_image  = toAbsolute(contentObj.profile_image);
            if (contentObj.logo_image)     contentObj.logo_image     = toAbsolute(contentObj.logo_image);
            if (Array.isArray(contentObj.images)) {
                contentObj.images = contentObj.images.map((img: string) => toAbsolute(img));
            }
            if (Array.isArray(contentObj.gallery)) {
                contentObj.gallery = contentObj.gallery.map((img: string) => toAbsolute(img));
            }
        };

        if (data.type === 'page') {
          // Ensure content is always a plain object, never a raw string
          if (data.page && typeof data.page.content === 'string') {
            try { data.page.content = JSON.parse(data.page.content); } catch(e) { data.page.content = {}; }
          }
          if (data.page && !data.page.content) data.page.content = {};

          sanitizeImages(data.page);
          setPageData(data.page);
          setPostData(null);

          if (data.page.page_type === 'news') {
            try {
              // ✅ Scope posts fetch to the correct tenant to prevent data leakage
              const tenantId = data.page.tenant_id;
              const postsUrl = tenantId
                ? `${BASE_URL}/api/public/posts?tenant_id=${tenantId}`
                : `${BASE_URL}/api/public/posts`;
              const postsRes = await fetch(postsUrl);
              if (postsRes.ok) {
                const postsData = await postsRes.json();
                postsData.forEach((p: any) => sanitizeImages(p));
                setPosts(postsData);
              }
            } catch (err) {
              console.error('[PublicView] Failed to fetch posts:', err);
            }
          }
        } else if (data.type === 'post') {
          // Ensure post content is always a plain object
          if (data.page && typeof data.page.content === 'string') {
            try { data.page.content = JSON.parse(data.page.content); } catch(e) { data.page.content = {}; }
          }
          if (data.page && !data.page.content) data.page.content = {};

          sanitizeImages(data.page);
          setPostData(data.page);
          setPageData({ page_type: 'post' });
        } else {
          console.warn('[PublicView] Unknown content type:', data.type);
          setNotFound(true);
        }
      } catch (e) {
        console.error('[PublicView] Fetch failed:', e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (subdomain) load();
  }, [subdomain, slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui', background: '#09090b', color: '#fafafa' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid #fbbf24', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ marginTop: '1.5rem', color: '#71717a', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Resolving…</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui', background: '#09090b', color: '#fafafa', textAlign: 'center', padding: '2rem' }}>
        <p style={{ fontSize: '5rem', fontWeight: 900, letterSpacing: '-0.05em', margin: 0, color: '#27272a' }}>404</p>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.5rem 0', color: '#fafafa' }}>Page Not Found Magic</h1>
        <p style={{ color: '#71717a', marginBottom: '2rem' }}>No content matches the slug <code style={{ color: '#fbbf24' }}>/{slug}</code>.</p>
        <a href="/" style={{ padding: '0.75rem 2rem', background: '#fbbf24', color: '#09090b', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>← Go Home</a>
      </div>
    );
  }

  // Determine active template with safe fallback
  const activeTemplate = (settings?.active_template || 'minimalist').toLowerCase().trim();

  // ── Task 2: Guarantee content is always a plain JS object ──────────────────
  const safePageData = pageData
    ? {
        ...pageData,
        content: typeof pageData.content === 'string'
          ? (() => { try { return JSON.parse(pageData.content); } catch { return {}; } })()
          : (pageData.content || {}),
      }
    : null;

  const safePostData = postData
    ? {
        ...postData,
        content: typeof postData.content === 'string'
          ? (() => { try { return JSON.parse(postData.content); } catch { return {}; } })()
          : (postData.content || {}),
      }
    : null;

  const sharedProps = {
    pageData: safePageData,
    postData: safePostData,
    settings,
    navPages,
    posts,
    palette,
    themeColor,
    currentSlug: slug || 'home',
    subdomain, // Pass subdomain so templates can build correct internal links
  };

  console.log('[PublicView] Rendering template:', activeTemplate, '| palette:', palette);

  const SelectedTemplate = TemplateRegistry[activeTemplate] || TemplateRegistry['minimalist'];

  const TemplateFallback = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-color)] text-[var(--text-main)] p-8 text-center" style={{ fontFamily: 'system-ui' }}>
      <div className="bg-red-50 text-red-500 p-6 rounded-lg border border-red-200">
        <h2 className="text-2xl font-bold mb-2">Templat Tidak Tersedia</h2>
        <p className="opacity-80">Terjadi kesalahan teknis saat memuat templat ini.</p>
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={<TemplateFallback />}>
      <Suspense fallback={
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui', background: palette.surface, color: palette.text }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: `3px solid ${palette.primary}`, borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        </div>
      }>
        <div 
          className="content-root"
          style={{
            '--primary-color': palette.primary,
            '--secondary-color': palette.secondary,
            '--bg-color': palette.surface,
            '--text-color': palette.text,
            minHeight: '100vh',
            background: 'var(--bg-color)',
            color: 'var(--text-color)'
          } as React.CSSProperties}
        >
          <SelectedTemplate {...sharedProps} />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}
