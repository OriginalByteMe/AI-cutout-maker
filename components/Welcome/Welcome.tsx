'use client';
import { Anchor, Button, Text, Title, useComputedColorScheme } from '@mantine/core';
import clsx from 'clsx';
import Link from 'next/link';
export function Welcome() {
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <>
      <Title
        className={clsx(
          'mt-20 text-center text-6xl font-bold tracking-tight',
          computedColorScheme === 'dark' ? 'text-white' : 'text-black'
        )}
      >
        Welcome to{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'blue', to: 'green' }}>
          Noah's AI Cutout Generator
        </Text>
      </Title>
      <Text className="mx-auto mt-8 max-w-xl text-center text-lg text-gray-700 dark:text-gray-300">
        The app that lets you {''}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'blue', to: 'green' }}>
          cutout any subject from an image
        </Text>
        ! This is the Front-end aspect of this project, the backend side can be found{' '}
        <Anchor href="https://github.com/OriginalByteMe/AI_Image_cutout_maker" size="lg">
          here
        </Anchor>
        .
      </Text>

      <div className="flex justify-center mt-8">
        <Link href="/upload">
          <Button
            variant="gradient"
            gradient={{ from: 'indigo', to: 'teal', deg: 90 }}
            radius="xl"
            size="lg"
            className="text-lg font-semibold"
          >
            Get started now
          </Button>
        </Link>
      </div>
    </>
  );
}
