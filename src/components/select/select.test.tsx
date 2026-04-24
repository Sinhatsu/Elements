import { createRef, useState, type ComponentPropsWithoutRef } from 'react';

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select';

beforeAll(() => {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  vi.stubGlobal('ResizeObserver', ResizeObserverMock);

  // Radix Select uses pointer capture APIs not implemented in jsdom.
  Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
    configurable: true,
    value: () => false,
  });
  Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
    configurable: true,
    value: () => {},
  });
  Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', {
    configurable: true,
    value: () => {},
  });
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: () => {},
  });
});

afterEach(() => {
  document.querySelectorAll('[data-testid="select-portal-root"]').forEach((node) => node.remove());
});

function BasicSelect({
  contentProps,
  triggerProps,
  ...selectProps
}: ComponentPropsWithoutRef<typeof Select> & {
  contentProps?: ComponentPropsWithoutRef<typeof SelectContent>;
  triggerProps?: ComponentPropsWithoutRef<typeof SelectTrigger>;
}) {
  return (
    <Select {...selectProps}>
      <SelectTrigger aria-label="Fruit" {...triggerProps}>
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent {...contentProps}>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry" disabled>
          Blueberry
        </SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
      </SelectContent>
    </Select>
  );
}

describe('Select', () => {
  it('renders a combobox with placeholder and opens a listbox', async () => {
    const user = userEvent.setup();
    render(<BasicSelect />);

    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveTextContent('Select a fruit');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await user.click(trigger);

    const listbox = await screen.findByRole('listbox');
    expect(listbox).toHaveAttribute('data-slot', 'select-content');
    expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
    expect(document.querySelector('[data-slot="select-trigger"]')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('supports uncontrolled defaultValue', () => {
    render(<BasicSelect defaultValue="banana" />);

    expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveTextContent('Banana');
  });

  it('supports controlled value and onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    function Controlled() {
      const [value, setValue] = useState('apple');
      return (
        <BasicSelect
          value={value}
          onValueChange={(next) => {
            onValueChange(next);
            setValue(next);
          }}
        />
      );
    }

    render(<Controlled />);

    expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveTextContent('Apple');

    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    await user.click(await screen.findByRole('option', { name: 'Grapes' }));

    expect(onValueChange).toHaveBeenCalledWith('grapes');
    expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveTextContent('Grapes');
  });

  it('closes on Escape and restores focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<BasicSelect />);

    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    await user.click(trigger);
    await screen.findByRole('listbox');

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it('supports keyboard navigation and selection', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<BasicSelect onValueChange={onValueChange} />);

    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    trigger.focus();
    await user.keyboard('{Enter}');
    await screen.findByRole('listbox');

    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(onValueChange).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  it('does not select disabled options', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<BasicSelect onValueChange={onValueChange} />);

    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    const disabled = await screen.findByRole('option', { name: 'Blueberry' });
    expect(disabled).toHaveAttribute('aria-disabled', 'true');

    await user.click(disabled);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('renders option groups with labels and separators', async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <SelectTrigger aria-label="Timezone">
          <SelectValue placeholder="Select a timezone" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>North America</SelectLabel>
            <SelectItem value="est">Eastern</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Europe</SelectLabel>
            <SelectItem value="gmt">GMT</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>,
    );

    await user.click(screen.getByRole('combobox', { name: 'Timezone' }));
    await screen.findByRole('listbox');

    expect(screen.getByText('North America')).toBeInTheDocument();
    expect(screen.getByText('Europe')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="select-separator"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="select-group"]')).toBeInTheDocument();
  });

  it('renders content in a portal by default', async () => {
    const user = userEvent.setup();
    const { container } = render(<BasicSelect />);

    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    const listbox = await screen.findByRole('listbox');

    expect(container.contains(listbox)).toBe(false);
    expect(document.body.contains(listbox)).toBe(true);
  });

  it('supports a custom portal container', async () => {
    const user = userEvent.setup();
    const portalRoot = document.createElement('div');
    portalRoot.setAttribute('data-testid', 'select-portal-root');
    document.body.appendChild(portalRoot);

    render(<BasicSelect contentProps={{ container: portalRoot }} />);

    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    expect(within(portalRoot).getByRole('listbox')).toBeInTheDocument();
  });

  it('forwards refs to trigger and content', async () => {
    const user = userEvent.setup();
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();

    render(
      <Select>
        <SelectTrigger ref={triggerRef} aria-label="Fruit">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent ref={contentRef}>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);

    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
    expect(contentRef.current).toHaveAttribute('data-slot', 'select-content');
  });

  it('exposes stable slot markers for styling and automation', async () => {
    const user = userEvent.setup();
    render(<BasicSelect defaultOpen />);

    expect(document.querySelector('[data-slot="select-trigger"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="select-value"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="select-content"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="select-viewport"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="select-item"]')).toBeInTheDocument();

    await user.click(screen.getByRole('option', { name: 'Apple' }));
  });

  it('supports typeahead search by option text', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<BasicSelect onValueChange={onValueChange} />);

    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    trigger.focus();
    await user.keyboard('{Enter}');
    await screen.findByRole('listbox');

    await user.keyboard('g');
    await user.keyboard('{Enter}');

    expect(onValueChange).toHaveBeenCalledWith('grapes');
  });
});
