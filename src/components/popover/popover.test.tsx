import { createRef, useState, type ComponentPropsWithoutRef } from 'react';

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { Button } from '@/components/button';

import { Popover, PopoverArrow, PopoverClose, PopoverContent, PopoverTrigger } from './popover';

beforeAll(() => {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  vi.stubGlobal('ResizeObserver', ResizeObserverMock);
});

afterEach(() => {
  document.querySelectorAll('[data-testid="popover-portal-root"]').forEach((node) => node.remove());
});

function TestPopover({
  contentProps,
  ...popoverProps
}: ComponentPropsWithoutRef<typeof Popover> & {
  contentProps?: ComponentPropsWithoutRef<typeof PopoverContent>;
}) {
  return (
    <>
      <Popover {...popoverProps}>
        <PopoverTrigger asChild>
          <Button>Open popover</Button>
        </PopoverTrigger>
        <PopoverContent {...contentProps}>
          <p>Popover body</p>
          <input aria-label="Layer name" defaultValue="Frame" />
          <PopoverClose asChild>
            <Button variant="secondary">Dismiss</Button>
          </PopoverClose>
          <PopoverArrow />
        </PopoverContent>
      </Popover>
      <button type="button">Outside action</button>
    </>
  );
}

describe('Popover', () => {
  it('opens on trigger click with accessible dialog semantics when modal', async () => {
    const user = userEvent.setup();
    render(<TestPopover modal contentProps={{ 'aria-label': 'Layer settings' }} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Open popover' }));

    const dialog = await screen.findByRole('dialog', { name: 'Layer settings' });
    expect(dialog).toHaveAttribute('data-slot', 'popover-content');
    expect(screen.getByText('Popover body')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="popover-trigger"]')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('supports uncontrolled defaultOpen', () => {
    render(<TestPopover defaultOpen />);

    expect(screen.getByText('Popover body')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open popover' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('supports controlled open and onOpenChange', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <TestPopover
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
        />
      );
    }

    render(<Controlled />);

    await user.click(screen.getByRole('button', { name: 'Open popover' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByText('Popover body')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
    await waitFor(() => {
      expect(screen.queryByText('Popover body')).not.toBeInTheDocument();
    });
  });

  it('closes on Escape and restores focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<TestPopover />);

    const trigger = screen.getByRole('button', { name: 'Open popover' });
    await user.click(trigger);

    expect(screen.getByText('Popover body')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByText('Popover body')).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it('closes on outside click', async () => {
    const user = userEvent.setup();
    render(<TestPopover />);

    await user.click(screen.getByRole('button', { name: 'Open popover' }));
    expect(screen.getByText('Popover body')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Outside action' }));
    await waitFor(() => {
      expect(screen.queryByText('Popover body')).not.toBeInTheDocument();
    });
  });

  it('closes from PopoverClose', async () => {
    const user = userEvent.setup();
    render(<TestPopover />);

    await user.click(screen.getByRole('button', { name: 'Open popover' }));
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));

    await waitFor(() => {
      expect(screen.queryByText('Popover body')).not.toBeInTheDocument();
    });
  });

  it('traps focus when modal', async () => {
    const user = userEvent.setup();
    render(<TestPopover modal contentProps={{ 'aria-label': 'Layer settings' }} />);

    await user.click(screen.getByRole('button', { name: 'Open popover' }));

    const field = screen.getByRole('textbox', { name: 'Layer name' });
    expect(field).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Dismiss' })).toHaveFocus();
    await user.tab();
    expect(field).toHaveFocus();
  });

  it('applies side and align for positioning', async () => {
    const user = userEvent.setup();
    render(<TestPopover contentProps={{ side: 'left', align: 'start' }} />);

    await user.click(screen.getByRole('button', { name: 'Open popover' }));

    const content = document.querySelector('[data-slot="popover-content"]');
    expect(content).toHaveAttribute('data-side', 'left');
    expect(content).toHaveAttribute('data-align', 'start');
  });

  it('renders content in a portal by default', async () => {
    const user = userEvent.setup();
    const { container } = render(<TestPopover />);

    await user.click(screen.getByRole('button', { name: 'Open popover' }));
    const content = document.querySelector('[data-slot="popover-content"]');

    expect(content).not.toBeNull();
    expect(container.contains(content)).toBe(false);
    expect(document.body.contains(content)).toBe(true);
  });

  it('supports a custom portal container', async () => {
    const user = userEvent.setup();
    const portalRoot = document.createElement('div');
    portalRoot.setAttribute('data-testid', 'popover-portal-root');
    document.body.appendChild(portalRoot);

    render(<TestPopover contentProps={{ container: portalRoot }} />);

    await user.click(screen.getByRole('button', { name: 'Open popover' }));
    expect(within(portalRoot).getByText('Popover body')).toBeInTheDocument();
  });

  it('forwards refs to trigger and content', async () => {
    const user = userEvent.setup();
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();

    render(
      <Popover>
        <PopoverTrigger ref={triggerRef}>Ref trigger</PopoverTrigger>
        <PopoverContent ref={contentRef}>Ref content</PopoverContent>
      </Popover>,
    );

    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);

    await user.click(screen.getByRole('button', { name: 'Ref trigger' }));
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
    expect(contentRef.current).toHaveAttribute('data-slot', 'popover-content');
  });

  it('exposes stable slot markers for styling and automation', async () => {
    const user = userEvent.setup();
    render(<TestPopover defaultOpen />);

    expect(document.querySelector('[data-slot="popover-trigger"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="popover-content"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="popover-close"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="popover-arrow"]')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
  });
});
