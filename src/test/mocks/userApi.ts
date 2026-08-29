import { HttpCode, HttpResponse, User } from '@/utils/types';

export function createUserApiMock() {
  return {
    getUserRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: {
          id: 'test_user_id',
          username: 'test_user',
          nickname: 'Tester',
        },
      } as HttpResponse<User>);
    }),
    uploadAvatarRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: 'https://example.com/avatar.png',
      } as HttpResponse<string>);
    }),
    updateUserRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: {
          id: 'test_user_id',
          username: 'test_user',
          nickname: 'Tester',
        },
      } as HttpResponse<User>);
    }),
    createUserRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: {
          id: 'test_user_id',
          username: 'test_user',
          nickname: 'Tester',
        },
      } as HttpResponse<User>);
    }),
    addSubscriptionRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: 'subscription_id',
      } as HttpResponse<string>);
    }),
    cancelSubscriptionRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
      } as HttpResponse<void>);
    }),
    isSubscribedRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: false,
      } as HttpResponse<boolean>);
    }),
    getFansRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: 42,
      } as HttpResponse<number>);
    }),
    getSubscriptionsRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: [],
      } as HttpResponse<[]>);
    }),
  };
}
