import { Button, Textarea } from '@heroui/react';
import { Comment, HttpCode, Reply, Video } from '@/utils/types';
import { useState } from 'react';
import { sendCommentRequest, sendReplyRequest } from '@/api/videoApi';
import { useStore } from '@/utils/store';

interface BaseProps {
  submitCallback: (data: Comment | Reply) => void;
  cancelCallback?: () => void;
}

interface CommentProps extends BaseProps {
  type: 'comment';
  video: Video;
  comment?: Comment;
}

interface ReplyProps extends BaseProps {
  type: 'reply';
  comment: Comment;
  video?: Video;
}

type CommentBoxProps = CommentProps | ReplyProps;

export function CommentBox({
  type,
  video,
  comment,
  submitCallback,
  cancelCallback,
}: CommentBoxProps) {
  const user = useStore((state) => state.user);
  const [text, setText] = useState('');

  async function send() {
    if (type === 'comment') {
      const result = await sendCommentRequest(user.id, video.id, text);
      if (result.code === HttpCode.OK) {
        setText('');
        submitCallback(result.data);
      }
    } else {
      const result = await sendReplyRequest(user.id, comment.id, comment?.id, 'c', text);
      if (result.code === HttpCode.OK) {
        setText('');
        submitCallback(result.data);
      }
    }
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <Textarea
        key={type === 'comment' ? video?.id : comment?.id}
        labelPlacement="outside"
        placeholder={`Enter your ${type}`}
        variant="underlined"
        minRows={1}
        value={text}
        onValueChange={setText}
      />
      <div className="flex justify-end gap-2">
        <Button
          radius="sm"
          variant="faded"
          onPress={() => {
            setText('');
            if (cancelCallback) {
              cancelCallback();
            }
          }}
        >
          Cancel
        </Button>
        <Button radius="sm" variant="faded" color="primary" onPress={send}>
          Send
        </Button>
      </div>
    </div>
  );
}
