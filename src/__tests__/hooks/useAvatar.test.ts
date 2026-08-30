import { act, renderHook, waitFor } from '@testing-library/react';
import { useAvatar } from '@/hooks/useAvatar';
import { addToast } from '@heroui/react';
import { uploadAvatarRequest } from '@/api/userApi';
import { mockStore, resetMockStore } from '@/test/mocks/store';
import { User } from '@/utils/types';

jest.mock('@/api/userApi', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createUserApiMock } = require('@/test/mocks/userApi');
  return createUserApiMock();
});

jest.mock('@heroui/react', () => ({
  ...jest.requireActual('@heroui/react'),
  addToast: jest.fn(),
}));

const user: User = {
  id: 'test_user_id',
  username: 'test_user',
  nickname: 'Tester',
  avatarUrl: 'https://example.com/avatar.png',
};

function fileChangeEvent(file: File) {
  return {
    target: { files: [file], value: 'C:\\fakepath\\avatar.png' },
  } as unknown as React.ChangeEvent<HTMLInputElement>;
}

describe('useAvatar', () => {
  beforeEach(() => {
    resetMockStore();
  });

  it('initializes with empty fileName and store avatarVersion', () => {
    const { result } = renderHook(() => useAvatar(user));
    expect(result.current.fileName).toBe('');
    expect(result.current.avatarVersion).toBe(mockStore.avatarVersion);
  });

  it('handleUploadImage sets fileName', () => {
    const { result } = renderHook(() => useAvatar(user));
    const file = new File(['x'], 'avatar.png', { type: 'image/png' });
    act(() => {
      result.current.handleUploadImage(fileChangeEvent(file));
    });
    expect(result.current.fileName).toBe('avatar.png');
  });

  it('submitAvatar warns when no file selected', async () => {
    const { result } = renderHook(() => useAvatar(user));
    await act(async () => {
      await result.current.submitAvatar();
    });
    expect(uploadAvatarRequest).not.toHaveBeenCalled();
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Warning', color: 'warning' }),
    );
  });

  it('submitAvatar uploads avatar and updates store on success', async () => {
    const { result } = renderHook(() => useAvatar(user));
    const file = new File(['x'], 'avatar.png', { type: 'image/png' });
    act(() => {
      result.current.handleUploadImage(fileChangeEvent(file));
    });
    await act(async () => {
      await result.current.submitAvatar();
    });
    await waitFor(() => {
      expect(uploadAvatarRequest).toHaveBeenCalledWith(file, user.id);
    });
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Upload Successfully', color: 'success' }),
    );
    expect(mockStore.updateUser).toHaveBeenCalled();
    expect(mockStore.updateAvatarVersion).toHaveBeenCalled();
    expect(user.avatarUrl).toBe('https://example.com/avatar.png');
  });
});
