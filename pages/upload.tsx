'use client';
import Dropzone from '@/components/Dropzone';
import useWarmup from '@/hooks/useWarmup';
import { Notification } from '@mantine/core';
import { useState } from 'react';

export default function UploadPage() {
  useWarmup();
  return (
    <>
      <Dropzone />
    </>
  );
}
