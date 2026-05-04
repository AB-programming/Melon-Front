import React, { useState } from 'react';
import { useStore } from '@/utils/store';
import { addToast } from '@heroui/react';
import { uploadAvatarRequest } from '@/api/userApi';
import { HttpCode, User } from '@/utils/types';

export function useAvatar(user: User) {
  const [avatar, setAvatar] = useState<File | null>(null);
  const avatarVersion = useStore((state) => state.avatarVersion);
  const updateUser = useStore((state) => state.updateUser);
  const updateAvatarVersion = useStore((state) => state.updateAvatarVersion);
  const [fileName, setFileName] = useState('');

  async function handleUploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setAvatar(file);
      event.target.value = '';
    }
  }

  async function submitAvatar() {
    if (!avatar) {
      addToast({
        title: 'Warning',
        description: 'Please select a picture!',
        color: 'warning',
        variant: 'flat',
      });
      return;
    }
    const result = await uploadAvatarRequest(avatar, user.id);
    if (result.code === HttpCode.OK) {
      addToast({
        title: 'Upload Successfully',
        description: 'The avatar has been updated successfully',
        color: 'success',
        variant: 'flat',
      });
      user.avatarUrl = result.data;
      updateUser(user);
      updateAvatarVersion();
    }
  }

  return { fileName, avatarVersion, handleUploadImage, submitAvatar };
}
