import type { Meta, StoryObj } from '@storybook/react-vite';

import { Check, ChevronRight, Clock } from 'lucide-react';

import { Badge } from '@/components/badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Badge communicates compact metadata. Use an accessible label when its visual text is insufficient context.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    children: 'Badge',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge icon={<Check className="size-3" />}>Verified</Badge>
      <Badge variant="warning" icon={<Clock className="size-3" />}>
        Pending
      </Badge>
      <Badge variant="outline" icon={<ChevronRight className="size-3" />} iconPosition="end">
        More
      </Badge>
    </div>
  ),
};
