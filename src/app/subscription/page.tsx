'use client';

import { Card, CardBody, Chip, Image, Link, User } from '@heroui/react';
import { HttpCode, Video } from '@/utils/types';
import { Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useStore } from '@/utils/store';
import { getFollowVideoListRequest } from '@/api/videoApi';

export default function Subscription() {
  const [videoList, setVideoList] = useState<Video[]>([]);
  const user = useStore((state) => state.user);

  useEffect(() => {
    const fetchVideoList = async () => {
      if (user.id === '') return;
      const result = await getFollowVideoListRequest(user.id);
      if (result.code === HttpCode.OK) {
        setVideoList(result.data);
      }
    };
    fetchVideoList().then();
  }, [user.id]);

  return (
    <div className="px-8 py-6 mb-16">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">订阅</h1>
        <p className="text-sm text-foreground-500">来自你关注的人的最新视频</p>
      </header>

      <div className="flex flex-col gap-5">
        {videoList.length !== 0 ? videoList.map((video) => (
          <Card
            key={video.id}
            isPressable
            as={Link}
            href={`/watch?v=${video.id}`}
            className="w-full border-none bg-content1/50"
          >
            <CardBody className="flex flex-row gap-4 p-0 overflow-hidden">
              <div className="relative w-72 h-48 shrink-0">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URI}/video/cover/${video.id}`}
                  alt={video.title}
                  width={288}
                  height={192}
                  className="w-full h-full object-cover overflow-hidden rounded-lg"
                  loading="lazy"
                />
                <div className="z-10 absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                  </div>
                </div>
                {/*todo video time*/}
                {/*<span className="z-10 absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">*/}
                {/*  15:42*/}
                {/*</span>*/}
              </div>

              <div className="flex flex-col justify-between py-4 pr-4 min-w-0 flex-1">
                <div>
                  <h3 className="text-base font-medium line-clamp-2 leading-snug">
                    {video.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-foreground-400 line-clamp-1">
                    {video.description}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <User
                    avatarProps={{
                      src: `${video.author.avatarUrl}`,
                      size: 'sm',
                    }}
                    name={video.author.nickname ?? ''}
                    // todo video play number
                    // description={
                    //   <span>
                    //     {'3分钟前'} · {'1.2w'}次播放
                    //   </span>
                    // }
                    classNames={{
                      name: 'text-sm font-medium',
                      description: 'text-xs text-foreground-400',
                    }}
                  />
                  <Chip color="success" variant="flat" size="sm">
                    已关注
                  </Chip>
                </div>
              </div>
            </CardBody>
          </Card>
        )) : '暂无订阅频道'}
      </div>
    </div>
  );
}
