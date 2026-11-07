import request, { Method } from '@/api/client';
import { Post } from '@/utils/types';

const token = localStorage.getItem('access_token') ?? '';

async function addPostRequest(content: string, files: File[]) {
  const formData = new FormData();
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

async function fetchFollowedPostsRequest() {
  return await request<Post[]>('/post/selectFollowedPosts', Method.GET, {
    token,
  });
}

async function addPostLikeRequest(postId: string) {
  return await request<string>('/post/like', Method.POST, {
    token,
    body: {
      postId,
    },
  });
}

async function deletePostLikeRequest(postId: string) {
  return await request<void>('/post/like', Method.DELETE, {
    token,
    body: {
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
      }
    });
  }
}

export {
  addPostRequest,
  fetchAllPostRequest,
  fetchPostListWithUserIdRequest,
  fetchFollowedPostsRequest,
  addPostLikeRequest,
  deletePostLikeRequest,
  deletePostRequest,
  getPostRequest,
};
