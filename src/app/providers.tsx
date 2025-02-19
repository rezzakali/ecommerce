'use client';

import { ThemeProvider } from '@/src/components/theme-provider';
import { CartProvider } from '../context/CartContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
    </CartProvider>
  );
}
