import { createRef, useState, type ComponentPropsWithoutRef } from 'react';

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { Button } from '@/components/button';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu';

beforeAll(() => {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  vi.stubGlobal('ResizeObserver', ResizeObserverMock);
});

afterEach(() => {
  document.querySelectorAll('[data-testid="dropdown-menu-portal-root"]').forEach((node) => {
    node.remove();
  });
});

function BasicDropdown({
  contentProps,
  ...menuProps
}: ComponentPropsWithoutRef<typeof DropdownMenu> & {
  contentProps?: ComponentPropsWithoutRef<typeof DropdownMenuContent>;
}) {
  return (
    <DropdownMenu {...menuProps}>
      <DropdownMenuTrigger asChild>
        <Button>Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent {...contentProps}>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem disabled>API keys</DropdownMenuItem>
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe('DropdownMenu', () => {
  it('opens with menu semantics and labelled items', async () => {
    const user = userEvent.setup();
    render(<BasicDropdown />);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    const menu = await screen.findByRole('menu');
    expect(menu).toHaveAttribute('data-slot', 'dropdown-menu-content');
    expect(screen.getByRole('menuitem', { name: 'Profile' })).toBeInTheDocument();
    expect(document.querySelector('[data-slot="dropdown-menu-trigger"]')).toHaveAttribute(
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
        <BasicDropdown
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
        />
      );
    }

    render(<Controlled />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(await screen.findByRole('menu')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('closes on Escape and restores focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<BasicDropdown />);

    const trigger = screen.getByRole('button', { name: 'Open menu' });
    await user.click(trigger);
    await screen.findByRole('menu');

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it('supports keyboard navigation between items', async () => {
    const user = userEvent.setup();
    render(<BasicDropdown />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await screen.findByRole('menu');

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Profile' })).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Log out' })).toHaveFocus();

    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Profile' })).toHaveFocus();
  });

  it('does not activate disabled items', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem disabled onSelect={onSelect}>
            API keys
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    const item = await screen.findByRole('menuitem', { name: 'API keys' });
    expect(item).toHaveAttribute('data-disabled');

    await user.click(item);
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('toggles checkbox items', async () => {
    const user = userEvent.setup();

    function CheckboxMenu() {
      const [checked, setChecked] = useState(false);
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Open menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked={checked} onCheckedChange={setChecked}>
              Status Bar
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    render(<CheckboxMenu />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    const item = await screen.findByRole('menuitemcheckbox', { name: 'Status Bar' });
    expect(item).toHaveAttribute('aria-checked', 'false');

    await user.click(item);
    expect(item).toHaveAttribute('aria-checked', 'true');
  });

  it('selects radio items within a group', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    function RadioMenu() {
      const [value, setValue] = useState('bottom');
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Open menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={value}
              onValueChange={(next) => {
                onValueChange(next);
                setValue(next);
              }}
            >
              <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    render(<RadioMenu />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(await screen.findByRole('menuitemradio', { name: 'Bottom' })).toHaveAttribute(
      'aria-checked',
      'true',
    );

    await user.click(screen.getByRole('menuitemradio', { name: 'Top' }));
    expect(onValueChange).toHaveBeenCalledWith('top');

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(await screen.findByRole('menuitemradio', { name: 'Top' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('menuitemradio', { name: 'Bottom' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });

  it('opens nested submenus via pointer and keyboard', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Email link</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    const subTrigger = await screen.findByRole('menuitem', { name: 'Share' });

    await user.hover(subTrigger);
    expect(await screen.findByRole('menuitem', { name: 'Email link' })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await screen.findByRole('menuitem', { name: 'Share' });
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowRight}');
    expect(await screen.findByRole('menuitem', { name: 'Email link' })).toBeInTheDocument();
  });

  it('renders content in a portal by default', async () => {
    const user = userEvent.setup();
    const { container } = render(<BasicDropdown />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    const menu = await screen.findByRole('menu');

    expect(container.contains(menu)).toBe(false);
    expect(document.body.contains(menu)).toBe(true);
  });

  it('supports a custom portal container', async () => {
    const user = userEvent.setup();
    const portalRoot = document.createElement('div');
    portalRoot.setAttribute('data-testid', 'dropdown-menu-portal-root');
    document.body.appendChild(portalRoot);

    render(<BasicDropdown contentProps={{ container: portalRoot }} />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(within(portalRoot).getByRole('menu')).toBeInTheDocument();
  });

  it('forwards refs to trigger and content', async () => {
    const user = userEvent.setup();
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger ref={triggerRef}>Ref trigger</DropdownMenuTrigger>
        <DropdownMenuContent ref={contentRef}>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);

    await user.click(screen.getByRole('button', { name: 'Ref trigger' }));
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
    expect(contentRef.current).toHaveAttribute('data-slot', 'dropdown-menu-content');
  });

  it('exposes stable slot markers for styling and automation', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger asChild>
          <Button>Open menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuCheckboxItem checked>Status</DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup value="a">
            <DropdownMenuRadioItem value="a">Option A</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Nested</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    expect(document.querySelector('[data-slot="dropdown-menu-trigger"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="dropdown-menu-content"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="dropdown-menu-label"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="dropdown-menu-separator"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="dropdown-menu-item"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="dropdown-menu-checkbox-item"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="dropdown-menu-radio-item"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="dropdown-menu-sub-trigger"]')).toBeInTheDocument();

    await user.hover(screen.getByRole('menuitem', { name: 'More' }));
    expect(await screen.findByRole('menuitem', { name: 'Nested' })).toBeInTheDocument();
    expect(document.querySelector('[data-slot="dropdown-menu-sub-content"]')).toBeInTheDocument();
  });
});
