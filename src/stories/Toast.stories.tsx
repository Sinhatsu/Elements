import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleAlert, CircleCheck, CircleX, Info as InfoIcon } from 'lucide-react';

import { Button } from '@/components/button';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  Toaster,
  toast,
} from '@/components/toast';
import { withDarkTheme } from '../../.storybook/decorators';

const meta = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Toast uses a Radix provider for timeouts, hover pausing, swipe dismissal, and accessible announcements. Use Toaster and toast() for application notifications.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

function ToastPreview({
  variant = 'success',
}: {
  variant?: 'success' | 'error' | 'warning' | 'info';
}) {
  const icons = { success: CircleCheck, error: CircleX, warning: CircleAlert, info: InfoIcon };
  const Icon = icons[variant];

  return (
    <ToastProvider duration={600_000} label="Toast preview">
      <Toast open variant={variant} className="w-96">
        <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <div className="grid gap-1.5">
          <ToastTitle>{variant[0].toUpperCase() + variant.slice(1)}</ToastTitle>
          <ToastDescription>This notification remains visible for documentation.</ToastDescription>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport className="pointer-events-none static mt-4 w-96 max-w-full p-0 sm:w-96" />
    </ToastProvider>
  );
}

export const Success: Story = { render: () => <ToastPreview /> };
export const Error: Story = { render: () => <ToastPreview variant="error" /> };
export const Warning: Story = { render: () => <ToastPreview variant="warning" /> };
export const Info: Story = { render: () => <ToastPreview variant="info" /> };

export const Interactive: Story = {
  render: () => (
    <>
      <Button onClick={() => toast.success({ title: 'Changes saved' })}>Trigger toast</Button>
      <Toaster maxVisible={2} />
    </>
  ),
};

export const Queue: Story = {
  render: () => (
    <>
      <Button
        onClick={() => {
          toast.info({ title: 'First notification' });
          toast.warning({ title: 'Second notification' });
          toast.error({ title: 'Queued notification' });
        }}
      >
        Add three notifications
      </Button>
      <Toaster maxVisible={2} />
    </>
  ),
};

export const DarkMode: Story = {
  decorators: [withDarkTheme],
  render: () => <ToastPreview variant="info" />,
};
