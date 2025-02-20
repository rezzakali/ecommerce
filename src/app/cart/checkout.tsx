'use client';

import { Button } from '@/src/components/ui/button';

import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const Checkout = ({ totalAmount }: { totalAmount: number }) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: null,
    });

    const data = await res.json();
    if (data.sessionId) {
      const stripe = await stripePromise;
      stripe?.redirectToCheckout({ sessionId: data.sessionId });
    }
    setLoading(false);
  };

  return (
    <div className="w-full md:w-1/3">
      <div className="p-4 border rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Checkout</h3>
        <div className="text-right font-semibold text-xl mb-4">
          Total: ₹{totalAmount.toFixed(2)}
        </div>
        <Button className="w-full" onClick={handleCheckout}>
          {loading ? 'Processing...' : 'Proceed to Checkout'}
        </Button>
      </div>
    </div>
  );
};

export default Checkout;
