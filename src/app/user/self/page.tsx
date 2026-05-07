'use client';

import React, { useState } from 'react';
import {
  addToast,
  Avatar,
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  Textarea,
  Tooltip,
  useDisclosure,
} from '@heroui/react';
import { Copy, FilePenLine, FileUp, House, StickyNote, Tv, Users } from 'lucide-react';
import { useStore } from '@/utils/store';
import { updateUserRequest } from '@/api/userApi';
import { HttpCode, User } from '@/utils/types';
import { useAvatar } from '@/hooks/useAvatar';
import { UserVideoList } from '@/components/UserVideoList';
import { UserHome } from '@/components/UserHome';
import { SubscribedUsers } from '@/components/SubscribedUsers';

export default function Self() {
  const localUser = JSON.parse(localStorage.getItem('user') ?? '') as User;

  const user = useStore((state) => state.user);
  const updateUser = useStore((state) => state.updateUser);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { fileName, avatarVersion, handleUploadImage, submitAvatar } =
    useAvatar(user);

  const [nickname, setNickname] = useState(
    localUser ? (localUser.nickname ?? '') : '',
  );
  const [signature, setSignature] = useState(
    localUser ? (localUser.signature ?? '') : '',
  );
  const [residence, setResidence] = useState(
    localUser ? (localUser.residence ?? '') : '',
  );
  const [introduction, setIntroduction] = useState(
    localUser ? (localUser.introduction ?? '') : '',
  );
  const [gender, setGender] = useState(
    localUser ? (localUser.gender ?? '') : '',
  );
  const [interest, setInterest] = useState(
    localUser ? (localUser.interest ?? '') : '',
  );

  async function submitEditUser(onClose: () => void) {
    if (nickname === '') {
      addToast({
        title: 'Input',
        description: 'Please enter your nickname',
        color: 'danger',
      });
      return;
    }
    const result = await updateUserRequest(
      user.id,
      nickname,
      signature,
      introduction,
      gender,
      residence,
      interest,
    );
    if (result.code === HttpCode.OK) {
      addToast({
        title: 'Success',
        description: 'User information modified successfully',
        color: 'success',
      });
      onClose();
      updateUser(result.data);
      user.nickname = result.data.nickname;
      user.signature = result.data.signature;
      user.gender = result.data.gender;
      user.introduction = result.data.introduction;
      user.interest = result.data.interest;
      user.residence = result.data.residence;
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  return (
    <div className="flex w-full mt-6 xl:px-28 lg:px-24 md:px-20 sm:px-16">
      <div className="w-3/4">
        <div className="flex justify-around">
          <h1 className="font-black text-3xl">{user.nickname}</h1>
          <Tooltip content="Copy link to profile" className="text-purple-400">
            <Button isIconOnly size="sm" variant="faded" radius="sm">
              <Copy size={16} />
            </Button>
          </Tooltip>
        </div>
        <div className="pt-8 xl:pl-24 lg:pl-16 md:pl-8 sm:pl-0">
          <Tabs aria-label="Options" variant="bordered">
            <Tab
              key="home"
              title={
                <div className="flex items-center space-x-2">
                  <House size={18} />
                  <span>首页</span>
                </div>
              }
            >
              <UserHome />
            </Tab>
            <Tab
              key="vedio"
              title={
                <div className="flex items-center space-x-2">
                  <Tv size={18} />
                  <span>视频</span>
                </div>
              }
            >
              <UserVideoList />
            </Tab>
            <Tab
              key="post"
              title={
                <div className="flex items-center space-x-2">
                  <StickyNote size={18} />
                  <span>帖子</span>
                </div>
              }
            >
              3
            </Tab>
            <Tab
              key="subscriptions"
              title={
                <div className="flex items-center space-x-2">
                  <Users size={18} />
                  <span>关注</span>
                </div>
              }
            >
              <SubscribedUsers />
            </Tab>
          </Tabs>
        </div>
      </div>
      <div className="w-1/4 flex flex-col gap-3">
        <Avatar
          radius="lg"
          className="w-20 h-20 text-large"
          src={`${user.avatarUrl}?v=${avatarVersion}`}
          key={user.id}
        />
        <p className="font-bold">{user.nickname}</p>
        <p>{user.signature}</p>
        <Button
          className="w-1/2"
          startContent={<FilePenLine size={18} />}
          color="success"
          variant="ghost"
          onPress={onOpen}
        >
          Edit profile
        </Button>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside" size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit profile
              </ModalHeader>
              <ModalBody>
                <Form className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <Avatar
                      radius="lg"
                      className="w-20 h-20 text-large"
                      src={`${user.avatarUrl}?v=${avatarVersion}`}
                    />
                    <div className="flex flex-col items-center gap-4">
                      <Input
                        type="file"
                        className="w-3/4"
                        onChange={handleUploadImage}
                      />
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
                  <Input
                    isRequired
                    errorMessage="Please enter a valid nickname"
                    label="Nickname"
                    labelPlacement="outside"
                    name="nickname"
                    placeholder="Enter your nickname"
                    type="text"
                    value={nickname}
                    onValueChange={setNickname}
                  />
                  <Input
                    errorMessage="Please enter a valid signature"
                    label="Signature"
                    labelPlacement="outside"
                    name="signature"
                    placeholder="Enter your signature"
                    type="text"
                    value={signature}
                    onValueChange={setSignature}
                  />
                  <RadioGroup
                    label="Gender"
                    orientation="horizontal"
                    value={gender}
                    onValueChange={setGender}
                  >
                    <Radio value="男">男</Radio>
                    <Radio value="女">女</Radio>
                  </RadioGroup>
                  <Input
                    errorMessage="Please enter a valid residence"
                    label="Residence"
                    labelPlacement="outside"
                    name="residence"
                    placeholder="Enter your residence"
                    type="text"
                    value={residence}
                    onValueChange={setResidence}
                  />
                  <Input
                    errorMessage="Please enter a valid interest"
                    label="Interest"
                    labelPlacement="outside"
                    name="interest"
                    placeholder="Enter your interest"
                    type="text"
                    value={interest}
                    onValueChange={setInterest}
                  />
                  <Textarea
                    labelPlacement="outside"
                    isClearable
                    value={introduction}
                    label="Introduction"
                    placeholder="please introduce you"
                    variant="bordered"
                    onValueChange={setIntroduction}
                  />
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={() => submitEditUser(onClose)}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}