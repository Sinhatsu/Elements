import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { OtpInput } from './otp-input';

function inputs() {
  return screen.getAllByRole('textbox');
}

describe('OtpInput', () => {
  it('supports uncontrolled entry, auto-advance, and completion', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<OtpInput length={4} autoFocus onComplete={onComplete} />);
    expect(inputs()[0]).toHaveFocus();
    await user.type(inputs()[0], '1234');
    expect(
      inputs()
        .map((input) => (input as HTMLInputElement).value)
        .join(''),
    ).toBe('1234');
    expect(onComplete).toHaveBeenCalledWith('1234');
  });

  it('supports controlled values and reports updates', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<OtpInput value="12" length={4} onValueChange={onValueChange} />);
    expect(inputs()[0]).toHaveValue('1');
    expect(inputs()[1]).toHaveValue('2');
    await user.type(inputs()[2], '3');
    expect(onValueChange).toHaveBeenCalledWith('123');
  });

  it('navigates with backspace and arrow keys', async () => {
    const user = userEvent.setup();
    render(<OtpInput defaultValue="12" length={4} />);
    inputs()[1].focus();
    await user.keyboard('{ArrowLeft}');
    expect(inputs()[0]).toHaveFocus();
    inputs()[2].focus();
    await user.keyboard('{Backspace}');
    expect(inputs()[0]).toHaveValue('1');
    expect(inputs()[1]).toHaveValue('');
    expect(inputs()[1]).toHaveFocus();
  });

  it('distributes a pasted code and filters invalid numeric characters', async () => {
    const user = userEvent.setup();
    render(<OtpInput length={4} />);
    await user.click(inputs()[0]);
    await user.paste('1a2-3 4');
    expect(
      inputs()
        .map((input) => (input as HTMLInputElement).value)
        .join(''),
    ).toBe('1234');
  });

  it('provides labelled, invalid, and disabled fields accessibly', () => {
    render(<OtpInput label="Verification code" error="Code is required." disabled />);
    expect(screen.getByRole('group', { name: 'Verification code' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(inputs()[0]).toHaveAttribute(
      'aria-describedby',
      screen.getByRole('alert').getAttribute('id'),
    );
    expect(inputs()[0]).toBeDisabled();
  });
});
