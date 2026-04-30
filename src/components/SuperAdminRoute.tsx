import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const SuperAdminRoute = () => {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);

  // Strict check for super_admin role as requested
  if (user.role !== 'super_admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
