import type { Meta, StoryObj } from '@storybook/react-vite';

import { ArrowRight, Mail, Plus } from 'lucide-react';
import { fn } from 'storybook/test';

import { Button } from '@/components/button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Use Button for user-initiated actions. Icon-only buttons require an accessible name.',
      },
    },
  },
  tags: ['autodocs'],
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Continue',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Create item">
        <Plus className="size-4" aria-hidden="true" />
      </Button>
    </div>
  ),
};

export const WithIcons: Story = {
  args: {
    children: 'Send email',
    leftIcon: <Mail className="size-4" />,
    rightIcon: <ArrowRight className="size-4" />,
  },
};

export const Loading: Story = {
  args: {
    children: 'Save changes',
    loading: true,
    loadingText: 'Saving changes',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Submit',
    disabled: true,
  },
};
