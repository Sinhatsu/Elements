import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  it('renders pulse animation and aria-hidden', () => {
    render(<Skeleton data-testid="skel" />);
    const skel = screen.getByTestId('skel');

    expect(skel).toBeInTheDocument();
    expect(skel).toHaveAttribute('data-slot', 'skeleton');
    expect(skel).toHaveAttribute('aria-hidden', 'true');
    expect(skel).toHaveClass('animate-pulse');
  });

  it('allows disabling animation', () => {
    render(<Skeleton animate={false} data-testid="skel" />);
    const skel = screen.getByTestId('skel');

    expect(skel).not.toHaveClass('animate-pulse');
  });

  it('forwards ref correctly', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Skeleton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
