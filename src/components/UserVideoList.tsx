'use client';

import Image from 'next/image';
import { useStore } from '@/utils/store';
import { useEffect, useState } from 'react';
import { HttpCode, Video } from '@/utils/types';
import { fetchUserVideoListRequest } from '@/api/videoApi';
import { Card, CardBody } from '@heroui/react';
import { PlayCircle } from 'lucide-react';
import Link from 'next/link';

export function UserVideoList() {
  const user = useStore(state => state.user);
  const [videoList, setVideoList] = useState<Video[]>([]);

  useEffect(() => {
    const fetchUserVideo = async () => {
      const result = await fetchUserVideoListRequest(user.id);
      if (result.code === HttpCode.OK) {
        setVideoList(result.data);
      }
    }
    if (user.id !== '') {
      fetchUserVideo().then();
    }
  }, [user]);

  return (
    <div className="mr-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videoList.length !== 0 ? videoList.map(video => (
        <Card key={video.id} className="group overflow-hidden">
          <Link href={`/watch?v=${video.id}`}>
            <div className="relative aspect-video">
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URI}/video/cover/${video.id}`}
                alt="The video not found"
                width={300}
                height={200}
                className="object-cover w-full h-36 transition-transform duration-300 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PlayCircle className="h-10 w-10 text-white" />
              </div>
            </div>
          </Link>
          <CardBody className="p-4 flex flex-col justify-between">
            <h3 className="text-md line-clamp-2 font-medium">{video.title}</h3>
            <p className="text-sm text-muted-foreground font-extralight">2万次观看 &middot; 发布于 2024年7月18日</p>
          </CardBody>
        </Card>
      )) : <>暂无作品</>}
    </div>
  );
}
