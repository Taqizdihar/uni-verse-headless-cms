import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import universeLogo from '../assets/logo/UNI-VERSE Logo V3.png';
import { NotificationModal } from '../components/ui/NotificationModal';

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
  post_id: number;
  author_name: string;
  author_email: string;
  content: string;
  post_title: string;
  created_at: string;
  status: 'pending' | 'approved' | 'spam';
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
  activeTenantId: number | null;
  activeRole: string | null;
  isSwitchingWorkspace: boolean;
  isAvatarUploading: boolean;
  setUser: (u: any) => void;
  setToken: (t: string | null) => void;
  setPages: (p: PageItem[]) => void;
  setPosts: (p: PostItem[]) => void;
  setMedia: (m: MediaItem[]) => void;
  fetchAllData: () => Promise<void>;
  switchWorkspace: (tenantId: number, role: string) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  
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
  // Comment operations (backed by real API)
  approveComment: (id: number) => Promise<void>;
  markCommentAsSpam: (id: number) => Promise<void>;
  deleteComment: (id: number) => Promise<void>;
  fetchComments: () => Promise<void>;
  togglePageStatus: (id: number, currentStatus: string) => Promise<void>;
  togglePostStatus: (id: number, currentStatus: string) => Promise<void>;
  isLoading: boolean;
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
  const [totalInquiries, setTotalInquiries] = useState<number>(0);
  const [user, setUser] = useState<any>(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [activeTenantId, setActiveTenantId] = useState<number | null>(() => {
    const stored = localStorage.getItem('active_tenant_id');
    return stored ? parseInt(stored, 10) : null;
  });
  const [activeRole, setActiveRole] = useState<string | null>(() => {
    return localStorage.getItem('active_role') || null;
  });
  const [isSwitchingWorkspace, setIsSwitchingWorkspace] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [evictionNotification, setEvictionNotification] = useState<{tenantName: string} | null>(null);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);

  // Helper for headers
  const getHeaders = () => {
     const t = localStorage.getItem('token') || token;
     let tid = localStorage.getItem('active_tenant_id') || activeTenantId;
     
     // Fallback to user's primary tenant if missing
     if (!tid || tid === 'undefined' || tid === 'null') {
       const storedUser = localStorage.getItem('user');
       if (storedUser) {
         try {
           const parsedUser = JSON.parse(storedUser);
           tid = parsedUser.tenant_id;
         } catch (e) {}
       }
     }
     
     return {
        'Content-Type': 'application/json',
        ...(t && t !== 'undefined' && t !== 'null' ? { 'Authorization': `Bearer ${t}` } : {}),
        ...(tid && tid !== 'undefined' && tid !== 'null' ? { 'x-active-tenant': String(tid) } : {})
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
        fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/stats`, options),
        fetch(`${import.meta.env.VITE_API_URL}/api/comments`, options)
      ]);

      // Check for 403 Forbidden on any response
      // Super Admin bypass: don't redirect on 403 during impersonation
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const isSuperAdmin = currentUser.role === 'super_admin';
      const hasForbidden = responses.some(res => res.status === 403);
      if (hasForbidden && !isSuperAdmin) {
         console.warn('[CMSContext] 403 Forbidden detected. Clearing invalid tenant state and redirecting...');
         localStorage.removeItem('active_tenant_id');
         localStorage.removeItem('active_role');
         window.location.href = '/dashboard';
         return;
      }

      const [settingsRes, pagesRes, layoutRes, postsRes, mediaRes, usersRes, pluginsRes, dashboardRes, commentsRes] = await Promise.all(
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
      if (dashboardRes && dashboardRes.totalInquiries !== undefined) setTotalInquiries(dashboardRes.totalInquiries);
      if (Array.isArray(commentsRes)) setComments(commentsRes);
      
    } catch (err) {
      console.error('Error fetching CMS data from backend:', err);
    }
  };

  useEffect(() => {
    const initializeSession = async () => {

      const currentToken = token || localStorage.getItem('token');
      if (!currentToken) {
        setIsLoading(false);
        return;
      }

      // Task 4: Immediately inject token into Axios defaults BEFORE any API call.
      // This ensures all downstream requests (profile validation, workspace fetch,
      // data loading) carry the correct Authorization header from the first request.
      try {
        const { default: api } = await import('../lib/api');
        api.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
      } catch (e) {
        console.warn('[CMSContext] Failed to pre-inject Axios headers');
      }

      // Task 4: Validate token by calling /api/user/profile.
      // If the token is expired or invalid (401/403), clear session and stop.
      try {
        const profileRes = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
          headers: getHeaders()
        });

        if (!profileRes.ok) {
          if (profileRes.status === 401 || profileRes.status === 403) {
            // Token is invalid or expired — clear everything
            console.warn(`[CMSContext] Token validation failed (${profileRes.status}). Clearing session.`);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('active_tenant_id');
            localStorage.removeItem('active_role');
            try {
              const { default: api } = await import('../lib/api');
              delete api.defaults.headers.common['Authorization'];
            } catch (e) {}
            setToken(null);
            setUser(null);
            setIsLoading(false);
            return;
          } else {
            console.warn(`[CMSContext] Profile validation returned non-401 error: ${profileRes.status}`);
          }
        } else {
          // Token is valid — hydrate user from the authoritative profile response
          const profileData = await profileRes.json();
          const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
          // Merge profile fields with stored session fields (overwrite entirely)
          const hydratedUser = { 
            ...storedUser, 
            ...profileData,
            role: profileData.role || storedUser.role,
            tenant_id: profileData.tenant_id || storedUser.tenant_id
          };
          setUser(hydratedUser);
          localStorage.setItem('user', JSON.stringify(hydratedUser));
          
          if (profileData.role) {
             setActiveRole(profileData.role);
             localStorage.setItem('active_role', profileData.role);
          }
        }
      } catch (err) {
        console.error('[CMSContext] Token validation network error:', err);
        // On network error, keep the existing session (offline-friendly)
      }

      try {
        // Fetch full list of workspaces to verify tenant context
        const wsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/user/workspaces`, {
          headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        if (wsRes.ok) {
          const workspaces = await wsRes.json();
          const currentTenantId = activeTenantId || parseInt(localStorage.getItem('active_tenant_id') || '0', 10);
          
          // Verify if active_tenant_id exists and is active in the fetched list
          const isValid = workspaces.find((w: any) => w.tenant_id === currentTenantId && w.status === 'active');
          
          // Super Admin Immunity: skip workspace reset during impersonation
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          const isSuperAdmin = currentUser.role === 'super_admin';
          
          if (!isValid && workspaces.length > 0 && !isSuperAdmin) {
            // Task 2: Stale Tenant Cleansing
            localStorage.removeItem('active_tenant_id');
            // Fallback to primary admin workspace
            const primary = workspaces.find((w: any) => w.role === 'admin') || workspaces[0];
            setActiveTenantId(primary.tenant_id);
            setActiveRole(primary.role);
            localStorage.setItem('active_tenant_id', String(primary.tenant_id));
            localStorage.setItem('active_role', primary.role);
          }

          // Backfill primary_tenant_id if missing (for existing sessions before this update)
          if (!localStorage.getItem('primary_tenant_id')) {
            const adminWs = workspaces.find((w: any) => w.role === 'admin');
            if (adminWs) {
              localStorage.setItem('primary_tenant_id', String(adminWs.tenant_id));
            }
          }

           // Task 3: Eviction Notification Check (skip for super_admin)
           try {
             const currentUserObj = JSON.parse(localStorage.getItem('user') || '{}');
             if (currentUserObj.role !== 'super_admin') {
               const activeWorkspaces = workspaces.filter((w: any) => w.status === 'active');
               const lastKnownStr = localStorage.getItem('last_known_workspaces');
               if (lastKnownStr) {
                 const lastKnown = JSON.parse(lastKnownStr);
                 if (lastKnown.length > 0) {
                   const evicted = lastKnown.filter((old: any) => 
                     !activeWorkspaces.some((cur: any) => cur.tenant_id === old.tenant_id)
                   );
                   if (evicted.length > 0) {
                     // Just show the first one
                     setEvictionNotification({ tenantName: evicted[0].tenant_name });
                   }
                 }
               }
               localStorage.setItem('last_known_workspaces', JSON.stringify(activeWorkspaces));
             }
           } catch(e) {
             console.error('Eviction check error:', e);
           }
        }

        // Fetch the data after verifying the tenant context
        await fetchAllData();
      } catch (err) {
        console.error('Failed to verify workspaces or fetch data on init:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();

    // Task 2: Background Data Polling
    const pollInterval = setInterval(() => {
      const currentToken = token || localStorage.getItem('token');
      if (currentToken) {
        fetchAllData();
      }
    }, 60000);

    return () => clearInterval(pollInterval);
  }, [token, activeTenantId]);

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
         await fetchAllData();
         
         // Task 4: UI Refinement - Update user.site_name for immediate consistency
         if (newSettings.site_name) {
             setUser((prev: any) => {
                 if (prev) {
                     const updatedUser = { ...prev, site_name: newSettings.site_name };
                     localStorage.setItem('user', JSON.stringify(updatedUser));
                     return updatedUser;
                 }
                 return prev;
             });
         }

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

  // =============================================================
  // Global Avatar Upload (Synchronous Await — mirrors Media module)
  // =============================================================
  // No polling. The backend fully awaits CDN processing and returns
  // the finalized URL in a single request/response cycle.
  // =============================================================
  const uploadAvatar = async (file: File) => {
    setIsAvatarUploading(true);
    const currentToken = token || localStorage.getItem('token');

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          ...(activeTenantId ? { 'x-active-tenant': String(activeTenantId) } : {})
        },
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errData.error || 'Upload failed');
      }

      const data = await res.json();

      if (data.url) {
        // Backend has fully resolved the URL — update global user state
        const updatedUser = { ...user, profile_picture_url: data.url };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('[AVATAR] ✅ Avatar updated successfully:', data.url);
      }
    } catch (err) {
      console.error('[AVATAR] ❌ Upload error:', err);
    } finally {
      // ALWAYS clear loading state — prevents infinite spinner
      setIsAvatarUploading(false);
    }
  };


  // Backend-backed comment operations
  const fetchComments = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comments`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  const approveComment = async (id: number) => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/comments/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status: 'approved' })
      });
      if (resp.ok) {
        setComments(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c));
      }
    } catch (err) { console.error('Failed to approve comment:', err); }
  };
  const markCommentAsSpam = async (id: number) => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/comments/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status: 'spam' })
      });
      if (resp.ok) {
        setComments(prev => prev.map(c => c.id === id ? { ...c, status: 'spam' } : c));
      }
    } catch (err) { console.error('Failed to mark comment as spam:', err); }
  };
  const deleteComment = async (id: number) => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/comments/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (resp.ok) {
        setComments(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) { console.error('Failed to delete comment:', err); }
  };

  const switchWorkspace = async (tenantId: number, role: string) => {
    if (isSwitchingWorkspace) return; // Prevent rapid-switch race condition

    // 1. Show branded loading overlay
    setIsSwitchingWorkspace(true);

    // 2. Clear ALL tenant-specific React state for a clean slate
    setPages([]);
    setPosts([]);
    setMedia([]);
    setComments([]);
    setLayoutBlocks([]);
    setUsers([]);
    setPlugins([]);
    setSettings({});
    setActivities([]);
    setTotalUsers(0);

    try {
      // 3. Call backend to re-issue JWT with the target tenant's role
      const currentToken = token || localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/switch-workspace`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(currentToken ? { 'Authorization': `Bearer ${currentToken}` } : {})
        },
        body: JSON.stringify({ tenant_id: tenantId })
      });

      if (res.ok) {
        const data = await res.json();

        // 4. Clear ALL localStorage except what we're about to set
        // This prevents stale data from the previous workspace leaking in
        const primaryTid = data.primary_tenant_id || localStorage.getItem('primary_tenant_id');
        localStorage.clear();

        // 5. Set fresh session data from backend response
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('active_tenant_id', String(data.tenant_id));
        localStorage.setItem('active_role', data.user.role);
        localStorage.setItem('primary_tenant_id', String(primaryTid));

        // 6. Synchronously update Axios default headers before any subsequent calls
        try {
          const { default: api } = await import('../lib/api');
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        } catch (e) {}

        // 7. Update state context atomically — FULL replacement, not merge
        setToken(data.token);
        setUser(data.user);
        setActiveTenantId(data.tenant_id);
        setActiveRole(data.user.role);

        // Fetch user data & tenant data
        await fetchAllData();
      } else {
        // Fallback: if API fails, do the old behavior
        console.error('[switchWorkspace] API failed, falling back to local switch');
        localStorage.setItem('active_tenant_id', String(tenantId));
        localStorage.setItem('active_role', role);
        setActiveTenantId(tenantId);
        setActiveRole(role);
        await fetchAllData();
      }
    } catch (err) {
      console.error('[switchWorkspace] Network error:', err);
      // Fallback: do local switch on network error
      localStorage.setItem('active_tenant_id', String(tenantId));
      localStorage.setItem('active_role', role);
      setActiveTenantId(tenantId);
      setActiveRole(role);
      await fetchAllData();
    } finally {
      // ALWAYS release the lock — prevents permanent UI freeze
      setIsSwitchingWorkspace(false);
    }
  };

  const isAuthenticated = !!token || !!localStorage.getItem('token');

  return (
    <CMSContext.Provider value={{ 
      pages, posts, media, comments, layoutBlocks, users, plugins, settings, activities, totalUsers, totalInquiries,
      user, token, isAuthenticated, activeTenantId, activeRole, isSwitchingWorkspace, isAvatarUploading, setUser, setToken, 
      setPages, setPosts, setMedia,
      fetchAllData, switchWorkspace, uploadAvatar,
      savePage, deletePage, 
      savePost, deletePost, 
      addMedia, deleteMedia, 
      approveComment, markCommentAsSpam, deleteComment, fetchComments,
      addUser, deleteUser,
      togglePluginStatus, updateSettings, updateLayout,
      togglePageStatus, togglePostStatus,
      addActivity,
      isLoading
    }}>
      {/* Task 1: Loading Guard */}
      {isLoading ? (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(11,11,11,0.92)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '24px'
        }}>
          <style>{`
            @keyframes universe-pulse {
              0%, 100% { transform: scale(1); opacity: 0.85; }
              50% { transform: scale(1.1); opacity: 1; }
            }
          `}</style>
          <img
            src={universeLogo}
            alt="UNI-VERSE"
            style={{
              height: '64px', width: 'auto',
              animation: 'universe-pulse 1.5s ease-in-out infinite'
            }}
          />
          <p style={{
            color: '#FAD02C', fontSize: '12px',
            fontWeight: 800, letterSpacing: '0.15em',
            textTransform: 'uppercase'
          }}>Loading Universe...</p>
        </div>
      ) : (
        <>
          {/* Task 2: Branded Full-Screen Loading Overlay */}
          {isSwitchingWorkspace && (
            <div style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(11,11,11,0.92)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '24px'
            }}>
              <style>{`
                @keyframes universe-pulse {
                  0%, 100% { transform: scale(1); opacity: 0.85; }
                  50% { transform: scale(1.1); opacity: 1; }
                }
              `}</style>
              <img
                src={universeLogo}
                alt="UNI-VERSE"
                style={{
                  height: '64px', width: 'auto',
                  animation: 'universe-pulse 1.5s ease-in-out infinite'
                }}
              />
              <p style={{
                color: '#FAD02C', fontSize: '12px',
                fontWeight: 800, letterSpacing: '0.15em',
                textTransform: 'uppercase'
              }}>Menyiapkan Workspace...</p>
            </div>
          )}
          
          {evictionNotification && (
            <NotificationModal
              isOpen={true}
              title="Akses Dicabut"
              message={`Anda telah dihapus dari tim ${evictionNotification.tenantName}.`}
              type="info"
              onClose={() => setEvictionNotification(null)}
            />
          )}
          {children}
        </>
      )}
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
