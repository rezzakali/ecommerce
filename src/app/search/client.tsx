'use client';

import { HomeSearchInterface } from '@/src/@types';
import ProductCard from '@/src/components/product-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const sortingOptions = [
  { label: 'Newest', value: 'createdAt_desc' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

const SearchClient: React.FC<HomeSearchInterface> = ({
  categories,
  products,
}) => {
  const [sortOption, setSortOption] = useState<string>(sortingOptions[0].value);

  const searchParams = useSearchParams();
  const searchedCategory = searchParams.get('category');
  const pathname = usePathname();
  const router = useRouter();

  // Function to update the URL without reloading the page
  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`/search?${params.toString()}`, { scroll: false }); // Update URL without page reload
  };

  // Sorting handler
  const handleSort = (value: string) => {
    setSortOption(value);
    updateQuery('sort', value);
  };

  // Clear filter
  const clearFilter = () => {
    router.replace(pathname);
  };

  return (
    <div className="p-4">
      {/* Mobile: Categories & Sorting as Select Options */}
      <div className="block sm:hidden mb-4">
        <div className="flex flex-col gap-2">
          <Select
            value={searchedCategory || 'all'}
            onValueChange={(value) => updateQuery('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortOption} onValueChange={handleSort}>
            <SelectTrigger>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              {sortingOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Desktop: Sidebar & Sorting */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left Sidebar - Categories (Hidden on Mobile) */}
        <div className="col-span-2 p-4 rounded-lg hidden sm:block">
          <h3 className="text-sm mb-3 text-gray-500">Collections</h3>
          <h3
            className="text-sm hover:underline cursor-pointer capitalize"
            onClick={clearFilter}
          >
            All
          </h3>
          <div className="flex flex-col gap-2">
            {categories.map((category) => (
              <p
                key={category._id}
                className={`hover:underline cursor-pointer capitalize ${
                  searchedCategory === category.name ? 'underline' : ''
                }`}
                onClick={() => updateQuery('category', category.name)}
              >
                {category.name}
              </p>
            ))}
          </div>
        </div>

        {/* Center - Product Grid */}
        <div className="col-span-12 sm:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.length === 0 ? (
            <div className="col-span-3 text-center mt-6">
              No products found.
            </div>
          ) : (
            products.map((item, index) => (
              <ProductCard key={index} product={item} />
            ))
          )}
        </div>

        {/* Right Sidebar - Sorting (Hidden on Mobile) */}
        <div className="col-span-2 p-4 rounded-lg hidden sm:block">
          <h3 className="font-semibold mb-3">Sort By</h3>
          <Select value={sortOption} onValueChange={handleSort}>
            <SelectTrigger>
              <SelectValue placeholder="Select sorting" />
            </SelectTrigger>
            <SelectContent>
              {sortingOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SearchClient;
