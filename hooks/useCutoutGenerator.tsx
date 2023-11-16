import { ExtFile } from "@files-ui/react";
import axios from 'axios';
import { useEffect, useState } from 'react';

const useCutoutGenerator = (imageName: string | undefined, classList: string[], setError: (error: string) => void) => {
  const [files, setFiles] = useState<ExtFile[]>([]);

  useEffect(() => {
    if (!imageName || imageName === 'test') {
      return;
    }

    const fetchCutouts = async () => {
      try {
        const response = await axios.post(process.env.NEXT_PUBLIC_CUTOUT_API + `/create-cutouts/${imageName}`, { classes: classList });
        const files = response.data.map((file: any, index: number) => ({
          id: `file-${index}`,
          size: file[1].size || 0,
          type: file[1].type || 'unknown',
          name: file[1].name || `file-${index}`,
          imageUrl: file[0],
        }));
        setFiles(files);
      } catch (error) {
        setError('Error fetching cutouts');
        console.error('Error fetching cutouts:', error);
      }
    };

    fetchCutouts();
  }, [imageName, classList]);

  return files;
};

export default useCutoutGenerator;
