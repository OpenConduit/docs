# Overview

OpenConduit is a cross-platform desktop AI chat application built with Electron + React. It supports multiple AI providers, MCP (Model Context Protocol) tool servers, intelligent model routing, and is packaged with electron-forge for macOS, Windows, and Linux.

## Repositories

| Repo | Purpose |
|---|---|
| [`OpenConduit/core`](https://github.com/OpenConduit/core) | All shared React UI — components, hooks, stores, services, types. Published as `@openconduit/core` to GitHub Packages. |
| [`OpenConduit/openconduit-client`](https://github.com/OpenConduit/openconduit-client) | Electron shell — main process, preload, IPC handlers, AI provider clients, electron-store settings. |
| [`OpenConduit/docs`](https://github.com/OpenConduit/docs) | This site. |

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Electron 42 (`contextIsolation: true`, `sandbox: false`) |
| Frontend | React 19, TypeScript, Tailwind CSS v4, Vite |
| State | Zustand v5 with `persist` middleware |
| Main process settings | `electron-store` v11 |
| Build / package | electron-forge (MakerSquirrel, MakerZIP, MakerDeb, MakerRpm) |
| Update / feedback | Cloudflare Worker at `openconduit.chumchal-account.workers.dev` |

## Supported AI Providers

- OpenAI
- Anthropic (Claude)
- Google Gemini
- LM Studio (OpenAI-compatible local)
- Ollama (local)

## Next Steps

- [Architecture](/guide/architecture) — how the layers fit together
- [API Reference](/api/stores) — stores, types, and IPC channels
- [Extension Platform](/extensions/) — what's coming in #38
