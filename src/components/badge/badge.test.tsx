import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from './badge';

describe('Badge', () => {
  it('renders its content with default styling', () => {
    render(<Badge>New</Badge>);

    const badge = screen.getByText('New');
    expect(badge.tagName).toBe('SPAN');
    expect(badge).toHaveClass('bg-primary', 'rounded-full', 'px-2.5');
  });

  it('supports variants and sizes', () => {
    render(
      <Badge variant="warning" size="lg">
        Pending
      </Badge>,
    );

    expect(screen.getByText('Pending')).toHaveClass('bg-amber-500', 'text-sm');
  });

  it('renders icons as decorative content', () => {
    render(<Badge icon={<svg data-testid="check-icon" />}>Verified</Badge>);

    expect(screen.getByTestId('check-icon').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Verified')).toBeInTheDocument();
  });

  it('supports icons at the end of a badge', () => {
    render(
      <Badge icon={<svg data-testid="arrow-icon" />} iconPosition="end">
        More
      </Badge>,
    );

    const badge = screen.getByText('More');
    expect(badge.lastElementChild).toContainElement(screen.getByTestId('arrow-icon'));
  });

  it('passes accessible labels to the badge', () => {
    render(<Badge aria-label="Three unread notifications">3</Badge>);

    expect(screen.getByLabelText('Three unread notifications')).toHaveTextContent('3');
  });
});
