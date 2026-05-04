import { Comment } from '@/components/Comment';
import { MelonVideo } from '@/components/MelonVideo';
import { getVideoInfoRequest } from '@/api/videoServerApi';
import { HttpCode } from '@/utils/types';
import { RecommendVideo } from '@/components/RecommendVideo';

export default async function Watch({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { v } = await searchParams;
  if (v === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        Not found video
      </div>
    );
  }
  const result = await getVideoInfoRequest(v);
  if (result.code !== HttpCode.OK) {
    return <div>System Error: Please retry</div>;
  }
  const video = result.data;

  return (
    <div className="flex px-16 py-4 gap-6">
      {/* 左半区域 */}
      <div className="w-2/3 flex flex-col gap-4">
        {/* 视频信息 */}
        <MelonVideo video={video} />
        {/* 评论区 */}
        <Comment video={video} />
      </div>
      {/* 右半区域 */}
      <div className="w-1/3">
        {/* 推荐视频区 */}
        <RecommendVideo />
      </div>
    </div>
  );
}
