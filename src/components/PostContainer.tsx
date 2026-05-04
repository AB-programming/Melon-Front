'use client';

import { PostTabs } from '@/components/PostTabs';
import { PostBody } from '@/components/PostBody';
import { useEffect, useState } from 'react';
import { HttpCode, HttpResponse, Post } from '@/utils/types';
import {
  fetchAllPostRequest,
  fetchPostListWithUserIdRequest,
} from '@/api/postApi';
import { useStore } from '@/utils/store';
import { PostContext } from '@/context/PostContext';

export function PostContainer() {
  const [postList, setPostList] = useState<Post[]>([]);
  const user = useStore((state) => state.user);

  // Update the like status after liking a post
  function handleAddPostLike(postId: string) {
    setPostList(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, isLike: true, likeCount: post.likeCount + 1 }
          : post,
      ),
    );
  }

  // Update the like status after unliking a post
  function handleRemovePostLike(postId: string) {
    setPostList(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, isLike: false, likeCount: post.likeCount - 1 }
          : post,
      ),
    );
  }

  // Re-render the page after delete a post
  function handleDeletePost(postId: string) {
    setPostList(prevPosts => prevPosts.filter(post => post.id !== postId));
  }

  async function addPostCallback(post: Post) {
    setPostList([post, ...postList]);
  }

  useEffect(() => {
    const initPostList = async () => {
      const loginStatus = localStorage.getItem('login_status');
      let result: HttpResponse<Post[]>;
      if (loginStatus === 'true') {
        result = await fetchPostListWithUserIdRequest(user.id);
      } else {
        result = await fetchAllPostRequest();
      }
      if (result.code === HttpCode.OK) {
        setPostList(result.data);
      }
    };
    initPostList().then();
  }, [user.id]);

  return (
    <>
      {/* tab section */}
      <PostTabs addPostCallbackAction={addPostCallback} />
      {/* body section */}
      <PostContext.Provider value={{ postList, handleAddPostLike, handleRemovePostLike, handleDeletePost }}>
        <PostBody />
      </PostContext.Provider>
    </>
  );
}
