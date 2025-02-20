import { Button } from '@/src/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found | QuickKart',
  description:
    "Oops! The page you're looking for doesn't exist. Browse our latest collections and shop now at QuickKart.",
  robots: 'noindex, follow',
  openGraph: {
    title: '404 - Page Not Found | QuickKart',
    description:
      'Oops! The page you are looking for does not exist. Explore our latest products instead!',
    url: 'https://quickkart.com/not-found',
    siteName: 'QuickKart',
    images: [
      {
        url: 'https://quickkart.com/images/404-error.jpg',
        width: 1200,
        height: 630,
        alt: '404 Page Not Found - QuickKart',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '404 - Page Not Found | QuickKart',
    description:
      'Oops! The page you are looking for does not exist. Explore our latest products instead!',
    images: ['https://quickkart.com/images/404-error.jpg'],
  },
};

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="p-6 flex flex-col items-center">
        <AlertTriangle className="h-16 w-16" />
        <h1 className="text-xl font-bold mt-4">404 - Page Not Found</h1>
        <p className="mt-2 text-center">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href={'/'}>
          <Button className="mt-6">Go Back Home</Button>
        </Link>
      </div>
    </div>
  );
}
