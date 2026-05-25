'use client';

import {
  addToast,
  Avatar,
  Button,
  Form,
  Input,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  User as UserIcon,
  Progress,
} from '@heroui/react';
import { MelonLogo } from './MelonLogo';
import { LogOut, NotepadText, UserRound, Wallet, Send } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Search } from './Search';
import pkceChallenge from 'pkce-challenge';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Introspect } from '@/utils/types';
import { HttpCode } from '@/utils/types';
import { useStore } from '@/utils/store';
import { getUserRequest } from '@/api/userApi';
import {
  createVideoRequest,
  mergeRequest,
  uploadChunkRequest,
} from '@/api/videoApi';
import SparkMD5 from 'spark-md5';
import pLimit from 'p-limit';

export function Header() {
  const router = useRouter();

  const [loginStatus, setLoginStatus] = useState(
    localStorage.getItem('login_status') != undefined &&
      localStorage.getItem('login_status') === 'true',
  );

  const limit = pLimit(5); // Limit the number of concurrent uploads to 5
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB, this is file chunk size for vide upload

  const user = useStore((state) => state.user);
  const avatarVersion = useStore((state) => state.avatarVersion);
  const updateUser = useStore((state) => state.updateUser);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [video, setVideo] = useState<File | null>(null);
  const [picture, setPicture] = useState<File | null>(null);
  const [videoName, setVideoName] = useState('');
  const [pictureName, setPictureName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    fetch(`${process.env.NEXT_PUBLIC_AUTH_URI}/introspect?token=${token}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((result) => {
        const introspect: Introspect = result;
        if (introspect.active && introspect.user) {
          getUserRequest(introspect.user.id).then((result) => {
            if (result.code === HttpCode.OK) {
              localStorage.setItem('user', JSON.stringify(result.data));
              updateUser(result.data);
            }
          });
        } else {
          setLoginStatus(false);
          clearLocalStorageCache();
        }
      });
  }, []);

  async function login() {
    const { code_challenge, code_verifier } = await pkceChallenge();
    localStorage.setItem('code_verifier', code_verifier);
    window.location.href = `${process.env.NEXT_PUBLIC_AUTH_URI}/oauth2/authorize?response_type=code&client_id=melon&scope=profile&redirect_uri=http://localhost:3000/login&code_challenge=${code_challenge}&code_challenge_method=S256`;
  }

  function clearLocalStorageCache() {
    localStorage.setItem('login_status', 'false');
    localStorage.removeItem('access_token');
    localStorage.removeItem('code_verifier');
    localStorage.removeItem('user');
  }

  function logout() {
    setLoginStatus(false);
    clearLocalStorageCache();
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URI}/logout`;
  }

  async function handleUploadVideo(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setVideoName(file.name);
      setVideo(file);
      event.target.value = '';
    }
  }

  async function handleUploadPicture(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    if (file) {
      setPictureName(file.name);
      setPicture(file);
      event.target.value = '';
    }
  }

  function createChunks(file: File) {
    const chunks = [];
    let current = 0;
    while (current < file.size) {
      chunks.push(file.slice(current, current + CHUNK_SIZE));
      current += CHUNK_SIZE;
    }
    return chunks;
  }

  async function calculateFileMD5(file: File) {
    return new Promise<string>((resolve) => {
      const chunks = Math.ceil(file.size / CHUNK_SIZE);
      let currentChunk = 0;
      const spark = new SparkMD5.ArrayBuffer();

      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        spark.append(e.target?.result as ArrayBuffer);
        currentChunk++;
        if (currentChunk < chunks) {
          loadNext();
        } else {
          resolve(spark.end());
        }
      };

      function loadNext() {
        const start = currentChunk * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        fileReader.readAsArrayBuffer(file.slice(start, end));
      }

      loadNext();
    });
  }

  async function submitVideo(close: () => void) {
    if (!video) {
      addToast({
        title: 'Warning',
        description: 'Please select a video!',
        color: 'warning',
        variant: 'flat',
      });
      return;
    }
    if (!picture) {
      addToast({
        title: 'Warning',
        description: 'Please select a cover!',
        color: 'warning',
        variant: 'flat',
      });
      return;
    }

    const result = await createVideoRequest(
      picture,
      user.id,
      title,
      description,
    );
    if (result.code === HttpCode.OK) {
      const chunks = createChunks(video);
      const fileMd5 = await calculateFileMD5(video);

      let uploadBytes = 0;

      const tasks = chunks.map((chunk, index) => {
        return limit(async () => {
          const response = await uploadChunkRequest(chunk, index, fileMd5);
          return new Promise<boolean>((resolve, reject) => {
            if (response.code === HttpCode.OK && response.data) {
              resolve(true);
              uploadBytes += chunk.size;
              setUploadProgress(Math.floor((uploadBytes / video.size) * 100));
              return;
            }
            reject(false);
          });
        });
      });

      try {
        await Promise.all(tasks);
        // all chunks uploaded successfully, now request merge
        const mergeResponse = await mergeRequest(fileMd5, result.data);
        if (mergeResponse.code === HttpCode.OK && mergeResponse.data) {
          addToast({
            title: 'Upload Successfully',
            description: 'The video has been upload successfully',
            color: 'success',
            variant: 'flat',
          });
          close();
          setVideo(null);
          setVideoName('');
          setTitle('');
          setDescription('');
        } else {
          // merge failed
          addToast({
            title: 'Upload Failed',
            description: 'Please again wait',
            color: 'danger',
            variant: 'flat',
          });
        }
      } catch (error) {
        console.error('💥 Promise.all failed，reason:', error);
        addToast({
          title: 'Upload Failed',
          description: 'Please again wait',
          color: 'danger',
          variant: 'flat',
        });
      }
    }
  }

  return (
    <div className="fixed top-0 left-0 w-full h-16 z-10">
      <Navbar maxWidth="full">
        <NavbarBrand>
          <MelonLogo />
          <p className="font-bold text-inherit">Melon</p>
        </NavbarBrand>
        <Search />
        <NavbarContent justify="end">
          {loginStatus && (
            <NavbarItem>
              <Button onPress={onOpen} color="success" variant="faded">
                <Send size={18} />
                Upload video
              </Button>
            </NavbarItem>
          )}
          <NavbarItem>
            <ThemeSwitcher />
          </NavbarItem>
          <>
            {loginStatus ? (
              <NavbarItem>
                <Popover showArrow offset={10} placement="bottom">
                  <PopoverTrigger>
                    <Avatar
                      radius="lg"
                      isBordered
                      src={`${user.avatarUrl}?v=${avatarVersion}`}
                      key={user.id}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-4">
                    <UserIcon
                      avatarProps={{
                        src: `${user.avatarUrl}?v=${avatarVersion}`,
                      }}
                      description="General User"
                      name={user.nickname}
                      key={user.id}
                    />
                    <Listbox aria-label="Actions" className="mt-2">
                      <ListboxItem
                        key="user"
                        startContent={<UserRound size={18} />}
                        onPress={() => router.push('/user/self')}
                      >
                        个人主页
                      </ListboxItem>
                      <ListboxItem
                        key="post"
                        startContent={<NotepadText size={18} />}
                      >
                        我的投稿
                      </ListboxItem>
                      <ListboxItem
                        key="wallet"
                        startContent={<Wallet size={18} />}
                      >
                        我的钱包
                      </ListboxItem>
                      <ListboxItem
                        key="logout"
                        className="text-danger"
                        color="danger"
                        startContent={<LogOut size={18} />}
                        onPress={logout}
                      >
                        Logout
                      </ListboxItem>
                    </Listbox>
                  </PopoverContent>
                </Popover>
              </NavbarItem>
            ) : (
              <></>
            )}
          </>
          <>
            {loginStatus ? (
              <></>
            ) : (
              <NavbarItem>
                <Button color="primary" variant="ghost" onPress={login}>
                  Log in
                </Button>
              </NavbarItem>
            )}
          </>
          <>
            {loginStatus ? (
              <></>
            ) : (
              <NavbarItem>
                <Button
                  color="success"
                  variant="ghost"
                  onPress={() => router.push('/sign-up')}
                >
                  Sign up
                </Button>
              </NavbarItem>
            )}
          </>
        </NavbarContent>
      </Navbar>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create my video
              </ModalHeader>
              <ModalBody>
                <Form className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2 justify-center w-full">
                    <div className="flex gap-4 items-center">
                      <label>Video:</label>
                      <Input
                        type="file"
                        className="w-3/4"
                        onChange={handleUploadVideo}
                      />
                    </div>
                    {videoName && <div>Selected video: {videoName}</div>}
                    <Progress
                      aria-label="Uploading..."
                      className="max-w-md"
                      color="success"
                      showValueLabel={true}
                      size="md"
                      value={uploadProgress}
                    />
                    <div className="flex items-center gap-4">
                      <label>Cover:</label>
                      <Input
                        type="file"
                        className="w-3/4"
                        onChange={handleUploadPicture}
                      />
                    </div>
                    {pictureName && <div>Selected cover: {pictureName}</div>}
                  </div>
                  <Input
                    isRequired
                    errorMessage="Please enter a valid title"
                    label="Title"
                    labelPlacement="outside"
                    name="title"
                    placeholder="Enter your video title"
                    type="text"
                    value={title}
                    onValueChange={setTitle}
                  />
                  <Input
                    errorMessage="Please enter a valid description"
                    label="Description"
                    labelPlacement="outside"
                    name="description"
                    placeholder="Enter your video description"
                    type="text"
                    value={description}
                    onValueChange={setDescription}
                  />
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={() => submitVideo(onClose)}>
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
