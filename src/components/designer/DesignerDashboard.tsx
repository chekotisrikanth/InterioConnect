import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Image,
  DollarSign,
  Bell,
  Settings,
  Briefcase,
} from 'lucide-react';
import { SignOutButton } from '../auth/SignOutButton';

const navItems = [
  {
    to: '/designer/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    to: '/designer/requests',
    icon: FileText,
    label: 'Requests',
  },
  {
    to: '/designer/projects',
    icon: Briefcase,
    label: 'Projects',
  },
  {
    to: '/designer/portfolio',
    icon: Image,
    label: 'Portfolio',
  },
  {
    to: '/designer/messages',
    icon: MessageSquare,
    label: 'Messages',
  },
  {
    to: '/designer/earnings',
    icon: DollarSign,
    label: 'Earnings',
  },
  {
    to: '/designer/notifications',
    icon: Bell,
    label: 'Notifications',
  },
  {
    to: '/designer/settings',
    icon: Settings,
    label: 'Settings',
  },
];

export const DesignerDashboard: React.FC = () => {
  return (
    <div className="pt-16"> {/* Add padding-top to account for fixed header */}
      {/* Sidebar */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 z-10">
        <div className="flex flex-col h-full">
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

          {/* Sign Out Button */}
          <div className="p-4 border-t border-gray-200">
            <SignOutButton className="w-full bg-gray-100 rounded-lg hover:bg-gray-200" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-64">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};