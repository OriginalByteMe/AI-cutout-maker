import { Modal } from '@mantine/core';
import Image from 'next/image';
import React, { useState } from 'react';
import { FaDownload } from 'react-icons/fa';

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
      <div className="absolute bottom-0 transform -translate-x-1/2 opacity-0 left-1/2 group-hover:opacity-100">
        <FaDownload onClick={handleDownload} className="text-xl" />
      </div>
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
