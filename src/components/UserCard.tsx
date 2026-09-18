import { Avatar, Card, CardBody } from '@heroui/react';
import { User } from '@/utils/types';

export function UserCard({ user }: { user: User }) {
  return (
    <Card isHoverable className="h-full transition-shadow hover:shadow-md">
      <CardBody className="flex flex-col items-center gap-2 py-6 text-center">
        <Avatar
          src={user.avatarUrl}
          isBordered
          radius="full"
          className="h-16 w-16"
        />
        <span className="w-full line-clamp-1 font-medium">
          {user.nickname ?? user.username}
        </span>
        <span className="w-full line-clamp-1 text-xs text-gray-400">
          @{user.username}
        </span>
        <span className="w-full line-clamp-2 text-sm text-gray-500">
          {user.signature ?? '这个人很神秘，什么都没有写'}
        </span>
      </CardBody>
    </Card>
  );
}
