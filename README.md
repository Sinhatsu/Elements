# CompLib

A React 19 component library built with TypeScript, Tailwind CSS, and Storybook. It uses a warm earthy color theme and includes 30 UI components along with full-page dashboard and account settings page examples.

---

### 🎨 Live Storybook

👉 **[Open Live Storybook](https://main--6a689a81f0860b8787e409c8.chromatic.com/)**

---

## Example Pages (`src/stories/`)

- **Admin Dashboard** (`Pages/Admin Dashboard`): Full dashboard layout with a sidebar, metric stat cards, order management table, order creation drawer (`Sheet`), command palette (`⌘K`), and CSV export.
- **Account Settings** (`Pages/Account Settings`): Profile and security settings page with 2FA verification flow, avatar photo upload toggle, timezone select, and notification preferences.

---

## Components

- **Form & Inputs**: Button, Input, Textarea, Checkbox, RadioGroup, Switch, Select, OtpInput, FileUpload
- **Navigation**: Breadcrumb, Pagination, Tabs, Command
- **Overlays**: Dialog, Sheet, Popover, DropdownMenu, Tooltip
- **Data Display**: DataTable, Card, Avatar, Badge, Accordion
- **Feedback & Utilities**: Alert, Toast, Progress, Spinner, Skeleton, Separator

---

## Theme Colors

Colors are configured in `src/styles/theme.css`:

```css
:root {
  --background: #f9f5f1; /* Cream background */
  --primary: #8c5934; /* Terracotta brown */
  --secondary: #d9b382; /* Sand */
  --text: #3c2f2f; /* Espresso text */
  --foreground: #3c2f2f; /* Charcoal */
  --surface-border: #e0d6cc; /* Border color */
  --surface-shadow: #d6c8ba; /* Shadow color */
}
```

---

## Usage

```tsx
import { Button, Input, Card } from 'complib';
import 'complib/styles.css';

export function Example() {
  return (
    <Card className="p-6">
      <Input placeholder="Enter email" />
      <Button>Save</Button>
    </Card>
  );
}
```

---

## Scripts

```bash
# Start Storybook dev server
npm run storybook

# Run test suite
npm run test:run

# Check types
npm run build:types

# Publish to Chromatic
npm run chromatic
```
