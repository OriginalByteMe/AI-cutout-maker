'use client';

import { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Container,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  IconAlertCircle,
  IconDownload,
  IconMovie,
  IconUpload,
  IconWand,
  IconX,
} from '@tabler/icons-react';
import { api, videoCutoutResultSchema, type UploadedFile, type VideoCutoutResult } from '@/lib/api';
import { downloadFile, filenameFromKey } from '@/lib/download';

const VIDEO_MIME_TYPES = [MIME_TYPES.mp4, 'video/quicktime', 'video/webm'];

export default function VideoPage() {
  const [video, setVideo] = useState<UploadedFile | null>(null);
  const [prompt, setPrompt] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);

  const upload = useMutation({
    mutationFn: (file: File) => api.uploadVideo(file),
    onSuccess: (file) => {
      setVideo(file);
      setJobId(null);
      api.warmup();
    },
    onError: (error) =>
      notifications.show({ color: 'red', title: 'Upload failed', message: error.message }),
  });

  const start = useMutation({
    mutationFn: () => api.startVideoCutout(video!.name, prompt),
    onSuccess: setJobId,
    onError: (error) =>
      notifications.show({ color: 'red', title: 'Could not start job', message: error.message }),
  });

  const job = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => api.getJob(jobId!),
    enabled: jobId !== null,
    refetchInterval: (query) =>
      query.state.data && query.state.data.status !== 'running' ? false : 3000,
  });

  let result: VideoCutoutResult | null = null;
  if (job.data?.status === 'done') {
    const parsed = videoCutoutResultSchema.safeParse(job.data.result);
    result = parsed.success ? parsed.data : null;
  }
  const running = jobId !== null && (job.isPending || job.data?.status === 'running');

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={2}>Video Studio</Title>
          <Text c="dimmed">
            Upload a clip and describe a subject — it gets tracked through every frame and rendered
            as a transparent-background WebM. Clips up to ~40 seconds work best.
          </Text>
        </div>

        <Dropzone
          onDrop={(files) => upload.mutate(files[0])}
          accept={VIDEO_MIME_TYPES}
          maxSize={100 * 1024 * 1024}
          loading={upload.isPending}
          multiple={false}
        >
          <Group justify="center" gap="md" mih={100} style={{ pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <IconUpload size={36} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={36} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconMovie size={36} />
            </Dropzone.Idle>
            <Stack gap={4}>
              <Text size="lg">Drop a video or click to browse</Text>
              <Text size="sm" c="dimmed">
                MP4, MOV or WebM, up to 100 MB
              </Text>
            </Stack>
          </Group>
        </Dropzone>

        {video && (
          <Group gap="xs">
            <Badge variant="light" size="lg">
              {video.name.split('_').slice(1).join('_') || video.name}
            </Badge>
            <Text size="sm" c="dimmed">
              {(video.size / 1024 / 1024).toFixed(1)} MB
            </Text>
          </Group>
        )}

        <Group align="end" gap="sm">
          <TextInput
            label="Subject to cut out"
            placeholder="e.g. the skateboarder"
            value={prompt}
            onChange={(event) => setPrompt(event.currentTarget.value)}
            style={{ flexGrow: 1 }}
          />
          <Button
            leftSection={<IconWand size={18} />}
            disabled={!video || !prompt.trim() || running}
            loading={start.isPending}
            onClick={() => start.mutate()}
          >
            Cut it out
          </Button>
        </Group>

        {running && (
          <Group gap="sm">
            <Loader size="sm" />
            <Text c="dimmed">
              Tracking “{prompt}” through your video… this can take a few minutes for longer clips.
            </Text>
          </Group>
        )}

        {job.data?.status === 'failed' && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
            {job.data.error ?? 'The video job failed.'}
          </Alert>
        )}

        {result && (
          <Stack gap="sm">
            <Title order={4}>Result</Title>
            <div className="checkerboard">
              <video
                className="video-preview"
                src={result.url}
                controls
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
            <Group>
              <Button
                variant="light"
                leftSection={<IconDownload size={16} />}
                onClick={() =>
                  downloadFile(result!.url, filenameFromKey(result!.key)).catch(() =>
                    notifications.show({
                      color: 'red',
                      title: 'Download failed',
                      message: 'The link may have expired — re-run the job.',
                    })
                  )
                }
              >
                Download transparent WebM
              </Button>
              <Text size="sm" c="dimmed">
                {result.frame_count} frames @ {result.fps.toFixed(0)} fps
              </Text>
            </Group>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
