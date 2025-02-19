'use client';

import { Menu, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useCart } from '../context/CartContext';
import { SearchForm } from './search-form';
import { Button } from './ui/button';
import { Drawer, DrawerContent, DrawerTitle } from './ui/drawer';

export default function MainNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();

  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    replace(`/search?${params.toString()}`);
  }, 300);

  return (
    <React.Fragment>
      <header className="bg-background shadow-sm sticky top-0 z-50 w-full">
        <div className="container mx-auto px-4 md:px-0 lg:px-0 py-3 flex justify-between items-center">
          {/* Brand Logo */}
          <Link href="/" className="text-xl font-bold">
            QuickKart
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex items-center border rounded-lg w-full max-w-lg">
            <SearchForm onSearch={(query) => handleSearch(query)} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            <Link href="/search">All</Link>
            <Link href="/search?category=apparel">Apparel</Link>
            <Link href="/search?category=grocery">Grocery</Link>
          </nav>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link href={'/cart'} className="relative">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded px-2">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </header>
      <NavigationDrawer open={mobileMenuOpen} setOpen={setMobileMenuOpen} />
    </React.Fragment>
  );
}

const NavigationDrawer = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    replace(`/search?${params.toString()}`);
  }, 300);

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTitle></DrawerTitle>
      <DrawerContent className="right-0 top-0 h-full left-auto w-full max-w-lg">
        <div className="p-4">
          <nav className="space-y-4 flex flex-col">
            <SearchForm onSearch={(query) => handleSearch(query)} />
            <Link href="/search">All</Link>
            <Link href="/search?category=apparel">Apparel</Link>
            <Link href="/search?category=grocery">Grocery</Link>
          </nav>
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
