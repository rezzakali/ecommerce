import { fetchDashboardOverview } from './actions';
import DashboardOverview from './dashboard-overview';

export const metadata = {
  title: 'Dashboard | QuickKart',
  description:
    'Manage your QuickKart account, track your orders, and explore personalized recommendations.',
  robots: 'noindex, nofollow', // Prevents search engines from indexing the dashboard
  keywords:
    'QuickKart dashboard, order tracking, account settings, shopping history',
};

export default async function page() {
  const res = await fetchDashboardOverview();
  return <DashboardOverview data={res.data} />;
}
