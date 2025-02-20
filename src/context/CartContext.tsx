import React, { createContext, useContext, useEffect, useState } from 'react';

interface CartContextType {
  cartCount: number;
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartCount, setCartCount] = useState<number>(0);

  // Fetch cart count when app starts
  const refreshCart = async () => {
    try {
      const res = await fetch('/api/cart', { credentials: 'include' });
      // if (!res.ok) throw new Error('Failed to fetch cart');

      const data = await res.json();
      setCartCount(data?.data?.items?.length || 0);
    } catch (error) {
      console.error('Cart fetch error:', error);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
