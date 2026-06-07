'use client';

import {
  addToast,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Form,
  Input,
  Progress,
  Textarea,
} from '@heroui/react';
import { Film, Image as ImageIcon, Upload } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import {
  checkMergeRequest,
  createVideoRequest,
  mergeRequest,
  uploadChunkRequest,
} from '@/api/videoApi';
import { HttpCode, User } from '@/utils/types';
import SparkMD5 from 'spark-md5';
import pLimit from 'p-limit';
import { useRouter } from 'next/navigation';

export default function UploadVideo() {
  const limit = pLimit(5); // Limit the number of concurrent uploads to 5
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB, this is file chunk size for vide upload

  const router = useRouter();
  const user = JSON.parse(localStorage.getItem('user') ?? '{}') as User;

  const cancelledRef = useRef(false);
  const [video, setVideo] = useState<File | null>(null);
  const [picture, setPicture] = useState<File | null>(null);
  const [videoName, setVideoName] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [pictureName, setPictureName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [picturePreview, setPicturePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
    }
  }, []);

  async function handleUploadVideo(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setVideoName(file.name);
      setVideo(file);
      setVideoUrl(URL.createObjectURL(file));
      const cover = await captureVideoCover(file);
      setPicture(cover);
      setPicturePreview(URL.createObjectURL(cover));
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
      setPicturePreview(URL.createObjectURL(file));
      event.target.value = '';
    }
  }

  function captureVideoCover(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.muted = true;
      video.onloadeddata = () => {
        // 跳到1秒位置
        video.currentTime = 1;
      };
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject();
          return;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (!blob) {
            reject();
            return;
          }
          const coverFile = new File([blob], 'cover.jpg', {
            type: 'image/jpeg',
          });
          resolve(coverFile);
        }, 'image/jpeg');
      };
    });
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

  async function pollCheckMerge(fileId: string) {
    // The polling frequency is set to 60 times.
    for (let i = 0; i < 60; i++) {
      const response = await checkMergeRequest(fileId);
      if (response.code === HttpCode.OK) {
        const status = response.data;
        if (status === 'SUCCESS') {
          addToast({
            title: 'Handle Successfully',
            description: 'File processing successful.',
            color: 'success',
            variant: 'flat',
          });
          router.push('/');
          break;
        } else if (status === 'MERGING') {
          await new Promise((r) => setTimeout(r, 2000))
          continue;
        }
      }
      // To avoid continuously polling when the user manually exits the interface
      if (cancelledRef.current) return;
      addToast({
        title: 'Error',
        description: 'File processing failed, please upload again later!',
        color: 'danger',
        variant: 'flat',
      });
      break;
    }
    setIsLoading(false);
  }

  async function submitVideo() {
    setIsLoading(true);
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
            description:
              'The file has been uploaded and is being processed in the background. Please wait.',
            color: 'success',
            variant: 'flat',
          });
          setVideo(null);
          setVideoName('');
          setTitle('');
          setDescription('');
          // Polling to check if the video is merged successfully and published
          await pollCheckMerge(result.data);
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
    <Card className="w-full md:w-1/2 lg:w-2/5 max-w-xl mt-6 mx-auto">
      <CardHeader className="flex flex-col gap-1">Create my video</CardHeader>
      {(videoUrl || picturePreview) && (
        <div className="px-4 pb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videoUrl && (
              <div className="rounded-xl overflow-hidden border border-default-200 bg-content1 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-default-200 bg-default-50">
                  <Film className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-default-600">
                    Video Preview
                  </span>
                </div>
                <div className="p-2 bg-black">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full aspect-video rounded-md"
                  />
                </div>
              </div>
            )}
            {picturePreview && (
              <div className="rounded-xl overflow-hidden border border-default-200 bg-content1 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-default-200 bg-default-50">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-default-600">
                    Cover Preview
                  </span>
                </div>
                <div className="p-2 flex items-center justify-center bg-default-50/50 min-h-[120px]">
                  <img
                    src={picturePreview}
                    alt="cover"
                    className="w-full max-w-xs aspect-video object-cover rounded-md"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <CardBody>
        <Form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 justify-center w-full">
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2 text-sm font-medium text-default-700 min-w-[64px]">
                <Upload className="w-4 h-4 text-primary" />
                Video
              </label>
              <Input
                type="file"
                className="w-3/4"
                onChange={handleUploadVideo}
              />
            </div>
            {videoName && (
              <Chip
                variant="flat"
                color="primary"
                size="sm"
                startContent={<Film className="w-3 h-3 ml-1" />}
                className="self-start"
              >
                {videoName}
              </Chip>
            )}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm font-medium text-default-700 min-w-[64px]">
                <ImageIcon className="w-4 h-4 text-primary" />
                Cover
              </label>
              <Input
                type="file"
                className="w-3/4"
                onChange={handleUploadPicture}
              />
            </div>
            {pictureName && (
              <Chip
                variant="flat"
                color="secondary"
                size="sm"
                startContent={<ImageIcon className="w-3 h-3 ml-1" />}
                className="self-start"
              >
                {pictureName}
              </Chip>
            )}
            <Progress
              aria-label="Uploading..."
              className="max-w-md"
              color="success"
              showValueLabel={true}
              size="md"
              value={uploadProgress}
            />
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
          <Textarea
            labelPlacement="outside"
            isClearable
            value={description}
            label="Description"
            placeholder="Enter your video description"
            variant="bordered"
            onValueChange={setDescription}
          />
        </Form>
      </CardBody>
      <CardFooter className="flex justify-center gap-4">
        <Button variant="ghost" onPress={() => router.push('/')}>Cancel</Button>
        <Button isLoading={isLoading} color="primary" onPress={submitVideo}>
          Create
        </Button>
      </CardFooter>
    </Card>
  );
}
