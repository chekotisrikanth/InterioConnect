import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export const ContentManager = () => {
  const [activeTab, setActiveTab] = React.useState('categories');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Content Management</h2>

      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setActiveTab('categories')}
          className={`py-2 px-4 border-b-2 ${
            activeTab === 'categories'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => setActiveTab('banners')}
          className={`py-2 px-4 border-b-2 ${
            activeTab === 'banners'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Banners
        </button>
        <button
          onClick={() => setActiveTab('blogs')}
          className={`py-2 px-4 border-b-2 ${
            activeTab === 'blogs'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Blog Posts
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        {activeTab === 'categories' && (
          <div>
            <h3 className="text-lg font-medium mb-4">Design Categories</h3>
            {/* Add category management UI here */}
          </div>
        )}
        
        {activeTab === 'banners' && (
          <div>
            <h3 className="text-lg font-medium mb-4">Promotional Banners</h3>
            {/* Add banner management UI here */}
          </div>
        )}
        
        {activeTab === 'blogs' && (
          <div>
            <h3 className="text-lg font-medium mb-4">Blog Posts</h3>
            {/* Add blog post management UI here */}
          </div>
        )}
      </div>
    </div>
  );
};