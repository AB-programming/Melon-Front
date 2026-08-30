import { act } from '@testing-library/react';
import { User } from '@/utils/types';

jest.unmock('@/utils/store');

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { useStore } = require('@/utils/store');

const initialUser: User = {
  id: '',
  username: '',
  avatarUrl: '',
  nickname: '',
  signature: '',
};

beforeEach(() => {
  act(() => {
    useStore.setState({ user: initialUser, avatarVersion: 0 });
  });
});

describe('useStore', () => {
  it('updateUser replaces the current user', () => {
    const newUser: User = {
      id: 'user_1',
      username: 'melon',
      nickname: 'Melon',
      avatarUrl: 'https://example.com/a.png',
      signature: 'hi',
    };
    act(() => {
      useStore.getState().updateUser(newUser);
    });
    expect(useStore.getState().user).toEqual(newUser);
  });

  it('updateAvatarVersion increments avatarVersion', () => {
    expect(useStore.getState().avatarVersion).toBe(0);
    act(() => {
      useStore.getState().updateAvatarVersion();
    });
    expect(useStore.getState().avatarVersion).toBe(1);
    act(() => {
      useStore.getState().updateAvatarVersion();
    });
    expect(useStore.getState().avatarVersion).toBe(2);
  });
});
