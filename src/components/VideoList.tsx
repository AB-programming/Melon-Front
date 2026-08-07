import { Video } from '@/utils/types';
import Link from 'next/link';
import Image from 'next/image';

export async function VideoList({ videoList }: { videoList: Video[] }) {
  return (
    <div className="grid grid-cols-3 gap-4 px-8 py-4 mb-16">
      {videoList.map((video) => (
        <div key={video.id} className="flex flex-col gap-4">
          <Link href={`/watch?v=${video.id}`}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_URI}/video/cover/${video.id}`}
              alt="The video not found"
              width={200}
              height={100}
              className="object-cover rounded-lg w-full h-48"
            />
          </Link>
          <div className="flex gap-4 items-center">
            <Image
              src={video.author.avatarUrl ?? ''}
              alt="The avatar not found"
              width={40}
              height={40}
              className="rounded-full"
            />
            <section>
              <Link href={`/watch?v=${video.id}`}>
                <h3 className="line-clamp-2 font-medium">{video.title}</h3>
              </Link>
              <span className="text-gray-400 font-light">
                {video.author.nickname}
              </span>
            </section>
          </div>
        </div>
      ))}
    </div>
  );
}
