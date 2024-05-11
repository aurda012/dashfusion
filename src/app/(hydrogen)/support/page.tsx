import SupportDashboard from '@/app/shared/support/dashboard';
import { metaObject } from '@/config/site';

export const metadata = {
  ...metaObject('Support'),
};

export default function SupportDashboardPage() {
  return <SupportDashboard />;
}
