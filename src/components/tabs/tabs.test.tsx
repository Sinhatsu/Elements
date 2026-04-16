import { useState, type ComponentPropsWithoutRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

function BasicTabs(
  props: Omit<ComponentPropsWithoutRef<typeof Tabs>, 'children'> = { defaultValue: 'account' },
) {
  return (
    <Tabs {...props}>
      <TabsList aria-label="Settings">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="billing" disabled>
          Billing
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">Manage your account details.</TabsContent>
      <TabsContent value="password">Change your password.</TabsContent>
      <TabsContent value="billing">Update billing information.</TabsContent>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('renders an accessible tablist with the default panel visible', () => {
    render(<BasicTabs defaultValue="account" />);

    expect(screen.getByRole('tablist', { name: 'Settings' })).toBeInTheDocument();

    const account = screen.getByRole('tab', { name: 'Account' });
    expect(account).toHaveAttribute('aria-selected', 'true');
    expect(account).toHaveAttribute('data-state', 'active');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Manage your account details.');
    expect(screen.queryByText('Change your password.')).not.toBeInTheDocument();
  });

  it('switches panels on trigger click', async () => {
    const user = userEvent.setup();
    render(<BasicTabs defaultValue="account" />);

    await user.click(screen.getByRole('tab', { name: 'Password' }));

    expect(screen.getByRole('tab', { name: 'Password' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Account' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Change your password.');
  });

  it('supports uncontrolled defaultValue', () => {
    render(<BasicTabs defaultValue="password" />);

    expect(screen.getByRole('tab', { name: 'Password' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Change your password.');
  });

  it('supports controlled value and onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    function Controlled() {
      const [value, setValue] = useState('account');
      return (
        <BasicTabs
          value={value}
          onValueChange={(next) => {
            onValueChange(next);
            setValue(next);
          }}
        />
      );
    }

    render(<Controlled />);

    await user.click(screen.getByRole('tab', { name: 'Password' }));
    expect(onValueChange).toHaveBeenCalledWith('password');
    expect(screen.getByRole('tab', { name: 'Password' })).toHaveAttribute('aria-selected', 'true');
  });

  it('does not activate disabled tabs', async () => {
    const user = userEvent.setup();
    render(<BasicTabs defaultValue="account" />);

    const billing = screen.getByRole('tab', { name: 'Billing' });
    expect(billing).toBeDisabled();
    await user.click(billing);

    expect(billing).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tab', { name: 'Account' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.queryByText('Update billing information.')).not.toBeInTheDocument();
  });

  it('supports horizontal keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<BasicTabs defaultValue="account" orientation="horizontal" />);

    const account = screen.getByRole('tab', { name: 'Account' });
    const password = screen.getByRole('tab', { name: 'Password' });

    account.focus();
    expect(account).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(password).toHaveFocus();
    expect(password).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{Home}');
    expect(account).toHaveFocus();

    await user.keyboard('{End}');
    expect(password).toHaveFocus();
  });

  it('supports vertical keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<BasicTabs defaultValue="account" orientation="vertical" />);

    const account = screen.getByRole('tab', { name: 'Account' });
    const password = screen.getByRole('tab', { name: 'Password' });

    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');

    account.focus();
    await user.keyboard('{ArrowDown}');
    expect(password).toHaveFocus();
    expect(password).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{ArrowUp}');
    expect(account).toHaveFocus();
  });

  it('exposes stable slot markers for styling and automation', () => {
    render(<BasicTabs defaultValue="account" />);

    expect(document.querySelector('[data-slot="tabs-list"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="tabs-trigger"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="tabs-content"]')).toBeInTheDocument();
  });
});
