import Link from 'next/link';
import Image from 'next/image';
import { Video } from '@/utils/types';

interface RecommendVideoItemProps {
  video: Video;
  className?: string;
}

export function RecommendVideoItem({ video, className }: RecommendVideoItemProps) {
  return (
    <div className={`relative flex items-start gap-4 ${className}`}>
      <Link href={`/watch?v=${video.id}`} className="absolute inset-0">
        <span className="sr-only">title</span>
      </Link>
      <Image
        src={`${process.env.NEXT_PUBLIC_BACKEND_URI}/video/cover/${video.id}`}
        alt="The video not found"
        width={168}
        height={94}
        className="aspect-video rounded-lg object-cover"
      />
      <div className="text-sm">
        <div className="font-bold text-sm line-clamp-2">{video.title}</div>
        <div className="text-xs text-muted-foreground line-clamp-1">{video.author.nickname}</div>
        <div className="mt-1 text-xs text-muted-foreground line-clamp-1">
          2万次观看 &middot; 发布于 2024年7月18日
        </div>
      </div>
    </div>
  );
}
