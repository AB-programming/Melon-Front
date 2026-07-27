import request, { Method, Options } from '@/api/client';
import { Comment, Reply, Video } from '@/utils/types';

const token = localStorage.getItem('access_token') ?? '';

async function createVideoRequest(
  picture: File,
  userId: string,
  title: string,
  description: string,
) {
  const formData = new FormData();
  formData.append('picture', picture);
  formData.append('userId', userId);
  formData.append('title', title);
  formData.append('description', description);
  const options: Options = {
    token,
    body: formData,
  };
  return await request<string>('/video/createVideo', Method.POST, options);
}

async function isLikeRequest(userId: string, videoId: string) {
  const options: Options = {
    token,
    body: {
      userId,
      videoId,
    },
  };
  return await request<boolean>('/video/like/isLike', Method.GET, options);
}

async function addLikeRequest(userId: string, videoId: string) {
  const options: Options = {
    token,
    body: {
      userId,
      videoId,
    },
  };
  return await request<string>('/video/like', Method.POST, options);
}

async function cancelLikeRequest(userId: string, videoId: string) {
  const options: Options = {
    token,
    body: {
      userId,
      videoId,
    },
  };
  return await request<void>('/video/like', Method.DELETE, options);
}

async function getVideoCountRequest(videoId: string) {
  const options: Options = {
    body: {
      videoId,
    },
  };
  return await request<number>('/video/like/count', Method.GET, options);
}

async function addCollectRequest(userId: string, videoId: string) {
  const options: Options = {
    token,
    body: {
      userId,
      videoId,
    },
  };
  return await request<string>('/video/collect', Method.POST, options);
}

async function cancelCollectRequest(userId: string, videoId: string) {
  const options: Options = {
    token,
    body: {
      userId,
      videoId,
    },
  };
  return await request<void>('/video/collect', Method.DELETE, options);
}

async function isCollectRequest(userId: string, videoId: string) {
  const options: Options = {
    token,
    body: {
      userId,
      videoId,
    },
  };
  return await request<boolean>(
    '/video/collect/isCollect',
    Method.GET,
    options,
  );
}

async function sendCommentRequest(
  userId: string,
  videoId: string,
  content: string,
) {
  const options: Options = {
    token,
    body: {
      userId,
      videoId,
      content,
    },
  };
  return await request<Comment>('/video/comment', Method.POST, options);
}

async function fetchCommentListRequest(userId: string, videoId: string) {
  return await request<Comment[]>(
    `/video/comment/list?userId=${userId}&videoId=${videoId}`,
    Method.GET,
  );
}

async function addCommentLikeRequest(userId: string, commentId: string) {
  const options: Options = {
    token,
    body: {
      userId,
      commentId,
    },
  };
  return await request<string>('/video/commentLike', Method.POST, options);
}

async function cancelCommentLikeRequest(userId: string, commentId: string) {
  const options: Options = {
    token,
    body: {
      userId,
      commentId,
    },
  };
  return await request<void>('/video/commentLike', Method.DELETE, options);
}

async function deleteCommentRequest(commentId: string) {
  const options: Options = {
    token,
    body: {
      commentId,
    },
  };
  return await request<void>('/video/comment', Method.DELETE, options);
}

async function deleteReplyRequest(replyId: string) {
  const options: Options = {
    token,
  };
  return await request<void>(`/video/reply/${replyId}`, Method.DELETE, options);
}

async function fetchUserVideoListRequest(userId: string) {
  return await request<Video[]>('/video/selectVideoListByUserId', Method.GET, {
    body: {
      userId,
    },
  });
}

async function sendReplyRequest(
  userId: string,
  targetId: string,
  commentId: string,
  type: 'c' | 'r',
  content: string,
) {
  const options: Options = {
    token,
    body: {
      userId,
      targetId,
      type,
      content,
      commentId,
    },
  };
  return request<Reply>('/video/reply', Method.POST, options);
}

async function checkChunkRequest(fileMd5: string) {
  const options: Options = {
    token,
    body: {
      fileMd5
    }
  };
  return request<number[]>('/video/check', Method.POST, options);
}

async function uploadChunkRequest(chunk: Blob, index: number, fileMd5: string) {
  const formData = new FormData();
  formData.append('chunk', chunk);
  formData.append('index', String(index));
  formData.append('fileMd5', fileMd5);
  const options: Options = {
    token,
    body: formData,
  };
  return await request<boolean>('/video/uploadChunk', Method.POST, options);
}

async function mergeRequest(fileMd5: string, id: string) {
  const options: Options = {
    token,
    body: {
      fileMd5,
      id
    }
  };
  return request<boolean>('/video/merge', Method.POST, options);
}

async function checkMergeRequest(fileId: string) {
  const options: Options = {
    token
  }
  return request<string>(`/video/checkMerge/${fileId}`, Method.GET, options);
}

async function deleteVideoRequest(videoId: string) {
  const options: Options = {
    token
  }
  return request<boolean>(`/video/${videoId}`, Method.DELETE, options);
}

export {
  createVideoRequest,
  isLikeRequest,
  addLikeRequest,
  cancelLikeRequest,
  getVideoCountRequest,
  addCollectRequest,
  cancelCollectRequest,
  isCollectRequest,
  sendCommentRequest,
  fetchCommentListRequest,
  addCommentLikeRequest,
  cancelCommentLikeRequest,
  deleteCommentRequest,
  deleteReplyRequest,
  fetchUserVideoListRequest,
  sendReplyRequest,
  checkChunkRequest,
  uploadChunkRequest,
  mergeRequest,
  checkMergeRequest,
  deleteVideoRequest
};
