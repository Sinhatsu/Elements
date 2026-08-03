import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '@/components/input';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Input supports native controlled and uncontrolled usage. Pair errors with helper text when validation context is needed.',
      },
    },
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

export const WithHelperText: Story = {
  args: {
    helperText: 'We will only use this address for account notifications.',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter your password',
    'aria-label': 'Password',
  },
};
