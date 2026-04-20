import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/button';
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/tooltip';
import { withDarkTheme } from '../../.storybook/decorators';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Tooltip uses Radix UI for hover/focus triggers, configurable delay, collision-aware positioning (`side` / `align`), portal rendering, and keyboard dismissal (Escape). Wrap tooltips in `TooltipProvider`. Keep content non-interactive for accessibility.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

function BasicTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="secondary">Hover or focus</Button>
      </TooltipTrigger>
      <TooltipContent>
        Add to library
        <TooltipArrow />
      </TooltipContent>
    </Tooltip>
  );
}

export const Default: Story = {
  render: () => <BasicTooltip />,
};

export const Positions: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-8 p-16">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="secondary">{side}</Button>
          </TooltipTrigger>
          <TooltipContent side={side}>
            Positioned {side}
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

export const Alignment: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-8 p-16">
      {(['start', 'center', 'end'] as const).map((align) => (
        <Tooltip key={align}>
          <TooltipTrigger asChild>
            <Button variant="secondary">align={align}</Button>
          </TooltipTrigger>
          <TooltipContent side="top" align={align}>
            Aligned {align}
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

export const CustomDelay: Story = {
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={600}>
        <Story />
      </TooltipProvider>
    ),
  ],
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="secondary">600ms delay</Button>
      </TooltipTrigger>
      <TooltipContent>Opens after a longer hover</TooltipContent>
    </Tooltip>
  ),
};

export const InstantOpen: Story = {
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={0}>
        <Story />
      </TooltipProvider>
    ),
  ],
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button>Instant</Button>
      </TooltipTrigger>
      <TooltipContent>No open delay</TooltipContent>
    </Tooltip>
  ),
};

export const DarkMode: Story = {
  decorators: [withDarkTheme],
  render: () => <BasicTooltip />,
};
