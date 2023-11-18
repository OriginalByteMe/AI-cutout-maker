import { Avatar, Group, Text, ThemeIcon } from '@mantine/core';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';

export function Navbar() {
  return (
    <div className="fixed top-0 z-50 flex flex-col items-center justify-between w-full p-4 sm:flex-row sm:p-6 md:p-8">
      <a href="https://noahrijkaard.com">
        <Avatar src="/logo.svg" alt="Noah Rijkaard" radius="xl" size="lg" />
      </a>
      <Group className="mt-4 sm:mt-0">
        <a href="https://github.com/originalbyteme" target="_blank" rel="noopener noreferrer">
          <ThemeIcon color="black" radius="xl">
            <FaGithub />
          </ThemeIcon>
        </a>
        <a
          href="https://www.linkedin.com/in/noahrijkaard/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ThemeIcon
            radius="xl"
          >
            <FaLinkedin />
          </ThemeIcon>
        </a>
        <a href="mailto:noahrijkaard@gmail.com" target="_blank" rel="noopener noreferrer">
          <ThemeIcon
            radius="xl"
          >
            <FaEnvelope />
          </ThemeIcon>
        </a>
        <ColorSchemeToggle />
      </Group>
    </div>
  );
}
