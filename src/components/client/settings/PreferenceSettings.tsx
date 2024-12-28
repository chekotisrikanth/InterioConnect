import React from 'react';
import { useClientProfile } from '../../../hooks/useClientProfile';
import { DESIGNER_STYLES } from '../../../constants';
import { Loader2 } from 'lucide-react';

export const PreferenceSettings: React.FC = () => {
  const { profile, updateProfile, isLoading, isSaving } = useClientProfile();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const styles = Array.from(formData.getAll('styles'));
    const budget = {
      lower: parseInt(formData.get('budget_min') as string),
      upper: parseInt(formData.get('budget_max') as string),
    };

    await updateProfile({
      preferred_styles: styles,
      preferred_budget_range: budget,
    });
  };

  if (isLoading) {
    return <div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Design Preferences</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Styles
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {DESIGNER_STYLES.map((style) => (
              <label key={style} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="styles"
                  value={style}
                  defaultChecked={profile?.preferred_styles?.includes(style)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">{style}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget Range
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                name="budget_min"
                defaultValue={profile?.preferred_budget_range?.lower}
                placeholder="Min budget"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <input
                type="number"
                name="budget_max"
                defaultValue={profile?.preferred_budget_range?.upper}
                placeholder="Max budget"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
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
              'Save Preferences'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};