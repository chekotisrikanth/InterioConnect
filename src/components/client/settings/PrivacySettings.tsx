import React from 'react';
import { usePrivacySettings } from '../../../hooks/usePrivacySettings';
import { Loader2 } from 'lucide-react';

export const PrivacySettings: React.FC = () => {
  const { settings, updateSettings, isLoading, isSaving } = usePrivacySettings();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await updateSettings({
      requirement_visibility: formData.get('requirement_visibility') === 'on',
      allow_messages: formData.get('allow_messages') === 'on',
      profile_visibility: formData.get('profile_visibility') === 'on',
    });
  };

  if (isLoading) {
    return <div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="requirement_visibility"
              defaultChecked={settings?.requirement_visibility}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">
              Make my requirements visible to all designers
            </span>
          </label>
        </div>

        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="allow_messages"
              defaultChecked={settings?.allow_messages}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">
              Allow designers to send me messages
            </span>
          </label>
        </div>

        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="profile_visibility"
              defaultChecked={settings?.profile_visibility}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">
              Make my profile visible to designers
            </span>
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <span className="flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </span>
            ) : (
              'Save Privacy Settings'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};