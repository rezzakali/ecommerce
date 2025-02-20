'use client';

import { ProductInterface } from '@/src/@types';
import ProductCard from '@/src/components/product-card';
import { Card, CardContent } from '@/src/components/ui/card';
import { sizes } from '@/src/constant/sizes';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function ProductGrid({
  products,
}: {
  products: ProductInterface[];
}) {
  return (
    <React.Fragment>
      <div className="flex flex-col md:flex-row gap-4 p-6 h-auto md:h-96 lg:h-96">
        {/* Large Product Card - Takes More Space */}
        <Link
          href={`/search/${products[0].slug}`}
          className="md:flex-1 lg:flex-[3] relative overflow-hidden hover:border-blue-500 group h-36 md:h-auto lg:h-auto border rounded-lg"
        >
          <CardContent className="p-4 flex items-center justify-center h-full relative">
            <div className="relative w-36 h-36">
              <Image
                src={products[0].image.url}
                alt={products[0].name}
                fill
                sizes={sizes}
                className="object-contain transition-transform duration-300 ease-in-out group-hover:scale-110"
              />
            </div>

            {/* Product Info - Stacked on Small Screens */}
            <div className="absolute left-6 bg-black/70 text-white px-4 py-2 rounded-lg flex flex-col sm:flex-row sm:items-center sm:gap-2 sm:top-6 bottom-4 sm:bottom-auto w-fit">
              <span className="text-xs">{products[0].name}</span>
              <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm mt-2 sm:mt-0">
                ${products[0].price?.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Link>

        {/* Two Smaller Product Cards - Flex Column */}
        <div className="flex flex-col gap-4 md:w-[40%] lg:w-[30%]">
          {products.slice(1, 3).map((product, index) => (
            <Link href={`/search/${product.slug}`} key={index}>
              <Card className="group overflow-hidden border rounded-lg transition-all hover:border-blue-500">
                <CardContent className="p-4 flex flex-col items-center justify-center relative">
                  <div className="relative w-32 h-32">
                    <Image
                      src={product.image.url}
                      alt={product.name}
                      fill
                      className="object-contain transition-transform duration-300 ease-in-out group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute left-6 bg-black/70 text-white px-4 py-2 rounded-lg flex flex-col sm:flex-row sm:items-center sm:gap-2 sm:top-6 bottom-4 sm:bottom-auto w-fit">
                    <span className="text-xs">{product.name}</span>
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm mt-2 sm:mt-0">
                      ${product.price?.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto whitespace-nowrap py-4 p-6">
        <div className="inline-flex space-x-4">
          {products.slice(3).map((product, index) => {
            return (
              <div key={index} className="w-52">
                <ProductCard product={product} />
              </div>
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
}
