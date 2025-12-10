'use client';

import {
    ActionIcon,
    Tooltip,
    useComputedColorScheme,
    useMantineColorScheme,
    type ColorScheme,
} from '@mantine/core';
import { Laptop2, MoonStar, SunMedium } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const displayScheme: ColorScheme = mounted ? colorScheme : 'auto';

  const effectiveScheme =
    displayScheme === 'auto' ? (computedColorScheme ?? 'light') : (displayScheme as ColorScheme);

  const renderScheme = mounted ? effectiveScheme : 'auto';

  const labelScheme =
    !mounted && colorScheme === 'auto'
      ? 'auto'
      : colorScheme === 'auto'
        ? effectiveScheme
        : colorScheme;

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
