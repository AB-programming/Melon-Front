import { Header } from '@/components/Header';
import React from 'react';

export function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main className="mt-16 flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
