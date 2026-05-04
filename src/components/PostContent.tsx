'use client';

import { addToast, Button, cn, Image, Link, User } from '@heroui/react';
import { HttpCode, Post } from '@/utils/types';
import { useEffect, useState } from 'react';
import { addPostLikeRequest, deletePostLikeRequest, getPostRequest } from '@/api/postApi';
import { useStore } from '@/utils/store';
import { ThumbsUp } from 'lucide-react';

interface PostContentProps {
  postId: string;
}

export function PostContent({ postId }: PostContentProps) {
  const [post, setPost] = useState<Post | null>(null);
  const user = useStore((state) => state.user);

  useEffect(() => {
    const getPost = async () => {
      console.log('getPost', user.id);
      const result = await getPostRequest(postId, user.id);
      if (result.code === HttpCode.OK) {
        setPost(result.data);
      }
    };
    getPost().then();
  }, [postId, user.id]);

  async function handlePostLike() {
    if (
      localStorage.getItem('login_status') == undefined ||
      localStorage.getItem('login_status') === 'false'
    ) {
      addToast({
        title: 'Un Authorization',
        description: 'Please login first!',
        color: 'warning',
        variant: 'flat',
      });
      return;
    }
    if (post !== null && post.isLike) {
      const deleteResult = await deletePostLikeRequest(user.id, postId);
      if (deleteResult.code === HttpCode.OK) {
        setPost(prevState => {
          if (prevState) {
            return {
              ...prevState,
              isLike: false,
              likeCount: prevState.likeCount - 1,
            };
          } else {
            return null;
          }
        });
      }
    } else {
      const addResult= await addPostLikeRequest(user.id, postId);
      if (addResult.code === HttpCode.OK) {
        setPost(prevState => {
          if (prevState) {
            return {
              ...prevState,
              isLike: true,
              likeCount: prevState.likeCount + 1,
            }
          } else {
            return null;
          }
        });
      }
    }
  }

  return (
    <div className="mt-5 px-3 flex flex-col items-start space-y-4">
      <User
        avatarProps={{
          src: post?.user.avatarUrl,
        }}
        description={
          <Link isExternal href="https://x.com/jrgarciadev" size="sm">
            @{post?.user.username}
          </Link>
        }
        name={post?.user.nickname}
      />
      <div className="flex flex-col space-y-4">
        <p>{post?.content}</p>
        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
          {post?.images.map((image, index) => (
            <Image
              key={index}
              alt="HeroUI hero Image"
              src={`http://localhost:8080/post/image?image=${image}`}
              width={300}
              isBlurred
              isZoomed
            />
          ))}
        </div>
        <div className="px-2 py-3 flex items-center gap-2">
          <Button
            onPress={handlePostLike}
            variant="ghost"
            size="sm"
            className={cn(
              'h-7 px-2 text-xs font-normal transition-all duration-200',
              'hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400',
              post?.isLike &&
                'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950',
            )}
          >
            <ThumbsUp
              className={cn(
                'w-3.5 h-3.5 transition-all duration-200',
                post?.isLike && 'fill-current',
              )}
            />
            {post?.likeCount}
          </Button>
        </div>
      </div>
    </div>
  );
}
