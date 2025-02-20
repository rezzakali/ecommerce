import CartClient from './client';

export const metadata = {
  title: 'Your Cart | QuickKart',
  description:
    'Review your selected products and proceed to checkout at QuickKart. Secure and fast shopping experience.',
  robots: 'index, follow',
  keywords: 'shopping cart, QuickKart cart, checkout, buy online, ecommerce',
  twitter: {
    card: 'summary',
    title: 'Your Cart | QuickKart',
    description:
      'Review your selected products and proceed to checkout at QuickKart.',
  },
};

export default async function page() {
  return <CartClient />;
}
