# Contributing

## Setup

`@openconduit/core` is published to GitHub Packages. You need a GitHub PAT with `read:packages` scope:

```bash
export NODE_AUTH_TOKEN=<your-github-pat>
npm install
```

CI/CD workflows use `secrets.GITHUB_TOKEN` automatically.

## Commands

```bash
# core repo
npm start          # Dev mode (electron-forge start)
npm run lint       # ESLint (TypeScript)
npm run make       # Package + create distributable

# Platform-specific builds
npm run make -- --platform darwin
npm run make -- --platform win32

# Cloudflare Worker
cd worker && wrangler deploy
```

## Branch Strategy

Features branch off `dev`. PRs target `dev`. `main` is the release branch.

```
main          ← releases only
dev           ← integration branch
feat/<name>   ← feature branches
fix/<name>    ← bug fix branches
```

## What Not To Do

- Don't add Node.js imports to renderer code (i.e. `@openconduit/core` source)
- Don't use `@tailwind` directive syntax (v3 style) — this project uses Tailwind v4
- Don't hardcode API keys anywhere; route them through IPC to `electron-store`
- Don't edit UI components or stores in `node_modules/` — make changes in `OpenConduit/core` and publish a new version
