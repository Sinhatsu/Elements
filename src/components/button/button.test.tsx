import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './button';

describe('Button', () => {
  it('renders a button with the default type', () => {
    render(<Button>Save changes</Button>);

    const button = screen.getByRole('button', { name: 'Save changes' });
    expect(button).toHaveAttribute('type', 'button');
  });

  it('supports variants and sizes', () => {
    render(
      <Button variant="destructive" size="lg">
        Delete
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled();
  });

  it('renders decorative icons alongside the accessible label', () => {
    render(<Button leftIcon={<svg data-testid="icon" />}>Continue</Button>);

    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
  });

  it('is disabled and busy while loading', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button loading loadingText="Saving" onClick={onClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Saving' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('announces a loading action when no visible loading text is provided', () => {
    render(<Button loading>Save</Button>);

    expect(screen.getByRole('button', { name: 'Loading' })).toHaveAttribute('aria-busy', 'true');
  });

  it('is reachable with keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<Button>Continue</Button>);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus();
  });

  it('prevents interaction when disabled', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button disabled onClick={onClick}>
        Submit
      </Button>,
    );

    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
