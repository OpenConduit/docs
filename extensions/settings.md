# Settings Contributions

::: warning Coming Soon
Tracked in [issue #37](https://github.com/OpenConduit/core/issues/37) (schema-driven UI) and [issue #38](https://github.com/OpenConduit/core/issues/38) (extension platform).
:::

Extensions can contribute settings that appear in the **Settings panel** under a tab named after the extension.

## Manifest Schema

```json
{
  "contributes": {
    "configuration": {
      "title": "My Extension",
      "properties": {
        "my-extension.apiEndpoint": {
          "type": "string",
          "default": "https://api.example.com",
          "description": "The API endpoint to connect to."
        },
        "my-extension.enabled": {
          "type": "boolean",
          "default": true,
          "description": "Enable or disable the extension."
        }
      }
    }
  }
}
```

## Supported Property Types

| Type | UI Control |
|---|---|
| `string` | Text input |
| `boolean` | Toggle |
| `number` | Number input |
| `string` (with `enum`) | Select dropdown |

## Reading Settings

```ts
// From within your extension
const value = openconduit.settings.get('my-extension.apiEndpoint');
```
