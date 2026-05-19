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
  createdAt: number;
  updatedAt: number;
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
