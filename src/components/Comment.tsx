'use client';

import { Comment as CommentType, HttpCode, Reply, Video } from '@/utils/types';
import { addToast, Avatar } from '@heroui/react';
import { useStore } from '@/utils/store';
import { useEffect, useState } from 'react';
import { fetchCommentListRequest } from '@/api/videoApi';
import { CommentBox } from '@/components/CommentBox';
import { CommentItem } from '@/components/CommentItem';
import { numberDisplay } from '@/utils/conversion';

interface Props {
  video: Video;
}

export function Comment({ video }: Props) {
  const user = useStore((state) => state.user);
  const [commentList, setCommentList] = useState<CommentType[]>([]);

  useEffect(() => {
    const fetchCommentList = async function () {
      const result = await fetchCommentListRequest(user.id, video.id);
      if (result.code === HttpCode.OK) {
        setCommentList(result.data);
      }
    };
    if (video.id !== '') {
      fetchCommentList().then();
    }
  }, [user, video]);

  async function sendCommentCallback(comment: CommentType | Reply) {
    comment = comment as CommentType;
    setCommentList([comment, ...commentList]);
    addToast({
      title: 'Success',
      description: 'Comment success',
      color: 'success',
    });
  }

  async function commentLikeCallback(isLike: boolean, commentId: string) {
    if (isLike) {
      setCommentList((prevList) =>
        prevList.map((comment) =>
          commentId === comment.id
            ? { ...comment, isLiked: false, likeCount: comment.likeCount - 1 }
            : comment,
        ),
      );
    } else {
      setCommentList((prevList) =>
        prevList.map((comment) =>
          commentId === comment.id
            ? { ...comment, isLiked: true, likeCount: comment.likeCount + 1 }
            : comment,
        ),
      );
    }
  }

  async function deleteCommentCallback(commentId: string) {
    setCommentList((prevList) =>
      prevList.filter((comment) => comment.id !== commentId),
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      <h3 className="text-lg font-bold">{numberDisplay(commentList.length)}条评论</h3>
      <div className="flex gap-4">
        <Avatar src={user.avatarUrl} />
        <CommentBox
          type="comment"
          video={video}
          submitCallback={sendCommentCallback}
        />
      </div>
      {/*  Comment list */}
      <div className="flex flex-col gap-8">
        {commentList.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            commentLikeCallback={commentLikeCallback}
            deleteCommentCallback={deleteCommentCallback}
          />
        ))}
      </div>
    </div>
  );
}
