'use client';

import Video from 'next-video';
import { addToast, Avatar, Button, Card, CardBody } from '@heroui/react';
import { numberDisplay } from '@/utils/conversion';
import { ThumbsUpButton } from '@/components/ThumbsUpButton';
import { Share2, Star } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import type { Asset } from 'next-video/dist/assets.d.ts';
import { HttpCode, Video as VideoType } from '@/utils/types';
import { useStore } from '@/utils/store';
import {
  addSubscriptionRequest,
  cancelSubscriptionRequest,
  getFansRequest,
  isSubscribedRequest,
} from '@/api/userApi';
import {
  addCollectRequest,
  addLikeRequest,
  cancelCollectRequest,
  cancelLikeRequest,
  getVideoCountRequest,
  isCollectRequest,
  isLikeRequest,
} from '@/api/videoApi';

interface MelonVideoProps {
  video: VideoType;
}

export function MelonVideo({ video }: MelonVideoProps) {
  const user = useStore((state) => state.user);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isCollect, setIsCollect] = useState(false);
  const [fans, setFans] = useState(0);

  const asset: Asset = {
    status: 'ready',
    provider: 'mux',
    originalFilePath: '',
    sources: [
      {
        src: `${process.env.NEXT_PUBLIC_BACKEND_URI}/video/${video.id}`,
        type: 'video/mp4',
      },
    ],
    createdAt: 0,
    updatedAt: 0,
  };

  useEffect(() => {
    const fetchFans = async function () {
      const result = await getFansRequest(video.author.id);
      if (result.code === HttpCode.OK) {
        setFans(result.data);
      }
    };
    if (video.author.id !== '') {
      fetchFans().then();
    }
  }, [video]);

  useEffect(() => {
    const fetchIsLike = async () => {
      const result = await isLikeRequest(user.id, video.id);
      if (result.code === HttpCode.OK) {
        setIsLike(result.data);
      }
    };
    const fetchVideoCount = async () => {
      const result = await getVideoCountRequest(video.id);
      if (result.code === HttpCode.OK) {
        setLikeCount(result.data);
      }
    };
    fetchVideoCount().then();
    if (user.id !== '' && video.id !== '') {
      fetchIsLike().then();
    }
  }, [user, video]);

  useEffect(() => {
    const fetchIsCollect = async () => {
      const result = await isCollectRequest(user.id, video.id);
      if (result.code === HttpCode.OK) {
        setIsCollect(result.data);
      }
    };
    if (user.id !== '' && video.id !== '') {
      fetchIsCollect().then();
    }
  }, [user, video]);

  useEffect(() => {
    const fetchIsSubscribed = async function () {
      const result = await isSubscribedRequest(user.id, video.author.id);
      setIsSubscribed(result.data);
    };
    if (
      user.id !== '' &&
      video.author.id !== '' &&
      user.id !== video.author.id
    ) {
      fetchIsSubscribed().then();
    }
  }, [user, video]);

  async function handleSubscription() {
    if (user.id === video.author.id) {
      addToast({
        title: 'Hint',
        description: '不能对自己进行订阅',
        color: 'danger',
      });
      return;
    }
    if (user.id == '') {
      addToast({
        title: 'Warning',
        description: 'Please login',
        color: 'warning',
      });
    }
    if (video.author.id === '') {
      addToast({
        title: 'Warning',
        description: 'User not exists',
        color: 'warning',
      });
    }
    if (isSubscribed) {
      const result = await cancelSubscriptionRequest(user.id, video.author.id);
      if (result.code === HttpCode.OK) {
        setIsSubscribed(!isSubscribed);
        setFans(fans - 1);
        addToast({
          title: 'Subscribe',
          description: 'Cancel Subscription Success',
          color: 'success',
        });
      }
    } else {
      const result = await addSubscriptionRequest(user.id, video.author.id);
      if (result.code === HttpCode.OK) {
        setIsSubscribed(!isSubscribed);
        setFans(fans + 1);
        addToast({
          title: 'Subscribe',
          description: 'Subscription Success',
          color: 'success',
        });
      }
    }
  }

  async function handleLike() {
    let result;
    if (isLike) {
      result = await cancelLikeRequest(user.id, video.id);
      if (result.code === HttpCode.OK) {
        setIsLike(false);
        setLikeCount(likeCount - 1);
        return true;
      }
    } else {
      result = await addLikeRequest(user.id, video.id);
      if (result.code === HttpCode.OK) {
        setIsLike(true);
        setLikeCount(likeCount + 1);
        return true;
      }
    }
    return false;
  }

  async function handleCollect() {
    let result;
    if (isCollect) {
      result = await cancelCollectRequest(user.id, video.id);
      if (result.code === HttpCode.OK) {
        setIsCollect(false);
        return true;
      }
    } else {
      result = await addCollectRequest(user.id, video.id);
      if (result.code === HttpCode.OK) {
        setIsCollect(true);
        return true;
      }
    }
    return false;
  }

  return (
    <>
      <div className="rounded-video-wrapper">
        <Video src={asset} />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-lg">{video.title}</h3>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Avatar size="md" src={video.author.avatarUrl} />
            <div>
              <span className="font-bold">{video.author.nickname}</span>
              <p className="text-sm">{numberDisplay(fans)}位订阅者</p>
            </div>
            <Button
              className="w-24 rounded-3xl"
              color={isSubscribed ? 'default' : 'secondary'}
              variant="shadow"
              onPress={handleSubscription}
            >
              {isSubscribed ? '已订阅' : '订阅'}
            </Button>
          </div>
          <div className="flex gap-4">
            <ThumbsUpButton
              isLike={isLike}
              number={likeCount}
              onPress={handleLike}
            />
            <Button
              variant="shadow"
              className="w-24 flex justify-center items-center"
              color={isCollect ? 'warning' : 'default'}
              onPress={handleCollect}
            >
              <Star size={16} />
              {isCollect ? '已收藏' : '收藏'}
            </Button>
            <Button
              className="w-24 flex justify-center items-center"
              variant="shadow"
            >
              <Share2 size={16} />
              分享
            </Button>
          </div>
        </div>
        {/* The video's description */}
        <Card>
          <CardBody>
            <p>{video.description}</p>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
