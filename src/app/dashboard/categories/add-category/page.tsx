import AddCategory from './client';

export const metadata = {
  title: 'Add Category | QuickKart Dashboard',
  description:
    'Create new product categories to better classify your store’s inventory.',
  robots: 'noindex, nofollow',
  keywords: 'add category, category management, QuickKart inventory',
};

const page = () => {
  return <AddCategory />;
};

export default page;
