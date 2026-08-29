import { Comment, HttpCode, HttpResponse, Reply, Video } from '@/utils/types';

export function createVideoApiMock() {
  return {
    createVideoRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: 'video_id',
      } as HttpResponse<string>);
    }),
    isLikeRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: false,
      } as HttpResponse<boolean>);
    }),
    addLikeRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: 'like_id',
      } as HttpResponse<string>);
    }),
    cancelLikeRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
      } as HttpResponse<void>);
    }),
    getVideoCountRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: 0,
      } as HttpResponse<number>);
    }),
    addCollectRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: 'collect_id',
      } as HttpResponse<string>);
    }),
    cancelCollectRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
      } as HttpResponse<void>);
    }),
    isCollectRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: false,
      } as HttpResponse<boolean>);
    }),
    sendCommentRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: {
          id: 'comment_id',
          content: '',
          likeCount: 0,
          isLike: false,
        },
      } as HttpResponse<Comment>);
    }),
    fetchCommentListRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: [],
      } as HttpResponse<Comment[]>);
    }),
    addCommentLikeRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: 'comment_like_id',
      } as HttpResponse<string>);
    }),
    cancelCommentLikeRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
      } as HttpResponse<void>);
    }),
    deleteCommentRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
      } as HttpResponse<void>);
    }),
    deleteReplyRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
      } as HttpResponse<void>);
    }),
    fetchUserVideoListRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: [],
      } as HttpResponse<Video[]>);
    }),
    sendReplyRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: {
          id: 'reply_id',
          content: '',
        },
      } as HttpResponse<Reply>);
    }),
    checkChunkRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: [],
      } as HttpResponse<number[]>);
    }),
    uploadChunkRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: true,
      } as HttpResponse<boolean>);
    }),
    mergeRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: true,
      } as HttpResponse<boolean>);
    }),
    checkMergeRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: 'file_id',
      } as HttpResponse<string>);
    }),
    deleteVideoRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: true,
      } as HttpResponse<boolean>);
    }),
    getFollowVideoListRequest: jest.fn(() => {
      return Promise.resolve({
        code: HttpCode.OK,
        message: 'OK',
        data: [],
      } as HttpResponse<Video[]>);
    }),
  };
}
