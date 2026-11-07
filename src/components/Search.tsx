'use client';

import { Input } from '@heroui/react';
import { SearchIcon } from 'lucide-react';
import { KeyboardEvent, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function Search() {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState('');

  useEffect(() => {
    if (pathname === '/search') {
      const params = new URLSearchParams(window.location.search);
      setValue(params.get('keyword') ?? '');
    }
  }, [pathname]);

  function handleSearch() {
    const trimmed = value.trim();
    if (trimmed) {
      router.push(`/search?keyword=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <div>
      <Input
        variant="bordered"
        className="w-80"
        isClearable
        placeholder="Type to search"
        radius="lg"
        value={value}
        onValueChange={setValue}
        startContent={<SearchIcon />}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
    </div>
  );
}
