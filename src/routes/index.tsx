import React from 'react';
import { RouteObject } from 'react-router-dom';
import { BrowseDesigners } from '../pages/BrowseDesigners';
import { AdminDashboard } from '../pages/admin/Dashboard';
import { clientRoutes } from './clientRoutes';
import { designerRoutes } from './designerRoutes';
import { RequireAuth } from '../components/auth/RequireAuth';

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
    ],
  },
];