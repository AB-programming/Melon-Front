'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Pagination, Spinner, Tab, Tabs } from '@heroui/react';
import {
  HttpCode,
  PageResult,
  Post,
  SearchAllResult,
  User,
  Video,
} from '@/utils/types';
import {
  searchAllRequest,
  searchPostRequest,
  searchUserRequest,
  searchVideoRequest,
} from '@/api/searchApi';
import { VideoList } from '@/components/VideoList';
import { PostItem } from '@/components/PostItem';
import { UserCard } from '@/components/UserCard';
import { PostContext } from '@/context/PostContext';
import { useStore } from '@/utils/store';

type SearchTab = 'all' | 'video' | 'user' | 'post';

const VIDEO_PAGE_SIZE = 12;
const USER_PAGE_SIZE = 10;
const POST_PAGE_SIZE = 10;

export function SearchResults() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') ?? '';
  const user = useStore((state) => state.user);

  const [activeTab, setActiveTab] = useState<SearchTab>('all');
  const [loading, setLoading] = useState(false);

  const [allResult, setAllResult] = useState<SearchAllResult | null>(null);
  const [videoResult, setVideoResult] = useState<PageResult<Video> | null>(
    null,
  );
  const [userResult, setUserResult] = useState<PageResult<User> | null>(null);
  const [postResult, setPostResult] = useState<PageResult<Post> | null>(null);

  const [videoPageNum, setVideoPageNum] = useState(1);
  const [userPageNum, setUserPageNum] = useState(1);
  const [postPageNum, setPostPageNum] = useState(1);

  // Reset tab and page numbers when the keyword changes
  useEffect(() => {
    setActiveTab('all');
    setVideoPageNum(1);
    setUserPageNum(1);
    setPostPageNum(1);
  }, [keyword]);

  useEffect(() => {
    if (!keyword) {
      return;
    }
    let cancelled = false;
    setLoading(true);

    async function load() {
      if (activeTab === 'all') {
        const result = await searchAllRequest(keyword, user.id || undefined);
        if (!cancelled && result.code === HttpCode.OK) {
          setAllResult(result.data);
        }
      } else if (activeTab === 'video') {
        const result = await searchVideoRequest(
          keyword,
          videoPageNum,
          VIDEO_PAGE_SIZE,
        );
        if (!cancelled && result.code === HttpCode.OK) {
          setVideoResult(result.data);
        }
      } else if (activeTab === 'user') {
        const result = await searchUserRequest(
          keyword,
          userPageNum,
          USER_PAGE_SIZE,
        );
        if (!cancelled && result.code === HttpCode.OK) {
          setUserResult(result.data);
        }
      } else {
        const result = await searchPostRequest(
          keyword,
          postPageNum,
          POST_PAGE_SIZE,
          user.id || undefined,
        );
        if (!cancelled && result.code === HttpCode.OK) {
          setPostResult(result.data);
        }
      }
      if (!cancelled) {
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [keyword, activeTab, videoPageNum, userPageNum, postPageNum, user.id]);

  function updatePostLike(postId: string, isLike: boolean) {
    const mapLike = (post: Post) =>
      post.id === postId
        ? {
            ...post,
            isLike,
            likeCount: post.likeCount + (isLike ? 1 : -1),
          }
        : post;
    setPostResult((prev) =>
      prev ? { ...prev, records: prev.records.map(mapLike) } : prev,
    );
    setAllResult((prev) =>
      prev
        ? {
            ...prev,
            posts: { ...prev.posts, records: prev.posts.records.map(mapLike) },
          }
        : prev,
    );
  }

  function handleAddPostLike(postId: string) {
    updatePostLike(postId, true);
  }

  function handleRemovePostLike(postId: string) {
    updatePostLike(postId, false);
  }

  function handleDeletePost(postId: string) {
    const filterPost = (post: Post) => post.id !== postId;
    setPostResult((prev) =>
      prev
        ? {
            ...prev,
            records: prev.records.filter(filterPost),
            total: prev.total - 1,
          }
        : prev,
    );
    setAllResult((prev) =>
      prev
        ? {
            ...prev,
            posts: {
              ...prev.posts,
              records: prev.posts.records.filter(filterPost),
              total: prev.posts.total - 1,
            },
          }
        : prev,
    );
  }

  function renderEmpty() {
    return (
      <div className="flex justify-center py-10 text-gray-400">
        暂无相关结果
      </div>
    );
  }

  function renderSectionHeader(title: string, hasMore: boolean, tab: SearchTab) {
    return (
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">{title}</h3>
        {hasMore && (
          <Button
            variant="light"
            size="sm"
            color="primary"
            onPress={() => setActiveTab(tab)}
          >
            查看更多 →
          </Button>
        )}
      </div>
    );
  }

  function renderUserGrid(users: User[]) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {users.map((item) => (
          <UserCard key={item.id} user={item} />
        ))}
      </div>
    );
  }

  function renderPostList(posts: Post[]) {
    return (
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    );
  }

  function renderAll() {
    if (!allResult) {
      return null;
    }
    return (
      <div className="flex flex-col gap-10">
        <section>
          {renderSectionHeader(
            '视频',
            allResult.videos.total > allResult.videos.records.length,
            'video',
          )}
          {allResult.videos.records.length > 0 ? (
            <VideoList
              videoList={allResult.videos.records}
              className="grid grid-cols-3 gap-4 py-2"
            />
          ) : (
            renderEmpty()
          )}
        </section>
        <section>
          {renderSectionHeader(
            '用户',
            allResult.users.total > allResult.users.records.length,
            'user',
          )}
          {allResult.users.records.length > 0
            ? renderUserGrid(allResult.users.records)
            : renderEmpty()}
        </section>
        <section>
          {renderSectionHeader(
            '帖子',
            allResult.posts.total > allResult.posts.records.length,
            'post',
          )}
          {allResult.posts.records.length > 0
            ? renderPostList(allResult.posts.records)
            : renderEmpty()}
        </section>
      </div>
    );
  }

  function renderPaged(
    result: PageResult<unknown> | null,
    pageNum: number,
    setPageNum: (page: number) => void,
    content: React.ReactNode,
    isEmpty: boolean,
  ) {
    return (
      <div className="flex flex-col gap-6">
        {isEmpty ? renderEmpty() : content}
        {result && result.total > 0 && (
          <div className="flex justify-center">
            <Pagination
              showControls
              total={Math.ceil(result.total / result.pageSize)}
              page={pageNum}
              onChange={setPageNum}
            />
          </div>
        )}
      </div>
    );
  }

  if (!keyword) {
    return (
      <div className="flex justify-center py-20 text-gray-400">
        请输入搜索关键字
      </div>
    );
  }

  return (
    <PostContext.Provider
      value={{
        postList: postResult?.records ?? [],
        handleAddPostLike,
        handleRemovePostLike,
        handleDeletePost,
      }}
    >
      <div className="px-8 py-4 mb-16">
        <h2 className="text-xl font-medium mb-4">搜索：{keyword}</h2>
        <Tabs
          aria-label="Search result tabs"
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as SearchTab)}
          className="mb-4"
        >
          <Tab key="all" title="全部" />
          <Tab key="video" title="视频" />
          <Tab key="user" title="用户" />
          <Tab key="post" title="帖子" />
        </Tabs>
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {activeTab === 'all' && renderAll()}
            {activeTab === 'video' &&
              renderPaged(
                videoResult,
                videoPageNum,
                setVideoPageNum,
                videoResult && (
                  <VideoList
                    videoList={videoResult.records}
                    className="grid grid-cols-3 gap-4 py-2"
                  />
                ),
                !videoResult || videoResult.records.length === 0,
              )}
            {activeTab === 'user' &&
              renderPaged(
                userResult,
                userPageNum,
                setUserPageNum,
                userResult && renderUserGrid(userResult.records),
                !userResult || userResult.records.length === 0,
              )}
            {activeTab === 'post' &&
              renderPaged(
                postResult,
                postPageNum,
                setPostPageNum,
                postResult && renderPostList(postResult.records),
                !postResult || postResult.records.length === 0,
              )}
          </>
        )}
      </div>
    </PostContext.Provider>
  );
}
