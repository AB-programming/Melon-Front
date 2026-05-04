import { Post } from '@/utils/types';
import { createContext } from 'react';

interface PostContext {
  postList: Post[],
  handleAddPostLike: (postId: string) => void,
  handleRemovePostLike: (postId: string) => void,
  handleDeletePost: (postId: string) => void,
}

export const PostContext = createContext<PostContext>({
  postList: [],
  handleAddPostLike: () => {},
  handleRemovePostLike: () => {},
  handleDeletePost: () => {},
})