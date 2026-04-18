import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';

export function ProtectedRoute() {
  const { setToken, setUser, fetchAllData } = useCMS();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      setToken(token);
      setUser(JSON.parse(userStr));
      setIsAuthenticated(true);
    }
    
    setIsChecking(false);
  }, [setToken, setUser]);

  if (isChecking) {
    return <div className="h-screen flex items-center justify-center bg-gray-50"><div className="w-8 h-8 flex animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" /></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
