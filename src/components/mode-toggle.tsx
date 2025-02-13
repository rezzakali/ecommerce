'use client';

import { Laptop, Moon, Sun } from 'lucide-react';
import { useTheme } from './theme-provider';

export default function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <div className="flex gap-3 items-center border px-2 rounded-full py-1">
      <Sun
        className="w-4 h-4 cursor-pointer"
        onClick={() => setTheme('light')}
      />
      <Moon
        className="w-4 h-4 dark:text-gray-300 cursor-pointer"
        onClick={() => setTheme('dark')}
      />
      <Laptop
        className="w-4 h-4 cursor-pointer"
        onClick={() => setTheme('system')}
      />
    </div>
  );
}
