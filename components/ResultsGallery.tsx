'use client';

import { useState } from 'react';
import { Alert, Button, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconFileZip } from '@tabler/icons-react';
import type { ImageResult } from '@/lib/api';
import { downloadAsZip, filenameFromKey, type ZipEntry } from '@/lib/download';
import { CutoutCard } from './CutoutCard';

export function ResultsGallery({ results }: { results: ImageResult[] }) {
  const [zipping, setZipping] = useState<'png' | 'sticker' | null>(null);

  const allCutouts = results.flatMap((result) => result.cutouts);
  const totalCutouts = allCutouts.length;

  const zipAll = async (kind: 'png' | 'sticker') => {
    const entries: ZipEntry[] = allCutouts
      .map((cutout) => {
        const url = kind === 'png' ? cutout.url : cutout.sticker_url;
        const key = kind === 'png' ? cutout.key : cutout.sticker_key;
        return url && key ? { url, filename: filenameFromKey(key) } : null;
      })
      .filter((entry): entry is ZipEntry => entry !== null);
    if (!entries.length) return;
    setZipping(kind);
    try {
      await downloadAsZip(entries, kind === 'png' ? 'cutouts.zip' : 'stickers.zip');
    } catch {
      notifications.show({
        color: 'red',
        title: 'Zip failed',
        message: 'Could not fetch all files. Check the S3 bucket CORS configuration.',
      });
    } finally {
      setZipping(null);
    }
  };

  if (!results.length) return null;

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={3}>
          {totalCutouts} cutout{totalCutouts === 1 ? '' : 's'}
        </Title>
        {totalCutouts > 0 && (
          <Group gap="xs">
            <Button
              variant="default"
              leftSection={<IconFileZip size={16} />}
              loading={zipping === 'png'}
              onClick={() => zipAll('png')}
            >
              All PNGs (.zip)
            </Button>
            <Button
              variant="default"
              leftSection={<IconFileZip size={16} />}
              loading={zipping === 'sticker'}
              onClick={() => zipAll('sticker')}
            >
              All stickers (.zip)
            </Button>
          </Group>
        )}
      </Group>

      {results.map((result) => (
        <Stack key={result.image_name} gap="sm">
          <Text fw={600} c="dimmed" size="sm">
            {result.image_name}
          </Text>
          {result.error ? (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
              {result.error}
            </Alert>
          ) : result.cutouts.length === 0 ? (
            <Alert color="yellow" variant="light">
              Nothing matched your prompt in this image. Try a different description or a lower
              confidence threshold.
            </Alert>
          ) : (
            <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="sm">
              {result.cutouts.map((cutout) => (
                <CutoutCard key={cutout.key} cutout={cutout} />
              ))}
            </SimpleGrid>
          )}
        </Stack>
      ))}
    </Stack>
  );
}
