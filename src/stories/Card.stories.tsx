import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/card';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Card is a composable surface. Use the slots you need and connect the title with aria-labelledby when the card needs a region label.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-96" aria-labelledby="account-card-title">
      <CardHeader>
        <CardTitle id="account-card-title">Account</CardTitle>
        <CardDescription>Manage your account preferences and security settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Your profile is visible to teammates in this workspace.</p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="secondary">Cancel</Button>
        <Button>Save changes</Button>
      </CardFooter>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent>
        <p className="text-sm">A Card can contain only the content needed for the context.</p>
      </CardContent>
    </Card>
  ),
};
