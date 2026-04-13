import type { Meta, StoryObj } from '@storybook/react-vite';

import { Textarea } from '@/components/textarea';
import { withDarkTheme } from '../../.storybook/decorators';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Textarea provides native controlled and uncontrolled behavior with optional validation and helper text.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    'aria-label': 'Message',
    placeholder: 'Write your message…',
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHelperText: Story = {
  args: {
    helperText: 'Maximum 280 characters',
  },
};

export const Invalid: Story = {
  args: {
    defaultValue: 'Too short',
    error: 'Please provide a more detailed message.',
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: 'This message cannot be changed.',
    disabled: true,
  },
};

export const ResizeOptions: Story = {
  render: () => (
    <div className="grid w-80 gap-4">
      <Textarea aria-label="Vertical resize" resize="vertical" placeholder="Vertical resize" />
      <Textarea aria-label="No resize" resize="none" placeholder="No resize" />
    </div>
  ),
};

export const DarkMode: Story = {
  decorators: [withDarkTheme],
  args: {
    defaultValue: 'A dark-theme message stays readable without changing the component API.',
  },
};
