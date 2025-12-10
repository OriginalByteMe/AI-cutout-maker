'use client';

import { cn } from '@/utils/cn';
import { downloadImage, fileToBase64 } from '@/utils/geminiUtils';
import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import { AlertTriangle, Brush, CheckCircle2, Image as ImageIcon, Loader2, PlayCircle, Sparkles, Upload, Wand2, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';
type Scheme = 'auto' | 'light' | 'dark';

interface UploadResponse {
  fileName?: string;
}

export function HomeUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [stickerImage, setStickerImage] = useState<string | null>(null);
  const [stickerLoading, setStickerLoading] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [animationType, setAnimationType] = useState<'wiggle' | 'pulse' | 'custom'>('wiggle');
  const [customInstruction, setCustomInstruction] = useState('');
  const [frameCount, setFrameCount] = useState<number>(4);
  const [frames, setFrames] = useState<string[]>([]);
  const [animLoading, setAnimLoading] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const [showEdit, setShowEdit] = useState(false);
  const [showAnim, setShowAnim] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const uploadUrl = process.env.NEXT_PUBLIC_S3_API ? `${process.env.NEXT_PUBLIC_S3_API}/upload-image` : null;

  useEffect(() => {
    if (!file) return;
    const nextUrl = URL.createObjectURL(file);
    setPreview(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [file]);

  useEffect(() => {
    if (!frames.length) return;
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, 650);
    return () => clearInterval(interval);
  }, [frames]);

  const clearSelection = () => {
    setFile(null);
    setPreview(null);
    setBase64Image(null);
    setStatus('idle');
    setProgress(0);
    setError(null);
    setUploadedFileName(null);
    setStickerImage(null);
    setEditedImage(null);
    setFrames([]);
    setFrameIndex(0);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const picked = files[0];
    setFile(picked);
    setStatus('idle');
    setProgress(0);
    setError(null);
    setUploadedFileName(null);
    setStickerImage(null);
    setEditedImage(null);
    setFrames([]);
    setFrameIndex(0);
    fileToBase64(picked)
      .then((value) => {
        setBase64Image(value);
        runGenerateSticker(value);
      })
      .catch((err) => setError(err?.message ?? 'Could not read file'));
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
  };

  const onBrowse = () => {
    inputRef.current?.click();
  };

  const handleAddTag = () => {
    const next = tagInput.trim();
    if (!next) return;
    if (tags.includes(next)) {
      setTagInput('');
      return;
    }
    setTags([...tags, next]);
    setTagInput('');
  };

  const handleRemoveTag = (value: string) => {
    setTags(tags.filter((tag) => tag !== value));
  };

  const runGenerateSticker = async (imageOverride?: string) => {
    const payloadImage = imageOverride || base64Image;
    if (!payloadImage) {
      setError('Select an image first.');
      return;
    }
    setStickerLoading(true);
    setError(null);
    setFrames([]);
    try {
      const { data } = await axios.post('/api/gemini/generate-sticker', { image: payloadImage });
      setStickerImage(data.image);
      setEditedImage(null);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? err?.message ?? 'Gemini cutout failed.');
    } finally {
      setStickerLoading(false);
    }
  };

  const runEditSticker = async () => {
    const prompt = editPrompt.trim();
    if (!prompt) {
      setError('Add an edit prompt first.');
      return;
    }
    const source = editedImage || stickerImage || base64Image;
    if (!source) {
      setError('Generate a cutout first.');
      return;
    }
    setEditLoading(true);
    setError(null);
    setFrames([]);
    try {
      const { data } = await axios.post('/api/gemini/edit-sticker', { image: source, prompt });
      setEditedImage(data.image);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? err?.message ?? 'Edit failed.');
    } finally {
      setEditLoading(false);
    }
  };

  const runGenerateAnimation = async () => {
    const source = editedImage || stickerImage || base64Image;
    if (!source) {
      setError('Generate a cutout first.');
      return;
    }
    const instruction =
      animationType === 'custom' ? customInstruction.trim() : animationType;
    if (!instruction) {
      setError('Add an animation instruction.');
      return;
    }
    setAnimLoading(true);
    setError(null);
    try {
      const { data } = await axios.post('/api/gemini/generate-animation', {
        image: source,
        instruction,
        frameCount,
      });
      setFrames(data.frames || []);
      setFrameIndex(0);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? err?.message ?? 'Animation failed.');
    } finally {
      setAnimLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file || !uploadUrl) {
      setError('Select an image first.');
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    setStatus('uploading');
    setError(null);

    const config: AxiosRequestConfig<FormData> = {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event: AxiosProgressEvent) => {
        const percent = Math.round(((event.loaded || 0) * 100) / (event.total || event.loaded || 1));
        setProgress(percent);
      },
    };

    try {
      const response = await axios.post<UploadResponse>(uploadUrl, formData, config);
      setStatus('success');
      setUploadedFileName(response.data.fileName ?? file.name);
    } catch (err: any) {
      setStatus('error');
      setError(err?.message ?? 'Upload failed. Please try again.');
    }
  };

  const hasUploaded = status === 'success' && uploadedFileName;
  const cutoutHref =
    hasUploaded && uploadedFileName
      ? `/cutout/${encodeURIComponent(uploadedFileName)}${
          tags.length ? `?${tags.map((tag) => `class=${encodeURIComponent(tag)}`).join('&')}` : ''
        }`
      : '#';

  return (
    <div className="w-full max-w-4xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <ImageIcon className="h-5 w-5 text-slate-500" />
            Upload an image
          </CardTitle>
          <CardDescription>
            Drop a subject photo to generate a cutout instantly. We&apos;ll keep your original safe.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            className={cn(
              'relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-slate-600 dark:hover:bg-slate-800/60',
              status === 'uploading' && 'pointer-events-none opacity-80'
            )}
            onClick={onBrowse}
          >
            {preview ? (
              <div className="flex w-full flex-col items-center gap-4 md:flex-row md:items-center md:gap-6">
                <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                  <Image src={preview} alt="Preview" fill className="object-cover" sizes="(min-width: 768px) 320px, 100vw" />
                </div>
                <div className="flex flex-1 flex-col items-start gap-3 text-left">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Ready to cut out <span className="font-semibold text-slate-900 dark:text-white">{file?.name}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tags.length === 0 ? (
                      <Badge variant="outline" className="border-dashed">
                        Add subjects you want isolated
                      </Badge>
                    ) : (
                      tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveTag(tag);
                          }}
                        >
                          {tag}
                          <X className="h-3 w-3" />
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <Upload className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-slate-900 dark:text-white">Drop your image here</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">or click to browse</p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Max size: 28MB • Images only</p>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {file && (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                <div className="space-y-2">
                  <Label htmlFor="tag-input">Subjects to cut out</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tag-input"
                      placeholder="e.g. person, product, object"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button type="button" variant="secondary" onClick={handleAddTag}>
                      Add
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end gap-2 md:self-end">
                  <Button type="button" variant="ghost" onClick={clearSelection} disabled={status === 'uploading'}>
                    Clear
                  </Button>
                  <Button type="button" onClick={handleUpload} disabled={status === 'uploading'}>
                    {status === 'uploading' ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Uploading
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <Wand2 className="h-4 w-4" /> Upload
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              {status === 'uploading' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              {status === 'success' && (
                <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900 dark:border-green-900 dark:bg-green-950/50 dark:text-green-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Upload complete. Ready to view your cutout.</span>
                  </div>
                  {hasUploaded && (
                    <Button asChild size="sm" variant="secondary">
                      <Link href={cutoutHref}>Open cutout</Link>
                    </Button>
                  )}
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-100">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    Cutout in progress
                  </div>
                  {(stickerLoading || editLoading || animLoading) && (
                    <div className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {stickerLoading
                        ? 'Generating cutout...'
                        : editLoading
                        ? 'Applying edit...'
                        : 'Building animation...'}
                    </div>
                  )}
                </div>

                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                  {stickerLoading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/10 backdrop-blur-sm dark:bg-slate-900/30">
                      <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs text-slate-700 shadow dark:bg-slate-800/80 dark:text-slate-100">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating cutout...
                      </div>
                    </div>
                  )}
                  <Image
                    src={editedImage || stickerImage || preview || '/placeholder.png'}
                    alt="Result"
                    fill
                    className="object-contain"
                    sizes="(min-width: 768px) 640px, 100vw"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadImage(editedImage || stickerImage || preview || '', 'cutout.png')}
                    disabled={!stickerImage && !editedImage && !preview}
                  >
                    Download
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowEdit((v) => !v)} disabled={!stickerImage && !editedImage}>
                    {showEdit ? 'Hide edit' : 'Edit'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowAnim((v) => !v)} disabled={!stickerImage && !editedImage}>
                    {showAnim ? 'Hide animation' : 'Animate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => runGenerateSticker()}
                    disabled={!base64Image || stickerLoading}
                  >
                    Regenerate
                  </Button>
                </div>

                {showEdit && (
                  <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                    <Label htmlFor="edit-prompt" className="text-xs uppercase text-slate-500">
                      Edit prompt
                    </Label>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                      <Input
                        id="edit-prompt"
                        placeholder="e.g. add a shadow, change color, add sunglasses"
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') runEditSticker();
                        }}
                      />
                      <Button type="button" onClick={runEditSticker} disabled={editLoading}>
                        <span className="inline-flex items-center gap-2">
                          {editLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brush className="h-4 w-4" />}
                          Apply edit
                        </span>
                      </Button>
                    </div>
                  </div>
                )}

                {showAnim && (
                  <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex flex-wrap items-center gap-2">
                      {(['wiggle', 'pulse', 'custom'] as const).map((option) => (
                        <Button
                          key={option}
                          type="button"
                          size="sm"
                          variant={animationType === option ? 'default' : 'outline'}
                          onClick={() => setAnimationType(option)}
                        >
                          {option === 'wiggle' && 'Wiggle'}
                          {option === 'pulse' && 'Pulse'}
                          {option === 'custom' && 'Custom'}
                        </Button>
                      ))}
                      <Input
                        type="number"
                        min={2}
                        max={8}
                        value={frameCount}
                        onChange={(e) => {
                          const next = Number(e.target.value);
                          const safe = Number.isNaN(next) ? 2 : Math.max(2, Math.min(8, next));
                          setFrameCount(safe);
                        }}
                        className="w-24"
                      />
                      <Button type="button" size="sm" onClick={runGenerateAnimation} disabled={animLoading}>
                        <span className="inline-flex items-center gap-2">
                          {animLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />}
                          Animate
                        </span>
                      </Button>
                    </div>
                    {animationType === 'custom' && (
                      <Input
                        placeholder="Describe the motion (e.g. rotate left, bounce)"
                        value={customInstruction}
                        onChange={(e) => setCustomInstruction(e.target.value)}
                      />
                    )}
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                      {frames.length > 0 ? (
                        <Image
                          key={frames[frameIndex]}
                          src={frames[frameIndex]}
                          alt="Animation frame"
                          fill
                          className="object-contain transition-opacity"
                          sizes="(min-width: 768px) 320px, 100vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-slate-400">
                          Build animation to preview frames
                        </div>
                      )}
                    </div>
                    {frames.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {frames.map((frame, idx) => (
                          <button
                            key={idx}
                            className={cn(
                              'relative h-16 w-16 overflow-hidden rounded border',
                              idx === frameIndex
                                ? 'border-indigo-500 ring-2 ring-indigo-200'
                                : 'border-slate-200 dark:border-slate-700'
                            )}
                            onClick={() => setFrameIndex(idx)}
                          >
                            <Image src={frame} alt={`Frame ${idx + 1}`} fill className="object-cover" sizes="64px" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
