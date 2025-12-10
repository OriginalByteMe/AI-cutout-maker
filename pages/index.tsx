import { HomeUploader } from '@/components/HomeUploader';
import useWarmup from '@/hooks/useWarmup';

export default function HomePage() {
  useWarmup();

  return (
    <div className="flex w-full flex-col items-center gap-8 px-4 py-12 sm:px-6 md:px-8">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          AI Cutout Generator
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Upload an image and get a clean cutout
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-300">
          Drag a photo, add the subjects you want isolated, and we&apos;ll prep it for download right away.
        </p>
      </div>
      <HomeUploader />
    </div>
  );
}
