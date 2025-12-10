import { CssLoader } from '@/components/Loader';
import { ExtFile, FileMosaic, FullScreen, ImagePreview } from '@files-ui/react';
import { Carousel } from '@mantine/carousel';
import { useMediaQuery } from '@mantine/hooks';
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ImageGrid from './cutout-grid';

interface FileMosaicComponentProps {
  singleFile: ExtFile;
  multipleFiles: ExtFile[];
}

const FileMosaicComponent: React.FC<FileMosaicComponentProps> = ({ singleFile, multipleFiles }) => {
  const chunks = [];
  if (multipleFiles) {
    for (let i = 0; i < multipleFiles.length; i += 4) {
      chunks.push(multipleFiles.slice(i, i + 4));
    }
  }

  const isMobile = useMediaQuery('(max-width: 768px)');

  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const handleSee = (imageSource: string | undefined) => {
    setImgSrc(imageSource);
  };

  const hasImages =
    chunks.length > 0 && chunks.every((chunk) => chunk.every((file) => file.imageUrl));

  return (
    <div
      className={`flex ${isMobile ? 'flex-col gap-6' : 'flex-row items-start gap-6'} justify-center`}
    >
      {singleFile ? (
        <div className={`${isMobile ? 'mb-5' : 'mr-5'}`}>
          <FileMosaic
            key={singleFile.id}
            {...singleFile}
            info
            preview
            uploadStatus={singleFile.uploadStatus}
            // onSee={() => handleSee(singleFile.imageUrl)}
          />
        </div>
      ) : (
        <CssLoader />
      )}
      {isMobile ? null : <ArrowRight className="text-slate-400" size={18} strokeWidth={1.8} />}
      {multipleFiles && multipleFiles.length > 0 ? (
        hasImages ? (
          // <div className="w-full h-screen py-20">
          // <LayoutGrid cards={cards} />
          <ImageGrid files={multipleFiles} />
        ) : (
          // </div> // Use LayoutGrid instead of Carousel
          <FileMosaic
            key="placeholder"
            imageUrl="/placeholder.png"
            info
            preview
            className="mb-5"
            onSee={() => handleSee('/placeholder.png')}
          />
        )
      ) : (
        <CssLoader />
      )}
    </div>
  );
};

export default FileMosaicComponent;
