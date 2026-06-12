import JSZip from 'jszip';

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export async function downloadFile(url: string, filename: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Download failed (${response.status})`);
  }
  triggerDownload(await response.blob(), filename);
}

export interface ZipEntry {
  url: string;
  filename: string;
}

/** Fetch every entry and bundle them into a single zip download. */
export async function downloadAsZip(entries: ZipEntry[], zipName: string): Promise<void> {
  const zip = new JSZip();
  await Promise.all(
    entries.map(async ({ url, filename }) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${filename} (${response.status})`);
      }
      zip.file(filename, await response.blob());
    })
  );
  const blob = await zip.generateAsync({ type: 'blob' });
  triggerDownload(blob, zipName);
}

/** Derive a friendly download name from an S3 key like "cutouts/img/dog_0.png". */
export function filenameFromKey(key: string): string {
  const parts = key.split('/');
  const file = parts[parts.length - 1];
  const stem = parts.length > 1 ? parts[parts.length - 2] : '';
  return stem ? `${stem}_${file}` : file;
}
