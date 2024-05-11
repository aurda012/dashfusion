import { metaObject } from '@/config/site';
import BillingSettingsView from '@/app/shared/account-settings/billing-settings';

export const metadata = {
  ...metaObject('Billing'),
};

export default function IntegrationSettingsFormPage() {
  return <BillingSettingsView />;
}
