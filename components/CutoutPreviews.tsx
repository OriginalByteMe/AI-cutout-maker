import { ExtFile, FileMosaic, FullScreen, ImagePreview } from "@files-ui/react";
import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface FileMosaicComponentProps {
  singleFile: ExtFile;
  multipleFiles: ExtFile[];
}

const FileMosaicComponent: React.FC<FileMosaicComponentProps> = ({ singleFile, multipleFiles }) => {
  const chunks = [];
  for (let i = 0; i < multipleFiles.length; i += 4) {
    chunks.push(multipleFiles.slice(i, i + 4));
  }

  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const handleSee = (imageSource: string | undefined) => {
    setImgSrc(imageSource);
  };

  return (
    <>
      <div className="flex items-center justify-center space-x-4">
        <FileMosaic
          key={singleFile.id}
          {...singleFile}
          info
          preview
          uploadStatus={singleFile.uploadStatus}
          className="mr-5"
          onSee={() => handleSee(singleFile.imageUrl)}
        />
        <FaArrowRight className="text-xl" />
        <div>
          {chunks.length > 0 ? (
            <Carousel showArrows={true} className="px-2">
              {chunks.map((chunk, index) => (
                <div key={index} className="grid grid-cols-2 grid-rows-2 gap-0.5">
                  {chunk.map(file => (
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
                  ))}
                </div>
              ))}
            </Carousel>
          ) : (
            <img src="/placeholder.png" alt="Placeholder" />
          )}
        </div>
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
