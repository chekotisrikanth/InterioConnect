import React from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { BrowseDesigners } from '../pages/BrowseDesigners';
import { AdminDashboard } from '../pages/admin/Dashboard';
import { clientRoutes } from './clientRoutes';
import { useAuthStore } from '../stores/authStore';

// Auth guard component
const RequireAuth: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
  const { user, loading } = useAuthStore();
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const routes: RouteObject[] = [
  {
    path: '/',
    children: [
      {
        index: true,
        element: <BrowseDesigners />,
      },
      {
        path: 'browse-designers',
        element: <BrowseDesigners />,
      },
      {
        path: 'admin',
        element: (
          <RequireAuth roles={['admin']}>
            <AdminDashboard />
          </RequireAuth>
        ),
      },
      ...clientRoutes,
    ],
  },
];