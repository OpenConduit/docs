# Extension API (`ExtensionAPI`)

The `ExtensionAPI` object is passed to your extension's [`activate`](/extensions/manifest#activate) function. It is the only sanctioned way to interact with application state from an extension — reads are always available, writes are gated by [permissions](/extensions/manifest#permissions).

```ts
// manifest.json / ExtensionManifest
{
  id: 'acme.my-extension',
  // ...
  permissions: ['conversations.write'],
  activate(api) {
    const conv = api.conversations.getActive();
    api.ui.showNotification({ message: `Active: ${conv?.title ?? 'none'}` });
  },
}
```

---

## `conversations`

| Method | Signature | Permission | Description |
|---|---|---|---|
| `getActive` | `() → Conversation \| null` | — | Currently active conversation, or `null` if none is selected. |
| `getAll` | `() → Conversation[]` | — | All conversations in the store. |
| `list` | `() → Conversation[]` | — | Alias for `getAll`. |
| `sendMessage` | `(text: string) → void` | `conversations.write` | Injects a message into the active conversation as if the user typed it. No-op (with a console warning) if the permission is absent. |
| `onNewMessage` | `(cb: (msg: Message) => void) → Unsubscribe` | — | Subscribes to new messages in the active conversation. Returns an unsubscribe function. Only available for in-process extensions — **not bridged over postMessage**. |

### Example

```ts
activate(api) {
  const all = api.conversations.getAll();
  console.log(`${all.length} conversations loaded`);

  const unsub = api.conversations.onNewMessage((msg) => {
    console.log('New message:', msg.content);
  });
  // call unsub() to stop listening
},
```

---

## `settings`

Reads and writes apply to the **host application's** `AppSettings` object via dot-separated key paths (e.g. `"theme"`, `"provider.openai.model"`).

| Method | Signature | Permission | Description |
|---|---|---|---|
| `get` | `<T>(key: string) → T \| undefined` | — | Read a single settings value by its dot-separated path. |
| `getAll` | `() → AppSettings \| null` | — | Returns the full settings object, or `null` if settings have not yet loaded. |
| `set` | `(key: string, value: unknown) → void` | `settings.write` | Persist a single settings value. No-op (with a console warning) if the permission is absent. |
| `onChange` | `(key: string, cb: (value: unknown) => void) → Unsubscribe` | — | Subscribe to changes for a specific key. Returns an unsubscribe function. Only available for in-process extensions — **not bridged over postMessage**. |

### Example

```ts
activate(api) {
  const theme = api.settings.get<string>('theme'); // 'light' | 'dark'
  console.log('Current theme:', theme);
},
```

---

## `ui`

| Method | Signature | Permission | Description |
|---|---|---|---|
| `registerMessageDecorator` | `(decorator: MessageDecorator) → Unsubscribe` | — | Registers a React renderer called below each chat message bubble. Returns an unsubscribe function that removes the decorator. Only available for in-process extensions — **not bridged over postMessage**. |
| `showNotification` | `(opts: { message: string; type?: 'info' \| 'success' \| 'warning' \| 'error' }) → void` | — | Displays a notification in the app's notification center. |
| `getActivePanel` | `() → string` | — | Returns the id of the currently active sidebar panel (e.g. `'chats'`, `'marketplace'`). |

### `MessageDecorator`

```ts
type MessageDecorator = (msg: Message) => React.ReactNode | null;
```

Decorators are rendered below the message bubble for every message in the active conversation. Return `null` to render nothing for a given message.

```ts
activate(api) {
  const unsub = api.ui.registerMessageDecorator((msg) => {
    if (msg.role !== 'assistant') return null;
    return <div className="text-xs text-muted">Decorated by acme.my-extension</div>;
  });
},
```

---

## `store`

Read-only access to shared application state.

| Method | Signature | Description |
|---|---|---|
| `getPersonas` | `() → Persona[]` | All defined personas. |
| `getSavedFiles` | `() → SavedFile[]` | All saved file attachments. |
| `getTasks` | `() → AiTask[]` | Current AI task list. |

---

## Permissions

Write-access methods require the corresponding permission string in the manifest. Attempting a write without the permission logs a console warning and is a no-op.

| Permission string | Unlocks |
|---|---|
| `conversations.write` | `api.conversations.sendMessage()` |
| `settings.write` | `api.settings.set()` |

```json
{
  "id": "acme.my-extension",
  "permissions": ["conversations.write", "settings.write"]
}
```

---

## Sandboxed extensions (`SandboxedPanel`)

Extensions rendered inside a sandboxed `<iframe>` can call API methods over postMessage using the `oc:api` protocol:

```js
// Inside sandbox — sends the call and waits for the response
function callApi(path, args = []) {
  return new Promise((resolve, reject) => {
    const id = String(Math.random());
    window.parent.postMessage({ type: 'oc:api', id, path, args }, '*');
    window.addEventListener('message', function handler(e) {
      if (e.data?.type !== 'oc:api-response' || e.data.id !== id) return;
      window.removeEventListener('message', handler);
      if (e.data.error) reject(new Error(e.data.error));
      else resolve(e.data.result);
    });
  });
}

const theme = await callApi('settings.get', ['theme']);
const panel = await callApi('ui.getActivePanel');
```

> **Note:** Subscription methods (`onNewMessage`, `settings.onChange`, `ui.registerMessageDecorator`) cannot be bridged over postMessage — calling them from a sandbox returns an error.
