import { HttpResponse, Video } from '@/utils/types';

async function fetchAllVideoRequest() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URI}/video/selectAllVideo`,
  );
  return (await response.json()) as HttpResponse<Video[]>;
}

async function getVideoInfoRequest(videoId: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/video/getVideoInfo?videoId=${videoId}`);
  return (await response.json()) as HttpResponse<Video>;
}

export { fetchAllVideoRequest, getVideoInfoRequest };
