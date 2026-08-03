import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import {
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@/components/popover';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Popover uses Radix UI for click triggers, controlled/uncontrolled open state, collision-aware positioning (`side` / `align`), portal rendering, Escape and outside-click dismissal. Set `modal` on the root to trap focus for form-like content, and give modal content an accessible name (`aria-label` or labelled heading).',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

function BasicPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid gap-2">
          <p className="font-medium">Dimensions</p>
          <p className="text-muted-foreground">Set the width and height for this layer.</p>
        </div>
        <PopoverArrow />
      </PopoverContent>
    </Popover>
  );
}

export const Default: Story = {
  render: () => <BasicPopover />,
};

export const WithForm: Story = {
  render: () => (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button>Edit profile</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" aria-label="Edit profile">
        <div className="grid gap-3">
          <div className="grid gap-1">
            <p className="font-medium">Profile</p>
            <p className="text-muted-foreground">Update how your name appears.</p>
          </div>
          <Input aria-label="Display name" defaultValue="Piyush" />
          <div className="flex justify-end gap-2">
            <PopoverClose asChild>
              <Button variant="secondary">Cancel</Button>
            </PopoverClose>
            <Button>Save</Button>
          </div>
        </div>
        <PopoverArrow />
      </PopoverContent>
    </Popover>
  ),
};

export const Positions: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-8 p-16">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Popover key={side}>
          <PopoverTrigger asChild>
            <Button variant="secondary">{side}</Button>
          </PopoverTrigger>
          <PopoverContent side={side} className="w-48">
            Positioned {side}
            <PopoverArrow />
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
};

export const Alignment: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-8 p-16">
      {(['start', 'center', 'end'] as const).map((align) => (
        <Popover key={align}>
          <PopoverTrigger asChild>
            <Button variant="secondary">align={align}</Button>
          </PopoverTrigger>
          <PopoverContent side="bottom" align={align} className="w-48">
            Aligned {align}
            <PopoverArrow />
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
};

export const Controlled: Story = {
  render: function ControlledPopover() {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground">Open: {open ? 'true' : 'false'}</p>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="secondary">Toggle</Button>
          </PopoverTrigger>
          <PopoverContent>
            Controlled popover content.
            <PopoverArrow />
          </PopoverContent>
        </Popover>
      </div>
    );
  },
};
