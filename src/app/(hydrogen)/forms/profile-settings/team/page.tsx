import { metaObject } from '@/config/site';
import TeamSettingsView from '@/app/shared/account-settings/team-settings';

export const metadata = {
  ...metaObject('Team'),
};

export default function ProfileSettingsFormPage() {
  return <TeamSettingsView />;
}
