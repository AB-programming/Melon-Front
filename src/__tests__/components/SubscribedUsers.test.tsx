import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SubscribedUsers } from '@/components/SubscribedUsers';
import { HttpCode } from '@/utils/types';
import { cancelSubscriptionRequest, getSubscriptionsRequest } from '@/api/userApi';

jest.mock('@/api/userApi', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createUserApiMock } = require('@/test/mocks/userApi');
  return createUserApiMock();
});

const subscribedUsers = [
  {
    id: 'sub_user_1',
    username: 'user1',
    nickname: 'User One',
    signature: 'sig1',
  },
  {
    id: 'sub_user_2',
    username: 'user2',
    nickname: 'User Two',
    signature: 'sig2',
  },
];

describe('SubscribedUsers', () => {
  it('renders subscribed user list', async () => {
    (getSubscriptionsRequest as jest.Mock).mockResolvedValueOnce({
      code: HttpCode.OK,
      message: 'OK',
      data: subscribedUsers,
    });
    render(<SubscribedUsers />);
    expect(await screen.findByText('我的关注')).toBeInTheDocument();
    expect(await screen.findByText('User One')).toBeInTheDocument();
    expect(await screen.findByText('User Two')).toBeInTheDocument();
    expect(screen.getByText('2 人')).toBeInTheDocument();
  });

  it('renders empty state when no subscriptions', async () => {
    (getSubscriptionsRequest as jest.Mock).mockResolvedValueOnce({
      code: HttpCode.OK,
      message: 'OK',
      data: [],
    });
    render(<SubscribedUsers />);
    expect(await screen.findByText('还没有关注任何人')).toBeInTheDocument();
  });

  it('removes user from list after unsubscribe', async () => {
    (getSubscriptionsRequest as jest.Mock).mockResolvedValueOnce({
      code: HttpCode.OK,
      message: 'OK',
      data: subscribedUsers,
    });
    render(<SubscribedUsers />);
    await screen.findByText('User One');
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[0]);
    await waitFor(() => {
      expect(cancelSubscriptionRequest).toHaveBeenCalledWith('test_user_id', 'sub_user_1');
    });
    await waitFor(() => {
      expect(screen.queryByText('User One')).not.toBeInTheDocument();
    });
    expect(screen.getByText('1 人')).toBeInTheDocument();
  });
});
