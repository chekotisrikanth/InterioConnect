import React from 'react';
import { DollarSign, CheckCircle2, Star, Building2, Briefcase } from 'lucide-react';
import { Designer } from '../types';
import { ImageCarousel } from './ImageCarousel';

interface DesignerCardProps {
  designer: Designer;
  onClick: (designer: Designer) => void;
}

export const DesignerCard: React.FC<DesignerCardProps> = ({ designer, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer"
      onClick={() => onClick(designer)}
    >
      <ImageCarousel images={designer.images} alt={designer.name} />
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-900">{designer.name}</h3>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 text-sm font-medium">{designer.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-1">
          {designer.styles.map((style, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              {style}
            </span>
          ))}
        </div>

        <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Building2 className="w-4 h-4 mr-1" />
            <span>{designer.experience_level}y exp</span>
          </div>
          <div className="flex items-center">
            <Briefcase className="w-4 h-4 mr-1" />
            <span>{designer.completed_projects} projects</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center mb-2">
            <DollarSign className="w-4 h-4 text-indigo-500 mr-1" />
            <span className="text-sm text-gray-600">
              ${designer.pricing.price_per_unit}/{designer.pricing.price_unit}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {designer.services.fullRoomDesign && (
              <span className="flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Full Room Design
              </span>
            )}
            {designer.services.consultation && (
              <span className="flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Consultation
              </span>
            )}
            {designer.services.eDesign && (
              <span className="flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                E-Design
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1">
          {designer.room_types.map((room, index) => (
            <span key={index} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs">
              {room}
            </span>
          ))}
        </div>

        <div className="mt-2 flex gap-2">
          {designer.portfolio_types.map((type, index) => (
            <span key={index} className="text-xs text-gray-500">
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
