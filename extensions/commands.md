# Commands

::: warning Coming Soon
Tracked in [issue #38](https://github.com/OpenConduit/core/issues/38).
:::

Commands are the core unit of the extension platform. A command has an `id`, a `label` shown in the command palette, and an optional `keybinding`.

## Manifest Schema

```json
{
  "contributes": {
    "commands": [
      {
        "id": "my-extension.helloWorld",
        "label": "Hello World",
        "keybinding": "cmd+shift+h"
      }
    ]
  }
}
```

## Current Built-in Commands

The following built-in commands already exist in `useKeyboardShortcuts` and will migrate to the command registry when #38 ships:

| ID (planned) | Label | Keybinding |
|---|---|---|
| `core.openCommandPalette` | Open Command Palette | `⌘K` |
| `core.openSettings` | Open Settings | `⌘,` |
| `core.newConversation` | New Conversation | `⌘T` |
| `core.closeTab` | Close Tab | `⌘W` |
