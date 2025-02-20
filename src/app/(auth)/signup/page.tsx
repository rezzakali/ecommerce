import Signup from './client';

export const metadata = {
  title: 'Sign Up - QuickKart',
  description:
    'Create your QuickKart account today and start shopping with exclusive deals and offers.',
  keywords:
    'QuickKart sign up, register account, ecommerce signup, create account',
  author: 'QuickKart Team',
  openGraph: {
    title: 'Sign Up - QuickKart',
    description:
      'Join QuickKart and shop from a wide range of products at the best prices.',
    url: 'https://www.quickkart.com/signup',
    type: 'website',
    images: [
      {
        url: 'https://www.quickkart.com/signup.png',
        width: 1200,
        height: 630,
        alt: 'Sign Up - QuickKart',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@quickkart',
    title: 'Sign Up - QuickKart',
    description:
      'Create your QuickKart account today and enjoy exclusive deals!',
    image: 'https://www.quickkart.com/signup.png',
  },
};

const page = () => {
  return <Signup />;
};

export default page;
