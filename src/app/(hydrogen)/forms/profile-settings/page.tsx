import { metaObject } from '@/config/site';
import PersonalInfoView from '@/app/shared/account-settings/personal-info';

export const metadata = {
  ...metaObject('Profile Settings'),
};

export default function ProfileSettingsFormPage() {
  return <PersonalInfoView />;
}
