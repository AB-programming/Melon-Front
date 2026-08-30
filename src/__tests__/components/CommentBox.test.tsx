import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { CommentBox } from '@/components/CommentBox';
import { HttpCode, Video } from '@/utils/types';
import { sendCommentRequest, sendReplyRequest } from '@/api/videoApi';

jest.mock('@/api/videoApi', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createVideoApiMock } = require('@/test/mocks/videoApi');
  return createVideoApiMock();
});

const video: Video = {
  id: 'video_id',
  title: 'Test Video',
  description: 'desc',
  author: { id: 'author_id', username: 'author', nickname: 'Author' },
};

describe('CommentBox', () => {
  it('sends a comment and clears the textarea', async () => {
    const submitCallback = jest.fn();
    render(
      <CommentBox type="comment" video={video} submitCallback={submitCallback} />,
    );
    const textarea = screen.getByPlaceholderText('Enter your comment');
    await userEvent.type(textarea, 'nice video');
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    await waitFor(() => {
      expect(sendCommentRequest).toHaveBeenCalledWith('test_user_id', 'video_id', 'nice video');
    });
    expect(submitCallback).toHaveBeenCalled();
    expect(textarea).toHaveValue('');
  });

  it('sends a reply with reply params', async () => {
    const submitCallback = jest.fn();
    render(
      <CommentBox
        type="reply"
        commentId="comment_id"
        targetId="target_id"
        replyType="c"
        submitCallback={submitCallback}
      />,
    );
    const textarea = screen.getByPlaceholderText('Enter your reply');
    await userEvent.type(textarea, 'a reply');
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    await waitFor(() => {
      expect(sendReplyRequest).toHaveBeenCalledWith(
        'test_user_id',
        'target_id',
        'comment_id',
        'c',
        'a reply',
      );
    });
    expect(submitCallback).toHaveBeenCalled();
  });

  it('does not call submitCallback when request fails', async () => {
    const submitCallback = jest.fn();
    (sendCommentRequest as jest.Mock).mockResolvedValueOnce({
      code: HttpCode.BAD_REQUEST,
      message: 'Bad Request',
      data: null,
    });
    render(
      <CommentBox type="comment" video={video} submitCallback={submitCallback} />,
    );
    await userEvent.type(screen.getByPlaceholderText('Enter your comment'), 'x');
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    await waitFor(() => {
      expect(sendCommentRequest).toHaveBeenCalled();
    });
    expect(submitCallback).not.toHaveBeenCalled();
  });

  it('clears text and calls cancelCallback on Cancel', async () => {
    const cancelCallback = jest.fn();
    render(
      <CommentBox
        type="comment"
        video={video}
        submitCallback={jest.fn()}
        cancelCallback={cancelCallback}
      />,
    );
    const textarea = screen.getByPlaceholderText('Enter your comment');
    await userEvent.type(textarea, 'draft');
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(textarea).toHaveValue('');
    expect(cancelCallback).toHaveBeenCalled();
  });
});
