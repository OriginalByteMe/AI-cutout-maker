import { Box, MantineLoaderComponent } from '@mantine/core';
import cx from 'clsx';
import { forwardRef } from 'react';
import classes from '@/styles/loader.module.css';

export const CssLoader: MantineLoaderComponent = forwardRef(({ className, ...others }, ref) => (
  <Box component="span" className={cx(classes.loader, className)} {...others} ref={ref} />
));
