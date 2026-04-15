import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Button } from '@/components/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';

function TestDialog() {
  return (
    <>
      <Dialog>
        <DialogTrigger>Open preferences</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preferences</DialogTitle>
            <DialogDescription>Choose how this workspace behaves.</DialogDescription>
          </DialogHeader>
          <input aria-label="Workspace name" defaultValue="Afterhours" />
          <DialogFooter>
            <Button>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <button type="button">Outside action</button>
    </>
  );
}

describe('Dialog', () => {
  it('opens with accessible modal semantics and an overlay', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByRole('button', { name: 'Open preferences' }));

    const dialog = screen.getByRole('dialog', { name: 'Preferences' });
    expect(dialog).toHaveAttribute('aria-describedby');
    expect(screen.getByText('Choose how this workspace behaves.')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="dialog-overlay"]')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('moves focus into the dialog, traps keyboard navigation, and restores it on Escape', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    const trigger = screen.getByRole('button', { name: 'Open preferences' });
    await user.click(trigger);

    const field = screen.getByRole('textbox', { name: 'Workspace name' });
    expect(field).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    await user.tab();
    expect(field).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes from the close control without reaching background actions', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByRole('button', { name: 'Open preferences' }));
    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Outside action' })).toBeInTheDocument();
  });
});
