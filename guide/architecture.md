# Architecture

OpenConduit is split across two repos: the **Electron shell** (`openconduit-client`) and the **shared React UI** (`@openconduit/core`). Vite resolves `@openconduit/core` imports directly to TypeScript source in `node_modules/@openconduit/core/src/` — no separate build step.

## Process Model

```
┌─────────────────────────────────────────────────────────┐
│  Main Process (Node.js)                                 │
│  src/main.ts → src/main/ipc.ts                          │
│                                                         │
│  ┌──────────────┐  ┌────────────────┐  ┌─────────────┐ │
│  │  AI Provider │  │   MCP Client   │  │electron-store│ │
│  │  Clients     │  │  (HTTP-SSE +   │  │  settings   │ │
│  │  openai.ts   │  │   stdio)       │  │             │ │
│  │  anthropic.ts│  └────────────────┘  └─────────────┘ │
│  │  gemini.ts   │                                       │
│  │  lmstudio.ts │                                       │
│  │  ollama.ts   │                                       │
│  └──────────────┘                                       │
└────────────────────────┬────────────────────────────────┘
                         │ IPC (contextBridge)
                         │ window.api.*
┌────────────────────────▼────────────────────────────────┐
│  Renderer Process (React)                               │
│  @openconduit/core                                      │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Zustand Stores                                 │   │
│  │  conversationStore · settingsStore · uiStore    │   │
│  │  analyticsStore · tasksStore · personasStore    │   │
│  │  filesStore · (folders + folderFiles in conv.)  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  React Components                               │   │
│  │  App → Sidebar + TabBar + ChatArea + StatusBar  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## IPC Channels

All Node.js / Electron APIs live in the main process. The context bridge in `preload.ts` exposes `window.api` to the renderer.

| Prefix | Purpose |
|---|---|
| `ai:*` | Streaming AI requests, model listing |
| `mcp:*` | MCP server management, tool calls |
| `settings:*` | Read/write `electron-store` settings |
| `updater:*` | Auto-update checks via Cloudflare Worker |

See [IPC Channels](/api/ipc-channels) for the full reference.

## State Management

All renderer state lives in Zustand stores in `@openconduit/core`. Main process state lives in `electron-store`.

**Rule:** Never persist sensitive data (API keys) in Zustand — those go through IPC to `electron-store`.

See [Stores](/api/stores) for the full reference.

## Component Tree

```
App
├── ChromeBar           ← search / command palette trigger
├── Sidebar             ← conversation list, activity panels
├── main area
│   ├── TabBar          ← tab strip, per-conversation controls, rename, context menu
│   ├── ChatArea        ← WelcomeScreen (no active conv) or MessageList + InputBar
│   │   ├── WelcomeScreen
│   │   ├── TasksPanel  ← floating AI task tracker
│   │   ├── MessageList
│   │   ├── ContextWarningBanner
│   │   └── InputBar
│   └── StatusBar       ← model info, token count, cost, notification bell
└── SettingsPanel       ← slide-in settings (General, Providers, MCP, Personas, …)
```

## Key Conventions

### Tailwind CSS v4
Use `@import "tailwindcss"` — **not** `@tailwind base/components/utilities` (v3 syntax).

Brand colors: `brand-blue`, `brand-violet`, `brand-cyan`, `brand-navy`, `brand-surface`, `brand-muted`, `brand-white`.

### macOS specifics
- `titleBarStyle: 'hiddenInset'` — no visible title bar
- When sidebar is closed on macOS, `TopBar` adds `pl-[80px]` to avoid traffic light overlap
- `app.setPath('userData', ...)` called before `createWindow` so the path never changes on rename

### Versioning
`__APP_VERSION__` is a Vite-injected global from `package.json`. Use it in the renderer for display.
