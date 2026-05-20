# Stores

All renderer state lives in Zustand v5 stores in `@openconduit/core/src/stores/`.

## `conversationStore`

Manages conversations and open tabs.

```ts
import { useConversationStore } from '@openconduit/core';
```

| Action | Signature | Description |
|---|---|---|
| `addConversation` | `(opts: { providerId, model, folderId? }) => Conversation` | Creates and returns a new conversation |
| `updateConversation` | `(id, patch) => void` | Partial update a conversation |
| `deleteConversation` | `(id) => void` | Deletes a conversation |
| `openTab` | `(id) => void` | Adds id to `openTabs` |
| `closeTab` | `(id) => void` | Removes id from `openTabs` |
| `createFolder` | `(name, parentId?) => ConversationFolder` | Creates a folder (optionally nested) |
| `updateFolder` | `(id, patch) => void` | Partial update a folder (name, systemPrompt, collapsed…) |
| `deleteFolder` | `(id) => void` | Recursively deletes folder + subfolders; moves conversations to root |
| `toggleFolderCollapsed` | `(id) => void` | Toggles the collapsed state of a folder |
| `moveConversation` | `(convId, folderId: string \| null) => void` | Moves a conversation into a folder (`null` = root) |
| `addFolderFile` | `(file: Omit<FolderFile, 'id' \| 'createdAt'>) => FolderFile` | Attaches a file to a folder |
| `deleteFolderFile` | `(id) => void` | Removes a file from a folder |
| `renameFolderFile` | `(id, name) => void` | Renames a folder file |

| State | Type | Description |
|---|---|---|
| `conversations` | `Conversation[]` | All conversations |
| `openTabs` | `string[]` | Currently open tab ids |
| `folders` | `ConversationFolder[]` | All folders, persisted |
| `folderFiles` | `FolderFile[]` | All folder-attached files, persisted |

### Folder AI instructions

Each folder can define a `systemPrompt` that overrides the conversation-level system prompt for all conversations inside it. When a conversation is sent, the nearest ancestor folder with a non-empty `systemPrompt` wins. Subfolders can define their own instructions to shadow their parent.

```ts
updateFolder(folderId, { systemPrompt: 'You are a code reviewer. Be terse.' });
```

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
| `toggleBottomPanel` | `() => void` | Toggles the bottom panel open/closed |
| `setBottomPanelOpen` | `(v: boolean) => void` | Sets bottom panel open state |
| `setBottomPanelHeight` | `(h: number) => void` | Sets bottom panel height (px); persisted to `localStorage` |
| `setBottomPanelActiveTab` | `(tab: string) => void` | Sets the active bottom panel tab id; persisted to `localStorage` |
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

### Bottom Panel State

| State | Type | Default | Description |
|---|---|---|---|
| `bottomPanelOpen` | `boolean` | `false` | Whether the panel is visible |
| `bottomPanelHeight` | `number` | `240` | Panel height in px (min 100, max 600) |
| `bottomPanelActiveTab` | `string` | `'tool-calls'` | Active tab id — kept as `string` so extension tabs work without type changes |

See [Bottom Panel Contributions](/extensions/bottom-panel) for programmatic usage.

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

Tracks token usage and cost per conversation. Persisted to `localStorage` under `openconduit-analytics`.

```ts
import { useAnalyticsStore } from '@openconduit/core';
```

| State | Type | Description |
|---|---|---|
| `records` | `UsageRecord[]` | All usage records, newest first |

| Action | Signature | Description |
|---|---|---|
| `addRecord` | `(params, pricing?) => void` | Appends a `UsageRecord`; computes USD cost if pricing data is available |
| `clearRecords` | `() => void` | Wipes all records |

### `addRecord` params

```ts
addRecord(
  {
    conversationId: string;
    providerId: string;
    model: string;
    usage: TokenUsage; // { inputTokens, outputTokens }
  },
  pricing?: ModelPricing, // optional — from provider registry
)
```

---

## `tasksStore`

Holds the AI-generated task list for the active conversation. The task list is extracted from `<ai-tasks>` XML blocks in AI responses by `useChat` and replaced in full on every update.

```ts
import { useTasksStore } from '@openconduit/core';
```

| State | Type | Description |
|---|---|---|
| `tasks` | `AiTask[]` | Current task list |
| `conversationId` | `string \| null` | Conversation the tasks belong to |

| Action | Signature | Description |
|---|---|---|
| `setTasks` | `(tasks: AiTask[], conversationId: string) => void` | Replace the full task list |
| `clearTasks` | `() => void` | Clear tasks and `conversationId` |

### `AiTask`

```ts
interface AiTask {
  id: string;
  text: string;
  status: 'pending' | 'in-progress' | 'done' | 'cancelled';
}
```

---

## `useDebugConsoleStore`

Ring-buffer store (max 500 entries) that backs the Debug Console panel tab.

```ts
import { useDebugConsoleStore } from '@openconduit/core';
```

| State | Type | Description |
|---|---|---|
| `entries` | `DebugEntry[]` | All log entries, oldest first |

| Action | Signature | Description |
|---|---|---|
| `addEntry` | `(level, message, data?) => void` | Appends an entry |
| `clear` | `() => void` | Empties the ring buffer |

Prefer the [`debugConsole`](/guide/debug-console) helper over calling `addEntry` directly.

---

## `personasStore`

Manages personas (named system-prompt presets). Persisted to `localStorage` under `openconduit-personas`. The `default` persona always exists and cannot be deleted.

```ts
import { usePersonasStore } from '@openconduit/core';
```

| State | Type | Description |
|---|---|---|
| `personas` | `Persona[]` | All personas including defaults |

| Action | Signature | Description |
|---|---|---|
| `addPersona` | `(partial: Omit<Persona, 'id' \| 'isDefault'>) => Persona` | Creates and returns a new persona |
| `updatePersona` | `(id, updates) => void` | Update name, color, or systemPrompt (blocked on `isDefault` personas) |
| `deletePersona` | `(id) => void` | Delete a non-default persona |
| `duplicatePersona` | `(id) => Persona \| null` | Clone a persona with a new id |
| `importPersonas` | `(personas: Persona[]) => void` | Bulk-import personas (merges by id) |
| `getPersona` | `(id) => Persona \| undefined` | Look up a persona by id |

### `Persona`

```ts
interface Persona {
  id: string;
  name: string;
  systemPrompt: string;
  color: string;   // hex color for the avatar badge
  isDefault: boolean;
}
```

---

## `useSavedFilesStore`

Stores files that were saved from conversations (e.g. AI-generated artifacts). Persisted to `localStorage` under `openconduit-files`.

::: warning Note
The export name is `useSavedFilesStore`, not `useFilesStore`.
:::

```ts
import { useSavedFilesStore } from '@openconduit/core';
```

| State | Type | Description |
|---|---|---|
| `files` | `SavedFile[]` | All saved files, newest first |

| Action | Signature | Description |
|---|---|---|
| `saveFile` | `(file: Omit<SavedFile, 'id' \| 'savedAt'>) => string` | Saves and returns the new file id |
| `renameFile` | `(id, name) => void` | Rename a file |
| `deleteFile` | `(id) => void` | Delete a file |

### `SavedFile`

```ts
interface SavedFile {
  id: string;
  name: string;
  content: string;
  mimeType: string;
  size: number;
  conversationId?: string;
  savedAt: number;
}
```
