import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { ClientDashboard } from '../components/client/ClientDashboard';
import { Dashboard } from '../pages/client/Dashboard';

import { useAuthStore } from '../stores/authStore';

// Auth guard component
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuthStore();
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'client') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const clientRoutes: RouteObject[] = [
  {
    path: 'client',
    element: (
      <RequireAuth>
        <ClientDashboard />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'requirements',
        children: [
          {
            index: true,
            // TODO: Add Requirements list component
            element: <div>Requirements List</div>,
          },
          {
            path: 'new',
            // TODO: Add New Requirement form component
            element: <div>New Requirement Form</div>,
          },
          {
            path: ':id',
            // TODO: Add Requirement details component
            element: <div>Requirement Details</div>,
          },
        ],
      },
      {
        path: 'chats',
        children: [
          {
            index: true,
            // TODO: Add Chats list component
            element: <div>Chats List</div>,
          },
          {
            path: ':id',
            // TODO: Add Chat details component
            element: <div>Chat Details</div>,
          },
        ],
      },
      {
        path: 'designers',
        children: [
          {
            index: true,
            // TODO: Add Hired/Bookmarked designers list component
            element: <div>Designers List</div>,
          },
          {
            path: ':id',
            // TODO: Add Designer profile component
            element: <div>Designer Profile</div>,
          },
        ],
      },
      {
        path: 'notifications',
        // TODO: Add Notifications component
        element: <div>Notifications</div>,
      },
      {
        path: 'settings',
        // TODO: Add Settings component
        element: <div>Settings</div>,
      },
    ],
  },
];
