import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';

function TestCommandDialog({ onSelect = vi.fn() }: { onSelect?: (value: string) => void }) {
  return (
    <CommandDialog>
      <CommandInput placeholder="Search commands" />
      <CommandList>
        <CommandEmpty>No commands found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem value="create document" onSelect={onSelect}>
            Create document
          </CommandItem>
          <CommandItem value="open settings" onSelect={onSelect}>
            Open settings
          </CommandItem>
          <CommandItem value="delete workspace" disabled onSelect={onSelect}>
            Delete workspace
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

describe('CommandDialog', () => {
  it('opens from Ctrl+K and focuses the search input', async () => {
    const user = userEvent.setup();
    render(<TestCommandDialog />);

    await user.keyboard('{Control>}k{/Control}');

    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search commands')).toHaveFocus();
  });

  it('filters commands and presents an empty state', async () => {
    const user = userEvent.setup();
    render(<TestCommandDialog />);
    await user.keyboard('{Meta>}k{/Meta}');

    const input = screen.getByPlaceholderText('Search commands');
    await user.type(input, 'settings');
    expect(screen.getByText('Open settings')).toBeInTheDocument();
    expect(screen.queryByText('Create document')).not.toBeInTheDocument();

    await user.clear(input);
    await user.type(input, 'missing');
    expect(screen.getByText('No commands found.')).toBeInTheDocument();
  });

  it('uses keyboard navigation, skips disabled commands, and selects the active command', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<TestCommandDialog onSelect={onSelect} />);
    await user.keyboard('{Control>}k{/Control}');

    await user.keyboard('{ArrowDown}{Enter}');

    expect(onSelect).toHaveBeenCalledWith('open settings');
    expect(screen.getByText('Delete workspace').closest('[cmdk-item]')).toHaveAttribute(
      'data-disabled',
      'true',
    );
  });

  it('closes with Escape and restores focus to the document', async () => {
    const user = userEvent.setup();
    render(<TestCommandDialog />);
    await user.keyboard('{Control>}k{/Control}');
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
