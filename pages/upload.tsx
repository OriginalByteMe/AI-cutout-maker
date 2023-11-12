'use client';
import { useState } from 'react';
import { Notification } from '@mantine/core';

import Dropzone from '@/components/Dropzone';
import Layout from '@/app/layout';
export default function UploadPage() {

  return (
    <Layout>
      <div>
        <Dropzone />
      </div>
    </Layout>
  );
}