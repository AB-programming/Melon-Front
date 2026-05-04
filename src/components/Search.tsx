import { Input } from '@heroui/react';
import { SearchIcon } from 'lucide-react';
import { KeyboardEvent } from 'react';

export function Search() {
  return (
    <div>
      <Input
        variant="bordered"
        className="w-80"
        isClearable
        placeholder="Type to search"
        radius="lg"
        startContent={<SearchIcon />}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            console.log(e.currentTarget.value)
          }
        }}
      />
    </div>
  );
}
