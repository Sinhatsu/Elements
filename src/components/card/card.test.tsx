import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

describe('Card', () => {
  it('renders a semantic section with compound content', () => {
    render(
      <Card aria-labelledby="profile-title">
        <CardHeader>
          <CardTitle id="profile-title">Profile</CardTitle>
          <CardDescription>Manage your public information.</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );

    expect(screen.getByRole('region', { name: 'Profile' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Profile', level: 3 })).toBeInTheDocument();
    expect(screen.getByText('Manage your public information.').tagName).toBe('P');
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('forwards native props and accepts class names on each slot', () => {
    render(
      <Card className="max-w-md" data-testid="card">
        <CardHeader className="gap-3">
          <CardTitle className="text-lg">Title</CardTitle>
        </CardHeader>
      </Card>,
    );

    expect(screen.getByTestId('card')).toHaveClass('max-w-md');
    expect(screen.getByRole('heading', { name: 'Title' })).toHaveClass('text-lg');
  });

  it('exposes stable slot markers for styling and automation', () => {
    render(
      <Card>
        <CardContent>Content</CardContent>
      </Card>,
    );

    expect(screen.getByText('Content')).toHaveAttribute('data-slot', 'card-content');
  });
});
