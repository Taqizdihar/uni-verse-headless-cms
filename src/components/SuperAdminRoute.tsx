import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const SuperAdminRoute = () => {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);

  // Strict check for user_id === 1 as requested
  if (user.id !== 1 || user.email !== 'm.taqizdihar@gmail.com') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
