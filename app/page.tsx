'use client';

import Link from 'next/link';
import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconMovie, IconPhotoScan, IconSticker, IconWand } from '@tabler/icons-react';

const features = [
  {
    icon: IconWand,
    title: 'Describe it, cut it out',
    description:
      'Type what you want — "dog", "person in a red hat" — and SAM 3 finds and cuts out every matching subject.',
  },
  {
    icon: IconPhotoScan,
    title: 'Bulk processing',
    description:
      'Drop dozens of images at once. Cutouts are generated in parallel on autoscaling GPUs.',
  },
  {
    icon: IconSticker,
    title: 'Sticker-ready exports',
    description:
      'Every cutout ships as a transparent PNG plus a WhatsApp-compatible 512x512 WebP sticker. Grab them one by one or as a zip.',
  },
  {
    icon: IconMovie,
    title: 'Video cutouts',
    description:
      'Upload a clip, describe a subject, and get it back tracked through every frame as a transparent WebM.',
  },
];

export default function HomePage() {
  return (
    <Container size="lg" py={64}>
      <Stack align="center" gap="lg">
        <Badge variant="light" size="lg">
          Powered by Segment Anything 3
        </Badge>
        <Title order={1} ta="center" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>
          Cut anything out of{' '}
          <Text span inherit variant="gradient" gradient={{ from: 'violet', to: 'cyan' }}>
            anything
          </Text>
        </Title>
        <Text c="dimmed" ta="center" maw={600} size="lg">
          Upload images or videos, describe the subjects you want, and download transparent cutouts,
          stickers and alpha videos in seconds.
        </Text>
        <Group>
          <Button component={Link} href="/studio" size="lg">
            Open Image Studio
          </Button>
          <Button component={Link} href="/video" size="lg" variant="light">
            Try Video Cutouts
          </Button>
        </Group>
      </Stack>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" mt={64}>
        {features.map((feature) => (
          <Card key={feature.title} withBorder padding="lg">
            <Group gap="sm" mb="xs">
              <feature.icon size={22} />
              <Text fw={600}>{feature.title}</Text>
            </Group>
            <Text c="dimmed" size="sm">
              {feature.description}
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}
