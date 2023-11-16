import { useState } from 'react';
import { useRouter } from 'next/router'
import usePresignedUrl from '@/hooks/usePresignedUrl';
import CutoutPreviews from '@/components/CutoutPreviews';
import useCutoutGenerator from '@/hooks/useCutoutGenerator';

export default function CutoutPage() {
  const router = useRouter()
  const image_name = router.query.image_name as string | undefined;
  const [error, setError] = useState<string | null>(null);
  
  const OriginalImage = usePresignedUrl(image_name, setError);
  const Cutouts = useCutoutGenerator(image_name, ["human", "cup"],setError);

  if (error) {
    return <div>Image not found</div>;
  }

  return (
    <div>
      {OriginalImage && Cutouts ? <CutoutPreviews singleFile={OriginalImage} multipleFiles={Cutouts} /> : <div>Loading...</div>}
    </div>
  );
}