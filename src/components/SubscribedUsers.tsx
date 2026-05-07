'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Spinner,
  Tooltip,
  User as HeroUIUser,
} from '@heroui/react';
import { Users, UserX } from 'lucide-react';
import { useStore } from '@/utils/store';
import {
  getSubscriptionsRequest,
  cancelSubscriptionRequest,
} from '@/api/userApi';
import { HttpCode } from '@/utils/types';

export interface SubscribedUser {
  id: string;
  username: string;
  nickname: string;
  avatarUrl?: string;
  signature?: string;
  introduction?: string;
}

export function SubscribedUsers() {
  const user = useStore((state) => state.user);
  const [subscribedList, setSubscribedList] = useState<SubscribedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscriptions() {
      const result = await getSubscriptionsRequest(user.id);
      if (result.code === HttpCode.OK && result.data) {
        setSubscribedList(result.data);
      }
      setLoading(false);
    }

    fetchSubscriptions().then();
  }, [user.id]);

  async function handleUnsubscribe(targetId: string) {
    const result = await cancelSubscriptionRequest(user.id, targetId);
    if (result.code === HttpCode.OK) {
      setSubscribedList((prev) => prev.filter((u) => u.id !== targetId));
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner color="primary" size="lg" label="加载关注列表..." />
      </div>
    );
  }

  if (subscribedList.length === 0) {
    return (
      <Card className="mr-8">
        <CardBody className="flex flex-col items-center justify-center py-16 gap-4">
          <Users size={48} className="text-gray-300" />
          <p className="text-gray-400 text-lg">还没有关注任何人</p>
          <p className="text-gray-300 text-sm">去发现感兴趣的人吧~</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4 mr-8">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-xl">我的关注</h3>
        <Chip color="primary" variant="flat" size="sm">
          {subscribedList.length} 人
        </Chip>
      </div>
      {subscribedList.map((subUser) => (
        <Card key={subUser.id}>
          <CardBody>
            <div className="flex items-center justify-between">
              <HeroUIUser
                name={subUser.nickname}
                description={subUser.signature || subUser.username}
                avatarProps={{
                  src: subUser.avatarUrl ? `${subUser.avatarUrl}` : undefined,
                }}
              />
              <Tooltip content="取消关注">
                <Button
                  isIconOnly
                  color="danger"
                  variant="light"
                  size="sm"
                  onPress={() => handleUnsubscribe(subUser.id)}
                >
                  <UserX size={18} />
                </Button>
              </Tooltip>
            </div>
            {subUser.introduction && (
              <>
                <Divider className="my-2" />
                <p className="text-sm text-gray-500 line-clamp-2">
                  {subUser.introduction}
                </p>
              </>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
