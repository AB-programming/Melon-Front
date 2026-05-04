export enum HttpCode {
  OK = 200,
  UN_AUTHORIZED = 401,
  FORBIDDEN = 403,
  BAD_REQUEST = 400,
  INTERNAL_SERVER_ERROR = 500,
  NOT_FOUND = 404,
}

interface HttpResponse<T> {
  code: HttpCode;
  message: string;
  data: T;
}

interface User {
  id: string;
  username: string;
  nickname?: string;
  avatarUrl?: string;
  signature?: string;
  introduction?: string;
  gender?: '男' | '女';
  residence?: string;
  interest?: string;
}

interface Introspect {
  active: boolean;
  user?: User;
}

interface Video {
  id: string;
  title: string;
  author: User;
  description: string;
}

interface Comment {
  id: string;
  user: User;
  content: string;
  createdTime: string;
  likeCount: number;
  isLiked: boolean;
}

interface Reply {
  id: string;
  user: User;
  content: string;
  type: 'c' | 'r';
  targetId: string;
  createdTime: string;
}

interface Post {
  id: string;
  user: User;
  content: string;
  images: string[];
  createdTime: string;
  isLike: boolean;
  likeCount: number;
}

export type { HttpResponse, User, Introspect, Video, Comment, Reply, Post };
