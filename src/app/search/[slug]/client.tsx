'use client';

import { ProductInterface } from '@/src/@types';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { useCart } from '@/src/context/CartContext';
import { useToast } from '@/src/hooks/use-toast';
import Image from 'next/image';
import { useState } from 'react';
import { addToCart } from '../../cart/actions';

const ProductDetails = ({ product }: { product: ProductInterface }) => {
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const { refreshCart } = useCart();

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const res = await addToCart(product._id);
      if (res?.error) {
        toast({
          title: 'Error',
          description: res.error || 'Something went wrong!',
          variant: 'destructive', // Optional: Use error styling
        });
        return; // Stop execution if there's an error
      }

      toast({
        title: 'Success',
        description: res.message || 'Product added to cart!',
      });
      setLoading(false);
      refreshCart();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Something went wrong!',
        variant: 'destructive', // Optional: Use error styling
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
      {/* Left Side - Product Image */}
      <div className="flex justify-center items-center">
        <Card className="p-4">
          <Image
            src={product.image.url}
            alt={product.name}
            width={400}
            height={400}
            className="object-contain rounded-lg"
          />
        </Card>
      </div>

      {/* Right Side - Product Details */}
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-xl font-semibold text-green-600">
          ₹{product.price.toFixed(2)}
        </p>

        {/* Stock Availability */}
        <p
          className={`text-sm ${
            product.stock > 0 ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
        </p>

        {/* Add to Cart Button */}
        <Button
          className="mt-4 w-full md:w-1/2"
          onClick={handleAddToCart}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
};

export default ProductDetails;
