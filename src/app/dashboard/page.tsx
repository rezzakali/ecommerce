import { fetchDashboardOverview } from './actions';
import DashboardOverview from './dashboard-overview';

export default async function page() {
  const res = await fetchDashboardOverview();
  return <DashboardOverview data={res.data} />;
}
