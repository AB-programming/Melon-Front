import request, { Method, Options } from '@/api/client';
import { HttpResponse, User } from '@/utils/types';

const token = localStorage.getItem('access_token') ?? '';

async function getUserRequest(userId: string) {
  const options: Options = {
    token,
  };
  return await request<User>(`/user/${userId}`, Method.GET, options);
}

async function uploadAvatarRequest(
  file: File,
  userId: string,
): Promise<HttpResponse<string>> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId);
  const options: Options = {
    token,
    body: formData,
  };
  return await request<string>('/user/uploadAvatar', Method.POST, options);
}

async function updateUserRequest(
  userId: string,
  nickname: string,
  signature: string,
  introduction: string,
  gender: string,
  residence: string,
  interest: string
) {
  const options: Options = {
    token,
    body: {
      nickname,
      signature,
      introduction,
      gender,
      residence,
      interest
    },
  };
  return await request<User>(`/user/${userId}`, Method.PUT, options);
}

async function createUserRequest(username: string, password: string) {
  const options: Options = {
    body: {
      username,
      password,
    },
  };
  return await request<User>('/user/createUser', Method.POST, options);
}

async function addSubscriptionRequest(subscriber: string, target: string) {
  const options: Options = {
    token,
    body: {
      subscriber,
      target,
    },
  };
  return await request<string>('/user/subscription', Method.POST, options);
}

async function cancelSubscriptionRequest(subscriber: string, target: string) {
  const options: Options = {
    token,
    body: {
      subscriber,
      target,
    },
  };
  return await request<void>('/user/subscription', Method.DELETE, options);
}

async function isSubscribedRequest(subscriber: string, targetId: string) {
  const options: Options = {
    token,
    body: {
      subscriber,
      targetId,
    },
  };
  return await request<boolean>(
    '/user/subscription/isSubscribed',
    Method.GET,
    options,
  );
}

async function getFansRequest(userId: string) {
  const options: Options = {
    body: {
      userId,
    },
  };
  return await request<number>('/user/subscription/getFans', Method.GET, options);
}

export {
  getUserRequest,
  uploadAvatarRequest,
  updateUserRequest,
  createUserRequest,
  addSubscriptionRequest,
  isSubscribedRequest,
  cancelSubscriptionRequest,
  getFansRequest
};
