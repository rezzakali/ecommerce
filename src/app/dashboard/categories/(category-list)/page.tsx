import { getCategories } from '../actions';
import CategoryLists from '../categoryLists';

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

  const response = await getCategories({
    search,
    page,
    limit,
    sort,
  });

  if ('error' in response) {
    // Handle the error case
    return <div>Error: {response.error}</div>;
  }

  return <CategoryLists {...response} />;
};

export default page;
