import React from 'react';
import { BaseLayout } from '@/app/providers/base-layout';

export default function WatchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <BaseLayout>{children}</BaseLayout>;
}
