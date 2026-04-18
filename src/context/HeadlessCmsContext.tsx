// File: src/context/HeadlessCmsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// ==========================================
// Tipe Data (Memudahkan Migrasi ke Relasional/MySQL)
// ==========================================

export interface Settings {
  tenant_id: number;
  site_name: string;
  active_template: 'minimalist' | 'corporate' | 'creative';
}

// Relasi tabel layout: merepresentasikan urutan blok yang aktif
export interface LayoutBlock {
  id: number;
  type: string;
  order: number;
}

// Relasi tabel pages: menyimpan konten halaman (content disimpan format JSON nantinya di MySQL)
export interface PageData {
  id: number;
  type: string;
  content: Record<string, any>; // Fleksibel untuk JSON
}

// Relasi tabel posts: menyimpan artikel standar
export interface PostData {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  status: 'published' | 'draft';
}

interface HeadlessCmsContextType {
  settings: Settings;
  layout: LayoutBlock[];
  pages: PageData[];
  posts: PostData[];
  
  // Actions
  updateSettings: (newSettings: Partial<Settings>) => void;
  reorderLayout: (newLayout: LayoutBlock[]) => void;
  updatePage: (id: number, newContent: Record<string, any>) => void;
}

const HeadlessCmsContext = createContext<HeadlessCmsContextType | undefined>(undefined);

// ==========================================
// Initial Dummy Data
// ==========================================

const initialSettings: Settings = {
  tenant_id: 1,
  site_name: "Web Saya",
  active_template: "minimalist"
};

const initialLayout: LayoutBlock[] = [
  { id: 1, type: "hero", order: 1 },
  { id: 2, type: "about", order: 2 }
];

const initialPages: PageData[] = [
  { 
    id: 101, 
    type: "home", 
    content: { 
      headline: "Selamat Datang", 
      sub: "Kami siap membantu", 
      image: "url" 
    } 
  },
  { 
    id: 102, 
    type: "contact", 
    content: { 
      email: "a@b.com", 
      phone: "123" 
    } 
  }
];

const initialPosts: PostData[] = [
  {
    id: 1,
    title: "Peluncuran Fitur Baru",
    excerpt: "Kami baru saja meluncurkan fitur...",
    content: "<p>Kami baru saja meluncurkan fitur Headless Build...</p>",
    status: "published"
  }
];

export function HeadlessCmsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [layout, setLayout] = useState<LayoutBlock[]>(initialLayout);
  const [pages, setPages] = useState<PageData[]>(initialPages);
  const [posts, setPosts] = useState<PostData[]>(initialPosts);

  // 1. Update Settings
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // 2. Mengubah Urutan Layout
  const reorderLayout = (newLayout: LayoutBlock[]) => {
    // Memastikan data di-urutkan berdasarkan properti "order" sebelum disimpan
    const sortedLayout = [...newLayout].sort((a, b) => a.order - b.order);
    setLayout(sortedLayout);
  };

  // 3. Update Page Content
  const updatePage = (id: number, newContent: Record<string, any>) => {
    setPages(prevPages => 
      prevPages.map(page => 
        page.id === id 
          ? { ...page, content: { ...page.content, ...newContent } } 
          : page
      )
    );
  };

  return (
    <HeadlessCmsContext.Provider value={{
      settings,
      layout,
      pages,
      posts,
      updateSettings,
      reorderLayout,
      updatePage
    }}>
      {children}
    </HeadlessCmsContext.Provider>
  );
}

export function useHeadlessCms() {
  const context = useContext(HeadlessCmsContext);
  if (context === undefined) {
    throw new Error('useHeadlessCms must be used within a HeadlessCmsProvider');
  }
  return context;
}
