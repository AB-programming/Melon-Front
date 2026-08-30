import { User } from '@/utils/types';

const defaultUser: User = {
  id: 'test_user_id',
  username: 'test_user',
  avatarUrl: 'https://example.com/avatar.png',
  nickname: 'Tester',
  signature: 'Hello Jest!',
};

export const mockStore = {
  user: { ...defaultUser },
  avatarVersion: 1,
  updateUser: jest.fn(),
  updateAvatarVersion: jest.fn(),
};

export function resetMockStore() {
  mockStore.user = { ...defaultUser };
  mockStore.avatarVersion = 1;
}
