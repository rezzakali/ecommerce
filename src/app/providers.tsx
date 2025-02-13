// app/providers.tsx
'use client'; // Mark this as a client component

import { ThemeProvider } from '@/src/components/theme-provider'; // Your existing ThemeProvider

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <Provider store={store}>
    <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
    // </Provider>
  );
}
