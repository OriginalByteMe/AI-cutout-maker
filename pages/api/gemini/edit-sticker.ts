import { editSticker } from '@/services/geminiService';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image, prompt } = req.body as { image?: string; prompt?: string };
  if (!image || !prompt) {
    return res.status(400).json({ error: 'Missing image or prompt' });
  }

  try {
    const edited = await editSticker(image, prompt);
    return res.status(200).json({ image: edited });
  } catch (error: any) {
    console.error('Gemini editSticker error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to edit sticker' });
  }
}
