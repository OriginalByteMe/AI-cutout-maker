import CutoutPreviews from '@/components/CutoutPreviews';
import useCutoutGenerator from '@/hooks/useCutoutGenerator';
import usePresignedUrl from '@/hooks/usePresignedUrl';
import { ExtFile } from '@files-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function CutoutPage() {
  const router = useRouter()
  const image_name = router.query.image_name as string | undefined;
  const classes = router.query.class as string[] || [];
  const [error, setError] = useState<string | null>(null);
  const presignedUrl = usePresignedUrl(image_name, setError);
  let Cutouts = useCutoutGenerator(image_name, classes, setError) as ExtFile[];
  
  let OriginalImage: ExtFile;
  

  if (image_name === "test") {
    const placeholderImage = "/placeholder.png";
    const numberOfCutouts = 5; // Set this to the desired number of cutouts

    OriginalImage = { name: 'original', imageUrl: placeholderImage };
    Cutouts = Array.from({length: numberOfCutouts}, (_, i) => ({name: `cutout${i}`, imageUrl: placeholderImage}));
  } else {
    OriginalImage = presignedUrl ? { name: image_name || '', imageUrl: presignedUrl } as ExtFile : { name: '', imageUrl: ''} as ExtFile;
  }

  if (error) {
    return <div>Image not found</div>;
  }

  return (
    <>
        {OriginalImage && Cutouts ? <CutoutPreviews singleFile={OriginalImage} multipleFiles={Cutouts} /> : <div>Loading...</div>}
    </>
  );
}
