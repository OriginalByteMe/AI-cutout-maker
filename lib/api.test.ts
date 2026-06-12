import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { api, ApiError } from './api';

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

describe('api client', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.com/');
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('uploads images as multipart form data and strips trailing slash', async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse({
        files: [{ name: 'abc_dog.png', url: 'https://s3/x', size: 123 }],
      })
    );

    const files = await api.uploadImages([new File(['x'], 'dog.png', { type: 'image/png' })]);

    expect(files).toHaveLength(1);
    expect(files[0].name).toBe('abc_dog.png');
    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(url).toBe('https://api.example.com/images');
    expect(init?.body).toBeInstanceOf(FormData);
  });

  it('sends snake_case fields for cutout requests and parses results', async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse({
        results: [
          {
            image_name: 'a.png',
            cutouts: [
              {
                key: 'cutouts/a/dog_0.png',
                url: 'https://s3/c',
                prompt: 'dog',
                score: 0.9,
                width: 10,
                height: 12,
                sticker_key: null,
                sticker_url: null,
              },
            ],
            error: null,
          },
        ],
      })
    );

    const results = await api.createCutouts({
      imageNames: ['a.png'],
      prompts: ['dog'],
      scoreThreshold: 0.4,
    });

    expect(results[0].cutouts[0].prompt).toBe('dog');
    const [, init] = vi.mocked(fetch).mock.calls[0];
    expect(JSON.parse(init?.body as string)).toEqual({
      image_names: ['a.png'],
      prompts: ['dog'],
      create_stickers: true,
      score_threshold: 0.4,
    });
  });

  it('surfaces FastAPI error detail as ApiError', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ detail: 'Video not found' }, 404));

    await expect(api.getJob('fc-123')).rejects.toThrowError(new ApiError('Video not found', 404));
  });

  it('rejects malformed responses', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ nope: true }));
    await expect(api.getJob('fc-123')).rejects.toThrow();
  });

  it('throws a helpful error when the API URL is missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', '');
    await expect(api.getJob('fc-123')).rejects.toThrow(/NEXT_PUBLIC_API_URL/);
  });
});
