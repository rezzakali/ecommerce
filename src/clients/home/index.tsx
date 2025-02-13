'use client';

import ImageComponent from '@/src/components/image-component';
import ProductCard from '@/src/components/product-card';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import React from 'react';

const products = [
  {
    id: 1,
    image: '/bag-1-dark.avif',
    name: 'Acme Circles T-Shirt',
    price: '$20.00 USD',
  },
  {
    id: 2,
    image: '/bag-1-dark.avif',
    name: 'Acme Drawstring Bag',
    price: '$12.00 USD',
  },
  { id: 3, image: '/bag-1-dark.avif', name: 'Acme Cup', price: '$15.00 USD' },
];

export default function ProductGrid() {
  return (
    <React.Fragment>
      <div className="flex flex-col md:flex-row gap-4 py-6">
        {/* Large Product Card - Takes More Space */}
        <Card className="md:flex-1 lg:flex-[3] relative overflow-hidden hover:border-blue-500 cursor-pointer group h-36 md:h-auto lg:h-auto">
          <CardContent className="p-4 flex items-center justify-center h-full relative">
            <ImageComponent
              src={products[0].image}
              alt={products[0].name}
              fill
              priority
              className="object-contain"
            />

            {/* Product Info - Stacked on Small Screens */}
            <div className="absolute left-6 bg-black/70 text-white px-4 py-2 rounded-lg flex flex-col sm:flex-row sm:items-center sm:gap-2 sm:top-6 bottom-4 sm:bottom-auto w-fit">
              <span className="text-xs">{products[0].name}</span>
              <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm mt-2 sm:mt-0">
                {products[0].price}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Two Smaller Product Cards - Flex Column */}
        <div className="flex flex-col gap-4 md:w-[40%] lg:w-[30%]">
          {products.slice(1).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <div className="overflow-x-auto whitespace-nowrap py-4">
        <div className="inline-flex space-x-4">
          {Array.from({ length: 10 }, (_, i) => (
            <Card key={i} className="w-64 flex-shrink-0">
              <CardHeader>
                <CardTitle>Card {Number(i) + 1}</CardTitle>
                <CardDescription>
                  Description for Card {Number(i) + 1}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Content for Card {Number(i) + 1}</p>
              </CardContent>
            </Card>
          ))}

          {/* Add more cards as needed */}
        </div>
      </div>
    </React.Fragment>
  );
}
