import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Input } from './input';

describe('Input', () => {
  it('renders with native input attributes', () => {
    render(
      <Input aria-label="Email address" placeholder="you@example.com" required type="email" />,
    );

    const input = screen.getByRole('textbox', { name: 'Email address' });
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('placeholder', 'you@example.com');
  });

  it('forwards the ref to the native input', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} aria-label="Name" />);

    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Name' }));
  });

  it('supports user input and focus', async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Search" />);

    const input = screen.getByRole('textbox', { name: 'Search' });
    await user.click(input);
    await user.type(input, 'design system');

    expect(input).toHaveFocus();
    expect(input).toHaveValue('design system');
  });

  it('marks invalid inputs for assistive technology', () => {
    render(<Input invalid aria-label="Email address" />);

    const input = screen.getByRole('textbox', { name: 'Email address' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveClass('aria-invalid:border-red-500');
  });

  it('prevents interaction while disabled', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Input disabled aria-label="Disabled field" onChange={onChange} />);

    const input = screen.getByRole('textbox', { name: 'Disabled field' });
    expect(input).toBeDisabled();
    await user.type(input, 'cannot change');
    expect(onChange).not.toHaveBeenCalled();
  });
});
