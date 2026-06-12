import { describe, expect, it } from 'vitest';
import { render, screen } from '@/test-utils/render';
import { CutoutCard } from './CutoutCard';
import type { Cutout } from '@/lib/api';

const baseCutout: Cutout = {
  key: 'cutouts/photo/dog_0.png',
  url: 'https://example.com/dog.png',
  prompt: 'dog',
  score: 0.92,
  width: 100,
  height: 120,
  sticker_key: 'stickers/photo/dog_0.webp',
  sticker_url: 'https://example.com/dog.webp',
};

describe('CutoutCard', () => {
  it('renders the preview, prompt badge and both download buttons', () => {
    render(<CutoutCard cutout={baseCutout} />);

    expect(screen.getByAltText('dog')).toHaveAttribute('src', baseCutout.url);
    expect(screen.getByText('dog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /png/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sticker/i })).toBeInTheDocument();
  });

  it('hides the sticker button when no sticker was generated', () => {
    render(<CutoutCard cutout={{ ...baseCutout, sticker_url: null, sticker_key: null }} />);

    expect(screen.queryByRole('button', { name: /sticker/i })).not.toBeInTheDocument();
  });
});
