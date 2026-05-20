# Extension Platform

## Overview

OpenConduit has a first-class extension system modeled loosely after VS Code's contribution model. Extensions declare what they provide via a manifest — the runtime activates them and routes their contributions into the appropriate registries.

## What Extensions Can Do Today

- Contribute **sidebar panels** via the ActivityBar (Phase 1 & 2 of [#38](https://github.com/OpenConduit/core/issues/38) — live in `@openconduit/core` v2.0.0+)
- Register **commands** (show in command palette, bind keyboard shortcuts)
- Contribute **settings** (schema-driven UI in the Settings panel)
- Add **bottom panel tabs**
- Add **notification** messages (via `addNotification` over IPC)

## How It Works

1. An extension is a bundled JavaScript file (`dist/index.js`) installed to `userData/extensions/<id>/` alongside a `manifest.json`.
2. On startup (and after a marketplace install) `loadInstalledExtensions()` scans that directory, reads each bundle via the preload bridge, wraps it in a Blob URL, and dynamically `import()`s it.
3. Each bundle calls `window.__openConduit.extensionRegistry.registerExtension(manifest, contributions)` to declare its panels and other contributions.
4. `ActivityBar` and other consumers subscribe to the registry and re-render reactively when a new extension registers.

## Built-in Extensions

First-party features are implemented as built-in extensions registered at module-load time:

| Extension ID | Panel |
|---|---|
| `openconduit.personas` | Personas panel (order 20) |

## Registration APIs in Place

| Feature | Status |
|---|---|
| `extensionRegistry` + `ActivityBarContribution` | ✅ Live — sidebar panel contributions |
| `commandRegistry` + `CommandContribution` | ✅ Live — command palette + keybindings |
| `settingsRegistry` + `SettingsContribution` | ✅ Live — schema-driven settings UI |
| `bottomPanelRegistry` + `BottomPanelTab` | ✅ Live — bottom panel tab registration |
| `addNotification` in `uiStore` | ✅ Live — `AppNotification.source` carries extension id |

See [Extension Manifest](/extensions/manifest), [Activity Bar](/extensions/activity-bar), [Commands](/extensions/commands), [Settings](/extensions/settings), and [Bottom Panel](/extensions/bottom-panel) for the API reference.
