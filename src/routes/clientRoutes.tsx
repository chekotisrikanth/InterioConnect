import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { ClientDashboard } from '../components/client/ClientDashboard';
import { Dashboard } from '../pages/client/Dashboard';
import { AccountSettings } from '../pages/client/settings/AccountSettings';
import { Requirements } from '../pages/client/requirements/Requirements';
import { RequirementView } from '../pages/client/requirements/RequirementView';
import { Chats } from '../pages/client/chats/Chats';
import { ChatViewPage } from '../pages/client/chats/ChatViewPage';
import { RequireAuth } from '../components/auth/RequireAuth';

export const clientRoutes: RouteObject[] = [
  {
    path: 'client',
    element: (
      <RequireAuth roles={['client', 'user']}>
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
            element: <Requirements />,
          },
          {
            path: ':id',
            element: <RequirementView />,
          },
        ],
      },
      {
        path: 'chats',
        children: [
          {
            index: true,
            element: <Chats />,
          },
          {
            path: ':id',
            element: <ChatViewPage />,
          },
        ],
      },
      {
        path: 'settings',
        element: <AccountSettings />,
      },
    ],
  },
];
