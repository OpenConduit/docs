# Settings Contributions

Extensions contribute settings that appear in the **Settings** panel under a dedicated tab. The contribution system shipped in [issue #37](https://github.com/OpenConduit/core/issues/37).

::: tip Extension platform
Full manifest-based registration is planned for [issue #38](https://github.com/OpenConduit/core/issues/38). Until then, register contributions directly using the TypeScript API below.
:::

## Quick Start

```ts
import { settingsRegistry } from '@openconduit/core';

settingsRegistry.register({
  id: 'my-extension',
  label: 'My Extension',
  order: 100,
  sections: [
    {
      title: 'Connection',
      properties: [
        {
          type: 'string',
          key: 'my-extension.apiEndpoint',
          title: 'API Endpoint',
          description: 'The API endpoint to connect to.',
          default: 'https://api.example.com',
          placeholder: 'https://',
          order: 1,
        },
        {
          type: 'boolean',
          key: 'my-extension.enabled',
          title: 'Enabled',
          description: 'Enable or disable the extension.',
          default: true,
          order: 2,
        },
      ],
    },
  ],
});
```

Import this file as a **side-effect** (e.g. `import './my-settings'`) so it runs before `SettingsPanel` first renders.

## `SettingsContribution`

```ts
interface SettingsContribution {
  id: string;       // unique identifier, e.g. 'my-extension'
  label: string;    // displayed in the settings sidebar tab
  order: number;    // sort position — lower numbers appear first
  sections: SettingsSection[];
}
```

## `SettingsSection`

```ts
interface SettingsSection {
  title: string;
  description?: string;  // subtext shown below the section heading
  properties: SettingsProperty[];
}
```

## Property Types

All property types share a common base:

```ts
interface SettingsPropertyBase {
  key: string;          // dot-notation path into AppSettings (see below)
  title: string;        // label shown above the control
  description?: string; // helper text shown below the control
  default?: string | number | boolean;
  order?: number;       // sort position within the section
}
```

### `string`

Renders a text input. Use `enum` for a select dropdown, `sensitive` for a password field, `multiline` for a textarea.

| Field | Type | Description |
|---|---|---|
| `enum` | `string[]` | Restricts to a fixed set of values |
| `enumDescriptions` | `string[]` | Labels shown alongside each `enum` value (order must match) |
| `placeholder` | `string` | Input placeholder text |
| `sensitive` | `boolean` | Masks the value — renders as `type="password"` |
| `multiline` | `boolean` | Renders as a `<textarea>` |

### `number`

Renders a number input with optional range constraints.

| Field | Type | Description |
|---|---|---|
| `minimum` | `number` | Minimum allowed value |
| `maximum` | `number` | Maximum allowed value |
| `step` | `number` | Step increment |

### `boolean`

Renders a card-style toggle with a **Reset to default** button. No extra fields.

## Key Paths

`key` is a dot-notation path written into `AppSettings`. Both top-level keys (`'theme'`, `'updateChannel'`) and nested keys (`'defaultParameters.temperature'`, `'labs.debugMode'`) are supported.

::: warning Out-of-schema keys
Keys that don't exist in `AppSettings` are written to `settings.json` and round-trip correctly, but TypeScript won't infer their type. Proper type augmentation is planned for #38.
:::

## Ordering

Both `SettingsContribution.order` and `SettingsProperty.order` accept any number. Built-in OpenConduit sections use `10`–`70`. Use `100` or higher to appear after the built-in tabs.

| ID | Label | Order |
|---|---|---|
| `openconduit.general` | General | 10 |
| `openconduit.labs` | Labs | 60 |
| `openconduit.updates` | Updates | 70 |

## `settingsRegistry` API

```ts
import { settingsRegistry } from '@openconduit/core';

settingsRegistry.register(contribution);  // add a contribution
settingsRegistry.unregister(id);          // remove (e.g. on extension unload)
settingsRegistry.get(id);                 // look up by id
settingsRegistry.getAll();               // all contributions, sorted by order
```
