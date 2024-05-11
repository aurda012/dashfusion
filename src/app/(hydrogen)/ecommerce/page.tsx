import EcommerceDashboard from '@/app/shared/ecommerce/dashboard';
import { metaObject } from '@/config/site';

export const metadata = {
  ...metaObject('E-Commerce'),
};

export default function eCommerceDashboardPage() {
  return <EcommerceDashboard />;
}
