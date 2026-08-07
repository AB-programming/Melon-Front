import { HttpCode } from '@/utils/types';
import { fetchAllVideoRequest } from '@/api/videoServerApi';
import { VideoList } from '@/components/VideoList';

export async function Home() {
  const result = await fetchAllVideoRequest();
  if (result.code !== HttpCode.OK) {
    return <div>System Error: Please retry</div>;
  }
  const videoList = result.data;
  return (
    <VideoList videoList={videoList} />
  );
}
