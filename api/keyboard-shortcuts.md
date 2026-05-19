# Keyboard Shortcuts

All global keyboard shortcuts are driven by the [`commandRegistry`](/extensions/commands). Each `CommandContribution` with a `keybinding` field is automatically wired by `useKeyboardShortcuts` — a single hook mounted in `App.tsx`.

To add a shortcut, [register a command](/extensions/commands#quick-start) with a `keybinding`. No changes to `useKeyboardShortcuts` are needed.

## Current Bindings

Built-in commands are defined in `src/commands/coreCommandContributions.ts`:

| Shortcut | Command ID | Action |
|---|---|---|
| `⌘K` / `Ctrl+K` | `core.openCommandPalette` | Open command palette |
| `⌘,` / `Ctrl+,` | `core.openSettings` | Open settings |
| `⌘J` / `Ctrl+J` | `core.toggleBottomPanel` | Toggle bottom panel |
| `⌘T` / `Ctrl+T` | `core.newConversation` | New conversation |
| `⌘N` / `Ctrl+N` | `core.newConversationAlt` | New conversation (alias) |
| `⌘W` / `Ctrl+W` | `core.closeTab` | Close active tab |

Tab bar context menu shortcuts:

| Shortcut | Action |
|---|---|
| `⌘W` | Close tab (shown as hint in context menu) |
| `⌘T` | New conversation (shown as hint in context menu) |

## Adding a Shortcut

Register a command with a `keybinding` in your contribution file:

```ts
import { commandRegistry } from '@openconduit/core';

commandRegistry.register({
  id: 'my-ext.exportConversation',
  label: 'Export conversation',
  shortcut: '⌘⇧E',
  keybinding: { key: 'e', mod: true, shift: true },
  action: () => { /* ... */ },
});
```

The shortcut is active immediately after registration — no restart required.
