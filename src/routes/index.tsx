import React from 'react';
import { RouteObject } from 'react-router-dom';
import { BrowseDesigners } from '../pages/BrowseDesigners';
import { AdminDashboard } from '../pages/admin/Dashboard';
import { LocationTest } from '../pages/LocationTest';
import { clientRoutes } from './clientRoutes';
import { designerRoutes } from './designerRoutes';
import { RequireAuth } from '../components/auth/RequireAuth';

// Development-only routes
const devRoutes: RouteObject[] = process.env.NODE_ENV === 'development' 
  ? [
      {
        path: 'test/location',
        element: <LocationTest />,
      },
    ]
  : [];

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
      ...designerRoutes,
      ...devRoutes,
    ],
  },
];
