import { getProduct } from '../actions';
import ProductDetails from './client';

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const response = await getProduct({ slug });
  return <ProductDetails product={response.data} />;
};

export default page;
