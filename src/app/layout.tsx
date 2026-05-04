import type { Metadata } from 'next';
import './globals.css';
import localFont from 'next/font/local';
import { Provider } from '@/app/providers/provider';
import React from 'react';

export const metadata: Metadata = {
  title: 'Melon',
  description: 'A life sharing website',
};

const aliAgile = localFont({
  src: '../fonts/AlimamaAgileVF-Thin.woff',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={aliAgile.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
