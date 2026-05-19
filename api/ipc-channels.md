# IPC Channels

All IPC handlers live in `packages/desktop/src/main/ipc.ts`. The context bridge in `preload.ts` exposes `window.api` to the renderer.

## `ai:*`

| Channel | Direction | Description |
|---|---|---|
| `ai:stream` | renderer → main | Start a streaming AI request |
| `ai:stream-chunk` | main → renderer | Delta text chunk from provider |
| `ai:stream-done` | main → renderer | Stream completed |
| `ai:stream-error` | main → renderer | Stream error |
| `ai:list-models` | renderer → main | Fetch available models from provider |
| `ai:abort` | renderer → main | Abort active stream |

## `mcp:*`

| Channel | Direction | Description |
|---|---|---|
| `mcp:list-tools` | renderer → main | List tools from all active MCP servers |
| `mcp:call-tool` | renderer → main | Execute a tool call |
| `mcp:status` | renderer → main | Get connection status of all servers |
| `mcp:refresh` | renderer → main | Re-connect all servers |

## `settings:*`

| Channel | Direction | Description |
|---|---|---|
| `settings:get` | renderer → main | Read settings from `electron-store` |
| `settings:set` | renderer → main | Write settings to `electron-store` |

## `updater:*`

| Channel | Direction | Description |
|---|---|---|
| `updater:check` | renderer → main | Check for updates via Cloudflare Worker `GET /latest` |
| `updater:download` | renderer → main | Open download URL in system browser |

## `feedback:*`

| Channel | Direction | Description |
|---|---|---|
| `feedback:submit` | renderer → main | Post feedback to Cloudflare Worker `POST /feedback` → GitHub Issue |
