'use client';
import { OpacityBack } from '@/components/OpacityBack';
import {
  addToast,
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Form,
  Input,
  Textarea,
} from '@heroui/react';
import { motion } from 'framer-motion';
import { BookmarkCheck, FileUp } from 'lucide-react';
import React, { FormEvent, use } from 'react';
import { useAvatar } from '@/hooks/useAvatar';
import { useStore } from '@/utils/store';
import { updateUserRequest } from '@/api/userApi';
import { HttpCode } from '@/utils/types';

export default function InfoComplete({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const user = useStore((state) => state.user);
  const { fileName, avatarVersion, handleUploadImage, submitAvatar } =
    useAvatar(user);
  const updateUser = useStore((state) => state.updateUser);

  const params = use(searchParams);
  if (params.id === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        Missing User ID
      </div>
    );
  }

  async function submitComplete(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    const result = await updateUserRequest(user.id, formData.nickname as string, formData.signature as string, '', '', '', '');
    if (result.code === HttpCode.OK) {
      addToast({
        title: 'Success',
        description: 'User information completed successfully',
        color: 'success'
      });
      updateUser(result.data);
      user.nickname = result.data.nickname;
      user.signature = result.data.signature;
      localStorage.setItem('user', JSON.stringify(user));
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
  }

  return (
    <OpacityBack>
      <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
        <CardHeader className="flex justify-center gap-3 mt-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex gap-2"
          >
            <BookmarkCheck color="white" />
            <h1 className="text-xl font-bold text-white">
              Complete personal information
            </h1>
          </motion.div>
        </CardHeader>
        <CardBody className="py-6 flex items-center">
          <Form
            className="w-full max-w-xs flex flex-col gap-2 items-center"
            onSubmit={submitComplete}
          >
            <div className="w-full h-36 flex gap-2 mb-4">
              <Avatar
                radius="lg"
                className="w-1/3 h-28"
                name="You"
                showFallback
                src={`${user.avatarUrl}?v=${avatarVersion}`}
              />
              <div className="flex flex-col items-center gap-4 w-2/3">
                <Input type="file" onChange={handleUploadImage} />
                {fileName && <div>Selected file: {fileName}</div>}
                <Button
                  startContent={<FileUp />}
                  color="success"
                  onPress={submitAvatar}
                >
                  Upload
                </Button>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full"
            >
              <Input
                isRequired
                errorMessage="Please enter a valid nickname"
                label="Nickname"
                labelPlacement="outside"
                name="nickname"
                placeholder="Enter your nickname"
                type="text"
                variant="bordered"
                classNames={{
                  input: 'text-white placeholder:text-white/70',
                  label: 'text-black/70 group-data-[filled=true]:text-white/90',
                  inputWrapper: [
                    'bg-white/10',
                    'backdrop-blur-md',
                    'border-white/20',
                    'hover:border-white/40',
                    'focus-within:border-blue-400',
                    'group-data-[focus=true]:border-blue-400',
                    '!cursor-text',
                  ],
                  innerWrapper: 'bg-transparent',
                  base: 'data-[has-label=true]:mt-[calc(theme(fontSize.small)_+_8px)]',
                }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full"
            >
              <Textarea
                errorMessage="Please enter a valid signature"
                label="Signature"
                labelPlacement="outside"
                name="signature"
                placeholder="Enter your signature"
                type="text"
                variant="bordered"
                classNames={{
                  input: 'text-white placeholder:text-white/70',
                  label: 'text-black/70 group-data-[filled=true]:text-white/90',
                  inputWrapper: [
                    'bg-white/10',
                    'backdrop-blur-md',
                    'border-white/20',
                    'hover:border-white/40',
                    'focus-within:border-blue-400',
                    'group-data-[focus=true]:border-blue-400',
                    '!cursor-text',
                  ],
                  innerWrapper: 'bg-transparent',
                  base: 'data-[has-label=true]:mt-[calc(theme(fontSize.small)_+_8px)]',
                }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex gap-4 mt-4">
                <Button
                  color="primary"
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Submit
                </Button>
                <Button
                  type="reset"
                  variant="flat"
                  className="w-full bg-gradient-to-r from-gray-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Reset
                </Button>
              </div>
            </motion.div>
          </Form>
        </CardBody>
        <CardFooter className="flex justify-center">
          <p className="text-sm font-light text-gray-400">Powered by Melon</p>
        </CardFooter>
      </Card>
    </OpacityBack>
  );
}
