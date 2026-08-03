import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileText, FolderOpen, LayoutDashboard, Settings, Users } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/command';

const meta = {
  title: 'Components/Command',
  component: CommandDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Command Dialog uses cmdk for efficient filtering and roving keyboard navigation. Press Ctrl+K or Cmd+K to open it; Escape closes it.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CommandDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function CommandPaletteExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open command palette</Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search pages, settings, and people…" />
        <CommandList>
          <CommandEmpty>No matching commands.</CommandEmpty>
          <CommandGroup heading="Navigate">
            <CommandItem value="dashboard" onSelect={() => setOpen(false)}>
              <LayoutDashboard aria-hidden="true" />
              Dashboard
              <CommandShortcut>G D</CommandShortcut>
            </CommandItem>
            <CommandItem value="projects" onSelect={() => setOpen(false)}>
              <FolderOpen aria-hidden="true" />
              Projects
              <CommandShortcut>G P</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Workspace">
            <CommandItem value="new document" onSelect={() => setOpen(false)}>
              <FileText aria-hidden="true" />
              New document
              <CommandShortcut>⌘ N</CommandShortcut>
            </CommandItem>
            <CommandItem value="team members" onSelect={() => setOpen(false)}>
              <Users aria-hidden="true" />
              Team members
            </CommandItem>
            <CommandItem value="settings" disabled>
              <Settings aria-hidden="true" />
              Settings
              <CommandShortcut>Coming soon</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

export const Default: Story = { render: () => <CommandPaletteExample /> };
