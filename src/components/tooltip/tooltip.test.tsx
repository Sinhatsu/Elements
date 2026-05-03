import { createRef, useState, type ComponentPropsWithoutRef } from 'react';

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { Button } from '@/components/button';

import { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

beforeAll(() => {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  vi.stubGlobal('ResizeObserver', ResizeObserverMock);
});

afterEach(() => {
  document.querySelectorAll('[data-testid="tooltip-portal-root"]').forEach((node) => node.remove());
});

function TestTooltip({
  providerProps,
  contentProps,
  ...tooltipProps
}: ComponentPropsWithoutRef<typeof Tooltip> & {
  providerProps?: ComponentPropsWithoutRef<typeof TooltipProvider>;
  contentProps?: ComponentPropsWithoutRef<typeof TooltipContent>;
}) {
  return (
    <TooltipProvider delayDuration={0} {...providerProps}>
      <Tooltip {...tooltipProps}>
        <TooltipTrigger asChild>
          <Button>Show tip</Button>
        </TooltipTrigger>
        <TooltipContent {...contentProps}>
          Helpful tip
          <TooltipArrow />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

describe('Tooltip', () => {
  it('opens on hover with tooltip semantics and aria linkage', async () => {
    const user = userEvent.setup();
    render(<TestTooltip />);

    const trigger = screen.getByRole('button', { name: 'Show tip' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await user.hover(trigger);

    const tip = await screen.findByRole('tooltip', { name: 'Helpful tip' });
    expect(tip).toHaveAttribute('data-slot', 'tooltip-content');
    expect(trigger).toHaveAttribute('aria-describedby', tip.id);
  });

  it('opens on focus and dismisses on Escape', async () => {
    const user = userEvent.setup();
    render(<TestTooltip />);

    const trigger = screen.getByRole('button', { name: 'Show tip' });
    await user.tab();

    expect(await screen.findByRole('tooltip', { name: 'Helpful tip' })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it('supports controlled open and onOpenChange', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <TestTooltip
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
        />
      );
    }

    render(<Controlled />);

    await user.hover(screen.getByRole('button', { name: 'Show tip' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
  });

  it('applies side and align for positioning', async () => {
    const user = userEvent.setup();
    render(<TestTooltip contentProps={{ side: 'left', align: 'start' }} />);

    await user.hover(screen.getByRole('button', { name: 'Show tip' }));

    const tip = await screen.findByRole('tooltip');
    expect(tip).toHaveAttribute('data-side', 'left');
    expect(tip).toHaveAttribute('data-align', 'start');
  });

  it('renders content in a portal by default', async () => {
    const user = userEvent.setup();
    const { container } = render(<TestTooltip />);

    await user.hover(screen.getByRole('button', { name: 'Show tip' }));
    const tip = await screen.findByRole('tooltip');

    expect(container.contains(tip)).toBe(false);
    expect(document.body.contains(tip)).toBe(true);
  });

  it('supports a custom portal container', async () => {
    const user = userEvent.setup();
    const portalRoot = document.createElement('div');
    portalRoot.setAttribute('data-testid', 'tooltip-portal-root');
    document.body.appendChild(portalRoot);

    render(<TestTooltip contentProps={{ container: portalRoot }} />);

    await user.hover(screen.getByRole('button', { name: 'Show tip' }));
    const tip = await screen.findByRole('tooltip');

    expect(within(portalRoot).getByRole('tooltip')).toBe(tip);
  });

  it('forwards refs to trigger and content', async () => {
    const user = userEvent.setup();
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();

    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger ref={triggerRef}>Ref trigger</TooltipTrigger>
          <TooltipContent ref={contentRef}>Ref content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);

    await user.hover(screen.getByRole('button', { name: 'Ref trigger' }));
    await screen.findByRole('tooltip');

    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
    expect(contentRef.current).toHaveAttribute('data-slot', 'tooltip-content');
  });

  it('exposes stable slot markers for styling and automation', async () => {
    const user = userEvent.setup();
    render(<TestTooltip />);

    expect(document.querySelector('[data-slot="tooltip-trigger"]')).toBeInTheDocument();

    await user.hover(screen.getByRole('button', { name: 'Show tip' }));
    await screen.findByRole('tooltip');

    expect(document.querySelector('[data-slot="tooltip-content"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="tooltip-arrow"]')).toBeInTheDocument();
  });

  it('hides when focus leaves the trigger', async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Show tip</Button>
          </TooltipTrigger>
          <TooltipContent>Helpful tip</TooltipContent>
        </Tooltip>
        <button type="button">Outside</button>
      </TooltipProvider>,
    );

    await user.tab();
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();

    await user.tab();
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus();
  });
});
