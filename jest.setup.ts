import '@testing-library/jest-dom';

beforeEach(() => {
  jest.clearAllMocks();
});

const mockStore = {
  user: {
    id: 'test_user_id',
    username: 'test_user',
    avatarUrl: 'https://example.com/avatar.png',
    nickname: 'Tester',
    signature: 'Hello Jest!',
  },
  avatarVersion: 1,
  updateUser: jest.fn(),
  updateAvatarVersion: jest.fn(),
};

jest.mock('@/utils/store', () => ({
  useStore: jest.fn((selector) => selector(mockStore)),
}));
