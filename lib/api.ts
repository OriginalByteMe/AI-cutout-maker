import { z } from 'zod';

export const uploadedFileSchema = z.object({
  name: z.string(),
  url: z.string(),
  size: z.number(),
  content_type: z.string().nullish(),
});

const uploadResponseSchema = z.object({
  files: z.array(uploadedFileSchema),
});

export const cutoutSchema = z.object({
  key: z.string(),
  url: z.string(),
  prompt: z.string(),
  score: z.number(),
  width: z.number(),
  height: z.number(),
  sticker_key: z.string().nullish(),
  sticker_url: z.string().nullish(),
});

export const imageResultSchema = z.object({
  image_name: z.string(),
  cutouts: z.array(cutoutSchema),
  error: z.string().nullish(),
});

const cutoutResponseSchema = z.object({
  results: z.array(imageResultSchema),
});

const jobStartedSchema = z.object({ job_id: z.string() });

const jobStatusSchema = z.object({
  job_id: z.string(),
  status: z.enum(['running', 'done', 'failed']),
  result: z.unknown().nullish(),
  error: z.string().nullish(),
});

export const videoCutoutResultSchema = z.object({
  video_name: z.string(),
  prompt: z.string(),
  key: z.string(),
  url: z.string(),
  frame_count: z.number(),
  fps: z.number(),
});

export type UploadedFile = z.infer<typeof uploadedFileSchema>;
export type Cutout = z.infer<typeof cutoutSchema>;
export type ImageResult = z.infer<typeof imageResultSchema>;
export type CutoutResponse = z.infer<typeof cutoutResponseSchema>;
export type JobStatus = z.infer<typeof jobStatusSchema>;
export type VideoCutoutResult = z.infer<typeof videoCutoutResultSchema>;

export interface CreateCutoutsParams {
  imageNames: string[];
  prompts: string[];
  createStickers?: boolean;
  scoreThreshold?: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function baseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new ApiError('NEXT_PUBLIC_API_URL is not configured');
  }
  return url.replace(/\/$/, '');
}

async function request<T>(path: string, schema: z.ZodType<T>, init?: RequestInit): Promise<T> {
  const url = `${baseUrl()}${path}`;
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch {
    throw new ApiError('Could not reach the cutout API — is it deployed?');
  }
  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = await response.json();
      if (typeof body?.detail === 'string') {
        detail = body.detail;
      }
    } catch {
      // keep statusText
    }
    throw new ApiError(detail, response.status);
  }
  return schema.parse(await response.json());
}

export const api = {
  /** Fire-and-forget GPU pre-boot to hide the cold start. */
  warmup(): void {
    fetch(`${baseUrl()}/warmup`).catch(() => {
      // best effort only
    });
  },

  async uploadImages(files: File[]): Promise<UploadedFile[]> {
    const form = new FormData();
    files.forEach((file) => form.append('files', file));
    const { files: uploaded } = await request('/images', uploadResponseSchema, {
      method: 'POST',
      body: form,
    });
    return uploaded;
  },

  async uploadVideo(file: File): Promise<UploadedFile> {
    const form = new FormData();
    form.append('files', file);
    const { files } = await request('/videos', uploadResponseSchema, {
      method: 'POST',
      body: form,
    });
    return files[0];
  },

  async createCutouts(params: CreateCutoutsParams): Promise<ImageResult[]> {
    const { results } = await request('/cutouts', cutoutResponseSchema, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_names: params.imageNames,
        prompts: params.prompts,
        create_stickers: params.createStickers ?? true,
        score_threshold: params.scoreThreshold ?? 0.5,
      }),
    });
    return results;
  },

  async startVideoCutout(videoName: string, prompt: string): Promise<string> {
    const { job_id } = await request('/video-cutouts', jobStartedSchema, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ video_name: videoName, prompt }),
    });
    return job_id;
  },

  async getJob(jobId: string): Promise<JobStatus> {
    return request(`/jobs/${jobId}`, jobStatusSchema);
  },
};
