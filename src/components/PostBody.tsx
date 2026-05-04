'use client';

import { ScrollShadow } from '@heroui/react';
import { PostItem } from './PostItem';
import { useContext } from 'react';
import { PostContext } from '@/context/PostContext';

export function PostBody() {
  const postList = useContext(PostContext).postList;

  return (
    <ScrollShadow hideScrollBar>
      <div className="flex flex-col space-y-4 pl-2 pr-4 mb-16">
        {postList.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </ScrollShadow>
  );
}
