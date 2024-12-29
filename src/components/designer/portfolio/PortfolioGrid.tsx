import React from 'react';
import { Image, Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  room_type: string;
  style: string;
  images: { image_url: string }[];
  featured: boolean;
  created_at: string;
}

interface PortfolioGridProps {
  items: PortfolioItem[];
}

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-sm overflow-hidden group"
        >
          <div className="relative aspect-video">
            {item.images[0] ? (
              <img
                src={item.images[0].image_url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <Image className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex space-x-2">
                <button className="p-2 bg-white rounded-full text-gray-700 hover:text-gray-900">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white rounded-full text-gray-700 hover:text-gray-900">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-medium text-gray-900">{item.title}</h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {item.description}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                {item.room_type}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                {item.style}
              </span>
              {item.featured && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                  Featured
                </span>
              )}
            </div>
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <div className="col-span-full text-center py-12">
          <Image className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No portfolio items
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first project to your portfolio
          </p>
        </div>
      )}
    </div>
  );
};