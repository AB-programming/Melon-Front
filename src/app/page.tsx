import { Home } from '@/components/Home';
import React from 'react';
import { BaseLayout } from '@/app/providers/base-layout';
import { SideLayout } from '@/app/providers/side-layout';

export default function App() {
  return (
    <BaseLayout>
      <SideLayout>
        <Home />
      </SideLayout>
    </BaseLayout>
  );
}
