import Footer from '@/src/components/footer';
import MainNav from '@/src/components/main-nav';
import { Toaster } from '@/src/components/ui/toaster';
import { Roboto } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import { Providers } from './providers';

const roboto = Roboto({
  variable: '--font-lato-sans',
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
});

export const metadata = {
  title: 'QuickKart - Your One-Stop E-Commerce Destination',
  description:
    'Shop a wide range of products at QuickKart. Enjoy seamless shopping, secure checkout, and fast delivery. Find the best deals on fashion, electronics, and more!',
  keywords:
    'ecommerce, online shopping, buy online, fashion, electronics, best deals, QuickKart',
  author: 'QuickKart Team',
  openGraph: {
    title: 'QuickKart - Your One-Stop E-Commerce Destination',
    description:
      'Find the best deals on fashion, electronics, and more. Shop smart with QuickKart!',
    url: 'https://www.quickkart.com',
    type: 'website',
    images: [
      {
        url: 'https://www.quickkart.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'QuickKart Online Shopping',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@quickkart',
    title: 'QuickKart - Your One-Stop E-Commerce Destination',
    description:
      'Shop a wide range of products at QuickKart. Enjoy secure checkout and fast delivery!',
    image: 'https://www.quickkart.com/twitter-image.jpg',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const pathname = cookieStore.get('next-url')?.value || '';
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            {!isDashboard && <MainNav />}
            <main className="container-fluid mx-0">{children}</main>
            {!isDashboard && <Footer />}
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
