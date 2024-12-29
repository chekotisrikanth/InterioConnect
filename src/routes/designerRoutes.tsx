import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { DesignerDashboard } from '../components/designer/DesignerDashboard';
import { DashboardOverview } from '../pages/designer/DashboardOverview';
import { DesignerRequests } from '../pages/designer/DesignerRequests';
import { DesignerProjects } from '../pages/designer/DesignerProjects';
import { PortfolioManager } from '../pages/designer/PortfolioManager';
import { DesignerMessages } from '../pages/designer/DesignerMessages';
import { DesignerEarnings } from '../pages/designer/DesignerEarnings';
import { DesignerNotifications } from '../pages/designer/DesignerNotifications';
import { DesignerSettings } from '../pages/designer/DesignerSettings';
import { RequireAuth } from '../components/auth/RequireAuth';

export const designerRoutes: RouteObject[] = [
  {
    path: 'designer',
    element: (
      <RequireAuth roles={['designer']}>
        <DesignerDashboard />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardOverview />,
      },
      {
        path: 'requests',
        element: <DesignerRequests />,
      },
      {
        path: 'projects',
        element: <DesignerProjects />,
      },
      {
        path: 'portfolio',
        element: <PortfolioManager />,
      },
      {
        path: 'messages',
        element: <DesignerMessages />,
      },
      {
        path: 'earnings',
        element: <DesignerEarnings />,
      },
      {
        path: 'notifications',
        element: <DesignerNotifications />,
      },
      {
        path: 'settings',
        element: <DesignerSettings />,
      },
    ],
  },
];