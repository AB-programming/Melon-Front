import { RecommendVideoItem } from '@/components/RecommendVideoItem';
import { fetchAllVideoRequest } from '@/api/videoServerApi';
import { HttpCode } from '@/utils/types';

export async function RecommendVideo() {
  const result = await fetchAllVideoRequest();
  if (result.code !== HttpCode.OK) {
    return <div>System Error: Please retry</div>;
  }
  const videoList = result.data;
  return (
    <>
      {videoList.map((video) => (
        <RecommendVideoItem key={video.id} video={video} className="mb-4" />
      ))}
    </>
  );
}
