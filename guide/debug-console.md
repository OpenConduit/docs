# Debug Console

The **Debug Console** is a built-in bottom panel tab that shows structured, timestamped log entries from anywhere in the renderer. It shipped in [issue #18](https://github.com/OpenConduit/core/issues/18).

Open it with `⌘J` (or the status bar toggle), then click the **Debug Console** tab.

## Writing to the Console

```ts
import { debugConsole } from '@openconduit/core';

debugConsole.debug('noisy internal event', { delta: '...' });
debugConsole.log('settings loaded', { provider: 'openai' });
debugConsole.info('routing decision', { original: 'gpt-4o', final: 'gpt-4o-mini' });
debugConsole.warn('rate limit approaching', { remaining: 3 });
debugConsole.error('stream failed', err);
```

`debugConsole` is a plain object — it can be called from any renderer module, store, hook, or component. It is **not** available in the main process.

## Log Levels

| Method | Level | Default visible? | Color |
|---|---|---|---|
| `.debug()` | `debug` | No (hidden at `info` default) | dim grey |
| `.log()` | `log` | No (hidden at `info` default) | grey |
| `.info()` | `info` | Yes | blue |
| `.warn()` | `warn` | Yes | yellow |
| `.error()` | `error` | Yes | red |

The filter in the toolbar is a **minimum level** selector — choosing `INFO` shows `info`, `warn`, and `error`. The default is `info`.

## Built-in Events

The following events are logged automatically by the core:

| Event | Level | Data |
|---|---|---|
| Settings loaded | `log` | `defaultProvider`, `defaultModel`, `providerCount` |
| MCP status refresh | `debug` | `total`, `connected` |
| Stream started | `debug` | `messageId`, `conversationId`, `model`, `providerId` |
| Stream ended | `debug` | `messageId`, `conversationId`, `usage` |
| Stream error | `error` | `messageId`, `conversationId`, `error` |
| Tool calls pending approval | `info` | `messageId`, `tools[]` |
| Tool approval requested | `info` | `messageId`, `toolName`, `toolId` |
| Tool approval response | `info` | `toolId`, `approved` |
| Routing decision | `info` | `original`, `final`, `reason` |
| Routing failure (non-fatal) | `warn` | `error` |

## UI Features

- **Level filter** — minimum-level selector (ALL / DBG / LOG / INFO / WARN / ERROR)
- **Auto-scroll** — checkbox to keep the view pinned to the latest entry
- **Entry count** — shows how many entries pass the current filter
- **Clear** — empties the ring buffer (max 500 entries)
- **Data preview** — inline JSON for short payloads; expandable `show data` link for long ones

## `useDebugConsoleStore`

The underlying Zustand store is exported for advanced use:

```ts
import { useDebugConsoleStore } from '@openconduit/core';

const { entries, addEntry, clear } = useDebugConsoleStore();

// Add an entry directly
addEntry('warn', 'something odd', { detail: 123 });
```

### Types

```ts
type DebugLevel = 'debug' | 'log' | 'info' | 'warn' | 'error';

interface DebugEntry {
  id: string;
  ts: number;       // Date.now()
  level: DebugLevel;
  message: string;
  data?: unknown;   // serialized as JSON in the UI
}
```
