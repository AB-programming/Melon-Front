import request, { Method } from '@/api/client';
import { Post } from '@/utils/types';

const token = localStorage.getItem('access_token') ?? '';

async function addPostRequest(userId: string, content: string, files: File[]) {
  const formData = new FormData();
  formData.append('userId', userId);
  formData.append('content', content);
  files.forEach((file) => {
    formData.append('images', file);
  });
  return await request<Post>('/post', Method.POST, { body: formData, token });
}

async function fetchAllPostRequest() {
  return await request<Post[]>('/post/selectAllPost', Method.GET);
}

async function fetchPostListWithUserIdRequest(userId: string) {
  return await request<Post[]>('/post/selectPostListWithUserId', Method.GET, {
    token,
    body: {
      userId,
    },
  });
}

async function addPostLikeRequest(userId: string, postId: string) {
  return await request<string>('/post/like', Method.POST, {
    token,
    body: {
      userId,
      postId,
    },
  });
}

async function deletePostLikeRequest(userId: string, postId: string) {
  return await request<void>('/post/like', Method.DELETE, {
    token,
    body: {
      userId,
      postId,
    },
  });
}

async function deletePostRequest(postId: string) {
  return await request<void>(`/post/${postId}`, Method.DELETE, { token });
}

async function getPostRequest(postId: string, userId: string) {
  if (userId === '') {
    return await request<Post>(`/post/${postId}`, Method.GET);
  } else {
    return await request<Post>('/post/getPostByIdWithUserId', Method.GET, {
      token,
      body: {
        postId,
        userId,
      }
    });
  }
}

export {
  addPostRequest,
  fetchAllPostRequest,
  fetchPostListWithUserIdRequest,
  addPostLikeRequest,
  deletePostLikeRequest,
  deletePostRequest,
  getPostRequest,
};
