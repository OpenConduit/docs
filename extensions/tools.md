# Tool Contributions

Extensions can register **AI tools** that the language model can call during a conversation — just like MCP tools, but implemented entirely in the renderer as plain JavaScript functions. No MCP server, no IPC setup, no changes to the host app required.

---

## Quick start

```ts
// my-extension/index.ts
extensionRegistry.registerExtension(
  {
    id: 'acme.weather',
    name: 'Weather',
    version: '1.0.0',
    activate(api) {
      api.tools.register(
        {
          name: 'get_weather',
          description: 'Returns the current weather for a given city.',
          inputSchema: {
            type: 'object',
            properties: {
              city: { type: 'string', description: 'City name, e.g. "London"' },
            },
            required: ['city'],
          },
        },
        async ({ city }) => {
          const res = await fetch(`https://wttr.in/${String(city)}?format=3`);
          return res.text(); // must return a string
        },
      );
    },
  },
  {},
);
```

That's it. The model can now call `get_weather` and your handler runs in the renderer whenever it does.

---

## `api.tools.register(toolDef, handler)`

Called inside `activate(api)`. Registers a tool definition and its execution handler.

```ts
const unregister = api.tools.register(toolDef, handler);
// call unregister() to remove the tool at any time
```

### `toolDef`

A subset of the `McpTool` type — `serverId` is set automatically to `'__extension__'`.

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | ✅ | Unique tool name. Snake_case recommended (`get_weather`, not `getWeather`). Must be unique across all registered tools. |
| `description` | `string` | ✅ | Plain-English description shown to the model to help it decide when to call the tool. |
| `inputSchema` | `Record<string, unknown>` | ✅ | JSON Schema object describing the tool's input parameters. |

### `handler`

```ts
type ToolHandler = (input: Record<string, unknown>) => string | Promise<string>;
```

- Receives the raw input object the model produced.
- Must return a **string** (or a Promise that resolves to one). The string is sent back to the model as the tool result.
- Throw an `Error` (or return a rejected promise) to report a tool error — the error message is forwarded to the model as an error result and the conversation continues.

---

## Static `contributes.tools`

If your tool definition and handler are fixed at registration time, you can declare them in `contributes.tools` instead of calling `api.tools.register()` in `activate`:

```ts
extensionRegistry.registerExtension(
  { id: 'acme.weather', name: 'Weather', version: '1.0.0' },
  {
    tools: [
      {
        name: 'get_weather',
        description: 'Returns the current weather for a given city.',
        inputSchema: {
          type: 'object',
          properties: { city: { type: 'string' } },
          required: ['city'],
        },
        handler: async ({ city }) => {
          const res = await fetch(`https://wttr.in/${String(city)}?format=3`);
          return res.text();
        },
      },
    ],
  },
);
```

Use `api.tools.register()` in `activate` when you need access to runtime settings (e.g. an API key from `api.settings.get()`).

---

## Listing registered tools

```ts
activate(api) {
  const tools = api.tools.list();
  console.log('My tools:', tools.map((t) => t.name));
},
```

`api.tools.list()` returns only the tools registered by this extension.

---

## How execution works

1. The `beforeSend` pipeline merges all registered tool definitions into `builtinTools` on every `ChatRequest` before it leaves the renderer.
2. The AI provider receives the tool list and may call any tool by name.
3. When a tool call arrives whose `serverId` is `'__extension__'`, the main process sends a `chat:extension-tool-call` IPC message to the renderer.
4. `useChat` receives the call, looks up the handler in `toolContributionRegistry`, and runs it.
5. The string result (or error) is sent back via `chat:extension-tool-result`.
6. The main process injects the result into the conversation and re-queries the provider.

> Extension tool calls follow the same approval flow as MCP tools when **Require Tool Approval** is enabled in settings.

---

## Settings-aware tools

A common pattern is to enable/disable a tool based on a settings toggle:

```ts
activate(api) {
  let unregister: (() => void) | undefined;

  const sync = () => {
    const enabled = api.settings.get<boolean>('weather.enabled') ?? false;
    if (enabled && !unregister) {
      unregister = api.tools.register(weatherToolDef, weatherHandler);
    } else if (!enabled && unregister) {
      unregister();
      unregister = undefined;
    }
  };

  sync(); // run once on activation
  api.settings.onChange('weather.enabled', sync); // re-run on changes
},
```

---

## Limitations

- Tool handlers run in the **renderer process** — you have full access to `fetch`, browser APIs, and `@openconduit/core` stores, but **no access to Node.js or Electron APIs**. For tools that need filesystem access, native modules, or spawned child processes, use an MCP server instead.
- `api.tools.register()` is only available for **in-process (non-sandboxed) extensions**. Sandboxed extensions (marketplace-installed bundles running in an `<iframe>`) cannot register tool handlers.
- Tool names must be unique globally. If two extensions register the same tool name, the second registration silently overwrites the first.
