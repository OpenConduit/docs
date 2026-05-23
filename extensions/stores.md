# Store Slice Contributions

Extensions can register Zustand store slices that are accessible to other extensions or to the host app via `extensionRegistry.getStore(id)`.

## Registration

```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GitSyncState {
  lastSyncedAt: number | null;
  isSyncing: boolean;
  setSyncing(v: boolean): void;
  markSynced(): void;
}

const useGitSyncStore = create<GitSyncState>()(
  persist(
    (set) => ({
      lastSyncedAt: null,
      isSyncing: false,
      setSyncing: (v) => set({ isSyncing: v }),
      markSynced: () => set({ lastSyncedAt: Date.now() }),
    }),
    { name: 'acme-git-sync' },
  ),
);

window.__openConduit.extensionRegistry.registerExtension(
  { id: 'acme.git-sync', name: 'Git Sync', version: '1.0.0' },
  {
    stores: [
      { id: 'acme.git-sync.store', store: useGitSyncStore },
    ],
  }
);
```

## `StoreSliceContribution` Interface

```ts
interface StoreSliceContribution<S = any> {
  /** Unique identifier for this store slice. */
  id: string;
  /** The Zustand store hook (or any value). */
  store: S;
}
```

## Accessing a Registered Store

From another extension or from host code:

```ts
const useGitSync = extensionRegistry.getStore('acme.git-sync.store') as typeof useGitSyncStore;
const { isSyncing } = useGitSync();
```

`getStore` returns `unknown` — cast to the expected hook type at the call site.

Use `extensionRegistry.getAllStoreSlices()` to enumerate every registered slice.

## Notes

- Slices are deduped by `id`. Registering the same id twice silently skips the second registration.
- Store slices are not automatically persisted unless you add `persist` middleware yourself (as shown above).
- Use reverse-domain prefixes for your slice `id` to avoid collisions (`acme.my-extension.store`).
