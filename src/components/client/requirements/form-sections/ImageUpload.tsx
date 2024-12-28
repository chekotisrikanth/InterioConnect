import React from 'react';
import { RequirementFormData } from '../../../../types/client';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  formData: RequirementFormData;
  setFormData: (data: RequirementFormData) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ formData, setFormData }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData({ ...formData, images: [...formData.images, ...newFiles] });
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Images</h3>
      
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
        <div className="space-y-1 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="images"
              className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <span>Upload files</span>
              <input
                id="images"
                name="images"
                type="file"
                className="sr-only"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF up to 10MB each
          </p>
        </div>
      </div>

      {formData.images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {formData.images.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={`Upload ${index + 1}`}
                className="h-24 w-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};