'use client';

import {
  ActionIcon,
  Tooltip,
  type ColorScheme,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { Laptop2, MoonStar, SunMedium } from 'lucide-react';

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const labels: Record<ColorScheme, string> = {
    auto: 'System',
    light: 'Light',
    dark: 'Dark',
  };

  const handleClick = () => {
    const order: ColorScheme[] = ['auto', 'light', 'dark'];
    const next = order[(order.indexOf(colorScheme) + 1) % order.length];
    setColorScheme(next);
  };

  const icon =
    colorScheme === 'auto'
      ? Laptop2
      : computedColorScheme === 'dark'
      ? MoonStar
      : SunMedium;

  const IconComponent = icon;

  return (
    <Tooltip withArrow label={`Theme: ${labels[colorScheme]}`}>
      <ActionIcon
        variant="default"
        radius="xl"
        size="lg"
        aria-label={`Toggle color scheme (current: ${labels[colorScheme]})`}
        onClick={handleClick}
      >
        <IconComponent size={18} strokeWidth={1.8} />
      </ActionIcon>
    </Tooltip>
  );
}
