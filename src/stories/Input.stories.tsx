import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from '@/components/input';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    'aria-label': 'Email address',
    placeholder: 'you@example.com',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    defaultValue: 'jane@example.com',
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: 'jane@example.com',
    disabled: true,
  },
};

export const Invalid: Story = {
  args: {
    defaultValue: 'not-an-email',
    invalid: true,
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter your password',
    'aria-label': 'Password',
  },
};
