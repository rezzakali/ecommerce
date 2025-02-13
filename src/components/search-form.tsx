'use client';

import { Input } from '@/src/components/ui/input';
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

  return (
    <Input
      type="text"
      placeholder="Search for products..."
      value={query}
      onChange={handleChange}
    />
  );
}
