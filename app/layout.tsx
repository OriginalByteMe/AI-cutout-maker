import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '../styles/global.css';
import React from 'react';
import { theme } from '../theme';
import { Navbar } from '@/components/NavBar/NavBar';

export const metadata = {
  title: 'AI Cutout generator',
  description: 'A simple AI cutout generator',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/logo.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Navbar />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
