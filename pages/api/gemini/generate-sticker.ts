import { generateSticker } from '@/services/geminiService';
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

  const { image } = req.body as { image?: string };
  if (!image) {
    return res.status(400).json({ error: 'Missing image' });
  }

  try {
    const sticker = await generateSticker(image);
    return res.status(200).json({ image: sticker });
  } catch (error: any) {
    console.error('Gemini generateSticker error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate sticker' });
  }
}
