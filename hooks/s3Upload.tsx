import { useState } from 'react';
import AWS from 'aws-sdk';

interface S3File {
  key: string;
  url: string;
}

export const useS3 = () => {
  const [files, setFiles] = useState<S3File[]>([]);
  const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
  });

  const getPresignedUrl = async (key: string, operation: 'putObject' | 'getObject'): Promise<string> => {
    const params = {
      Bucket: process.env.REACT_APP_S3_BUCKET_NAME as string,
      Key: key,
      Expires: 60 * 5, // URL expires in 5 minutes
    };
    const url = await s3.getSignedUrlPromise(operation, params);
    return url;
  };

  return { files, getPresignedUrl };
};