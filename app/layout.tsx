import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '../styles/global.css';
import React from 'react';
import { theme } from '../theme';
import { Navbar } from '@/components/NavBar/NavBar';


export default function RootLayout({ children }: { children: any }) {
  return (
      <MantineProvider theme={theme}>
        <Navbar />
        {children}
    </MantineProvider>
  );
}
