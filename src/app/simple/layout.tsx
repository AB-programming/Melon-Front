import React from 'react';
import { BaseLayout } from '@/app/providers/base-layout';

export default function SimpleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <BaseLayout>{children}</BaseLayout>
    </div>
  );
}
