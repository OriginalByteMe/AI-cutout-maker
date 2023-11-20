import ClassDisplay from '@/components/ClassDisplay';
import CutoutPreviews from '@/components/CutoutPreviews';
import { CssLoader } from '@/components/Loader';
import useCutoutGenerator from '@/hooks/useCutoutGenerator';
import usePresignedUrl from '@/hooks/usePresignedUrl';
import { ExtFile } from '@files-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function CutoutPage() {
  const router = useRouter();
  const image_name = router.query.image_name as string | undefined;
  const classes = (router.query.class as string[]) || [];
  const [error, setError] = useState<string | null>(null);
  const uploadedUrl = usePresignedUrl(image_name, setError);
  let cutoutUrls = useCutoutGenerator(image_name, classes, setError) as ExtFile[];
  console.log('🚀 ~ file: [image_name].tsx:16 ~ CutoutPage ~ Cutouts:', cutoutUrls);

  let OriginalImage: ExtFile;
  let Cutouts: ExtFile[];

  if (image_name === 'test') {
    const placeholderImage = '/placeholder.png';
    const numberOfCutouts = 5; // Set this to the desired number of cutouts

    OriginalImage = { name: 'original', imageUrl: placeholderImage };
    Cutouts = Array.from({ length: numberOfCutouts }, (_, i) => ({
      name: `cutout${i}`,
      imageUrl: placeholderImage,
    }));
  } else {
    OriginalImage = uploadedUrl ? uploadedUrl : ({ name: '', imageUrl: '' } as ExtFile);
    Cutouts = cutoutUrls ? cutoutUrls : ([{}] as ExtFile[]);
  }

  if (error) {
    return <div>Image not found</div>;
  }

  return (
    <div className="flex items-center justify-center gap-2">
      {OriginalImage && Cutouts ? (
        <CutoutPreviews singleFile={OriginalImage} multipleFiles={Cutouts} />
      ) : (
        <CssLoader />
      )}
      {classes && <ClassDisplay classes={classes} />}
    </div>
  );
}
