import { useState, type ComponentPropsWithoutRef } from 'react';

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';

function SingleAccordion(
  props: Omit<ComponentPropsWithoutRef<typeof Accordion>, 'type' | 'children'> = {},
) {
  return (
    <Accordion type="single" collapsible {...props}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Shipping</AccordionTrigger>
        <AccordionContent>Ships in 2–3 business days.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Returns</AccordionTrigger>
        <AccordionContent>Free returns within 30 days.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3" disabled>
        <AccordionTrigger>Warranty</AccordionTrigger>
        <AccordionContent>Covered for one year.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe('Accordion', () => {
  it('renders accessible triggers and keeps panels closed by default', () => {
    render(<SingleAccordion />);

    const shipping = screen.getByRole('button', { name: 'Shipping' });
    expect(shipping).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Ships in 2–3 business days.')).not.toBeInTheDocument();
  });

  it('opens and closes a single collapsible item', async () => {
    const user = userEvent.setup();
    render(<SingleAccordion />);

    const shipping = screen.getByRole('button', { name: 'Shipping' });
    await user.click(shipping);

    expect(shipping).toHaveAttribute('aria-expanded', 'true');
    expect(shipping).toHaveAttribute('aria-controls');
    const region = screen.getByRole('region', { name: 'Shipping' });
    expect(within(region).getByText('Ships in 2–3 business days.')).toBeInTheDocument();

    await user.click(shipping);
    expect(shipping).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Ships in 2–3 business days.')).not.toBeInTheDocument();
  });

  it('allows only one open panel in single mode', async () => {
    const user = userEvent.setup();
    render(<SingleAccordion />);

    await user.click(screen.getByRole('button', { name: 'Shipping' }));
    await user.click(screen.getByRole('button', { name: 'Returns' }));

    expect(screen.getByRole('button', { name: 'Shipping' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByRole('button', { name: 'Returns' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByText('Free returns within 30 days.')).toBeInTheDocument();
    expect(screen.queryByText('Ships in 2–3 business days.')).not.toBeInTheDocument();
  });

  it('allows multiple open panels in multiple mode', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>Shipping</AccordionTrigger>
          <AccordionContent>Ships in 2–3 business days.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Returns</AccordionTrigger>
          <AccordionContent>Free returns within 30 days.</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    await user.click(screen.getByRole('button', { name: 'Shipping' }));
    await user.click(screen.getByRole('button', { name: 'Returns' }));

    expect(screen.getByRole('button', { name: 'Shipping' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Returns' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByText('Ships in 2–3 business days.')).toBeInTheDocument();
    expect(screen.getByText('Free returns within 30 days.')).toBeInTheDocument();
  });

  it('supports uncontrolled defaultValue', () => {
    render(<SingleAccordion defaultValue="item-2" />);

    expect(screen.getByRole('button', { name: 'Returns' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByText('Free returns within 30 days.')).toBeInTheDocument();
  });

  it('supports controlled value and onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    function Controlled() {
      const [value, setValue] = useState('item-1');
      return (
        <SingleAccordion
          value={value}
          onValueChange={(next) => {
            onValueChange(next);
            setValue(next);
          }}
        />
      );
    }

    render(<Controlled />);

    expect(screen.getByRole('button', { name: 'Shipping' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    await user.click(screen.getByRole('button', { name: 'Returns' }));
    expect(onValueChange).toHaveBeenCalledWith('item-2');
    expect(screen.getByRole('button', { name: 'Returns' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('does not expand disabled items', async () => {
    const user = userEvent.setup();
    render(<SingleAccordion />);

    const warranty = screen.getByRole('button', { name: 'Warranty' });
    expect(warranty).toBeDisabled();
    await user.click(warranty);

    expect(warranty).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Covered for one year.')).not.toBeInTheDocument();
  });

  it('supports keyboard navigation between triggers', async () => {
    const user = userEvent.setup();
    render(<SingleAccordion />);

    const shipping = screen.getByRole('button', { name: 'Shipping' });
    const returns = screen.getByRole('button', { name: 'Returns' });

    shipping.focus();
    expect(shipping).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(returns).toHaveFocus();

    await user.keyboard('{Home}');
    expect(shipping).toHaveFocus();

    await user.keyboard('{End}');
    expect(returns).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(returns).toHaveAttribute('aria-expanded', 'true');
  });

  it('exposes stable slot markers for styling and automation', () => {
    render(<SingleAccordion defaultValue="item-1" />);

    expect(document.querySelector('[data-slot="accordion-item"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="accordion-trigger"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="accordion-content"]')).toBeInTheDocument();
  });
});
