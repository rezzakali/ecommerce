export const dynamic = 'force-dynamic';

import { fetchProfile } from './actions';
import Page from './client';

export const metadata = {
  title: 'My Account | QuickKart',
  description:
    'Manage your QuickKart account, view order history, update details, and enhance your shopping experience.',
  robots: 'index, follow',
  keywords: 'QuickKart account, user profile, order history, manage account',
  twitter: {
    card: 'summary',
    title: 'My Account | QuickKart',
    description:
      'Access your QuickKart account, track orders, and update your details.',
  },
};

const page = async () => {
  const user = await fetchProfile();
  return <Page user={user.data} />;
};

export default page;
