import { CssLoader } from '@/components/Loader';
import { ExtFile, FileMosaic, FullScreen, ImagePreview } from "@files-ui/react";
import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
// import { Carousel } from 'react-responsive-carousel';
import { Carousel } from '@mantine/carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

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

  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const handleSee = (imageSource: string | undefined) => {
    setImgSrc(imageSource);
  };

  const hasImages = chunks.length > 0 && chunks.every(chunk => chunk.every(file => file.imageUrl));

  return (
    <>
      <div className="flex items-center justify-center space-x-4">
        {singleFile ? (
          <FileMosaic
            key={singleFile.id}
            {...singleFile}
            info
            preview
            uploadStatus={singleFile.uploadStatus}
            className="mr-5"
            onSee={() => handleSee(singleFile.imageUrl)}
          />
        ) : (
          <CssLoader />
        )}
        <FaArrowRight className="text-xl" />
        <>
        {multipleFiles && multipleFiles.length > 0 ? (
          hasImages ? (
            <Carousel
              withIndicators
              height={200}
              slideSize={{ base: '100%', sm: '50%', md: '33.333333%' }}
              slideGap={{ base: 0, sm: 'md' }}
            
              align="start"
            >
              {multipleFiles.map((file, fileIndex) => (
                <Carousel.Slide key={fileIndex}>
                  <div className="flex items-center justify-center">
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
                  </div>
                </Carousel.Slide>
              ))}
            </Carousel>
            ) : (
              <FileMosaic
                key="placeholder"
                imageUrl="/placeholder.png"
                info
                preview
                className="mb-5"
                onSee={() => handleSee("/placeholder.png")}
              />
            )
          ) : (
            <CssLoader />
          )}
        </>
      </div>
      <FullScreen
        open={imgSrc !== undefined}
        onClose={() => setImgSrc(undefined)}
      >
        <ImagePreview src={imgSrc} />
      </FullScreen>
    </>
  );
};

export default FileMosaicComponent;
