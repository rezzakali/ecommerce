import OrdersPage from './client';

export const metadata = {
  title: 'My Orders | QuickKart',
  description:
    'View your past and ongoing orders on QuickKart. Track shipping, order status, and details in one place.',
  robots: 'index, follow',
  keywords: 'QuickKart orders, track order, purchase history, order status',
  twitter: {
    card: 'summary',
    title: 'My Orders | QuickKart',
    description:
      'Track your QuickKart orders, check statuses, and view purchase history.',
  },
};

const page = () => {
  return <OrdersPage />;
};

export default page;
