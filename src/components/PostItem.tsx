'use client';

import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  cn,
  Image,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  User,
  Link as LinkIcon
} from '@heroui/react';
import { HttpCode, Post } from '@/utils/types';
import { Ellipsis, Flag, ThumbsUp, Trash2, ListCollapse } from 'lucide-react';
import {
  addPostLikeRequest,
  deletePostLikeRequest,
  deletePostRequest,
} from '@/api/postApi';
import { useStore } from '@/utils/store';
import { useContext } from 'react';
import { PostContext } from '@/context/PostContext';
import Link from 'next/link';

interface PostItemProps {
  post: Post;
}

export function PostItem({ post }: PostItemProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const user = useStore((state) => state.user);
  const postContext = useContext(PostContext);

  async function handlePostLike() {
    if (
      localStorage.getItem('login_status') == undefined ||
      localStorage.getItem('login_status') === 'false'
    ) {
      addToast({
        title: 'Un Authorization',
        description: 'Please login first!',
        color: 'warning',
        variant: 'flat',
      });
      return;
    }
    if (post.isLike) {
      const result = await deletePostLikeRequest(user.id, post.id);
      if (result.code === HttpCode.OK) {
        postContext.handleRemovePostLike(post.id);
      }
    } else {
      const result = await addPostLikeRequest(user.id, post.id);
      if (result.code === HttpCode.OK) {
        postContext.handleAddPostLike(post.id);
      }
    }
  }

  async function deletePost() {
    const result = await deletePostRequest(post.id);
    if (result.code === HttpCode.OK) {
      addToast({
        title: 'Success',
        description: 'Successfully deleted',
        color: 'success',
        variant: 'flat',
      });
      postContext.handleDeletePost(post.id);
    }
  }

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <User
          avatarProps={{
            src: post.user.avatarUrl,
          }}
          description={
            <LinkIcon isExternal href="https://x.com/jrgarciadev" size="sm">
              @{post.user.username}
            </LinkIcon>
          }
          name={post.user.nickname}
        />
        <div className="flex justify-center items-center">
          <span className="text-sm font-light text-gray-500">
            {post.createdTime}
          </span>
          <Popover placement="bottom">
            <PopoverTrigger>
              <Button
                aria-label="More options"
                variant="light"
                isIconOnly
                className="w-14 h-7"
                radius="sm"
              >
                <Ellipsis />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Listbox aria-label="More options menu">
                <ListboxItem
                  showDivider
                  key="new"
                  startContent={<Flag size={18} />}
                >
                  举报
                </ListboxItem>
                <ListboxItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  isDisabled={post.user.id !== user.id}
                  startContent={<Trash2 size={18} />}
                  onPress={onOpen}
                >
                  删除
                </ListboxItem>
              </Listbox>
            </PopoverContent>
          </Popover>
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
                    <Button color="primary" onPress={deletePost}>
                      Yes
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col space-y-4">
        <p>{post.content}</p>
        {/* picture section */}
        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
          {post.images.map((image, index) => (
            <Image
              key={index}
              alt="HeroUI hero Image"
              src={`http://localhost:8080/post/image?image=${image}`}
              width={300}
              isBlurred
              isZoomed
            />
          ))}
        </div>
      </CardBody>
      {/* interaction section */}
      <div className="px-2 py-3 flex items-center gap-2">
        <Button
          onPress={handlePostLike}
          variant="ghost"
          size="sm"
          className={cn(
            'h-7 px-2 text-xs font-normal transition-all duration-200',
            'hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400',
            post.isLike &&
              'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950',
          )}
        >
          <ThumbsUp
            className={cn(
              'w-3.5 h-3.5 transition-all duration-200',
              post.isLike && 'fill-current',
            )}
          />
          {post.likeCount}
        </Button>
        <Link href={`/post/${post.id}`}>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-7 px-2 text-xs font-normal transition-all duration-200',
              'hover:bg-yellow-50 hover:text-yellow-600 dark:hover:bg-yellow-950 dark:hover:text-yellow-400',
            )}
          >
            <ListCollapse
              className={cn('w-3.5 h-3.5 transition-all duration-200')}
            />
            查看详情
          </Button>
        </Link>
      </div>
    </Card>
  );
}
