'use client';
import { Anchor, Button, Text, Title, useMantineColorScheme } from '@mantine/core';
import Link from 'next/link';
export function Welcome() {
  const {colorScheme} = useMantineColorScheme();

  return (
    <>
      <Title
        className={`text-${colorScheme === 'dark' ? 'white' : 'black'} text-6xl font-bold tracking-tight text-center mt-20`}
      >
        Welcome to{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'blue', to: 'green' }}>
          Noah's AI Cutout Generator
        </Text>
      </Title>
      <Text className="text-gray-400 text-center text-lg max-w-xl mx-auto mt-8">
        The app that lets you {""}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'blue', to: 'green' }}>
          cutout any subject from an image 
        </Text>
        !{' '}
        This is the Front-end aspect of this project, the backend side can be found {' '}
        <Anchor href="https://github.com/OriginalByteMe/AI_Image_cutout_maker" size="lg">
          here
        </Anchor>
        .
      </Text>

      <div className="flex justify-center mt-8">
        <Link href="/upload">
            <Button variant="gradient" gradient={{ from: 'indigo', to: 'teal', deg: 90 }} radius="xl" size="lg" className="text-lg font-semibold">
              Get started now
            </Button>
        </Link>
      </div>
      
    </>
  );
}