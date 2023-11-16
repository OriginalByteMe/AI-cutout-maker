import { ExtFile } from "@files-ui/react";
import axios from 'axios';
import { useEffect, useState } from 'react';

/**
 * Custom hook that fetches a presigned URL for an image and returns an ExtFile object with the image data.
 * @param imageName - The name of the image to fetch.
 * @param setError - A function to set an error message if the fetch fails.
 * @returns An ExtFile object with the image data.
 */
const usePresignedUrl = (imageName: string | undefined, setError: (error: string) => void) => {
  const [file, setFile] = useState<ExtFile | null>(null);

  useEffect(() => {
    if (!imageName) {
      return;
    }

    const fetchPresignedUrl = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_S3_API + `/get-image/${imageName}`);
        console.log(response)
        setFile({
          id: response.data.id,
          size: response.data[1].size,
          type: response.data[1].type,
          name: imageName,
          imageUrl: response.data[0],
        });
      } catch (error) {
        setError('Error fetching presigned URL');
        console.error('Error fetching presigned URL:', error);
      }
    };

    fetchPresignedUrl();
  }, [imageName, setError]);

  return file;
};

export default usePresignedUrl;