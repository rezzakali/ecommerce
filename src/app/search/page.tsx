import { ProductsResponse } from '@/src/@types';
import { getCategories } from '../dashboard/categories/actions';
import { getProducts } from '../dashboard/products/actions';
import SearchClient from './client';

const page = async ({
  params,
}: {
  params: Promise<{
    search: string;
    page: string;
    limit: string;
    sort: string;
    category: string;
  }>;
}) => {
  const searchParams = await params;

  const search = searchParams.search || '';
  const sort = searchParams.sort || '';
  const category = searchParams.category || 'all';
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;

  const response: ProductsResponse = await getProducts({
    search,
    page,
    limit,
    sort,
    category,
  });

  const cate = await getCategories({
    search: '',
    page: '1',
    limit: '50',
    sort: 'name',
  });

  if ('error' in cate) {
    return <div>Error fetching categories</div>;
  }

  return <SearchClient products={response.data} categories={cate.data} />;
};

export default page;
