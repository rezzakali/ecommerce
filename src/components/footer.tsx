'use client';

import { Facebook, Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ModeToggle from './mode-toggle';

const pathnames = ['/profile', '/dashboard', '/signin', '/signup'];

const Footer = () => {
  const pathname = usePathname();

  if (pathnames.includes(pathname)) {
    return null;
  }

  return (
    <footer className="p-6 border-t m-auto">
      {/* 🔹 Footer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 🔹 About Section */}
        <div>
          <h2 className="text-lg font-semibold">QuickKart</h2>
          <p className="mt-2">
            Your one-stop e-commerce destination for seamless shopping. Browse a
            wide range of products, enjoy a smooth checkout experience. Shop
            smart, shop fast with QuickKart!
          </p>
        </div>

        {/* 🔹 Quick Links */}
        <div>
          <h2 className="text-lg font-semibold">Quick Links</h2>
          <ul className="mt-2 space-y-2">
            <li>
              <Link href="/" className="">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about-us" className="">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact-us">Contact Us</Link>
            </li>
            <li>
              <Link href="/how-to-use">How To Use</Link>
            </li>
          </ul>
        </div>

        {/* 🔹 Social Media Links */}
        <div>
          <h2 className="text-lg font-semibold">Follow Us</h2>
          <div className="mt-3 flex space-x-4">
            <Link href="/" aria-label="Facebook">
              <Facebook />
            </Link>
            <Link href="/" aria-label="Twitter">
              <Twitter />
            </Link>
            <Link href="/" aria-label="LinkedIn">
              <Linkedin />
            </Link>
            <Link href="/" aria-label="GitHub">
              <Github />
            </Link>
          </div>
        </div>
      </div>

      {/* 🔹 Copyright */}

      <div className="flex flex-col-reverse md:flex-row items-center mt-8 justify-between border-t px-8 py-2 gap-4">
        <div className="text-center text-sm">
          © {new Date().getFullYear()} <strong>QuickKart</strong>. All rights
          reserved.
        </div>
        <ModeToggle />
      </div>
    </footer>
  );
};

export default Footer;
