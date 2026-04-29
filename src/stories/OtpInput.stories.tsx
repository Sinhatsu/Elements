import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { OtpInput } from '@/components/otp-input';

const meta = {
  title: 'Components/OtpInput',
  component: OtpInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof OtpInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { autoFocus: true, helperText: 'Enter the six-digit code we sent you.' },
};
export const Alphanumeric: Story = {
  args: { type: 'alphanumeric', length: 8, label: 'Recovery code' },
};
export const Invalid: Story = { args: { error: 'The verification code is invalid.' } };
export const Disabled: Story = { args: { defaultValue: '123456', disabled: true } };
export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState('');
    return <OtpInput value={value} onValueChange={setValue} helperText={`Code: ${value || '—'}`} />;
  },
};
