import { render, screen, waitFor } from '@testing-library/react';
import { MelonVideo } from '@/components/MelonVideo';
import { Video } from '@/utils/types';
import { userEvent } from '@testing-library/user-event';
import { addSubscriptionRequest, cancelSubscriptionRequest } from '@/api/userApi';
import { addCollectRequest, cancelCollectRequest } from '@/api/videoApi';

jest.mock('next-video', () => {
  return function MockVideo() {
    return <div data-testid="mock-next-video" />;
  };
});

jest.mock('@/api/videoApi', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createVideoApiMock } = require('@/test/mocks/videoApi');
  return createVideoApiMock();
});
jest.mock('@/api/userApi', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createUserApiMock } = require('@/test/mocks/userApi');
  return createUserApiMock();
});

const video: Video = {
  id: 'video_id',
  title: 'Test Video',
  description: 'This is a test video',
  author: {
    id: 'user_id',
    username: 'username',
    nickname: 'nickname',
  }
};

describe('MelonVideo', () => {
  it('Like a video', async () => {
    localStorage.setItem('login_status', 'true');
    render(<MelonVideo video={video} />);
    const button = await screen.findByRole('button', {name: /0$/});
    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    const updatedButton = await screen.findByRole('button', {name: /1$/});
    expect(updatedButton).toBeInTheDocument();
    expect(updatedButton).toHaveTextContent('1');
  });

  it('Subscribe and unsubscribe an author', async () => {
    localStorage.setItem('login_status', 'true');
    render(<MelonVideo video={video} />);
    const subscribeButton = await screen.findByRole('button', { name: '订阅' });
    expect(await screen.findByText('42位订阅者')).toBeInTheDocument();
    await userEvent.click(subscribeButton);
    await waitFor(() => {
      expect(addSubscriptionRequest).toHaveBeenCalledWith('test_user_id', 'user_id');
    });
    expect(await screen.findByRole('button', { name: '已订阅' })).toBeInTheDocument();
    expect(await screen.findByText('43位订阅者')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '已订阅' }));
    await waitFor(() => {
      expect(cancelSubscriptionRequest).toHaveBeenCalledWith('test_user_id', 'user_id');
    });
    expect(await screen.findByRole('button', { name: '订阅' })).toBeInTheDocument();
    expect(await screen.findByText('42位订阅者')).toBeInTheDocument();
  });

  it('Collect and uncollect a video', async () => {
    localStorage.setItem('login_status', 'true');
    render(<MelonVideo video={video} />);
    const collectButton = await screen.findByRole('button', { name: '收藏' });
    await userEvent.click(collectButton);
    await waitFor(() => {
      expect(addCollectRequest).toHaveBeenCalledWith('test_user_id', 'video_id');
    });
    expect(await screen.findByRole('button', { name: '已收藏' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '已收藏' }));
    await waitFor(() => {
      expect(cancelCollectRequest).toHaveBeenCalledWith('test_user_id', 'video_id');
    });
    expect(await screen.findByRole('button', { name: '收藏' })).toBeInTheDocument();
  });
});