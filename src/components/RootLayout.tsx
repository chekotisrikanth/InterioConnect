import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { useAuthStore } from '../stores/authStore';

export const RootLayout: React.FC = () => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  
  // Don't show header in client dashboard or admin routes
  const hideHeader = location.pathname.startsWith('/client') || 
                    location.pathname.startsWith('/admin');

  return (
    <>
      {!hideHeader && <Header />}
      <Outlet />
    </>
  );
};
