# Commands

Commands are the core unit of the extension platform. Every action in OpenConduit — new conversation, open settings, toggle the bottom panel — is a **`CommandContribution`** registered in the `commandRegistry`. Extensions add their own commands the same way built-in commands are registered.

## Quick Start

```ts
import { commandRegistry } from '@openconduit/core';

commandRegistry.register({
  id: 'my-extension.helloWorld',
  label: 'Hello World',
  shortcut: '⌘⇧H',
  keybinding: { key: 'h', mod: true, shift: true },
  action: () => {
    console.log('Hello from my extension!');
  },
});
```

The command immediately appears in the command palette (`>` mode) and its keyboard shortcut is active globally.

To remove the command (e.g. on extension deactivation):

```ts
commandRegistry.unregister('my-extension.helloWorld');
```

## `CommandContribution` Interface

```ts
interface CommandContribution {
  /** Unique namespaced id, e.g. 'my-ext.doThing' */
  id: string;

  /** Label shown in the command palette */
  label: string;

  /** Short human-readable shortcut hint, e.g. '⌘⇧H' */
  shortcut?: string;

  /** Machine-readable keybinding for the global shortcut handler */
  keybinding?: {
    key: string;     // KeyboardEvent.key value, case-insensitive
    mod?: boolean;   // metaKey || ctrlKey
    shift?: boolean;
    alt?: boolean;
  };

  /** Icon rendered in the command palette result row */
  icon?: React.ReactNode;

  /**
   * The handler. Use store.getState() for runtime context —
   * actions run outside React component lifecycle.
   */
  action: () => void;

  /**
   * Optional visibility guard. When present, the command is hidden from
   * the palette and its keybinding is ignored when this returns false.
   */
  when?: () => boolean;
}
```

## `commandRegistry` API

| Method | Description |
|---|---|
| `register(cmd)` | Register a command. Re-registering the same `id` replaces the previous entry. |
| `unregister(id)` | Remove a command by id. |
| `get(id)` | Get a single command by id. Returns `undefined` if not found. |
| `getAll()` | All registered commands in registration order. |
| `execute(id)` | Execute a command by id. Respects the `when` guard — silently no-ops if it returns false. |

## Built-in Commands

All built-in commands are registered in `src/commands/coreCommandContributions.ts` at startup.

| ID | Label | Shortcut |
|---|---|---|
| `core.newConversation` | New conversation | `⌘T` |
| `core.newConversationAlt` | *(alias, hidden from palette)* | `⌘N` |
| `core.toggleSidebar` | Toggle sidebar | — |
| `core.openSettings` | Open settings | `⌘,` |
| `core.openSettingsFile` | Open settings.json | — *(Electron only)* |
| `core.closeTab` | Close tab | `⌘W` |
| `core.compareModels` | Compare models | — |
| `core.toggleBottomPanel` | Toggle bottom panel | `⌘J` |
| `core.openCommandPalette` | Open command palette | `⌘K` *(hidden from palette)* |

## Context-sensitive Commands

Use the `when` guard to show a command only in certain states:

```ts
import { commandRegistry } from '@openconduit/core';
import { useConversationStore } from '@openconduit/core';

commandRegistry.register({
  id: 'my-ext.exportActive',
  label: 'Export active conversation',
  when: () => !!useConversationStore.getState().activeConversationId,
  action: () => {
    const { activeConversationId, conversations } = useConversationStore.getState();
    // ...
  },
});
```

When `when()` returns false the command is hidden from the palette and its keybinding does nothing.

## Writing Actions

Actions run outside React so you **cannot use hooks**. Use Zustand's `getState()` instead:

```ts
// ✅ Correct — getState() works anywhere
import { useUiStore } from '@openconduit/core';

action: () => {
  useUiStore.getState().setShowSettings(true);
},

// ❌ Wrong — hooks only work inside React components
action: () => {
  const { setShowSettings } = useUiStore(); // runtime error
  setShowSettings(true);
},
```
