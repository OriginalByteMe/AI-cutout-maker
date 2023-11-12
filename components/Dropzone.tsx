import { useState } from 'react';
import { Dropzone as FilesUIDropzone, FileMosaic, ExtFile } from "@files-ui/react";
import { Notification } from '@mantine/core';
export default function Dropzone() {
  const [files, setFiles] = useState<ExtFile[]>([]);

  const updateFiles = (acceptedFiles: ExtFile[]) => {
    setFiles(acceptedFiles);
  };

  const removeFile = (fileId: string | number | undefined) => {
    if (typeof fileId === "number") {
      setFiles(files.filter((x) => x.id !== fileId));
    }
  };

  return (
    <>
      <FilesUIDropzone
        onChange={updateFiles}
        value={files}
        accept={"image/*"}
        maxFileSize={28 * 1024*1024}
        maxFiles={1}
        actionButtons={{ position: "after", uploadButton: {}, abortButton: {} }}
        uploadConfig={{
          url: "https://www.myawsomeserver.com/upload",
          method: "POST",
          headers: {
            Authorization:
              "bearer HTIBI/IBYG/&GU&/GV%&G/&IC%&V/Ibi76bfh8g67gg68g67i6g7G&58768&/(&/(FR&G/&H%&/",
          },
          cleanOnUpload: true,
        }}
        fakeUpload
      >
        {files.map((file: ExtFile) => (
          <FileMosaic key={file.id} {...file} onDelete={removeFile} info preview />
        ))}
      </FilesUIDropzone>
      {/* {files.length > 0 && (
        <Notification title="Upload successful" color="green">
          Your image has been uploaded successfully. Click the button below to continue.
        </Notification>
      )} */}
    </>
  );}

