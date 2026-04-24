import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Toaster } from './toaster';
import { resetToastStore, setToastLimit, toast, TOAST_LIMIT } from './use-toast';

beforeEach(() => {
  resetToastStore();
  setToastLimit(TOAST_LIMIT);
});

afterEach(() => {
  act(() => {
    resetToastStore();
  });
  vi.useRealTimers();
});

describe('Toaster', () => {
  it('renders semantic variant announcements and a manual close control', () => {
    render(<Toaster duration={600_000} />);

    act(() => {
      toast.success({ title: 'Changes saved', description: 'Your profile is up to date.' });
      toast.error({ title: 'Save failed', description: 'Try again in a moment.' });
      toast.warning({ title: 'Storage almost full' });
      toast.info({ title: 'New version available' });
    });

    expect(screen.getByText('Changes saved')).toBeInTheDocument();
    expect(screen.getByText('Save failed')).toBeInTheDocument();
    const closeControls = screen.getAllByRole('button', { name: 'Close' });
    expect(closeControls).toHaveLength(3);
    expect(screen.getByText('Save failed').closest('[data-slot="toast"]')).toHaveAttribute(
      'data-variant',
      'error',
    );

    fireEvent.click(closeControls[0]);
    expect(screen.queryByText('Storage almost full')).not.toBeInTheDocument();
  });

  it('keeps overflow notifications in FIFO order until a visible toast is dismissed', () => {
    vi.useFakeTimers();
    render(<Toaster duration={600_000} />);

    let first: ReturnType<typeof toast>;
    let second: ReturnType<typeof toast>;
    let third: ReturnType<typeof toast>;
    act(() => {
      first = toast({ title: 'First' });
      second = toast({ title: 'Second' });
      third = toast({ title: 'Third' });
      toast({ title: 'Fourth' });
    });

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
    expect(screen.queryByText('Fourth')).not.toBeInTheDocument();

    act(() => {
      first.dismiss();
      second.dismiss();
      third.dismiss();
      vi.advanceTimersByTime(400);
    });

    expect(screen.getByText('Fourth')).toBeInTheDocument();
  });

  it('auto-dismisses notifications and pauses their timer while hovered', () => {
    vi.useFakeTimers();
    render(<Toaster duration={1000} />);

    act(() => {
      toast({ title: 'Temporary notification' });
    });

    const notification = screen.getByText('Temporary notification').closest('[data-slot="toast"]');
    expect(notification).not.toBeNull();

    act(() => {
      fireEvent.pointerMove(notification as HTMLElement);
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('Temporary notification')).toBeInTheDocument();

    act(() => {
      fireEvent.pointerLeave(notification?.closest('[role="region"]') as HTMLElement);
      vi.advanceTimersByTime(1000);
    });
    expect(screen.queryByText('Temporary notification')).not.toBeInTheDocument();
  });
});
