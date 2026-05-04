'use client';

import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
  Textarea,
  useDisclosure,
} from '@heroui/react';
import { CircleX, Plus, Telescope, Upload, UserRoundPlus } from 'lucide-react';
import { useRef, useState } from 'react';
import { addPostRequest } from '@/api/postApi';
import { useStore } from '@/utils/store';
import { HttpCode, Post } from '@/utils/types';

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

interface PostTabsProps {
  addPostCallbackAction: (post: Post) => void;
}

export function PostTabs({ addPostCallbackAction }: PostTabsProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [content, setContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useStore((state) => state.user);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: ImageFile[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const preview = URL.createObjectURL(file);
        const id = Math.random().toString(36).substr(2, 9);
        newImages.push({ file, preview, id });
      }
    });

    setImages((prev) => [...prev, ...newImages]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  const clearAllImages = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
  };

  // submit a post
  const handleSubmit = async (onClose: () => void) => {
    const files = images.map((img) => img.file);
    const result = await addPostRequest(user.id, content, files);
    if (result.code === HttpCode.OK) {
      addToast({
        title: 'Successfully',
        description: 'Post successfully published',
        color: 'success',
        variant: 'flat',
      });
      onClose();
      setContent('');
      setImages([]);
      addPostCallbackAction(result.data);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex justify-between mb-4 px-3">
      <Tabs color="secondary" variant="bordered">
        <Tab
          key="discover"
          title={
            <div className="flex items-center space-x-2">
              <Telescope />
              <span>探索</span>
            </div>
          }
        />
        <Tab
          key="follow"
          title={
            <div className="flex items-center space-x-2">
              <UserRoundPlus />
              <span>关注</span>
            </div>
          }
        />
      </Tabs>
      <Button onPress={onOpen} variant="shadow" radius="full" color="primary">
        <Plus size={18} />
        发帖
      </Button>
      <Modal
        size="lg"
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                发布帖子
              </ModalHeader>
              <ModalBody>
                <div className="w-full space-y-2">
                  <Textarea
                    minRows={4}
                    label="帖子内容"
                    placeholder="输入你的帖子内容"
                    value={content}
                    onValueChange={setContent}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="flex gap-3 mt-4">
                    <Button
                      onPress={triggerFileSelect}
                      variant="shadow"
                      color="primary"
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      选择图片
                    </Button>

                    {images.length > 0 && (
                      <Button
                        onPress={clearAllImages}
                        variant="shadow"
                        color="danger"
                      >
                        清空所有
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    支持多选，仅支持图片格式文件
                  </p>
                  {images.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-medium">
                        已选择图片 ({images.length})
                      </h3>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image) => (
                          <div key={image.id} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                              <img
                                src={image.preview || '/placeholder.svg'}
                                alt={image.file.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* 删除按钮 */}
                            <button
                              onClick={() => removeImage(image.id)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <CircleX className="w-5 h-5" />
                            </button>

                            {/* 文件名 */}
                            <p className="mt-2 text-xs text-muted-foreground truncate">
                              {image.file.name}
                            </p>

                            {/* 文件大小 */}
                            <p className="text-xs text-muted-foreground">
                              {(image.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button color="primary" onPress={() => handleSubmit(onClose)}>
                  发布
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
