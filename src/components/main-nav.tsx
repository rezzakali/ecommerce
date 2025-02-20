import { cookies } from 'next/headers';
import Link from 'next/link';
import UserNav from './user-nav';

export default async function MainNav() {
  const session = (await cookies()).get('session')?.value;

  return (
    <header className="bg-background shadow-sm sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 md:px-0 py-3 flex justify-between items-center ">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold">
            QuickKart
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/search">All</Link>
            <Link href="/search?category=apparel">Apparel</Link>
            <Link href="/search?category=grocery">Grocery</Link>
          </nav>
        </div>
        {/* User & Cart Section (Client Component) */}
        <UserNav session={session} />
      </div>
    </header>
  );
}
