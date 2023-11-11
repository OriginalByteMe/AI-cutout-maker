'use client';

import { Button, useMantineColorScheme, ThemeIcon  } from '@mantine/core';
import { useState } from 'react';
import { FaSun, FaMoon, FaSync } from 'react-icons/fa';

export function ColorSchemeToggle() {
  const [scheme, setScheme] = useState('auto');
  const { setColorScheme, colorScheme } = useMantineColorScheme();

  const handleClick = () => {
    if (scheme === 'auto') {
      setScheme('light');
      setColorScheme('light');
    } else if (scheme === 'light') {
      setScheme('dark');
      setColorScheme('dark');
    } else {
      setScheme('auto');
      setColorScheme('auto');
    }
  };

  const getIcon = () => {
    if (scheme === 'auto') {
      return <FaSync />;
    } else if (scheme === 'light') {
      return <FaSun />;
    } else {
      return <FaMoon />;
    }
  };

  return (
    <Button onClick={handleClick} variant="subtle">
      <ThemeIcon color={colorScheme === 'light' ? 'black' : 'lilac'}  radius="xl">
        {getIcon()}
      </ThemeIcon>
    </Button>
  );
}
