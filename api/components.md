# Components

All components are exported from `@openconduit/core`.

```ts
import { NotificationBell, CommandPalette } from '@openconduit/core';
```

These are the components most likely to be composed by integrators or extended in future. For the full component list see the [source](https://github.com/OpenConduit/core/tree/dev/src/components).

---

## `NotificationBell`

A bell icon button that renders a popover list of `AppNotification` items. Reads from and writes to `uiStore`. Intended for use in a fixed bottom bar (the popover opens **upward**).

```tsx
import { NotificationBell } from '@openconduit/core';

<NotificationBell />
```

No props — all state is from `uiStore`.

**Behaviour:**
- Shows a red badge with the unread count (capped at `9+`)
- Opening the popover automatically calls `markAllRead()`
- Each notification shows a variant-coloured dot, title, optional message, and relative timestamp
- "Clear all" button in the popover header calls `clearNotifications()`
- Click outside closes the popover

**Firing a notification:**
```ts
const { addNotification } = useUiStore();

addNotification({
  title: 'Export complete',
  message: 'Saved to ~/Downloads/chat.md',
  variant: 'success',
});
```

See [`uiStore`](/api/stores#uistore) for the full `addNotification` API and [`AppNotification`](/api/types#appnotification) for the type definition.

---

## `CommandPalette`

A fuzzy-search modal (`⌘K` / `Ctrl+K`) that surfaces conversations, built-in commands, models, and personas. Reads `commandPaletteOpen` from `uiStore`.

```tsx
import { CommandPalette } from '@openconduit/core';

<CommandPalette />
```

No props — open/close is driven by `uiStore.setCommandPaletteOpen(true/false)` or the `⌘K` keyboard shortcut registered in `useKeyboardShortcuts`.

**Result kinds:**

| Kind | What it shows |
|---|---|
| `conversation` | Recent conversations — click to open |
| `command` | Built-in actions (new conversation, open settings, etc.) with optional shortcut hint |
| `model` | Available provider/model combinations — click to set as default |
| `persona` | Saved personas — click to apply to the active conversation |

**Built-in commands surfaced:**

| Label | Action |
|---|---|
| New Conversation | Opens a new conversation tab |
| Open Settings | Opens the settings panel |
| Compare Mode | Switches to side-by-side compare view |
| Close Tab | Closes the active tab |

Custom commands will be registerable via the #38 extension platform (`CommandContribution`). See [Command Contributions](/extensions/commands).
