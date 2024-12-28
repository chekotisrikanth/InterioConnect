import React from 'react';
import { PersonalInfo } from '../../../components/client/settings/PersonalInfo';
import { PreferenceSettings } from '../../../components/client/settings/PreferenceSettings';
import { PaymentHistory } from '../../../components/client/settings/PaymentHistory';
import { SavedDesigners } from '../../../components/client/settings/SavedDesigners';
import { PrivacySettings } from '../../../components/client/settings/PrivacySettings';

export const AccountSettings: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Account Settings</h1>
      
      <div className="space-y-6">
        <PersonalInfo />
        <PreferenceSettings />
        <PaymentHistory />
        <SavedDesigners />
        <PrivacySettings />
      </div>
    </div>
  );
};