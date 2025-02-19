'use client';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Skeleton } from '@/src/components/ui/skeleton';
import { useCart } from '@/src/context/CartContext';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { CartItem } from './cart.interface';

const CartClient = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingItems, setLoadingItems] = useState<string[]>([]);

  const { refreshCart } = useCart();

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const updateCartHandler = async (
    itemId: string,
    action: 'increase' | 'decrease' | 'remove'
  ) => {
    try {
      setLoadingItems((prev) => [...prev, itemId]); //  Start loading for this item

      const res = await fetch(`/api/cart/${action}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
        credentials: 'include',
      });

      if (!res.ok) throw new Error(`Failed to ${action} item!`);

      const data = await res.json();
      if (data?.data?.items) {
        setCartItems(data.data.items);
        refreshCart();
      }
    } catch (error) {
      console.error(`Update cart (${action}) error:`, error);
    } finally {
      setLoadingItems((prev) => prev.filter((id) => id !== itemId)); // Remove item from loading state
    }
  };

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/cart', { credentials: 'include' });

        if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);

        const data = await res.json();
        setCartItems(data?.data?.items || []);
      } catch (error) {
        setError('Failed to fetch cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchCarts();
  }, []);

  if (loading)
    return (
      <div className="space-y-4 max-w-4xl mx-auto p-4">
        {[1, 2, 3].map((index) => (
          <Card
            key={index}
            className="flex flex-col md:flex-row items-center gap-4 p-4"
          >
            <Skeleton className="w-20 h-20 rounded-md bg-gray-200" />
            <CardContent className="flex-1">
              <Skeleton className="h-5 w-3/4 bg-gray-200 mb-2" />
              <Skeleton className="h-4 w-1/2 bg-gray-200 mb-4" />
              <div className="flex items-center gap-2">
                <Skeleton className="w-10 h-10 rounded bg-gray-300" />
                <Skeleton className="w-6 h-6 rounded bg-gray-300" />
                <Skeleton className="w-10 h-10 rounded bg-gray-300" />
                <Skeleton className="w-16 h-10 rounded bg-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );

  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {cartItems.length === 0 ? (
        <div className="flex items-center justify-center h-[70vh]">
          <p className="text-center text-gray-500">Your cart is empty.</p>
        </div>
      ) : (
        <React.Fragment>
          <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              {cartItems?.map((item) => {
                const isLoading = loadingItems.includes(item._id);

                return (
                  <Card
                    key={item._id}
                    className="flex flex-col md:flex-row items-center gap-4 p-4 mb-4"
                  >
                    <Image
                      src={item.product.image?.url || '/bag-1-dark.avif'}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="w-full md:w-auto"
                    />

                    <CardContent className="flex-1 text-center md:text-left">
                      <h3 className="text-lg font-semibold">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-500">
                        ₹{item.product.price?.toFixed(2)}
                      </p>

                      <div className="flex justify-center md:justify-start items-center gap-2 mt-2">
                        <Button
                          className="border p-2 rounded"
                          onClick={() =>
                            updateCartHandler(item._id, 'decrease')
                          }
                          disabled={isLoading || item.quantity === 1}
                        >
                          -
                        </Button>
                        <span className="mx-2">{item.quantity}</span>
                        <Button
                          className="border p-2 rounded"
                          onClick={() =>
                            updateCartHandler(item._id, 'increase')
                          }
                          disabled={isLoading}
                        >
                          +
                        </Button>

                        <Button
                          className="border p-2 rounded bg-red-500 text-white"
                          onClick={() => updateCartHandler(item._id, 'remove')}
                          disabled={isLoading}
                        >
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="w-full md:w-1/3">
              <div className="p-4 border rounded-xl shadow">
                <h3 className="text-xl font-semibold mb-4">Checkout</h3>
                <div className="text-right font-semibold text-xl mb-4">
                  Total: ₹{totalAmount.toFixed(2)}
                </div>
                <Button className="w-full">Proceed to Checkout</Button>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default CartClient;
