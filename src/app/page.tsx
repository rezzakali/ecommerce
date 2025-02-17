import ProductGrid from '../clients/home';
import { getProducts } from './dashboard/products/actions';

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

  const response = await getProducts({
    search,
    page,
    limit,
    sort,
  });

  return <ProductGrid products={response.data} />;
};

export default page;
