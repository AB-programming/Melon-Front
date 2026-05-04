import React from 'react';
import { BaseLayout } from '@/app/providers/base-layout';
import { SideLayout } from '@/app/providers/side-layout';
import PostRanking from '@/components/PostRanking';

export default function PostLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BaseLayout>
      <SideLayout>
        <div className="flex h-screen">
          {/* left section */}
          <div className="w-2/3 flex flex-col h-full">
            {children}
          </div>
          {/* right section */}
          <div className="w-1/3 h-full border-l">
            <PostRanking />
          </div>
        </div>
      </SideLayout>
    </BaseLayout>
  );
}
