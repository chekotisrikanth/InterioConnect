import React from 'react';
import { LayoutDashboard, Users, Calendar, FileText, Settings } from 'lucide-react';
import { AdminStats } from '../../components/admin/AdminStats';
import { DesignerApprovals } from '../../components/admin/DesignerApprovals';
import { ProjectsOverview } from '../../components/admin/ProjectsOverview';
import { ContentManager } from '../../components/admin/ContentManager';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = React.useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white h-screen shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
          </div>
          <nav className="mt-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center px-6 py-3 text-sm ${
                activeTab === 'overview'
                  ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center px-6 py-3 text-sm ${
                activeTab === 'users'
                  ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5 mr-3" />
              User Management
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center px-6 py-3 text-sm ${
                activeTab === 'projects'
                  ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-5 h-5 mr-3" />
              Projects
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center px-6 py-3 text-sm ${
                activeTab === 'content'
                  ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-5 h-5 mr-3" />
              Content
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'overview' && <AdminStats />}
          {activeTab === 'users' && <DesignerApprovals />}
          {activeTab === 'projects' && <ProjectsOverview />}
          {activeTab === 'content' && <ContentManager />}
        </div>
      </div>
    </div>
  );
};