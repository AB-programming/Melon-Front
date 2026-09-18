import { HttpCode, HttpResponse, Post } from '@/utils/types';

const defaultPost: Post = {
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
};

const likedPost: Post = {
  ...defaultPost,
  id: 'test_id_2',
  user: {
    id: 'test_user_id_2',
    username: 'test_user_2',
    nickname: 'test_user_2',
  },
  isLike: true,
  likeCount: 1,
};

export function createPostApiMock() {
  return {
    addPostRequest: jest.fn((userId: string, content: string) => {
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
    fetchAllPostRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: [defaultPost],
      } as HttpResponse<Post[]>);
    }),
    fetchPostListWithUserIdRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: [defaultPost, likedPost],
      } as HttpResponse<Post[]>);
    }),
    fetchFollowedPostsRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: [],
      } as HttpResponse<Post[]>);
    }),
    addPostLikeRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: 'test_id',
      } as HttpResponse<string>);
    }),
    deletePostLikeRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
      } as HttpResponse<void>);
    }),
    deletePostRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
      } as HttpResponse<void>);
    }),
    getPostRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: defaultPost,
      } as HttpResponse<Post>);
    }),
  };
}
