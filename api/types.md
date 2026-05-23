# Types

All shared TypeScript types are exported from `@openconduit/core`.

```ts
import type { Conversation, AppNotification, AppSettings } from '@openconduit/core';
```

## Core Types

### `Conversation`

```ts
interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  providerId: string;
  model: string;
  routingProfileId?: string;
  personaId?: string;
  folderId?: string | null; // null = root (no folder)
  createdAt: number;
  updatedAt: number;
}
```

### `ConversationFolder`

A folder that groups conversations. Folders can be nested via `parentId`.

```ts
interface ConversationFolder {
  id: string;
  name: string;
  parentId: string | null; // null = top-level folder
  order: number;
  collapsed: boolean;
  systemPrompt?: string;  // AI instructions — overrides conversation system prompt
                          // cascades to subfolders unless they define their own
}
```

### `FolderFile`

A file attached to a folder — either saved from an AI artifact or uploaded by the user.

```ts
interface FolderFile {
  id: string;
  folderId: string;
  name: string;
  language?: string;  // e.g. 'ts', 'py', 'md'
  content: string;
  mimeType: string;
  size: number;
  createdAt: number;
  source: 'ai-artifact' | 'user-upload';
  conversationId?: string; // set when saved from an artifact
}
```

### `Message`

```ts
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: number;
  usage?: TokenUsage;
  toolCalls?: ToolCall[];
}
```

### `AppNotification`

In-app notification. Kept serializable so extension callers (#38) can fire via IPC.

```ts
interface AppNotification {
  id: string;
  title: string;
  message?: string;
  variant: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
  source?: string; // extension id, or 'app' for built-in
}
```

### `AppSettings`

```ts
interface AppSettings {
  defaultProviderId: string;
  defaultModel: string;
  providers: ProviderConfig[];
  mcpServers: McpServerConfig[];
  routing: RoutingConfig;
  routingProfiles: RoutingProfile[];
  // ... see types.ts for full definition
}
```

## Provider Types

### `ProviderConfig`

```ts
interface ProviderConfig {
  id: string;
  type: ProviderType; // 'openai' | 'anthropic' | 'gemini' | 'lmstudio' | 'ollama'
  name: string;
  apiKey?: string;
  baseUrl?: string;
}
```

## Request Types

### `SimpleCompletionRequest`

Used with `window.api.chat.complete()` (and `service.chat.complete()` in builtins) for headless LLM calls that return full response text without creating conversation messages. Useful for pipeline steps, background processing, and any extension that needs an LLM response outside the conversation store.

```ts
interface SimpleCompletionRequest {
  providerId: string;
  model: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  systemPrompt?: string;
  parameters?: Partial<ModelParameters>;
}
```

---

## MCP Types

### `McpServerConfig`

```ts
interface McpServerConfig {
  id: string;
  name: string;
  transport: McpTransport; // 'http-sse' | 'stdio'
  url?: string;
  command?: string;
  args?: string[];
}
```

## Settings Contribution Types

All exported from `@openconduit/core`. Used by the schema-driven settings UI ([issue #37](https://github.com/OpenConduit/core/issues/37)).

```ts
import type { SettingsContribution, SettingsSection, SettingsProperty } from '@openconduit/core';
```

### `SettingsContribution`

```ts
interface SettingsContribution {
  id: string;
  label: string;
  order: number;
  sections: SettingsSection[];
}
```

### `SettingsSection`

```ts
interface SettingsSection {
  title: string;
  description?: string;
  properties: SettingsProperty[];
}
```

### `SettingsProperty`

```ts
type SettingsProperty =
  | SettingsStringProperty
  | SettingsNumberProperty
  | SettingsBooleanProperty;

interface SettingsStringProperty {
  type: 'string';
  key: string;
  title: string;
  description?: string;
  default?: string;
  enum?: string[];
  enumDescriptions?: string[];
  placeholder?: string;
  sensitive?: boolean;
  multiline?: boolean;
  order?: number;
}

interface SettingsNumberProperty {
  type: 'number';
  key: string;
  title: string;
  description?: string;
  default?: number;
  minimum?: number;
  maximum?: number;
  step?: number;
  order?: number;
}

interface SettingsBooleanProperty {
  type: 'boolean';
  key: string;
  title: string;
  description?: string;
  default?: boolean;
  order?: number;
}
```

See [Settings Contributions](/extensions/settings) for usage examples.

## Extension Types

All exported from `@openconduit/core`. Used by the extension loader and registry.

```ts
import type {
  InstalledExtensionInfo,
  ExtensionManifest,
  ActivityBarContribution,
} from '@openconduit/core';
```

### `InstalledExtensionInfo`

Returned by `extensions:get-installed` IPC. Describes an extension installed to `userData/extensions/<id>/`.

```ts
interface InstalledExtensionInfo {
  id: string;
  name: string;
  version: string;
  /** Absolute path to the JS bundle, read by the preload bridge. */
  entryPoint: string;
}
```

### `ExtensionManifest`

The manifest object passed to `extensionRegistry.registerExtension()` by an extension's entry point at runtime.

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
}
```

### `ActivityBarContribution`

```ts
interface ActivityBarContribution {
  panelId: string;
  label: string;
  icon: React.ReactNode;
  panel: React.ComponentType;
  /** Render order in the dynamic section. Lower = higher in the bar. @default 50 */
  order?: number;
}
```

See [Activity Bar Contributions](/extensions/activity-bar) for usage.

## Update / Feedback

### `UpdateInfo`

```ts
interface UpdateInfo {
  hasUpdate: boolean;
  latestVersion: string;
  currentVersion: string;
  releaseNotes?: string;
  downloadUrl?: string;
}
```
