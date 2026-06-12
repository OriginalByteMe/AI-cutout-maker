'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ActionIcon,
  Anchor,
  Container,
  Group,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { IconMoon, IconScissors, IconSun } from '@tabler/icons-react';

const links = [
  { href: '/studio', label: 'Image Studio' },
  { href: '/video', label: 'Video Studio' },
];

function ThemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computed = useComputedColorScheme('light', { getInitialValueInEffect: true });
  return (
    <ActionIcon
      variant="default"
      size="lg"
      aria-label="Toggle color scheme"
      onClick={() => setColorScheme(computed === 'light' ? 'dark' : 'light')}
    >
      {computed === 'light' ? <IconMoon size={18} /> : <IconSun size={18} />}
    </ActionIcon>
  );
}

export function Header() {
  const pathname = usePathname();
  return (
    <Container size="lg" py="md">
      <Group justify="space-between">
        <Anchor component={Link} href="/" underline="never" c="inherit">
          <Group gap="xs">
            <IconScissors size={24} />
            <Text fw={700} size="lg">
              AI Cutout Maker
            </Text>
          </Group>
        </Anchor>
        <Group gap="md">
          {links.map((link) => (
            <Anchor
              key={link.href}
              component={Link}
              href={link.href}
              fw={pathname === link.href ? 700 : 400}
              c={pathname === link.href ? 'violet' : 'inherit'}
            >
              {link.label}
            </Anchor>
          ))}
          <ThemeToggle />
        </Group>
      </Group>
    </Container>
  );
}
