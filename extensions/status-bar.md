# Status Bar Contributions

Extensions can contribute React components to the bottom status bar via `contributes.statusBarItems`.

## Registration

```ts
window.__openConduit.extensionRegistry.registerExtension(
  { id: 'acme.git-sync', name: 'Git Sync', version: '1.0.0' },
  {
    statusBarItems: [
      {
        id: 'acme.git-sync.status',
        render: GitSyncStatusItem,
        align: 'right',
        order: 30,
      },
    ],
  }
);
```

## `StatusBarItemContribution` Interface

```ts
interface StatusBarItemContribution {
  /** Unique identifier for this item. */
  id: string;
  /** React component to render. Receives no props — read from your own stores. */
  render: React.ComponentType;
  /** Which side of the status bar to place the item. Default: `'right'`. */
  align?: 'left' | 'right';
  /**
   * Sort order within the chosen side. Lower numbers render closer to centre.
   * Default: `50`.
   */
  order?: number;
}
```

## Layout

The status bar layout from left to right is:

```
[model indicator] [left items…] ──── spacer ──── [right items…] [routing badge] [tokens] [cost] [notification bell] [panel toggle]
```

- `align: 'left'` items are inserted after the model/routing profile indicator, sorted by `order` ascending.
- `align: 'right'` items are inserted before the notification bell, sorted by `order` ascending.

## Tips

- The status bar is `h-6` (24 px) with `text-[11px]`. Keep items compact.
- Use `text-slate-400` / `text-slate-500` to match the surrounding text style.
- Read conversation or external state from your own Zustand store — the `render` component receives no props.
- Items are deduped by `id`; registering the same id twice has no effect.
