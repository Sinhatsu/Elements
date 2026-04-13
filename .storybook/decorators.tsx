import type { Decorator } from '@storybook/react-vite';

export const withDarkTheme: Decorator = (Story) => (
  <div
    className="dark"
    style={{
      minHeight: '12rem',
      padding: '2rem',
      backgroundColor: 'var(--background)',
      color: 'var(--foreground)',
    }}
  >
    <Story />
  </div>
);
