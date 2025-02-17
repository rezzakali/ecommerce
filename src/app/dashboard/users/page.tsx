import { fetchUsers } from './actions';
import UserLists from './user-lists';

const page = async (props: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    limit?: string;
    sort?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;

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
