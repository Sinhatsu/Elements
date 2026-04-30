import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Separator } from './separator';

describe('Separator', () => {
  it('renders a decorative horizontal separator by default', () => {
    render(<Separator data-testid="sep" />);
    const sep = screen.getByTestId('sep');

    expect(sep).toBeInTheDocument();
    expect(sep).toHaveAttribute('data-slot', 'separator');
    expect(sep).toHaveAttribute('role', 'none');
    expect(sep).toHaveClass('h-px w-full');
  });

  it('renders a vertical non-decorative separator with role and orientation', () => {
    render(<Separator orientation="vertical" decorative={false} />);
    const sep = screen.getByRole('separator');

    expect(sep).toHaveAttribute('aria-orientation', 'vertical');
    expect(sep).toHaveClass('h-full w-px');
  });

  it('forwards ref correctly', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Separator ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
