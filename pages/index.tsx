import { Welcome } from '@/components/Welcome/Welcome';
import useWarmup from '@/hooks/useWarmup';

export default function HomePage() {
  useWarmup();
  return (
    <>
      <Welcome />
    </>
  );
}
