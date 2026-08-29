import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { PostContainer } from '@/components/PostContainer';
import { userEvent } from '@testing-library/user-event';

jest.mock('@/api/postApi', () => {
  const { createPostApiMock } = require('@/test/mocks/postApi');
  return createPostApiMock();
});

describe('PostContainer', () => {
  it('Like a post', async () => {
    localStorage.setItem('login_status', 'true');
    render(<PostContainer />);
    const button = await screen.findByRole('button', { name: /0$/ });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('0');
    await userEvent.click(button);
    await waitFor(() => {
      expect(button).toHaveTextContent('1');
    });
  });

  it('Unlike a post', async () => {
    localStorage.setItem('login_status', 'true');
    render(<PostContainer />);
    const button = await screen.findByRole('button', { name: /1$/ });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('1');
    await userEvent.click(button);
    await waitFor(() => {
      expect(button).toHaveTextContent('0');
    });
  });

  it('Delete a post', async () => {
    localStorage.setItem('login_status', 'true');
    render(<PostContainer />);
    const moreButtons = await screen.findAllByRole('button', { name: 'More options' });
    expect(moreButtons).not.toBeFalsy();
    let postNum = moreButtons.length;
    for (const moreButton of moreButtons) {
      await userEvent.click(moreButton);
      const deleteButton = await screen.findByRole('option', { name: '删除' });
      expect(deleteButton).toBeInTheDocument();
      if (!(deleteButton.getAttribute('aria-disabled') === 'true')) {
        // 帖子是自己发布的，可以删除
        await userEvent.click(deleteButton);
        const confirmButton = await screen.findByRole('button', { name: 'Yes' });
        expect(confirmButton).toBeInTheDocument();
        await userEvent.click(confirmButton);
        // 等待帖子数量减少
        const newMoreButtons = await screen.findAllByRole('button', { name: 'More options' });
        expect(newMoreButtons).toHaveLength(postNum - 1);
        postNum = postNum - 1;
      }
    }
  });

  it('Add a post', async () => {
    localStorage.setItem('login_status', 'true');
    render(<PostContainer />);
    const addPostButton = await screen.findByRole('button', { name: '发帖' });
    expect(addPostButton).toBeInTheDocument();
    await userEvent.click(addPostButton);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    await userEvent.click(textarea);
    expect(textarea).toHaveFocus();
    await userEvent.type(textarea, "new post");
    const submitButton = await screen.findByRole('button', { name: '发布' });
    expect(submitButton).toBeInTheDocument();
    await userEvent.click(submitButton);
    const text = await screen.findByText('new post');
    expect(text).toBeInTheDocument();
  });
});
