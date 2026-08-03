import { useState, type ComponentProps } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Tabs uses Radix UI for WAI-ARIA tab semantics, keyboard navigation, horizontal/vertical orientation, and controlled or uncontrolled selection.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[min(100vw-2rem,28rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

function AccountTabs({
  showDisabled = false,
  ...props
}: Omit<ComponentProps<typeof Tabs>, 'children'> & { showDisabled?: boolean }) {
  return (
    <Tabs {...props}>
      <TabsList aria-label="Account sections">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        {showDisabled ? (
          <TabsTrigger value="billing" disabled>
            Billing
          </TabsTrigger>
        ) : null}
      </TabsList>
      <TabsContent value="profile">Update the name and photo your teammates see.</TabsContent>
      <TabsContent value="security">Manage password, sessions, and two-factor auth.</TabsContent>
      <TabsContent value="notifications">Choose which alerts reach your inbox.</TabsContent>
      {showDisabled ? (
        <TabsContent value="billing">Billing is available on paid plans.</TabsContent>
      ) : null}
    </Tabs>
  );
}

export const Horizontal: Story = {
  render: () => <AccountTabs defaultValue="profile" orientation="horizontal" />,
};

export const Vertical: Story = {
  decorators: [
    (Story) => (
      <div className="w-[min(100vw-2rem,36rem)]">
        <Story />
      </div>
    ),
  ],
  render: () => <AccountTabs defaultValue="profile" orientation="vertical" />,
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState('security');

    return (
      <div className="grid gap-3">
        <p className="text-sm text-foreground">
          Active tab: <span className="font-medium">{value}</span>
        </p>
        <AccountTabs value={value} onValueChange={setValue} />
      </div>
    );
  },
};

export const DisabledTab: Story = {
  render: () => <AccountTabs defaultValue="profile" showDisabled />,
};
