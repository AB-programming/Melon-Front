import request, { Method, Options } from '@/api/client';
import {
  PageResult,
  Post,
  SearchAllResult,
  User,
  Video,
} from '@/utils/types';

async function searchAllRequest(keyword: string, userId?: string) {
  const options: Options = {
    body: {
      keyword,
      type: 'all',
      userId,
    },
  };
  return await request<SearchAllResult>('/search', Method.GET, options);
}

async function searchVideoRequest(
  keyword: string,
  pageNum: number,
  pageSize: number,
) {
  const options: Options = {
    body: {
      keyword,
      type: 'video',
      pageNum,
      pageSize,
    },
  };
  return await request<PageResult<Video>>('/search', Method.GET, options);
}

async function searchUserRequest(
  keyword: string,
  pageNum: number,
  pageSize: number,
) {
  const options: Options = {
    body: {
      keyword,
      type: 'user',
      pageNum,
      pageSize,
    },
  };
  return await request<PageResult<User>>('/search', Method.GET, options);
}

async function searchPostRequest(
  keyword: string,
  pageNum: number,
  pageSize: number,
  userId?: string,
) {
  const options: Options = {
    body: {
      keyword,
      type: 'post',
      pageNum,
      pageSize,
      userId,
    },
  };
  return await request<PageResult<Post>>('/search', Method.GET, options);
}

export {
  searchAllRequest,
  searchVideoRequest,
  searchUserRequest,
  searchPostRequest,
};
