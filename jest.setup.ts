import '@testing-library/jest-dom';
import { HttpCode, HttpResponse, Post } from '@/utils/types';
import { getFansRequest, isSubscribedRequest } from '@/api/userApi';
import { addLikeRequest, getVideoCountRequest, isCollectRequest, isLikeRequest } from '@/api/videoApi';

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock('@/api/postApi', () => ({
  addPostLikeRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      code: HttpCode.OK,
      message: 'OK',
      data: 'test_id',
    } as HttpResponse<string>);
  }),
  deletePostLikeRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      code: HttpCode.OK,
      message: 'OK',
    } as HttpResponse<void>);
  }),
  fetchAllPostRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      code: HttpCode.OK,
      message: 'OK',
      data: [
        {
          id: 'test_id',
          user: {
            id: 'test_user_id',
            username: 'test_user',
            nickname: 'test_user',
          },
          content: '',
          images: [],
          createdTime: '',
          isLike: false,
          likeCount: 0,
        },
      ],
    } as HttpResponse<Post[]>);
  }),
  fetchPostListWithUserIdRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      code: HttpCode.OK,
      message: 'OK',
      data: [
        {
          id: 'test_id_1',
          user: {
            id: 'test_user_id',
            username: 'test_user',
            nickname: 'test_user',
          },
          content: '',
          images: [],
          createdTime: '',
          isLike: false,
          likeCount: 0,
        },
        {
          id: 'test_id_2',
          user: {
            id: 'test_user_id_2',
            username: 'test_user_2',
            nickname: 'test_user_2',
          },
          content: '',
          images: [],
          createdTime: '',
          isLike: true,
          likeCount: 1,
        },
      ],
    } as HttpResponse<Post[]>);
  }),
  deletePostRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      code: HttpCode.OK,
      message: 'OK',
    } as HttpResponse<void>);
  }),
  addPostRequest: jest.fn().mockImplementation((userId: string, content: string, files: File[]) => {
    return Promise.resolve({
      code: HttpCode.OK,
      message: 'OK',
      data: {
        id: 'new_post_id',
        user: {
          id: userId,
          username: 'username',
          nickname: 'nickname',
        },
        content: content,
        images: [],
        createdTime: '',
        isLike: false,
        likeCount: 0,
      },
    } as HttpResponse<Post>);
  }),
}));

jest.mock('@/api/userApi', () => ({
  getFansRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      code: HttpCode.OK,
      message: 'OK',
      data: 42,
    } as HttpResponse<number>)
  }),
  isSubscribedRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      code: HttpCode.OK,
      message: 'OK',
      data: false,
    } as HttpResponse<boolean>)
  })
}));

jest.mock('@/api/videoApi', () => ({
  isLikeRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      code: HttpCode.OK,
      message: 'OK',
      data: false,
    } as HttpResponse<boolean>)
  }),
  getVideoCountRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      code: HttpCode.OK,
      message: 'OK',
      data: 0,
    } as HttpResponse<number>)
  }),
  isCollectRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      code: HttpCode.OK,
      message: 'OK',
      data: false,
    } as HttpResponse<boolean>)
  }),
  addLikeRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      code: HttpCode.OK,
      message: 'OK',
      data: 'like_id',
    } as HttpResponse<string>)
  })
}));

// Mock当前登录的用户
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
