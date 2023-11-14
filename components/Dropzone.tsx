import { useS3 } from '@/hooks/s3Upload';
import { ExtFile, FileMosaic, Dropzone as FilesUIDropzone, Method } from "@files-ui/react";
import { Notification } from '@mantine/core';
import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import cors from 'cors';
import { useState } from 'react';

type UploadStatus = "preparing" | "aborted" | "uploading" | "success" | "error";

export default function Dropzone() {
  const [files, setFiles] = useState<ExtFile[]>([]);
  const [presignedUrl, setPresignedUrl] = useState<string>('');
  const [dropOccurred, setDropOccurred] = useState<boolean>(false);

  const updateFiles = (acceptedFiles: ExtFile[]) => {
    setFiles(acceptedFiles.map((file) => ({
      ...file,
      uploadStatus: "preparing" as UploadStatus,
    })));
    setDropOccurred(true);
    useS3().getPresignedUrl(acceptedFiles[0].name as string,'putObject').then((url) => {
      console.log(url);
      setPresignedUrl(url);
    });
  };

  const removeFile = (fileId: string | number | undefined) => {
    if (typeof fileId === "number") {
      setFiles(files.filter((x) => x.id !== fileId));
      setDropOccurred(false);
      setPresignedUrl('');
    }
  };

  const uploadFile = async (file: ExtFile) => {
    if (presignedUrl) {
      const formData = new FormData();
      formData.append('file', file.file as File);
      const config: AxiosRequestConfig<FormData> = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setFiles(files.map((f) => {
            if (f.id === file.id) {
              return {
                ...f,
                uploadStatus: "uploading" as UploadStatus,
                uploadProgress: percentCompleted,
              };
            }
            return f;
          }));
        },
      };
      try {
        const response = await axios.put(presignedUrl, formData, { headers: {
          'Content-Type': file.type,
        },});
        setFiles(files.map((f) => {
          if (f.id === file.id) {
            return {
              ...f,
              uploadStatus: "success" as UploadStatus,
              serverResponse: response.data,
            };
          }
          return f;
        }));
      } catch (error) {
        setFiles(files.map((f) => {
          if (f.id === file.id) {
            return {
              ...f,
              uploadStatus: "error" as UploadStatus,
              errors: error.message,
            };
          }
          return f;
        }));
      }
    }
  };

  // Add the CORS middleware
  const corsMiddleware = cors({
    origin: process.env.NEXT_PUBLIC_APP_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  return (
    <>
      <FilesUIDropzone
        onChange={updateFiles}
        value={files}
        accept={"image/*"}
        maxFileSize={28 * 1024*1024}
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
          <button onClick={()=> uploadFile(files[0])}>Upload</button>
          <Notification title="Upload successful" color="green">
            Your image has been uploaded successfully. Click the button below to continue.
          </Notification>
        </>
      )}
    </>
  );
}