import { ProductsResponse } from '@/src/@types';
import { getProducts } from '../actions';
import ProductsList from '../ProductsList';

export const metadata = {
  title: 'Product List | QuickKart Dashboard',
  description: 'View, manage, and update all products available on QuickKart.',
  robots: 'noindex, nofollow',
  keywords: 'product management, QuickKart products, inventory management',
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
