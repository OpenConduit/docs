# Extension Manifest

::: warning Coming Soon
Tracked in [issue #38](https://github.com/OpenConduit/core/issues/38).
:::

Each extension will declare its contributions in an `extension.json` manifest:

```json
{
  "id": "my-extension",
  "name": "My Extension",
  "version": "1.0.0",
  "description": "Does something useful.",
  "main": "dist/index.js",
  "contributes": {
    "commands": [...],
    "configuration": {...},
    "themes": [...],
    "personas": [...],
    "routingProfiles": [...]
  }
}
```

## Fields

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique extension identifier (reverse-domain style recommended) |
| `name` | `string` | Display name |
| `version` | `string` | SemVer version |
| `main` | `string` | Entry point — loaded in a sandboxed context |
| `contributes` | `object` | Contribution points (see below) |

## Contribution Points

Full detail in the individual contribution pages:

- [`commands`](/extensions/commands) — command palette entries + keybindings
- [`configuration`](/extensions/settings) — settings schema + UI
