import { Navbar } from '@/components/NavBar/NavBar';
import { MantineProvider } from '@mantine/core';
import React from 'react';
import { theme } from '../theme';


export default function RootLayout({ children }: { children: any }) {
  return (
    <MantineProvider theme={theme}>
        <Navbar />
        <div className="flex flex-col items-center justify-center h-screen mx-auto mt-10 space-y-4 sm:mt-16 md:mt-20 lg:mt-24 xl:mt-28 2xl:mt-32">
          {children}
        </div>
    </MantineProvider>
  );
}
