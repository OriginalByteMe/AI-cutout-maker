'use client';

import { createTheme, Loader } from '@mantine/core';
import { CssLoader } from '@/components/Loader';
export const theme = createTheme({
  /* Put your mantine theme override here */
  components: {
    Loader: Loader.extend({
      defaultProps: {
        loaders: { ...Loader.defaultLoaders, custom: CssLoader },
        type: 'custom',
      },
    }),
  },
});
