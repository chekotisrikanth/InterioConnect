import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Users,
  Bell,
  Settings,
} from 'lucide-react';

const navItems = [
  {
    to: '/client/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    to: '/client/requirements',
    icon: FileText,
    label: 'Requirements',
  },
  {
    to: '/client/chats',
    icon: MessageSquare,
    label: 'Messages',
  },
  {
    to: '/client/designers',
    icon: Users,
    label: 'Designers',
  },
  {
    to: '/client/notifications',
    icon: Bell,
    label: 'Notifications',
  },
  {
    to: '/client/settings',
    icon: Settings,
    label: 'Settings',
  },
];

export const ClientDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-10">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">Interior Match</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-64">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8">
          <div className="flex-1">
            {/* Add header content like search or breadcrumbs */}
          </div>
          <div className="flex items-center space-x-4">
            {/* Add user menu, notifications, etc. */}
            <div className="w-8 h-8 rounded-full bg-gray-200" />
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
