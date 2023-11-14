import S3  from 'aws-sdk/clients/s3';


export const useS3 = () => {
  const s3 = new S3({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    region: process.env.NEXT_PUBLIC_AWS_REGION,
  });

  const getPresignedUrl = async (key: string, operation: 'putObject' | 'getObject'): Promise<string> => {
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_STORAGE_BUCKET_NAME as string,
      Key: key,
      Expires: 60 * 5, // URL expires in 5 minutes
    };
    console.log(params.Bucket)
    const url = await s3.getSignedUrlPromise(operation, params);
    return url;
  };

  return { getPresignedUrl };
};