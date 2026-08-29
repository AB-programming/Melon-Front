import { render, screen } from '@testing-library/react';
import { MelonVideo } from '@/components/MelonVideo';
import { Video } from '@/utils/types';
import { userEvent } from '@testing-library/user-event';

jest.mock('next-video', () => {
  return function MockVideo() {
    return <div data-testid="mock-next-video" />;
  };
});

jest.mock('@/api/videoApi', () => {
  const { createVideoApiMock } = require('@/test/mocks/videoApi');
  return createVideoApiMock();
});
jest.mock('@/api/userApi', () => {
  const { createUserApiMock } = require('@/test/mocks/userApi');
  return createUserApiMock();
});

describe('MelonVideo', () => {
  it('Like a video', async () => {
    localStorage.setItem('login_status', 'true');
    const video: Video = {
      id: 'video_id',
      title: 'Test Video',
      description: 'This is a test video',
      author: {
        id: 'user_id',
        username: 'username',
        nickname: 'nickname',
      }
    }
    render(<MelonVideo video={video} />);
    const button = await screen.findByRole('button', {name: /0$/});
    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    const updatedButton = await screen.findByRole('button', {name: /1$/});
    expect(updatedButton).toBeInTheDocument();
    expect(updatedButton).toHaveTextContent('1');
  })
});