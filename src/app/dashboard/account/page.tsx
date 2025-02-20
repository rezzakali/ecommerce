export const dynamic = 'force-dynamic';

import { fetchUserById } from './actions';
import Page from './client';

export const metadata = {
  title: 'Admin Account | QuickKart Dashboard',
  description:
    'Manage your admin profile, update account details, and change settings.',
  robots: 'noindex, nofollow',
  keywords: 'admin account, profile settings, QuickKart dashboard',
};

const page = async () => {
  const user = await fetchUserById();
  return <Page user={user.data} />;
};

export default page;
