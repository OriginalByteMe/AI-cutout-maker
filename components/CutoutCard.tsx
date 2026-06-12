'use client';

import { useState } from 'react';
import { Badge, Button, Card, Group, Tooltip } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconDownload, IconSticker } from '@tabler/icons-react';
import type { Cutout } from '@/lib/api';
import { downloadFile, filenameFromKey } from '@/lib/download';

export function CutoutCard({ cutout }: { cutout: Cutout }) {
  const [busy, setBusy] = useState<'png' | 'sticker' | null>(null);

  const save = async (kind: 'png' | 'sticker') => {
    const url = kind === 'png' ? cutout.url : cutout.sticker_url;
    const key = kind === 'png' ? cutout.key : cutout.sticker_key;
    if (!url || !key) return;
    setBusy(kind);
    try {
      await downloadFile(url, filenameFromKey(key));
    } catch {
      notifications.show({
        color: 'red',
        title: 'Download failed',
        message: 'Could not fetch the file — the link may have expired.',
      });
    } finally {
      setBusy(null);
    }
  };

  return (
    <Card withBorder padding="sm">
      <Card.Section className="checkerboard" p="xs">
        {/* eslint-disable-next-line @next/next/no-img-element -- presigned URL, no optimizer */}
        <img src={cutout.url} alt={cutout.prompt} className="cutout-preview" />
      </Card.Section>
      <Group justify="space-between" mt="sm" gap="xs">
        <Tooltip label={`Confidence ${(cutout.score * 100).toFixed(0)}%`}>
          <Badge variant="light">{cutout.prompt}</Badge>
        </Tooltip>
        <Group gap="xs">
          <Button
            size="compact-sm"
            variant="light"
            leftSection={<IconDownload size={14} />}
            loading={busy === 'png'}
            onClick={() => save('png')}
          >
            PNG
          </Button>
          {cutout.sticker_url && (
            <Button
              size="compact-sm"
              variant="light"
              color="teal"
              leftSection={<IconSticker size={14} />}
              loading={busy === 'sticker'}
              onClick={() => save('sticker')}
            >
              Sticker
            </Button>
          )}
        </Group>
      </Group>
    </Card>
  );
}
