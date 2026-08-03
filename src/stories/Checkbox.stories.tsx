import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from '@/components/checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Checkbox allows the user to select one or multiple items from a set. Built with Radix UI Checkbox primitive.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none text-foreground cursor-pointer"
      >
        Accept terms and conditions
      </label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="subscribe" defaultChecked />
      <label
        htmlFor="subscribe"
        className="text-sm font-medium leading-none text-foreground cursor-pointer"
      >
        Subscribe to newsletter
      </label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="disabled-check" disabled />
      <label
        htmlFor="disabled-check"
        className="text-sm font-medium leading-none text-muted-foreground cursor-not-allowed"
      >
        Disabled option
      </label>
    </div>
  ),
};
