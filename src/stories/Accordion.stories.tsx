import { useState, type ComponentProps } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/accordion';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Accordion uses Radix UI for WAI-ARIA semantics, keyboard navigation, single/multiple modes, and controlled or uncontrolled open state.',
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
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const faqItems = [
  {
    value: 'shipping',
    title: 'How long does shipping take?',
    content: 'Orders ship within 2–3 business days. Express options are available at checkout.',
  },
  {
    value: 'returns',
    title: 'What is the return policy?',
    content: 'Unused items can be returned within 30 days for a full refund.',
  },
  {
    value: 'support',
    title: 'How do I contact support?',
    content: 'Email support@example.com or use the in-app chat Monday–Friday, 9am–6pm.',
  },
] as const;

type FaqAccordionProps = Omit<ComponentProps<typeof Accordion>, 'children'> & {
  showDisabled?: boolean;
};

function FaqAccordion({ showDisabled = false, ...props }: FaqAccordionProps) {
  const items = (
    <>
      {faqItems.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
      {showDisabled ? (
        <AccordionItem value="enterprise" disabled>
          <AccordionTrigger>Enterprise SLA (contact sales)</AccordionTrigger>
          <AccordionContent>Available on Enterprise plans only.</AccordionContent>
        </AccordionItem>
      ) : null}
    </>
  );

  if (props.type === 'multiple') {
    return <Accordion {...props}>{items}</Accordion>;
  }

  return (
    <Accordion type="single" collapsible {...props}>
      {items}
    </Accordion>
  );
}

export const Single: Story = {
  render: () => <FaqAccordion type="single" defaultValue="shipping" />,
};

export const Multiple: Story = {
  render: () => <FaqAccordion type="multiple" defaultValue={['shipping', 'returns']} />,
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState('returns');

    return (
      <div className="grid gap-3">
        <p className="text-sm text-muted-foreground">
          Open item: <span className="font-medium text-foreground">{value || 'none'}</span>
        </p>
        <FaqAccordion type="single" value={value} onValueChange={setValue} />
      </div>
    );
  },
};

export const DisabledItem: Story = {
  render: () => <FaqAccordion type="single" showDisabled defaultValue="shipping" />,
};
