import { Avatar, Group, Text, ThemeIcon } from '@mantine/core';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';

export function Navbar() {
  return (
    <div className="flex items-center justify-between  p-4">
      <a href="https://noahrijkaard.com">
        <Avatar
          src="./logo.svg"
          alt="Noah Rijkaard"
          radius="xl"
          size="xl"
        />
      </a>
      <Group>
        <a href='https://github.com/originalbyteme' target="_blank" rel="noopener noreferrer">
          <ThemeIcon 
            color="black"
            radius="xl"
          >
            <FaGithub />
          </ThemeIcon>
        </a>
        <a href="https://www.linkedin.com/in/noahrijkaard/" target="_blank" rel="noopener noreferrer">
          <ThemeIcon 
            // color="gray"
            radius="xl"
          >
            <FaLinkedin />
          </ThemeIcon>
        </a>
        <a href="mailto:noahrijkaard@gmail.com" target="_blank" rel="noopener noreferrer">
          <ThemeIcon 
            // color="gray"
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