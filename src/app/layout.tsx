import Footer from '@/src/components/footer';
import MainNav from '@/src/components/main-nav';
import { Toaster } from '@/src/components/ui/toaster';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import { Providers } from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const pathname = cookieStore.get('next-url')?.value || '';
  const isDashboard =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/signin') ||
    pathname.startsWith('/signup');

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
