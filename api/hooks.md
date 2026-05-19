# Hooks

All hooks are exported from `@openconduit/core`.

```ts
import { useBeforeSend, useOnResponse, useOnStreamChunk, useOnToolCall } from '@openconduit/core';
```

Hooks prefixed with `useOn*` / `useBeforeSend` are lifecycle hooks backed by the [hookRegistry](#hookregistry). They are the primary extension point for observing and modifying the AI chat pipeline — and the groundwork for the #38 extension platform.

---

## Lifecycle Hooks

### `useBeforeSend`

Registers a middleware that runs **before** a chat request is sent to the provider. The hook receives the full `ChatRequest` and must return a (possibly modified) `ChatRequest`.

Hooks are chained in registration order — each hook receives the output of the previous one.

```ts
useBeforeSend(name: string, fn: BeforeSendHook, deps?: DependencyList): void
```

| Param | Type | Description |
|---|---|---|
| `name` | `string` | Unique key — re-registering with the same name replaces the previous hook |
| `fn` | `(req: ChatRequest) => ChatRequest \| Promise<ChatRequest>` | Transform the request |
| `deps` | `DependencyList` | Re-registers when deps change (like `useEffect`) |

**Example — inject a system prompt:**
```ts
useBeforeSend('company-policy', (req) => ({
  ...req,
  systemPrompt: `${req.systemPrompt ?? ''}\n\nAlways respond formally.`.trim(),
}));
```

**Example — filter attachments by type:**
```ts
useBeforeSend('images-only', (req) => ({
  ...req,
  attachments: req.attachments?.filter((a) => a.mimeType.startsWith('image/')),
}));
```

---

### `useOnResponse`

Fires after an assistant message is **fully streamed and finalised** (i.e. the complete `Message` object is available). Use this for logging, analytics, post-processing, or triggering side-effects.

```ts
useOnResponse(name: string, fn: OnResponseHook, deps?: DependencyList): void
```

| Param | Type | Description |
|---|---|---|
| `name` | `string` | Unique key |
| `fn` | `(message: Message) => void \| Promise<void>` | Called with the finalised message |
| `deps` | `DependencyList` | Re-registers when deps change |

**Example — log to console:**
```ts
useOnResponse('response-logger', (msg) => {
  console.log('[AI]', msg.content.slice(0, 100));
});
```

**Example — fire a notification when a long response arrives:**
```ts
const { addNotification } = useUiStore();
useOnResponse('long-response-alert', (msg) => {
  if (msg.content.length > 2000) {
    addNotification({ title: 'Long response received', variant: 'info' });
  }
}, [addNotification]);
```

---

### `useOnStreamChunk`

Fires on **every streamed token delta** as it arrives. Synchronous — keep the handler fast to avoid blocking the render loop.

```ts
useOnStreamChunk(name: string, fn: OnStreamChunkHook, deps?: DependencyList): void
```

| Param | Type | Description |
|---|---|---|
| `name` | `string` | Unique key |
| `fn` | `(chunk: StreamChunk) => void` | Called with each delta chunk |
| `deps` | `DependencyList` | Re-registers when deps change |

**Example — count tokens as they stream:**
```ts
const count = useRef(0);
useOnStreamChunk('token-counter', (chunk) => {
  count.current += chunk.delta.length;
});
```

---

### `useOnToolCall`

Fires when the AI requests a tool call. Return `false` to **deny** the call programmatically. Only runs when `requireToolApproval` is enabled in settings.

If multiple hooks are registered, a single `false` return from any one of them denies the call.

```ts
useOnToolCall(name: string, fn: OnToolCallHook, deps?: DependencyList): void
```

| Param | Type | Description |
|---|---|---|
| `name` | `string` | Unique key |
| `fn` | `(toolCall: ToolCall) => boolean \| Promise<boolean>` | Return `false` to deny |
| `deps` | `DependencyList` | Re-registers when deps change |

**Example — deny dangerous tools:**
```ts
const BLOCKED = ['delete_file', 'run_shell'];
useOnToolCall('deny-dangerous', (tc) => !BLOCKED.includes(tc.name));
```

---

## Other Hooks

### `useCompare`

Drives the **Compare mode** view — runs the same prompt against two or more provider/model columns simultaneously and displays responses side by side.

```ts
import { useCompare } from '@openconduit/core';

const { columns, setColumn, sendAll, reset, saveAsConversation } = useCompare();
```

| Return | Type | Description |
|---|---|---|
| `columns` | `CompareColumn[]` | Two or more columns (each tracks its own stream state) |
| `setColumn` | `(id, patch: Partial<CompareColumn>) => void` | Update provider/model for a column |
| `sendAll` | `(userMessage: string) => Promise<void>` | Send the same message to all columns |
| `reset` | `() => void` | Clear all columns back to empty |
| `saveAsConversation` | `(colId: string) => void` | Promote a column's thread to a full conversation |

### `useKeyboardShortcuts`

Registers global keyboard shortcuts. See [Keyboard Shortcuts](/api/keyboard-shortcuts) for the full binding table and instructions on adding new shortcuts.

---

## hookRegistry

Low-level registry that backs the lifecycle hooks above. Direct use is unnecessary for most cases — prefer the `useOn*` / `useBeforeSend` wrappers.

```ts
import { hookRegistry } from '@openconduit/core';
```

### Types

```ts
type BeforeSendHook    = (request: ChatRequest) => ChatRequest | Promise<ChatRequest>;
type OnResponseHook    = (message: Message) => void | Promise<void>;
type OnStreamChunkHook = (chunk: StreamChunk) => void;
type OnToolCallHook    = (toolCall: ToolCall) => boolean | Promise<boolean>;
```

### Methods

| Method | Description |
|---|---|
| `registerBeforeSend(name, fn)` | Register a beforeSend hook |
| `unregisterBeforeSend(name)` | Remove a beforeSend hook |
| `registerOnResponse(name, fn)` | Register an onResponse hook |
| `unregisterOnResponse(name)` | Remove an onResponse hook |
| `registerOnStreamChunk(name, fn)` | Register an onStreamChunk hook |
| `unregisterOnStreamChunk(name)` | Remove an onStreamChunk hook |
| `registerOnToolCall(name, fn)` | Register an onToolCall hook |
| `unregisterOnToolCall(name)` | Remove an onToolCall hook |
| `runBeforeSend(request)` | Run all beforeSend hooks in chain |
| `runOnResponse(message)` | Run all onResponse hooks |
| `runOnStreamChunk(chunk)` | Run all onStreamChunk hooks |
| `runOnToolCall(toolCall)` | Run all onToolCall hooks; returns `false` if any hook denied |

::: warning
`hookRegistry` is a singleton. Names must be globally unique — use a namespaced prefix (e.g. `my-extension:before-send`) to avoid collisions when multiple hooks are registered.
:::
