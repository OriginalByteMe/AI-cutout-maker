import { ActionIcon, Avatar, Group } from '@mantine/core';
import { Github, Linkedin, Mail } from 'lucide-react';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';

export function Navbar() {
  return (
    <div className="w-full px-4 py-3 sm:px-6 md:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <a href="https://cutouts.noahrijkaard.com">
          <Avatar src="/logo.svg" alt="Noah Rijkaard" radius="xl" size="lg" />
        </a>
        <Group gap="xs" wrap="nowrap" align="center" className="mt-0">
          <ActionIcon
            component="a"
            href="https://github.com/originalbyteme"
            target="_blank"
            rel="noopener noreferrer"
            variant="default"
            radius="xl"
            size="lg"
            aria-label="GitHub"
          >
            <Github size={18} />
          </ActionIcon>
          <ActionIcon
            component="a"
            href="https://www.linkedin.com/in/noahrijkaard/"
            target="_blank"
            rel="noopener noreferrer"
            variant="default"
            radius="xl"
            size="lg"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </ActionIcon>
          <ActionIcon
            component="a"
            href="mailto:noahrijkaard@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            variant="default"
            radius="xl"
            size="lg"
            aria-label="Email"
          >
            <Mail size={18} />
          </ActionIcon>
          <a href="https://noahrijkaard.com">
            <Avatar src="/profile.jpg" alt="Noah Rijkaard" radius="xl" size="md" />
          </a>
          <ColorSchemeToggle />
        </Group>
      </div>
    </div>
  );
}
