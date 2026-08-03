import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Alert displays a prominent callout message for user notifications or warnings.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert className="max-w-md">
      <Info className="size-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>You can add components to your app using the cli.</AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="max-w-md">
      <AlertCircle className="size-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  render: () => (
    <Alert variant="success" className="max-w-md">
      <CheckCircle2 className="size-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>Your changes have been saved successfully.</AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  render: () => (
    <Alert variant="warning" className="max-w-md">
      <AlertTriangle className="size-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>Your storage limit is almost reached.</AlertDescription>
    </Alert>
  ),
};
