import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import { Textarea } from './textarea';

describe('Textarea', () => {
  it('supports an uncontrolled default value', async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="Notes" defaultValue="Initial note" />);

    const textarea = screen.getByRole('textbox', { name: 'Notes' });
    expect(textarea).toHaveValue('Initial note');
    await user.type(textarea, ' updated');
    expect(textarea).toHaveValue('Initial note updated');
  });

  it('supports controlled values', async () => {
    const user = userEvent.setup();

    function ControlledTextarea() {
      const [value, setValue] = useState('');
      return (
        <Textarea
          aria-label="Message"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      );
    }

    render(<ControlledTextarea />);
    const textarea = screen.getByRole('textbox', { name: 'Message' });
    await user.type(textarea, 'Hello');
    expect(textarea).toHaveValue('Hello');
  });

  it('connects helper text to the textarea', () => {
    render(<Textarea aria-label="Bio" helperText="Maximum 280 characters" />);

    const textarea = screen.getByRole('textbox', { name: 'Bio' });
    const helper = screen.getByText('Maximum 280 characters');
    expect(textarea).toHaveAttribute('aria-describedby', helper.id);
    expect(helper).toHaveClass('text-muted-foreground');
  });

  it('exposes errors to assistive technology', () => {
    render(<Textarea aria-label="Bio" error="A biography is required" />);

    const textarea = screen.getByRole('textbox', { name: 'Bio' });
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAttribute(
      'aria-describedby',
      screen.getByText('A biography is required').id,
    );
  });

  it('supports disabled and resize states', () => {
    render(<Textarea aria-label="Disabled notes" disabled resize="none" />);

    const textarea = screen.getByRole('textbox', { name: 'Disabled notes' });
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass('resize-none');
  });
});
