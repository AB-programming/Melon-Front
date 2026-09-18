import { Comment, HttpCode, Reply } from '@/utils/types';
import {
  addToast,
  Avatar,
  Button,
  cn,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from '@heroui/react';
import {
  Ellipsis,
  Flag,
  Reply as ReplyIcon,
  ThumbsUp,
  Trash2,
} from 'lucide-react';
import { useStore } from '@/utils/store';
import {
  addCommentLikeRequest,
  cancelCommentLikeRequest,
  deleteCommentRequest,
  deleteReplyRequest,
} from '@/api/videoApi';
import { CommentBox } from '@/components/CommentBox';
import { Fragment, useState } from 'react';
import { ReplyItem } from '@/components/ReplyItem';

interface CommentItemProps {
  comment: Comment;
  commentLikeCallback: (isLike: boolean, commentId: string) => void;
  deleteCommentCallback: (commentId: string) => void;
}

export function CommentItem({
  comment,
  commentLikeCallback,
  deleteCommentCallback,
}: CommentItemProps) {
  const user = useStore((state) => state.user);
  const [localReplyList, setLocalReplyList] = useState<Reply[]>(comment.replyList ?? []);
  const [pendingDelete, setPendingDelete] = useState<
    { type: 'comment'; id: string } | { type: 'reply'; id: string } | null
  >(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [
    replyContext,
    setReplyContext,
  ] = useState<{ type: 'comment' } | { type: 'reply'; replyId: string } | null>(null);

  async function handleCommentLike(isLike: boolean, commentId: string) {
    if (user.id === '') {
      addToast({
        title: 'Warning',
        description: 'Please login',
        color: 'danger',
      });
      return;
    }
    if (isLike) {
      const result = await cancelCommentLikeRequest(user.id, commentId);
      if (result.code === HttpCode.OK) {
        commentLikeCallback(isLike, commentId);
      }
    } else {
      const result = await addCommentLikeRequest(user.id, commentId);
      if (result.code === HttpCode.OK) {
        commentLikeCallback(isLike, commentId);
      }
    }
  }

  function handleDeleteReplyClick(replyId: string) {
    setPendingDelete({ type: 'reply', id: replyId });
    onOpen();
  }

  function handleDeleteCommentClick(commentId: string) {
    setPendingDelete({ type: 'comment', id: commentId });
    onOpen();
  }

  async function confirmDelete(onClose: () => void) {
    if (!pendingDelete) return;
    if (pendingDelete.type === 'comment') {
      const result = await deleteCommentRequest(pendingDelete.id);
      if (result.code === HttpCode.OK) {
        addToast({
          title: '成功',
          description: '评论已删除',
          color: 'success',
        });
        deleteCommentCallback(pendingDelete.id);
      }
    } else {
      const result = await deleteReplyRequest(pendingDelete.id);
      if (result.code === HttpCode.OK) {
        addToast({
          title: '成功',
          description: '回复已删除',
          color: 'success',
        });
        setLocalReplyList((prev) => prev.filter((r) => r.id !== pendingDelete.id));
      }
    }
    setPendingDelete(null);
    onClose();
  }

  async function sendReplyCallback(reply: Comment | Reply) {
    const newReply = reply as Reply;
    addToast({
      title: '成功',
      description: '回复发布成功',
      color: 'success',
    });
    setLocalReplyList((prev) => [...prev, newReply]);
    setReplyContext(null);
  }

  return (
    <div className="flex gap-4">
      <Avatar src={comment.user.avatarUrl} />
      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex justify-between items-center">
          <p className="text-sm">
            @{comment.user.nickname}&nbsp;&nbsp;
            <span className="text-gray-400 text-xs">{comment.createdTime}</span>
          </p>
          <Popover placement="bottom">
            <PopoverTrigger>
              <Button
                variant="light"
                isIconOnly
                className="w-14 h-7"
                radius="sm"
              >
                <Ellipsis />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Listbox aria-label="More options menu" disabledKeys={comment.user.id !== user.id ? ['delete'] : []}>
                <ListboxItem
                  showDivider
                  key="new"
                  startContent={<Flag size={18} />}
                >
                  举报
                </ListboxItem>
                  <ListboxItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    startContent={<Trash2 size={18} />}
                    onPress={() => handleDeleteCommentClick(comment.id)}
                  >
                  删除
                </ListboxItem>
              </Listbox>
            </PopoverContent>
          </Popover>
        </div>
        <p>{comment.content}</p>
        <div className="flex gap-2">
          <Button
            onPress={() => handleCommentLike(comment.isLiked, comment.id)}
            variant="ghost"
            size="sm"
            className={cn(
              'h-7 px-2 text-xs font-normal transition-all duration-200',
              'hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400',
              comment.isLiked &&
                'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950',
            )}
          >
            <ThumbsUp
              className={cn(
                'w-3.5 h-3.5 transition-all duration-200',
                comment.isLiked && 'fill-current',
              )}
            />
            {comment.likeCount}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-7 px-2 text-xs font-normal transition-all duration-200',
              'hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950 dark:hover:text-green-400',
            )}
            onPress={() => setReplyContext({ type: 'comment' })}
          >
            <ReplyIcon className="w-3.5 h-3.5" />
            回复
          </Button>
        </div>
        {replyContext?.type === 'comment' && (
          <CommentBox
            type="reply"
            commentId={comment.id}
            targetId={comment.id}
            replyType="c"
            submitCallback={sendReplyCallback}
            cancelCallback={() => setReplyContext(null)}
          />
        )}
        <div>
          {localReplyList?.map((reply) => (
            <Fragment key={reply.id}>
              <ReplyItem
                reply={reply}
                deleteReplyCallback={handleDeleteReplyClick}
                onReplyClick={(replyId) => setReplyContext({ type: 'reply', replyId })}
              />
              {replyContext?.type === 'reply' &&
                replyContext.replyId === reply.id && (
                  <div className="ml-11 mt-2">
                    <CommentBox
                      type="reply"
                      commentId={comment.id}
                      targetId={reply.id}
                      replyType="r"
                      submitCallback={sendReplyCallback}
                      cancelCallback={() => setReplyContext(null)}
                    />
                  </div>
                )}
            </Fragment>
          ))}
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                确认删除
              </ModalHeader>
              <ModalBody>
                {pendingDelete?.type === 'comment'
                  ? '确定要删除这条评论吗？'
                  : '确定要删除这条回复吗？'}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button color="danger" onPress={() => confirmDelete(onClose)}>
                  确认删除
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
