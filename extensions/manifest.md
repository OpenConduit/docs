# Extension Manifest

Each installed extension must have a `manifest.json` in its directory under `userData/extensions/<id>/`.

```json
{
  "id": "acme.my-extension",
  "name": "My Extension",
  "version": "1.0.0",
  "description": "Does something useful.",
  "author": "Acme Corp",
  "entryPoint": "/absolute/path/to/userData/extensions/acme.my-extension/dist/index.js"
}
```

The extension's JS bundle then calls `window.__openConduit.extensionRegistry.registerExtension()` to declare its contributions at runtime:

```ts
window.__openConduit.extensionRegistry.registerExtension(
  { id: 'acme.my-extension', name: 'My Extension', version: '1.0.0' },
  {
    activityBarItems: [ /* ... */ ],
  }
);
```

## `manifest.json` Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✅ | Unique extension identifier. Reverse-domain style recommended (`acme.my-ext`). |
| `name` | `string` | ✅ | Display name |
| `version` | `string` | ✅ | SemVer version |
| `entryPoint` | `string` | ✅ | Absolute path to the JS bundle read by the preload bridge |
| `description` | `string` | — | Short description |
| `author` | `string` | — | Author name or org |
| `permissions` | `string[]` | — | Permission strings required by write-access API methods. See [Extension API → Permissions](/extensions/api#permissions). |
| `activate` | `(api: ExtensionAPI) => void \| Promise<void>` | — | Lifecycle hook called once after all contributions are registered. Receives the [Extension API](/extensions/api). |

## `registerExtension` — `ExtensionManifest`

The first argument to `registerExtension` mirrors the on-disk manifest (without `entryPoint`):

```ts
interface ExtensionManifest {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  contributes?: {
    activityBarItems?: ActivityBarContribution[];
    commands?: CommandContribution[];
  };
  permissions?: string[];
  activate?: (api: ExtensionAPI) => void | Promise<void>;
}
```

## Contribution Points

| Key | Docs |
|---|---|
| `activityBarItems` | [Activity Bar Contributions](/extensions/activity-bar) |
| `commands` | [Command Contributions](/extensions/commands) |
| `slashCommands` | [Slash Commands](/extensions/slash-commands) |
| `settingsTab` | [Settings Contributions](/extensions/settings) |
| `bottomPanelTabs` | [Bottom Panel Contributions](/extensions/bottom-panel) |
| `tools` | [Tool Contributions](/extensions/tools) |
| `hooks` | [Extension API](/extensions/api) |

## `activate(api)`

The `activate` function is called once after all contributions are registered. Use it to interact with the host application via the [`ExtensionAPI`](/extensions/api).

```ts
window.__openConduit.extensionRegistry.registerExtension(
  {
    id: 'acme.my-extension',
    name: 'My Extension',
    version: '1.0.0',
    permissions: ['conversations.write'],
    activate(api) {
      api.ui.showNotification({ message: 'My Extension activated!' });
    },
  },
  { /* contributions */ },
);
```

See [Extension API](/extensions/api) for the full method reference.
