import { useState } from 'react';
import { Notification } from '@mantine/core';

import Dropzone from '@/components/Dropzone';

export default function UploadPage() {

  return (
    <div>
      <Dropzone />
    </div>
  );
}