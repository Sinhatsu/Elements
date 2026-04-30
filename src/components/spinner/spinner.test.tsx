import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Spinner } from './spinner';

describe('Spinner', () => {
  it('renders status role with accessible text', () => {
    render(<Spinner label="Fetching data" />);

    const status = screen.getByRole('status');
    expect(status).toBeInTheDocument();
    expect(screen.getByText('Fetching data')).toBeInTheDocument();
  });

  it('renders svg spinner with data-slot', () => {
    render(<Spinner data-testid="spinner-svg" />);

    const svg = screen.getByTestId('spinner-svg');
    expect(svg).toHaveAttribute('data-slot', 'spinner');
    expect(svg).toHaveClass('animate-spin');
  });

  it('forwards ref correctly', () => {
    const ref = createRef<SVGSVGElement>();
    render(<Spinner ref={ref} />);
    expect(ref.current).toBeInstanceOf(SVGSVGElement);
  });
});
