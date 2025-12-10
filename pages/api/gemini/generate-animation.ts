import { generateAnimationFrames } from '@/services/geminiService';
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

  const { image, instruction, frameCount } = req.body as {
    image?: string;
    instruction?: string;
    frameCount?: number;
  };

  if (!image || !instruction) {
    return res.status(400).json({ error: 'Missing image or instruction' });
  }

  try {
    const frames = await generateAnimationFrames(image, instruction, frameCount || 3);
    return res.status(200).json({ frames });
  } catch (error: any) {
    console.error('Gemini generateAnimationFrames error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate animation frames' });
  }
}
