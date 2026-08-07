'use client';
import { Link } from '@heroui/react';

export function Sidebar() {
  return (
    <div className="flex flex-col px-6 py-2 gap-2">
      <Link
        href="/"
        className="px-2 py-2 hover:bg-gray-200 rounded-lg transition delay-50 duration-300 ease-in-out"
        color="foreground"
      >
        首页
      </Link>
      <Link
        href="/simple"
        className="px-2 py-2 hover:bg-gray-200 rounded-lg transition delay-50 duration-300 ease-in-out"
        color="foreground"
      >
        短视频
      </Link>
      <Link
        href="/subscription"
        className="px-2 py-2 hover:bg-gray-200 rounded-lg transition delay-50 duration-300 ease-in-out"
        color="foreground"
      >
        订阅
      </Link>
      <Link
        href="/post"
        className="px-2 py-2 hover:bg-gray-200 rounded-lg transition delay-50 duration-300 ease-in-out"
        color="foreground"
      >
        帖子
      </Link>
    </div>
  );
}
