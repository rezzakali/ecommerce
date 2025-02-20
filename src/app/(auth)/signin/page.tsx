import Signin from './client';

export const metadata = {
  title: 'Sign In - QuickKart',
  description:
    'Access your QuickKart account to track orders, manage your cart, and shop seamlessly.',
  keywords: 'QuickKart login, sign in, ecommerce account, track orders',
  author: 'QuickKart Team',
  openGraph: {
    title: 'Sign In - QuickKart',
    description:
      'Log in to your QuickKart account to enjoy a seamless shopping experience.',
    url: 'https://www.quickkart.com/signin',
    type: 'website',
    images: [
      {
        url: 'https://www.quickkart.com/signin.png',
        width: 1200,
        height: 630,
        alt: 'Sign In - QuickKart',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@quickkart',
    title: 'Sign In - QuickKart',
    description: 'Log in to your QuickKart account and continue shopping!',
    image: 'https://www.quickkart.com/signin.png',
  },
};

const page = () => {
  return <Signin />;
};

export default page;
