'use client';

import { PostTabs } from '@/components/PostTabs';
import { PostBody } from '@/components/PostBody';
import { useCallback, useEffect, useState } from 'react';
import { HttpCode, HttpResponse, Post } from '@/utils/types';
import {
  fetchAllPostRequest,
  fetchFollowedPostsRequest,
  fetchPostListWithUserIdRequest,
} from '@/api/postApi';
import { useStore } from '@/utils/store';
import { PostContext } from '@/context/PostContext';

export function PostContainer() {
  const [postList, setPostList] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'discover' | 'follow'>('discover');
  const user = useStore((state) => state.user);

  const isLoggedIn = user.id !== '';

  function handleAddPostLike(postId: string) {
    setPostList(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, isLike: true, likeCount: post.likeCount + 1 }
          : post,
      ),
    );
  }

  function handleRemovePostLike(postId: string) {
    setPostList(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, isLike: false, likeCount: post.likeCount - 1 }
          : post,
      ),
    );
  }

  function handleDeletePost(postId: string) {
    setPostList(prevPosts => prevPosts.filter(post => post.id !== postId));
  }

  function addPostCallback(post: Post) {
    if (activeTab === 'discover') {
      setPostList(prev => [post, ...prev]);
    }
  }

  function handleTabChange(tab: string) {
    if (tab === 'discover' || tab === 'follow') {
      setActiveTab(tab);
    }
  }

  const initPostList = useCallback(async () => {
    let result: HttpResponse<Post[]>;
    if (activeTab === 'discover') {
      const loginStatus = localStorage.getItem('login_status');
      if (loginStatus === 'true' && user.id) {
        result = await fetchPostListWithUserIdRequest(user.id);
      } else {
        result = await fetchAllPostRequest();
      }
    } else {
      result = await fetchFollowedPostsRequest(user.id);
    }
    if (result.code === HttpCode.OK) {
      setPostList(result.data);
    }
  }, [activeTab, user.id]);

  useEffect(() => {
    initPostList().then();
  }, [initPostList]);

  return (
    <>
      <PostTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isLoggedIn={isLoggedIn}
        addPostCallbackAction={addPostCallback}
      />
      <PostContext.Provider value={{ postList, handleAddPostLike, handleRemovePostLike, handleDeletePost }}>
        <PostBody />
      </PostContext.Provider>
    </>
  );
}
