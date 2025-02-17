'use client';

import { ProductInterface } from '@/src/@types';
import ImageComponent from '@/src/components/image-component';
import ProductCard from '@/src/components/product-card';
import { Card, CardContent } from '@/src/components/ui/card';
import React from 'react';

export default function ProductGrid({
  products,
}: {
  products: ProductInterface[];
}) {
  return (
    <React.Fragment>
      <div className="flex flex-col md:flex-row gap-4 p-6">
        {/* Large Product Card - Takes More Space */}
        <Card className="md:flex-1 lg:flex-[3] relative overflow-hidden hover:border-blue-500 cursor-pointer group h-36 md:h-auto lg:h-auto">
          <CardContent className="p-4 flex items-center justify-center h-full relative">
            <ImageComponent
              src={products[0].image.url}
              alt={products[0].name}
              fill
              priority
              className="object-contain"
            />

            {/* Product Info - Stacked on Small Screens */}
            <div className="absolute left-6 bg-black/70 text-white px-4 py-2 rounded-lg flex flex-col sm:flex-row sm:items-center sm:gap-2 sm:top-6 bottom-4 sm:bottom-auto w-fit">
              <span className="text-xs">{products[0].name}</span>
              <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm mt-2 sm:mt-0">
                &#8377;{products[0].price?.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Two Smaller Product Cards - Flex Column */}
        <div className="flex flex-col gap-4 md:w-[40%] lg:w-[30%]">
          {products.slice(1, 3).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
      <div className="overflow-x-auto whitespace-nowrap py-4 p-6">
        <div className="inline-flex space-x-4">
          {products.slice(3).map((product, index) => {
            return (
              <div className="w-72" key={index}>
                <ProductCard product={product} />
              </div>
            );
          })}

          {/* Add more cards as needed */}
        </div>
      </div>
    </React.Fragment>
  );
}
