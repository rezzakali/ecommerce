import { fetchUsers } from './actions';
import UserLists from './user-lists';

export const metadata = {
  title: 'Users | QuickKart Dashboard',
  description: 'Manage customers, vendors, and admin users in QuickKart.',
  robots: 'noindex, nofollow',
  keywords: 'user management, QuickKart users, admin panel',
};

const page = async ({
  params,
}: {
  params: Promise<{
    search?: string;
    page?: string;
    limit?: string;
    sort?: string;
  }>;
}) => {
  const searchParams = await params;

  const search = searchParams?.search || '';
  const sort = searchParams?.sort || '';
  const page = searchParams?.page || '1';
  const limit = searchParams?.limit || '10';

  const response = await fetchUsers({
    search,
    page,
    limit,
    sort,
  });

  if ('error' in response) {
    // Handle error case
    return <div>Error: {response.error}</div>;
  }

  if ('message' in response && 'data' in response && 'pagination' in response) {
    // Handle success case
    return <UserLists {...response} />;
  }

  return <div>Unexpected response format</div>;
};

export default page;
