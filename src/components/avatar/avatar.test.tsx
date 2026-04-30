import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Avatar, AvatarFallback, AvatarImage } from './avatar';

describe('Avatar', () => {
  it('renders image when src loaded', () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.jpg" alt="User avatar" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );

    const img = screen.getByRole('img', { name: 'User avatar' });
    expect(img).toBeInTheDocument();

    fireEvent.load(img);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders fallback when image fails to load', () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/broken.jpg" alt="User avatar" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );

    const img = screen.getByRole('img', { name: 'User avatar' });
    fireEvent.error(img);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('forwards refs correctly', () => {
    const avatarRef = createRef<HTMLDivElement>();
    const fallbackRef = createRef<HTMLDivElement>();

    render(
      <Avatar ref={avatarRef}>
        <AvatarFallback ref={fallbackRef}>AB</AvatarFallback>
      </Avatar>,
    );

    expect(avatarRef.current).toBeInstanceOf(HTMLDivElement);
    expect(fallbackRef.current).toBeInstanceOf(HTMLDivElement);
  });
});
