# Extension Platform

::: warning Coming Soon
The extension platform is planned for a future release. This section documents the design so contributors can build toward it. Track progress in [issue #38](https://github.com/OpenConduit/core/issues/38).
:::

## Overview

OpenConduit will support a first-class extension system modeled loosely after VS Code's contribution model. Extensions declare what they provide via a manifest — the runtime activates them and routes their contributions into the appropriate registries.

## What Extensions Will Be Able to Do

- Register **commands** (show in command palette, bind keyboard shortcuts)
- Contribute **settings** (schema-driven UI in the Settings panel)
- Add **notification** messages (via `addNotification` over IPC)
- Contribute **themes** (CSS token overrides)
- Add **sidebar panels** and **bottom panel tabs**
- Register **routing profiles** and **personas**

## Groundwork Already in Place

Several features already anticipate #38:

| Feature | How it maps to #38 |
|---|---|
| `useKeyboardShortcuts` hook | Each binding becomes a `CommandContribution` |
| `addNotification` in `uiStore` | Serializable payload, `source` field for extension id |
| `AppNotification.source` | Identifies which extension fired the notification |
| `extraTabs` prop on `SettingsPanel` | Extensions can inject settings tabs today |

See [Extension Manifest](/extensions/manifest), [Commands](/extensions/commands), and [Settings](/extensions/settings) for the planned API design.
