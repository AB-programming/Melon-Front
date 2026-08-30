import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ReplyItem } from '@/components/ReplyItem';
import { Reply } from '@/utils/types';
import { mockStore, resetMockStore } from '@/test/mocks/store';

const reply: Reply = {
  id: 'reply_id',
  user: {
    id: 'test_user_id',
    username: 'test_user',
    nickname: 'Tester',
    avatarUrl: 'https://example.com/avatar.png',
  },
  content: 'this is a reply',
  type: 'c',
  targetId: 'comment_id',
  targetUser: {
    id: 'target_user_id',
    username: 'target_user',
    nickname: 'Target',
  },
  createdTime: '2025-01-01 00:00:00',
};

describe('ReplyItem', () => {
  beforeEach(() => {
    resetMockStore();
  });

  it('renders reply content and nicknames', () => {
    render(
      <ReplyItem reply={reply} deleteReplyCallback={jest.fn()} />,
    );
    expect(screen.getByText('@Tester')).toBeInTheDocument();
    expect(screen.getByText('回复 @Target')).toBeInTheDocument();
    expect(screen.getByText('this is a reply')).toBeInTheDocument();
  });

  it('calls deleteReplyCallback when author deletes the reply', async () => {
    const deleteReplyCallback = jest.fn();
    render(
      <ReplyItem reply={reply} deleteReplyCallback={deleteReplyCallback} />,
    );
    await userEvent.click(screen.getAllByRole('button')[0]);
    const deleteOption = await screen.findByRole('option', { name: '删除' });
    expect(deleteOption).not.toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(deleteOption);
    expect(deleteReplyCallback).toHaveBeenCalledWith('reply_id');
  });

  it('disables delete option when current user is not the author', async () => {
    mockStore.user.id = 'other_user_id';
    render(
      <ReplyItem reply={reply} deleteReplyCallback={jest.fn()} />,
    );
    await userEvent.click(screen.getAllByRole('button')[0]);
    const deleteOption = await screen.findByRole('option', { name: '删除' });
    expect(deleteOption).toHaveAttribute('aria-disabled', 'true');
  });

  it('calls onReplyClick with reply id', async () => {
    const onReplyClick = jest.fn();
    render(
      <ReplyItem
        reply={reply}
        deleteReplyCallback={jest.fn()}
        onReplyClick={onReplyClick}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: '回复' }));
    expect(onReplyClick).toHaveBeenCalledWith('reply_id');
  });
});
