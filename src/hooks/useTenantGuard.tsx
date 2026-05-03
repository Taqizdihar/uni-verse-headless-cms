import { useEffect, useState } from 'react';
import { useCMS } from '../context/CMSContext';

export function useTenantGuard() {
  const { token, activeTenantId, switchWorkspace } = useCMS();
  const [isEvicted, setIsEvicted] = useState(false);

  useEffect(() => {
    if (!token || !activeTenantId) return;

    const checkTenantAccess = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/workspaces`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const workspaces = await res.json();
          const isValid = workspaces.find((w: any) => w.tenant_id === activeTenantId && w.status === 'active');
          if (!isValid) {
            setIsEvicted(true);
          }
        }
      } catch (err) {
        console.error('Failed to verify tenant access in Guard:', err);
      }
    };

    checkTenantAccess();

    const interval = setInterval(checkTenantAccess, 30000);
    return () => clearInterval(interval);
  }, [token, activeTenantId]);

  const handleEvictionAck = () => {
    setIsEvicted(false);
    const primaryTenantId = localStorage.getItem('primary_tenant_id');
    if (primaryTenantId) {
      switchWorkspace(parseInt(primaryTenantId, 10), 'admin');
    } else {
      window.location.replace('/dashboard');
    }
  };

  return { isEvicted, handleEvictionAck };
}
