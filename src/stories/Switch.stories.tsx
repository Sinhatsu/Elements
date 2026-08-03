import type { Meta, StoryObj } from '@storybook/react-vite';

import { Switch } from '@/components/switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Switch toggles the state of a single setting on or off. Built with Radix UI Switch primitive.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <label htmlFor="airplane-mode" className="text-sm font-medium text-foreground cursor-pointer">
        Airplane Mode
      </label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="notifications" defaultChecked />
      <label htmlFor="notifications" className="text-sm font-medium text-foreground cursor-pointer">
        Notifications
      </label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="disabled-switch" disabled />
      <label
        htmlFor="disabled-switch"
        className="text-sm font-medium text-muted-foreground cursor-not-allowed"
      >
        Disabled Toggle
      </label>
    </div>
  ),
};
