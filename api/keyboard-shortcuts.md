# Keyboard Shortcuts

All global keyboard shortcuts are defined in [`useKeyboardShortcuts`](https://github.com/OpenConduit/core/blob/dev/src/hooks/useKeyboardShortcuts.ts) — a single hook mounted in `App.tsx`.

This hook is the precursor to the [#38 command registry](/extensions/commands). Each entry here will become a `CommandContribution` with an `id`, `label`, and `keybinding`.

## Current Bindings

| Shortcut | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Open command palette |
| `⌘,` / `Ctrl+,` | Open settings |
| `⌘J` / `Ctrl+J` | Toggle bottom panel |
| `⌘T` / `Ctrl+T` | New conversation |
| `⌘N` / `Ctrl+N` | New conversation (alias) |
| `⌘W` / `Ctrl+W` | Close active tab |

Tab bar context menu shortcuts:

| Shortcut | Action |
|---|---|
| `⌘W` | Close tab (shown as hint in context menu) |
| `⌘T` | New conversation (shown as hint in context menu) |

## Adding a Shortcut

Add a new `if` block to the `handler` function in `useKeyboardShortcuts.ts`:

```ts
// ⌘⇧E — Export conversation
if (mod && e.shiftKey && e.key === 'e') {
  e.preventDefault();
  // ... action
  return;
}
```

Custom keybinding support (user-configurable bindings) is planned as part of the #38 extension platform.
