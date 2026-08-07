import React from 'react';
import { BaseLayout } from '@/app/providers/base-layout';
import { SideLayout } from '@/app/providers/side-layout';

export default function PostLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BaseLayout>
      <SideLayout>
        {children}
      </SideLayout>
    </BaseLayout>
  );
}
