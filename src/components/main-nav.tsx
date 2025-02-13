'use client';

import { Menu, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { SearchForm } from './search-form';
import { Button } from './ui/button';
import { Drawer, DrawerContent, DrawerTitle } from './ui/drawer';

export default function MainNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItemCount = 2;

  return (
    <React.Fragment>
      <header className="bg-background shadow-sm sticky top-0 z-50 w-full">
        <div className="container mx-auto px-4 md:px-0 lg:px-0 py-3 flex justify-between items-center">
          {/* Brand Logo */}
          <Link href="/" className="text-xl font-bold">
            Brand
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex items-center border rounded-lg w-full max-w-lg">
            <SearchForm onSearch={(query) => console.log(query)} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            <Link href="/shop">Shop</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </nav>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link href={'/cart'} className="relative">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded px-2">
                  {cartItemCount}
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
  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTitle></DrawerTitle>
      <DrawerContent className="right-0 top-0 h-full left-auto w-full max-w-lg">
        <div className="p-4">
          <nav className="space-y-2">
            <SearchForm onSearch={(query) => console.log(query)} />
            <Link href="/" className="block p-2 rounded">
              Home
            </Link>
            <Link href="/about" className="block p-2 rounded">
              About
            </Link>
            <Link href="/contact" className="block p-2 rounded">
              Contact
            </Link>
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
