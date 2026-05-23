# IPC Channels

All IPC handlers live in `packages/desktop/src/main/ipc.ts`. The context bridge in `preload.ts` exposes `window.api` to the renderer.

## `chat:*`

| Channel | Direction | Description |
|---|---|---|
| `chat:send` | renderer → main | Start a streaming AI request |
| `chat:complete` | renderer → main | **Headless completion** — returns `{ text: string }` with the full response. No conversation messages created, no stream events sent to renderer. Used by pipeline steps and background processing. |
| `chat:stream:chunk` | main → renderer | Delta text chunk from provider |
| `chat:stream:end` | main → renderer | Stream completed |
| `chat:stream:error` | main → renderer | Stream error |
| `chat:abort` | renderer → main | Abort active stream |

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
| `settings:open-file` | renderer → main | Open `settings.json` in the system default editor |
| `settings:export` | renderer → main | Export settings to a user-chosen `.json` file |
| `settings:import` | renderer → main | Import settings from a `.json` file, merging with current |

## `updater:*`

| Channel | Direction | Description |
|---|---|---|
| `updater:check` | renderer → main | Check for updates via Cloudflare Worker `GET /latest` |
| `updater:download` | renderer → main | Open download URL in system browser |

## `feedback:*`

| Channel | Direction | Description |
|---|---|---|
| `feedback:submit` | renderer → main | Post feedback to Cloudflare Worker `POST /feedback` → GitHub Issue |

## `extensions:*`

| Channel | Direction | Description |
|---|---|---|
| `extensions:get-installed` | renderer → main | Scan `userData/extensions/`, read each subdirectory's `manifest.json`, return `InstalledExtensionInfo[]`. Silent-fail for missing/invalid manifests. |
