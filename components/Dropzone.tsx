import { ExtFile, FileMosaic, Dropzone as FilesUIDropzone, Method } from '@files-ui/react';
import { Badge, Button, Notification, TextInput } from '@mantine/core';
import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import Link from 'next/link';
import { useState } from 'react';

type UploadStatus = 'preparing' | 'aborted' | 'uploading' | 'success' | 'error';

export default function Dropzone() {
  const [files, setFiles] = useState<ExtFile[]>([]);
  const uploadUrl = process.env.NEXT_PUBLIC_S3_API + '/upload-image';
  const [dropOccurred, setDropOccurred] = useState<boolean>(false);
  const [uploadSuccessful, setUploadSuccessful] = useState(false);

  const [word, setWord] = useState('');
  const [wordList, setWordList] = useState<string[]>([]);

  const colorSchemes = [
    'dark',
    'light',
    'blue',
    'cyan',
    'teal',
    'green',
    'lime',
    'yellow',
    'amber',
    'orange',
    'red',
    'pink',
    'purple',
    'indigo',
    'blue-gray',
  ];

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!/\s/.test(word)) {
        // Check if the word contains any spaces
        setWordList([...wordList, word]);
        setWord('');
      }
    }
  };

  const updateFiles = (acceptedFiles: ExtFile[]) => {
    setFiles(
      acceptedFiles.map((file) => ({
        ...file,
        uploadStatus: 'preparing' as UploadStatus,
      }))
    );
    setDropOccurred(true);
  };

  const removeFile = (fileId: string | number | undefined) => {
    if (typeof fileId === 'number') {
      setFiles(files.filter((x) => x.id !== fileId));
      setDropOccurred(false);
    }
  };

  const uploadFile = async (file: ExtFile) => {
    const formData = new FormData();
    formData.append('image', file.file as File);
    const config: AxiosRequestConfig<FormData> = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        setFiles(
          files.map((f) => {
            if (f.id === file.id) {
              return {
                ...f,
                uploadStatus: 'uploading' as UploadStatus,
                uploadProgress: percentCompleted,
              };
            }
            return f;
          })
        );
      },
    };
    try {
      const response = await axios.post(uploadUrl as string, formData, config);
      setFiles(
        files.map((f) => {
          if (f.id === file.id) {
            setUploadSuccessful(true);
            return {
              ...f,
              uploadStatus: 'success' as UploadStatus,
              serverResponse: response.data,
            };
          }
          return f;
        })
      );
    } catch (error) {
      setUploadSuccessful(false);
      setFiles(
        files.map((f) => {
          if (f.id === file.id) {
            return {
              ...f,
              uploadStatus: 'error' as UploadStatus,
              errors: (error as any).message,
            };
          }
          return f;
        })
      );
    }
  };

  return (
    <div className="flex flex-col w-full max-w-lg gap-3 ">
      <FilesUIDropzone
        onChange={updateFiles}
        value={files}
        accept={'image/*'}
        maxFileSize={28 * 1024 * 1024}
        maxFiles={1}
      >
        {files.map((file: ExtFile) => (
          <FileMosaic
            key={file.id}
            {...file}
            onDelete={removeFile}
            info
            preview
            uploadStatus={file.uploadStatus}
          />
        ))}
      </FilesUIDropzone>
      {files.length > 0 && (
        <>
          {uploadSuccessful && (
            <div className="flex flex-col gap-3">
              <TextInput
                variant="filled"
                value={word}
                onChange={(event) => setWord(event.currentTarget.value)}
                onKeyPress={handleKeyPress}
                size="md"
                radius="xl"
                label="Cutout objects"
                withAsterisk
                description="Names of objects you want to cut from this image (Yes people are objects in this case)"
                placeholder="Enter a word"
              />
              <div className="flex flex-wrap">
                {wordList.map((word, index) => (
                  <Badge
                    variant="light"
                    size="xl"
                    key={index}
                    color={colorSchemes[Math.floor(Math.random() * colorSchemes.length)]}
                    className="m-1"
                  >
                    {word}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center justify-center mt-4">
            {!uploadSuccessful ? (
              <Button onClick={() => uploadFile(files[0])}>Upload</Button>
            ) : (
              <Link
                href={`/cutout/${files[0].name}?${wordList
                  .map((word) => `class=${word}`)
                  .join('&')}`}
              >
                <Button>Next</Button>
              </Link>
            )}
          </div>
          {uploadSuccessful && (
            <Notification title="Upload successful" color="green">
              Your image has been uploaded successfully. Click the button below to continue.
            </Notification>
          )}
        </>
      )}
    </div>
  );
}
