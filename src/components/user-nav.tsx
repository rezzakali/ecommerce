'use client';

import {
  LogOut,
  Menu,
  ShoppingCart,
  ShoppingCartIcon,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { signout } from '../app/(auth)/actions';
import { useCart } from '../context/CartContext';
import { SearchForm } from './search-form';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function UserNav({ session }: { session?: any }) {
  const { cartCount } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    router.replace(`/search?${params.toString()}`);
  }, 300);

  const logoutHandler = async () => {
    await signout();
    localStorage.removeItem('user');
  };

  return (
    <React.Fragment>
      {pathname !== '/account' && (
        <div className="hidden md:flex items-center border rounded-lg w-full max-w-lg">
          <SearchForm onSearch={(query) => handleSearch(query)} />
        </div>
      )}

      {/* Right: Cart & User Authentication */}
      <div className="flex items-center gap-3">
        {/* Cart */}
        {session && (
          <Link href={'/cart'} className="relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded px-2">
              {cartCount}
            </span>
          </Link>
        )}

        {/* Authentication (Signin/Signout) */}
        <div className="hidden md:flex">
          {!session ? (
            <Link href={'/signin'}>Signin</Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Link
                    href="/account"
                    className="flex items-center gap-2 w-full"
                  >
                    <User className="w-4 h-4" /> Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="/orders"
                    className="flex items-center gap-2 w-full"
                  >
                    <ShoppingCartIcon className="w-4 h-4" /> Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 w-full"
                  onClick={logoutHandler}
                >
                  <LogOut className="w-4 h-4" /> Signout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-6 h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Link href="/search">All</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/search?category=apparel">Apparel</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/search?category=grocery">Grocery</Link>
            </DropdownMenuItem>
            {!session ? (
              <DropdownMenuItem>
                <Link href="/signin">
                  <Button className="w-full">Signin</Button>
                </Link>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem>
                <Button
                  type="submit"
                  variant="destructive"
                  onClick={logoutHandler}
                >
                  Signout
                </Button>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </React.Fragment>
  );
}
