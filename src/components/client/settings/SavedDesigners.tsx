import React from 'react';
import { Link } from 'react-router-dom';
import { useSavedDesigners } from '../../../hooks/useSavedDesigners';
import { Loader2, Star } from 'lucide-react';

export const SavedDesigners: React.FC = () => {
  const { designers, removeDesigner, isLoading } = useSavedDesigners();

  if (isLoading) {
    return <div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Saved Designers</h2>
      
      {designers?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {designers.map((designer) => (
            <div key={designer.id} className="flex items-start space-x-4 p-4 border rounded-lg">
              <img
                src={designer.images[0]}
                alt={designer.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <Link
                    to={`/browse-designers/${designer.id}`}
                    className="text-lg font-medium text-gray-900 hover:text-indigo-600"
                  >
                    {designer.name}
                  </Link>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 text-sm">{designer.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{designer.bio}</p>
                <button
                  onClick={() => removeDesigner(designer.id)}
                  className="mt-2 text-sm text-red-600 hover:text-red-700"
                >
                  Remove from saved
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No saved designers</p>
      )}
    </div>
  );
};