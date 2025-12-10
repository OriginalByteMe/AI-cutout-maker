import { ActionIcon, Modal } from '@mantine/core';
import { Download } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

interface CutoutProps {
  imageLink: string;
  height?: number;
  width?: number;
}

const Cutout: React.FC<CutoutProps> = ({ imageLink, height = 100, width = 100 }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleImageClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageLink;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative cursor-pointer group">
      <Image
        src={imageLink}
        alt="Cutout"
        onClick={handleImageClick}
        height={height}
        width={width}
        objectFit="cover"
        loading="lazy"
      />
      <ActionIcon
        variant="filled"
        color="dark"
        radius="xl"
        size="lg"
        className="absolute bottom-3 left-1/2 -translate-x-1/2 transform opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        onClick={handleDownload}
        aria-label="Download cutout"
      >
        <Download size={18} strokeWidth={1.8} />
      </ActionIcon>
      <Modal opened={isOpen} onClose={handleClose} size="xl">
        <Image
          src={imageLink}
          alt="Cutout"
          height={height}
          width={width}
          objectFit="cover"
          loading="lazy"
        />
      </Modal>
    </div>
  );
};

export default Cutout;
