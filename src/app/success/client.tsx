'use client';

import { Button } from '@/src/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const router = useRouter();

  useEffect(() => {
    const clearCart = async () => {
      if (orderId) {
        try {
          const response = await fetch('/api/cart/clear', {
            method: 'POST',
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error('Failed to clear cart');
          }

          console.log('Cart cleared successfully!');
        } catch (error) {
          console.error('Error clearing cart:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    clearCart();
  }, [orderId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <div className="shadow rounded-lg p-8">
        <h1 className="text-3xl font-bold text-green-600">
          🎉 Payment Successful!
        </h1>
        <p className="text-lg mt-2">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        {loading ? (
          <p className="text-gray-500 mt-4">Processing your order...</p>
        ) : (
          <p className="text-gray-700 mt-4">
            Order ID: <span className="font-semibold">{orderId}</span>
          </p>
        )}

        <Button onClick={() => router.push('/')} className="mt-4">
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
