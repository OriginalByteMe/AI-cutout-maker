import { AppShell, MantineProvider, localStorageColorSchemeManager } from '@mantine/core';
import React from 'react';
import { theme } from '../theme';
import { Navbar } from '@/components/NavBar/NavBar';

export default function RootLayout({ children }: { children: any }) {
  return (
    <MantineProvider
      theme={theme}
      defaultColorScheme="auto"
      colorSchemeManager={localStorageColorSchemeManager({ key: 'ai-cutout-color-scheme' })}
    >
      <AppShell header={{ height: { base: 60, md: 70, lg: 80 } }} padding="md">
        <AppShell.Header withBorder={false}>
          <Navbar />
        </AppShell.Header>
        <AppShell.Main className="flex flex-col items-center justify-center">
          {children}
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
