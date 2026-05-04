'use client';
import {
  addToast,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Form,
  Input,
} from '@heroui/react';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { FormEvent } from 'react';
import { createUserRequest } from '@/api/userApi';
import { HttpCode } from '@/utils/types';
import { useRouter } from 'next/navigation';
import { OpacityBack } from '@/components/OpacityBack';
import { useStore } from '@/utils/store';

export default function SignUp() {
  const router = useRouter();
  const updateUser = useStore((state) => state.updateUser);

  async function submitSignUp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    if (formData.password !== formData.againPassword) {
      addToast({
        title: 'Error',
        description:
          'The password you entered before and after is inconsistent!',
        color: 'danger',
        variant: 'flat',
      });
      return;
    }
    const result = await createUserRequest(
      formData.username as string,
      formData.password as string,
    );
    if (result.code === HttpCode.OK) {
      addToast({
        title: 'Success',
        description: 'Congratulations on your successful registration',
        color: 'success',
        variant: 'flat',
      });
      updateUser(result.data);
      setTimeout(() => {
        router.push(`/info-complete?id=${result.data.id}`);
      }, 1000);
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
            <ShieldCheck color="white" />
            <h1 className="text-xl font-bold text-white">Sign Up</h1>
          </motion.div>
        </CardHeader>
        <CardBody className="py-6 flex items-center">
          <Form
            className="w-full max-w-xs flex flex-col gap-6 items-center"
            onSubmit={submitSignUp}
          >
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full"
            >
              <Input
                isRequired
                errorMessage="Please enter a valid username"
                label="Username"
                labelPlacement="outside"
                name="username"
                placeholder="Enter your username"
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
              <Input
                isRequired
                errorMessage="Please enter a valid password"
                label="Password"
                labelPlacement="outside"
                name="password"
                placeholder="Enter your password"
                type="password"
                variant="bordered"
                classNames={{
                  input: ['text-white', 'placeholder:text-white/70'],
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
              <Input
                isRequired
                errorMessage="Please enter a valid password"
                label="Again Password"
                labelPlacement="outside"
                name="againPassword"
                placeholder="Enter your password"
                type="password"
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
