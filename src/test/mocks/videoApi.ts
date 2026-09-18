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
          user: {
            id: 'test_user_id',
            username: 'test_user',
            nickname: 'Tester',
            avatarUrl: 'https://example.com/avatar.png',
          },
          content: 'test comment',
          createdTime: '',
          likeCount: 0,
          isLiked: false,
          replyList: [],
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
    sendReplyRequest: jest.fn(
      (
        userId: string,
        targetId: string,
        commentId: string,
        type: 'c' | 'r',
        content: string,
      ) => {
        return Promise.resolve({
          code: HttpCode.OK,
          message: 'OK',
          data: {
            id: 'new_reply_id',
            user: {
              id: userId,
              username: 'test_user',
              nickname: 'Tester',
              avatarUrl: 'https://example.com/avatar.png',
            },
            content,
            type,
            targetId,
            targetUser: {
              id: targetId,
              username: 'target_user',
              nickname: 'Target',
            },
            createdTime: '',
          },
        } as HttpResponse<Reply>);
      },
    ),
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
