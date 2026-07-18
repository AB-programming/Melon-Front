import { Reply } from '@/utils/types';
import {
  Avatar,
  Button,
  cn,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@heroui/react';
import { Ellipsis, Flag, Reply as ReplyIcon, ThumbsUp, Trash2 } from 'lucide-react';
import { useStore } from '@/utils/store';

interface ReplyItemProps {
  reply: Reply;
  deleteReplyCallback: (replyId: string) => void;
}

export function ReplyItem({ reply, deleteReplyCallback }: ReplyItemProps) {
  const user = useStore((state) => state.user);

  return (
    <div className="flex gap-3 mt-2">
      <Avatar src={reply.user.avatarUrl} size="sm" />
      <div className="w-full flex flex-col gap-1">
        <div className="w-full flex justify-between items-center">
          <p className="text-sm">
            @{reply.user.nickname}&nbsp;&nbsp;
            <span className="text-gray-400 text-xs">{reply.createdTime}</span>
          </p>
          <Popover placement="bottom">
            <PopoverTrigger>
              <Button
                variant="light"
                isIconOnly
                className="w-14 h-7"
                radius="sm"
              >
                <Ellipsis />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Listbox disabledKeys={reply.user.id !== user.id ? ['delete'] : []}>
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
                  startContent={<Trash2 size={18} />}
                  onPress={() => deleteReplyCallback?.(reply.id)}
                >
                  删除
                </ListboxItem>
              </Listbox>
            </PopoverContent>
          </Popover>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          回复 @{reply.targetUser.nickname}
        </p>
        <p className="text-sm">{reply.content}</p>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-7 px-2 text-xs font-normal transition-all duration-200',
              'hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400',
            )}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            0
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-7 px-2 text-xs font-normal transition-all duration-200',
              'hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950 dark:hover:text-green-400',
            )}
          >
            <ReplyIcon className="w-3.5 h-3.5" />
            回复
          </Button>
        </div>
      </div>
    </div>
  );
}
