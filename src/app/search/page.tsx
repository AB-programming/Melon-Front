import React, { Suspense } from 'react';
import { SearchResults } from '@/components/SearchResults';

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}
