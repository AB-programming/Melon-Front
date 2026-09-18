import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { CommentItem } from '@/components/CommentItem';
import { addToast } from '@heroui/react';
import {
  addCommentLikeRequest,
  cancelCommentLikeRequest,
  deleteCommentRequest,
  deleteReplyRequest,
} from '@/api/videoApi';
import { mockStore, resetMockStore } from '@/test/mocks/store';
import { Comment } from '@/utils/types';

jest.mock('@/api/videoApi', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createVideoApiMock } = require('@/test/mocks/videoApi');
  return createVideoApiMock();
});

jest.mock('@heroui/react', () => ({
  ...jest.requireActual('@heroui/react'),
  addToast: jest.fn(),
}));

const baseComment: Comment = {
  id: 'comment_id',
  user: {
    id: 'test_user_id',
    username: 'test_user',
    nickname: 'Tester',
    avatarUrl: 'https://example.com/avatar.png',
  },
  content: 'this is a comment',
  createdTime: '2025-01-01 00:00:00',
  likeCount: 3,
  isLiked: false,
  replyList: [],
};

function renderComment(comment: Comment) {
  const commentLikeCallback = jest.fn();
  const deleteCommentCallback = jest.fn();
  render(
    <CommentItem
      comment={comment}
      commentLikeCallback={commentLikeCallback}
      deleteCommentCallback={deleteCommentCallback}
    />,
  );
  return { commentLikeCallback, deleteCommentCallback };
}

describe('CommentItem', () => {
  beforeEach(() => {
    resetMockStore();
  });

  it('adds a comment like when not liked', async () => {
    const { commentLikeCallback } = renderComment(baseComment);
    await userEvent.click(screen.getByRole('button', { name: /3$/ }));
    await waitFor(() => {
      expect(addCommentLikeRequest).toHaveBeenCalledWith('test_user_id', 'comment_id');
    });
    expect(commentLikeCallback).toHaveBeenCalledWith(false, 'comment_id');
  });

  it('cancels a comment like when already liked', async () => {
    const { commentLikeCallback } = renderComment({ ...baseComment, isLiked: true });
    await userEvent.click(screen.getByRole('button', { name: /3$/ }));
    await waitFor(() => {
      expect(cancelCommentLikeRequest).toHaveBeenCalledWith('test_user_id', 'comment_id');
    });
    expect(commentLikeCallback).toHaveBeenCalledWith(true, 'comment_id');
  });

  it('warns and does not call API when not logged in', async () => {
    mockStore.user.id = '';
    renderComment(baseComment);
    await userEvent.click(screen.getByRole('button', { name: /3$/ }));
    await waitFor(() => {
      expect(addToast).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Warning', color: 'danger' }),
      );
    });
    expect(addCommentLikeRequest).not.toHaveBeenCalled();
  });

  it('deletes the comment after confirmation', async () => {
    const { deleteCommentCallback } = renderComment(baseComment);
    await userEvent.click(screen.getAllByRole('button')[0]);
    await userEvent.click(await screen.findByRole('option', { name: '删除' }));
    await userEvent.click(await screen.findByRole('button', { name: '确认删除' }));
    await waitFor(() => {
      expect(deleteCommentRequest).toHaveBeenCalledWith('comment_id');
    });
    expect(deleteCommentCallback).toHaveBeenCalledWith('comment_id');
  });

  it('opens comment box on reply click and adds reply after submit', async () => {
    renderComment(baseComment);
    await userEvent.click(screen.getByRole('button', { name: '回复' }));
    const textarea = await screen.findByPlaceholderText('Enter your reply');
    await userEvent.type(textarea, 'a new reply');
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    await waitFor(() => {
      expect(screen.getByText('a new reply')).toBeInTheDocument();
    });
  });

  it('deletes a reply after confirmation', async () => {
    const commentWithReply: Comment = {
      ...baseComment,
      replyList: [
        {
          id: 'reply_id',
          user: baseComment.user,
          content: 'a reply',
          type: 'c',
          targetId: 'comment_id',
          targetUser: baseComment.user,
          createdTime: '2025-01-01 00:00:00',
        },
      ],
    };
    renderComment(commentWithReply);
    expect(screen.getByText('a reply')).toBeInTheDocument();
    const ellipsisIcons = document.querySelectorAll('svg.lucide-ellipsis');
    await userEvent.click(ellipsisIcons[ellipsisIcons.length - 1]);
    await userEvent.click(await screen.findByRole('option', { name: '删除' }));
    await userEvent.click(await screen.findByRole('button', { name: '确认删除' }));
    await waitFor(() => {
      expect(deleteReplyRequest).toHaveBeenCalledWith('reply_id');
    });
    expect(screen.queryByText('a reply')).not.toBeInTheDocument();
  });
});
