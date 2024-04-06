import { cn } from '@/utils/cn';
import { ExtFile, FileMosaic, FullScreen } from '@files-ui/react';
import React, { useEffect, useState } from 'react';

type ImageGridProps = {
  files: ExtFile[];
};

const ImageGrid: React.FC<ImageGridProps> = ({ files }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);

  const handleSee = (imageSource: string | undefined) => {
    setImgSrc(imageSource);
  };

  return (
    <div className="grid w-full h-full grid-cols-3 gap-4">
      {files.map((file) => (
        // !! Fullscreen won't work due to mantine styling
        // <FullScreen
        //   open={imgSrc !== undefined}
        //   onClose={() => setImgSrc(undefined)}
        //   key={'fullscreen-' + file.id}
        // >
          <FileMosaic
            key={file.id}
            {...file}
            info
            preview
            uploadStatus={file.uploadStatus}
            downloadUrl={file.imageUrl}
            className="mb-5"
            onSee={() => handleSee(file.imageUrl)}
          />
        // </FullScreen>
      ))}
    </div>
  );
};

export default ImageGrid;
