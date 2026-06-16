'use client';

import Image from 'next/image';
import { useStore } from '@/utils/store';
import { useEffect, useState } from 'react';
import { HttpCode, Video } from '@/utils/types';
import { deleteVideoRequest, fetchUserVideoListRequest } from '@/api/videoApi';
import {
  addToast,
  Button,
  Card,
  CardBody, Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import { PlayCircle } from 'lucide-react';
import Link from 'next/link';

export function UserVideoList() {
  const user = useStore(state => state.user);
  const [videoList, setVideoList] = useState<Video[]>([]);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

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

  async function deleteVideo(onClose: () => void, id: string) {
    const result = await deleteVideoRequest(id);
    onClose();
    if (result.code === HttpCode.OK && result.data) {
      addToast({
        title: 'Success',
        description: 'Video deleted successfully!',
        color: 'success',
        variant: 'flat',
      });
      setVideoList(prev => prev.filter(video => video.id !== id));
    } else {
      addToast({
        title: 'Failed',
        description: 'Video deleted failed, please try again!',
        color: 'danger',
        variant: 'flat',
      });
    }
  }

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
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Delete Post
                  </ModalHeader>
                  <ModalBody>Do you want to delete this post?</ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      No
                    </Button>
                    <Button color="primary" onPress={() => deleteVideo(onClose, video.id)}>
                      Yes
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
          <Button size="sm" color="danger" radius="lg" variant="light" onPress={onOpen}>删除视频</Button>
        </Card>
      )) : <>暂无作品</>}
    </div>
  );
}
