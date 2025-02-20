import AddProduct from './client';

export const metadata = {
  title: 'Add Product | QuickKart Dashboard',
  description: 'Add new products to your QuickKart store with ease.',
  robots: 'noindex, nofollow',
  keywords: 'add product, new listing, QuickKart product management',
};

const page = () => {
  return <AddProduct />;
};

export default page;
