import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { PostItem } from '@/components/PostItem';
import { PostContext } from '@/context/PostContext';
import { Post } from '@/utils/types';
import {
  addPostLikeRequest,
  deletePostLikeRequest,
  deletePostRequest,
} from '@/api/postApi';
import { mockStore, resetMockStore } from '@/test/mocks/store';

jest.mock('@/api/postApi', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createPostApiMock } = require('@/test/mocks/postApi');
  return createPostApiMock();
});

const basePost: Post = {
  id: 'post_id',
  user: {
    id: 'test_user_id',
    username: 'test_user',
    nickname: 'Tester',
    avatarUrl: 'https://example.com/avatar.png',
  },
  content: 'hello post',
  images: [],
  createdTime: '2025-01-01 00:00:00',
  isLike: false,
  likeCount: 2,
};

function renderPost(post: Post) {
  const context = {
    postList: [post],
    handleAddPostLike: jest.fn(),
    handleRemovePostLike: jest.fn(),
    handleDeletePost: jest.fn(),
  };
  render(
    <PostContext.Provider value={context}>
      <PostItem post={post} />
    </PostContext.Provider>,
  );
  return context;
}

describe('PostItem', () => {
  beforeEach(() => {
    resetMockStore();
    localStorage.setItem('login_status', 'true');
  });

  it('renders post content and like count', () => {
    renderPost(basePost);
    expect(screen.getByText('hello post')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('adds a post like when not liked', async () => {
    const context = renderPost(basePost);
    await userEvent.click(screen.getByRole('button', { name: /2$/ }));
    await waitFor(() => {
      expect(addPostLikeRequest).toHaveBeenCalledWith('test_user_id', 'post_id');
    });
    expect(context.handleAddPostLike).toHaveBeenCalledWith('post_id');
  });

  it('removes a post like when already liked', async () => {
    const context = renderPost({ ...basePost, isLike: true });
    await userEvent.click(screen.getByRole('button', { name: /2$/ }));
    await waitFor(() => {
      expect(deletePostLikeRequest).toHaveBeenCalledWith('test_user_id', 'post_id');
    });
    expect(context.handleRemovePostLike).toHaveBeenCalledWith('post_id');
  });

  it('does not call like API when not logged in', async () => {
    localStorage.setItem('login_status', 'false');
    renderPost(basePost);
    await userEvent.click(screen.getByRole('button', { name: /2$/ }));
    expect(addPostLikeRequest).not.toHaveBeenCalled();
    expect(deletePostLikeRequest).not.toHaveBeenCalled();
  });

  it('deletes the post after confirmation when user is the author', async () => {
    const context = renderPost(basePost);
    await userEvent.click(screen.getByRole('button', { name: 'More options' }));
    const deleteOption = await screen.findByRole('option', { name: '删除' });
    expect(deleteOption).not.toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(deleteOption);
    await userEvent.click(await screen.findByRole('button', { name: 'Yes' }));
    await waitFor(() => {
      expect(deletePostRequest).toHaveBeenCalledWith('post_id');
    });
    expect(context.handleDeletePost).toHaveBeenCalledWith('post_id');
  });

  it('disables delete option when current user is not the author', async () => {
    mockStore.user.id = 'other_user_id';
    renderPost(basePost);
    await userEvent.click(screen.getByRole('button', { name: 'More options' }));
    const deleteOption = await screen.findByRole('option', { name: '删除' });
    expect(deleteOption).toHaveAttribute('aria-disabled', 'true');
  });
});
