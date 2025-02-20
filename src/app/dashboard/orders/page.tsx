import OrdersPage from './client';

export const metadata = {
  title: 'Orders | QuickKart Dashboard',
  description: 'Track and manage all customer orders in your QuickKart store.',
  robots: 'noindex, nofollow',
  keywords: 'order management, QuickKart orders, track orders',
};

const page = () => {
  return <OrdersPage />;
};

export default page;
