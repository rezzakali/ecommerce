import { getProduct } from '../actions';
import ProductDetails from './client';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch product details from API
  // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/search/${slug}`);

  const product = await getProduct({ slug });

  return {
    title: `${product.data.name} | QuickKart`,
    description:
      product.data.description ||
      'Discover amazing products at QuickKart with the best deals and offers.',
    robots: 'index, follow',
    keywords: `${product.data.name}, buy ${product.data.name}, QuickKart, best price ${product.data.name}, online shopping`,
    twitter: {
      card: 'summary_large_image',
      title: `${product.data.name} | QuickKart`,
      description:
        product.data.description ||
        'Shop for quality products at the best prices.',
      images: [product.data.image?.url || '/cup-black.avif'], // Fallback image
    },
    openGraph: {
      title: `${product.data.name} | QuickKart`,
      description:
        product.data.description || 'Discover amazing products at QuickKart.',
      images: [{ url: product.data.image?.url || '/cup-black.avif' }],
    },
  };
}

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const response = await getProduct({ slug });
  return <ProductDetails product={response.data} />;
};

export default page;
