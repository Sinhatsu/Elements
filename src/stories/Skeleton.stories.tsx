import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from '@/components/skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Skeleton is used to render placeholder content while content is loading. It supports pulsing animations by default.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  render: () => <Skeleton className="h-4 w-[250px]" />,
};

export const Avatar: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-16 w-16 rounded-full" />
      <Skeleton className="h-20 w-20 rounded-full" />
    </div>
  ),
};

export const UserProfile: Story = {
  render: () => (
    <div className="flex items-center space-x-4 p-4 border border-border rounded-xl w-[350px]">
      <Skeleton className="h-12 w-12 rounded-full shrink-0" />
      <div className="space-y-2 w-full">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  ),
};

export const CardSkeleton: Story = {
  render: () => (
    <div className="flex flex-col space-y-3 p-4 border border-border rounded-xl w-[300px]">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),
};

export const FeedPost: Story = {
  render: () => (
    <div className="flex flex-col space-y-4 p-5 border border-border rounded-xl w-[400px]">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <div className="space-y-1.5 w-full">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <Skeleton className="h-[200px] w-full rounded-lg" />
      <div className="flex justify-between pt-2">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  ),
};

export const Table: Story = {
  render: () => (
    <div className="w-[500px] border border-border rounded-xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-4 pb-2 border-b border-border">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/4 ms-auto" />
      </div>
      {/* Rows */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-1.5">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-16 ms-auto" />
        </div>
      ))}
    </div>
  ),
};

export const Form: Story = {
  render: () => (
    <div className="w-[350px] border border-border rounded-xl p-5 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-20 w-full rounded-md" />
      </div>
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  ),
};

export const NoAnimation: Story = {
  render: () => (
    <div className="flex flex-col space-y-3 p-4 border border-border rounded-xl w-[300px]">
      <Skeleton animate={false} className="h-[125px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton animate={false} className="h-4 w-[250px]" />
        <Skeleton animate={false} className="h-4 w-[200px]" />
      </div>
    </div>
  ),
};
