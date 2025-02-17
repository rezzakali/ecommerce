'use client';

import { Input } from '@/src/components/ui/input';
import { cn } from '@/src/lib/utils'; // Ensure you have the `cn` utility for conditional classNames
import { X } from 'lucide-react';
import { useState } from 'react';

interface SearchFormProps {
  onSearch: (query: string) => void;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="Search for products..."
        value={query}
        onChange={handleChange}
        className="pr-10"
      />
      {query && (
        <button
          type="button"
          onClick={clearSearch}
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full',
            'bg-muted hover:bg-gray-300 transition-all'
          )}
        >
          <X size={16} className="text-gray-600" />
        </button>
      )}
    </div>
  );
}
