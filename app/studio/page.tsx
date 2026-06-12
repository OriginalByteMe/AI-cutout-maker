'use client';

import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CloseButton,
  Container,
  Group,
  Slider,
  Stack,
  Switch,
  TagsInput,
  Text,
  Title,
} from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { IconPhoto, IconScissors, IconUpload, IconX } from '@tabler/icons-react';
import { api, type ImageResult, type UploadedFile } from '@/lib/api';
import { ResultsGallery } from '@/components/ResultsGallery';

export default function StudioPage() {
  const [uploaded, setUploaded] = useState<UploadedFile[]>([]);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [createStickers, setCreateStickers] = useState(true);
  const [threshold, setThreshold] = useState(0.5);
  const [results, setResults] = useState<ImageResult[]>([]);

  // Pre-boot a GPU container while the user is still picking files.
  useEffect(() => {
    api.warmup();
  }, []);

  const upload = useMutation({
    mutationFn: (files: File[]) => api.uploadImages(files),
    onSuccess: (files) => setUploaded((current) => [...current, ...files]),
    onError: (error) =>
      notifications.show({ color: 'red', title: 'Upload failed', message: error.message }),
  });

  const generate = useMutation({
    mutationFn: () =>
      api.createCutouts({
        imageNames: uploaded.map((file) => file.name),
        prompts,
        createStickers,
        scoreThreshold: threshold,
      }),
    onSuccess: setResults,
    onError: (error) =>
      notifications.show({
        color: 'red',
        title: 'Cutout generation failed',
        message: error.message,
      }),
  });

  const removeImage = (name: string) =>
    setUploaded((current) => current.filter((file) => file.name !== name));

  const ready = uploaded.length > 0 && prompts.length > 0;

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={2}>Image Studio</Title>
          <Text c="dimmed">
            Upload images in bulk, describe the subjects to cut out, and download transparent PNGs
            or WhatsApp-ready stickers.
          </Text>
        </div>

        <Dropzone
          onDrop={(files) => upload.mutate(files)}
          accept={IMAGE_MIME_TYPE}
          maxSize={20 * 1024 * 1024}
          loading={upload.isPending}
          multiple
        >
          <Group justify="center" gap="md" mih={120} style={{ pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <IconUpload size={40} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={40} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto size={40} />
            </Dropzone.Idle>
            <Stack gap={4}>
              <Text size="lg">Drag images here or click to browse</Text>
              <Text size="sm" c="dimmed">
                JPEG, PNG or WebP, up to 20 MB each — drop as many as you like
              </Text>
            </Stack>
          </Group>
        </Dropzone>

        {uploaded.length > 0 && (
          <Group gap="sm">
            {uploaded.map((file) => (
              <Card key={file.name} withBorder padding={4} radius="md">
                <Group gap={6} wrap="nowrap">
                  {/* eslint-disable-next-line @next/next/no-img-element -- presigned URL */}
                  <img
                    src={file.url}
                    alt={file.name}
                    width={56}
                    height={56}
                    style={{ objectFit: 'cover', borderRadius: 6 }}
                  />
                  <Stack gap={0}>
                    <Text size="xs" maw={140} truncate="end">
                      {file.name.split('_').slice(1).join('_') || file.name}
                    </Text>
                    <Badge size="xs" variant="light">
                      {(file.size / 1024).toFixed(0)} KB
                    </Badge>
                  </Stack>
                  <CloseButton size="sm" onClick={() => removeImage(file.name)} />
                </Group>
              </Card>
            ))}
          </Group>
        )}

        <Stack gap="sm">
          <TagsInput
            label="What should be cut out?"
            description="Press Enter after each subject — e.g. “dog”, “person in a red hat”"
            placeholder={prompts.length ? undefined : 'dog, person, coffee cup…'}
            value={prompts}
            onChange={setPrompts}
            clearable
          />
          <Group gap="xl">
            <Switch
              label="Also create WhatsApp stickers"
              checked={createStickers}
              onChange={(event) => setCreateStickers(event.currentTarget.checked)}
            />
            <Stack gap={2} style={{ flexGrow: 1, maxWidth: 320 }}>
              <Text size="sm">Confidence threshold: {(threshold * 100).toFixed(0)}%</Text>
              <Slider
                min={0.1}
                max={0.9}
                step={0.05}
                value={threshold}
                onChange={setThreshold}
                label={(value) => `${(value * 100).toFixed(0)}%`}
              />
            </Stack>
          </Group>
        </Stack>

        <Button
          size="lg"
          leftSection={<IconScissors size={20} />}
          disabled={!ready}
          loading={generate.isPending}
          onClick={() => generate.mutate()}
        >
          {generate.isPending
            ? 'Cutting things out…'
            : ready
              ? `Cut ${prompts.length} subject${prompts.length === 1 ? '' : 's'} out of ${uploaded.length} image${uploaded.length === 1 ? '' : 's'}`
              : 'Add images and at least one subject'}
        </Button>

        <ResultsGallery results={results} />
      </Stack>
    </Container>
  );
}
