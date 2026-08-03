import type { Meta, StoryObj } from '@storybook/react-vite';

import { Progress } from '@/components/progress';

const meta = {
  title: 'Components/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Progress displays an indicator showing the completion progress of a task, typically as a horizontal bar.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <div className="flex justify-between text-sm text-foreground">
        <span>Downloading...</span>
        <span>60%</span>
      </div>
      <Progress value={60} aria-label="Download progress" />
    </div>
  ),
};

export const Complete: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <div className="flex justify-between text-sm text-foreground">
        <span>Task Complete</span>
        <span>100%</span>
      </div>
      <Progress value={100} aria-label="Task completion progress" />
    </div>
  ),
};
