import React from 'react';
import { Sidebar } from '@/components/Sidebar';

export function SideLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100vh-4rem)]">
      <div className="w-1/6 overflow-auto scrollbar-hide pb-4">
        <Sidebar />
      </div>
      <div className="w-full h-screen overflow-auto">
        {children}
      </div>
    </div>
  );
}
