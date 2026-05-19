# Stores

All renderer state lives in Zustand v5 stores in `@openconduit/core/src/stores/`.

## `conversationStore`

Manages conversations and open tabs.

```ts
import { useConversationStore } from '@openconduit/core';
```

| Action | Signature | Description |
|---|---|---|
| `addConversation` | `(opts: { providerId, model }) => Conversation` | Creates and returns a new conversation |
| `updateConversation` | `(id, patch) => void` | Partial update a conversation |
| `deleteConversation` | `(id) => void` | Deletes a conversation |
| `openTab` | `(id) => void` | Adds id to `openTabs` |
| `closeTab` | `(id) => void` | Removes id from `openTabs` |

| State | Type | Description |
|---|---|---|
| `conversations` | `Conversation[]` | All conversations |
| `openTabs` | `string[]` | Currently open tab ids |

## `uiStore`

UI state — active conversation, panels, modals, notifications.

```ts
import { useUiStore } from '@openconduit/core';
```

| Action | Signature | Description |
|---|---|---|
| `setActiveConversation` | `(id: string \| null) => void` | Sets the active conversation |
| `setShowSettings` | `(v: boolean) => void` | Opens/closes the settings panel |
| `setCommandPaletteOpen` | `(v: boolean) => void` | Opens/closes the command palette |
| `addNotification` | `(payload: Omit<AppNotification, 'id' \| 'timestamp' \| 'read'>) => void` | Fires an in-app notification |
| `markRead` | `(id: string) => void` | Marks a single notification as read |
| `markAllRead` | `() => void` | Marks all notifications as read |
| `clearNotifications` | `() => void` | Clears all notifications |

### `addNotification` payload

```ts
addNotification({
  title: 'Export complete',
  message: 'Conversation saved to file', // optional
  variant: 'success',                    // 'info' | 'success' | 'warning' | 'error'
  source: 'app',                         // optional, defaults to 'app'
});
```

Payloads are intentionally serializable (no React nodes) so that future extension callers (#38) can fire them over IPC.

## `settingsStore`

Wraps `electron-store` settings via IPC.

```ts
import { useSettingsStore } from '@openconduit/core';
```

| State | Type | Description |
|---|---|---|
| `settings` | `AppSettings \| null` | Current settings |
| `models` | `string[]` | Loaded model list |

| Action | Signature | Description |
|---|---|---|
| `saveSettings` | `(patch: Partial<AppSettings>) => void` | Persists settings via IPC |
| `loadModels` | `() => void` | Fetches available models from the active provider |

## `analyticsStore`

Tracks token usage and cost per message.

## `tasksStore`

Manages AI-generated task lists (floating `TasksPanel`).

## `personasStore`

Manages persona definitions (name, color, system prompt).

## `filesStore`

Manages saved files per conversation.
