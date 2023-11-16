import { ExtFile, FileMosaic, Dropzone as FilesUIDropzone, Method } from "@files-ui/react";
import { Button, Notification } from '@mantine/core';
import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import Link from "next/link";
import { useState } from 'react';

type UploadStatus = "preparing" | "aborted" | "uploading" | "success" | "error";

export default function Dropzone() {
  const [files, setFiles] = useState<ExtFile[]>([]);
  const uploadUrl = process.env.NEXT_PUBLIC_S3_API + "/upload-image";
  const [dropOccurred, setDropOccurred] = useState<boolean>(false);
  const [uploadSuccessful, setUploadSuccessful] = useState(false);

  const updateFiles = (acceptedFiles: ExtFile[]) => {
    setFiles(acceptedFiles.map((file) => ({
      ...file,
      uploadStatus: "preparing" as UploadStatus,
    })));
    setDropOccurred(true);
  };

  const removeFile = (fileId: string | number | undefined) => {
    if (typeof fileId === "number") {
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
      const response = await axios.post(uploadUrl as string, formData, config);
      setFiles(files.map((f) => {
        if (f.id === file.id) {
          setUploadSuccessful(true);
          return {
            ...f,
            uploadStatus: "success" as UploadStatus,
            serverResponse: response.data,
          };
        }
        return f;
      }));
    } catch (error) {
      setUploadSuccessful(false);
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
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-lg">
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
              <div className="flex items-center justify-center mt-4">
                {!uploadSuccessful ? (
                  <Button onClick={() => uploadFile(files[0])}>Upload</Button>
                ) : (
                  <Link href={`/cutouts/${files[0].name}`}>
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
      </div>
    </>
  );
}