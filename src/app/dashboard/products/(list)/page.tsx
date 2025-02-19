import { ProductsResponse } from '@/src/@types';
import { getProducts } from '../actions';
import ProductsList from '../ProductsList';

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
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 10;

  const response: ProductsResponse = await getProducts({
    search,
    page,
    limit,
    sort,
    category: 'all',
  });

  return <ProductsList {...response} />;
};

export default page;
