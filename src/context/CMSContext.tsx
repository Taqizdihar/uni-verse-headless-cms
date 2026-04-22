import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PageItem {
  id: number;
  title: string;
  slug?: string;
  page_type?: string;
  content?: any;
  author?: string;
  date?: string;
  status?: string;
}

export interface PostItem {
  id: number;
  title: string;
  slug?: string;
  content?: any;
  excerpt?: string;
  category?: string;
  author?: string;
  date?: string;
  status?: string;
}

export interface ActivityItem {
  id: number;
  tenant: string;
  action: string;
  date: string;
  status: 'Success' | 'Error';
}

export interface MediaItem {
  id: number;
  url: string;
  name?: string;
  filename?: string;
  file_type?: string;
  file_size?: number;
  date?: string;
}

export interface CommentItem {
  id: number;
  authorName: string;
  authorEmail: string;
  content: string;
  postTitle: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Spam';
}

export interface LayoutBlock {
  id?: number;
  title?: string;
  type: string;
  order?: number;
}

export interface UserItem {
  user_id?: number;
  id?: number;
  name: string;
  email?: string;
  role: string;
  status?: 'Active' | 'Inactive';
  lastLogin?: string;
}

export interface PluginItem {
  id: number;
  name?: string;
  description?: string;
  iconName?: string;
  is_active?: boolean;
}

export interface Settings {
  siteName?: string;
  tagline?: string;
  supportEmail?: string;
  site_name?: string;
  [key: string]: any;
}

interface CMSContextType {
  pages: PageItem[];
  posts: PostItem[];
  media: MediaItem[];
  comments: CommentItem[];
  layoutBlocks: LayoutBlock[];
  users: UserItem[];
  plugins: PluginItem[];
  settings: Settings;
  activities: ActivityItem[];
  totalUsers: number;
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (u: any) => void;
  setToken: (t: string | null) => void;
  setPages: (p: PageItem[]) => void;
  setPosts: (p: PostItem[]) => void;
  setMedia: (m: MediaItem[]) => void;
  fetchAllData: () => Promise<void>;
  
  savePage: (pageData: any) => Promise<void>;
  deletePage: (id: number) => Promise<void>;
  
  savePost: (postData: any) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
  
  addMedia: (item: any) => Promise<void>;
  deleteMedia: (id: number) => Promise<void>;
  
  updateLayout: (layoutArray: any[]) => Promise<void>;
  updateSettings: (newSettings: Settings) => Promise<void>;
  
  addUser: (user: any) => Promise<void>;
  deleteUser: (user_id: number) => Promise<void>;
  
  togglePluginStatus: (id: number, currentStatus: boolean) => Promise<void>;
  
  addActivity: (activity: Omit<ActivityItem, 'id' | 'date'>) => void;
  // Comment operations kept local for now as not explicitly requested for backend integration yet
  approveComment: (id: number) => void;
  markCommentAsSpam: (id: number) => void;
  deleteComment: (id: number) => void;
  togglePageStatus: (id: number, currentStatus: string) => Promise<void>;
  togglePostStatus: (id: number, currentStatus: string) => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [layoutBlocks, setLayoutBlocks] = useState<LayoutBlock[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [plugins, setPlugins] = useState<PluginItem[]>([]);
  const [settings, setSettings] = useState<Settings>({});
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  // Helper for headers
  const getHeaders = () => {
     const t = token || localStorage.getItem('token');
     return {
        'Content-Type': 'application/json',
        ...(t ? { 'Authorization': `Bearer ${t}` } : {})
     };
  };

  // Internal fetcher to avoid repeating fetch calls
  const fetchAllData = async () => {
    try {
      const headers = getHeaders();
      const options = { headers };
      const responses = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/settings`, options),
        fetch(`${import.meta.env.VITE_API_URL}/api/pages`, options),
        fetch(`${import.meta.env.VITE_API_URL}/api/layout`, options),
        fetch(`${import.meta.env.VITE_API_URL}/api/posts`, options),
        fetch(`${import.meta.env.VITE_API_URL}/api/media`, options),
        fetch(`${import.meta.env.VITE_API_URL}/api/users`, options),
        fetch(`${import.meta.env.VITE_API_URL}/api/plugins`, options),
        fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/stats`, options)
      ]);

      const [settingsRes, pagesRes, layoutRes, postsRes, mediaRes, usersRes, pluginsRes, dashboardRes] = await Promise.all(
        responses.map(res => res.ok ? res.json() : null)
      );
      
      if (settingsRes && !settingsRes.error) setSettings(settingsRes);
      if (Array.isArray(pagesRes)) setPages(pagesRes);
      
      if (layoutRes && layoutRes.blocks_order) {
          let blocks = layoutRes.blocks_order;
          if (typeof blocks === 'string') {
             try { blocks = JSON.parse(blocks); } catch(e) {}
          }
          setLayoutBlocks(Array.isArray(blocks) ? blocks : []);
      } else {
          setLayoutBlocks([]);
      }
      
      if (Array.isArray(postsRes)) setPosts(postsRes);
      if (Array.isArray(mediaRes)) setMedia(mediaRes);
      if (Array.isArray(usersRes)) setUsers(usersRes);
      if (Array.isArray(pluginsRes)) setPlugins(pluginsRes);
      if (dashboardRes && dashboardRes.totalUsers !== undefined) setTotalUsers(dashboardRes.totalUsers);
      
    } catch (err) {
      console.error('Error fetching CMS data from backend:', err);
    }
  };

  useEffect(() => {
    if (token || localStorage.getItem('token')) {
       fetchAllData();
    }
  }, [token]);

  // API Call abstractions
  const savePage = async (pageData: any) => {
    try {
      const isUpdate = !!pageData.id;
      const url = isUpdate ? `${import.meta.env.VITE_API_URL}/api/pages/${pageData.id}` : `${import.meta.env.VITE_API_URL}/api/pages`;
      const method = isUpdate ? 'PUT' : 'POST';

      const resp = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(pageData)
      });
      if (resp.ok) {
         await fetchAllData();
         addActivity({ tenant: "Admin", action: `Saved page: ${pageData.title}`, status: "Success" });
      }
    } catch(err) {
      console.error('Error saving page:', err);
    }
  };

  const deletePage = async (id: number) => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/pages/${id}`, { method: 'DELETE', headers: getHeaders() });
      if (resp.ok) {
         await fetchAllData();
         addActivity({ tenant: "Admin", action: `Deleted page ID: ${id}`, status: "Success" });
      }
    } catch(err) { console.error(err); }
  };

  const savePost = async (postData: any) => {
    try {
      const isUpdate = !!postData.id;
      const url = isUpdate ? `${import.meta.env.VITE_API_URL}/api/posts/${postData.id}` : `${import.meta.env.VITE_API_URL}/api/posts`;
      const method = isUpdate ? 'PUT' : 'POST';

      const resp = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(postData)
      });
      if (resp.ok) {
         await fetchAllData();
         addActivity({ tenant: "Admin", action: `Saved post: ${postData.title}`, status: "Success" });
      }
    } catch(err) {
      console.error('Error saving post:', err);
    }
  };

  const deletePost = async (id: number) => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${id}`, { method: 'DELETE', headers: getHeaders() });
      if (resp.ok) {
         await fetchAllData();
         addActivity({ tenant: "Admin", action: `Deleted post ID: ${id}`, status: "Success" });
      }
    } catch(err) { console.error(err); }
  };

  const updateLayout = async (newLayoutArray: any[]) => {
    try {
      setLayoutBlocks(newLayoutArray); // optimistic
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/layout`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ blocks_order: newLayoutArray })
      });
      if (resp.ok) {
         addActivity({ tenant: "Admin", action: `Updated layout structure`, status: "Success" });
      }
    } catch(err) {
      console.error('Error updating layout:', err);
    }
  };

  const updateSettings = async (newSettings: Settings) => {
    try {
      setSettings(newSettings); // optimistic
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(newSettings)
      });
      if (resp.ok) {
         addActivity({ tenant: "Admin", action: `Updated global settings`, status: "Success" });
      }
    } catch(err) {
      console.error('Error updating settings:', err);
    }
  };

  const addMedia = async (data: any) => {
    try {
      const isFormData = data instanceof FormData;
      const headers = getHeaders();
      if (isFormData) {
          delete (headers as any)['Content-Type'];
      }

      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/media`, {
        method: 'POST',
        headers: headers as any,
        body: isFormData ? data : JSON.stringify(data)
      });
      if (resp.ok) {
        await fetchAllData();
        addActivity({ tenant: "Admin", action: `Uploaded new media resource`, status: "Success" });
      }
    } catch(err) { console.error('Media upload failure:', err); }
  };

  const deleteMedia = async (id: number) => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/media/${id}`, { method: 'DELETE', headers: getHeaders() });
      if (resp.ok) {
         await fetchAllData();
         addActivity({ tenant: "Admin", action: `Deleted media ID: ${id}`, status: "Success" });
      }
    } catch(err) { console.error(err); }
  };

  const addUser = async (user: any) => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(user)
      });
      if (resp.ok) {
         await fetchAllData();
         addActivity({ tenant: "Admin", action: `Added user to tenant`, status: "Success" });
      }
    } catch(err) { console.error(err); }
  };

  const deleteUser = async (user_id: number) => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user_id}`, { method: 'DELETE', headers: getHeaders() });
      if (resp.ok) {
         await fetchAllData();
         addActivity({ tenant: "Admin", action: `Removed user relation ID: ${user_id}`, status: "Success" });
      }
    } catch(err) { console.error(err); }
  };

  const togglePluginStatus = async (id: number, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/plugins/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ is_active: newStatus ? 1 : 0 })
      });
      if (resp.ok) {
         await fetchAllData();
         addActivity({ tenant: "Admin", action: `Toggled plugin ID: ${id}`, status: "Success" });
      }
    } catch(err) { console.error(err); }
  };

  const togglePageStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
    const oldPages = [...pages];
    
    // Optimistic update
    setPages(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/pages/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!resp.ok) {
        const text = await resp.text();
        let errorMessage = 'Failed to update status';
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.error('[CRITICAL] Server returned non-JSON response:', text);
          errorMessage = `Server Error (HTML returned). Check console.`;
        }
        throw new Error(errorMessage);
      }
      
      addActivity({ tenant: "Admin", action: `Toggled page status to ${newStatus}`, status: "Success" });
    } catch (err) {
      console.error('Error toggling page status:', err);
      // Revert on error
      setPages(oldPages);
      alert(`Gagal memperbarui status halaman: ${err.message}`);
    }
  };

  const togglePostStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
    const oldPosts = [...posts];
    
    // Optimistic update
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    
    try {
      console.log(`[DEBUG] Toggling Post ${id} to ${newStatus}`);
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!resp.ok) {
        const text = await resp.text();
        console.warn(`[DEBUG] HTTP Error ${resp.status}:`, text);
        
        let errorMessage = 'Failed to update status';
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.error('[CRITICAL] Server returned non-JSON response during Toggle:', text);
          errorMessage = `JSON Parse Error: Server returned HTML. Check developer console for details.`;
        }
        throw new Error(errorMessage);
      }
      
      addActivity({ tenant: "Admin", action: `Toggled post status to ${newStatus}`, status: "Success" });
    } catch (err: any) {
      console.error('Error toggling post status:', err);
      // Revert on error
      setPosts(oldPosts);
      alert(`Gagal memperbarui status post: ${err.message}`);
    }
  };

  const addActivity = (activity: Omit<ActivityItem, 'id' | 'date'>) => {
    const newActivity: ActivityItem = {
      ...activity,
      id: Date.now(),
      date: "Just now"
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  // Local-only state mutators for non-connected features
  const approveComment = (id: number) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, status: 'Approved' } : c));
  };
  const markCommentAsSpam = (id: number) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, status: 'Spam' } : c));
  };
  const deleteComment = (id: number) => {
    setComments(prev => prev.filter(c => c.id !== id));
  };

  const isAuthenticated = !!token || !!localStorage.getItem('token');

  return (
    <CMSContext.Provider value={{ 
      pages, posts, media, comments, layoutBlocks, users, plugins, settings, activities, totalUsers,
      user, token, isAuthenticated, setUser, setToken, 
      setPages, setPosts, setMedia,
      fetchAllData,
      savePage, deletePage, 
      savePost, deletePost, 
      addMedia, deleteMedia, 
      approveComment, markCommentAsSpam, deleteComment, 
      addUser, deleteUser,
      togglePluginStatus, updateSettings, updateLayout,
      togglePageStatus, togglePostStatus,
      addActivity 
    }}>
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}
