'use client';

import { ActionIcon, Tooltip, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { Laptop2, MoonStar, SunMedium } from 'lucide-react';
import { useEffect, useState } from 'react';

type Scheme = 'auto' | 'light' | 'dark';

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true }) as Scheme;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const labels: Record<Scheme, string> = {
    auto: 'System',
    light: 'Light',
    dark: 'Dark',
  };

  const handleClick = () => {
    const order: Scheme[] = ['auto', 'light', 'dark'];
    const next = order[(order.indexOf(colorScheme as Scheme) + 1) % order.length];
    setColorScheme(next);
  };

  const displayScheme: Scheme = mounted ? (colorScheme as Scheme) : 'auto';

  const effectiveScheme =
    displayScheme === 'auto' ? (computedColorScheme ?? 'light') : displayScheme;

  const renderScheme = mounted ? effectiveScheme : 'auto';

  const labelScheme: Scheme =
    (!mounted && colorScheme === 'auto') || colorScheme === 'auto'
      ? effectiveScheme
      : (colorScheme as Scheme);

  const icon = renderScheme === 'auto' ? Laptop2 : renderScheme === 'dark' ? MoonStar : SunMedium;

  const IconComponent = icon;

  return (
    <Tooltip withArrow label={`Theme: ${labels[labelScheme]}`}>
      <ActionIcon
        variant="default"
        radius="xl"
        size="lg"
        aria-label={`Toggle color scheme (current: ${labels[labelScheme]})`}
        onClick={handleClick}
      >
        <IconComponent size={18} strokeWidth={1.8} />
      </ActionIcon>
    </Tooltip>
  );
}
