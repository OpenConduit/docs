# Activity Bar Contributions

Activity bar contributions add icon buttons to the left-hand icon strip and wire them to a sidebar panel component. They are the primary way extensions add top-level UI to OpenConduit.

## Quick Start

In your extension's entry point:

```ts
window.__openConduit.extensionRegistry.registerExtension(
  {
    id: 'acme.map-view',
    name: 'Map View',
    version: '1.0.0',
  },
  {
    activityBarItems: [
      {
        panelId: 'acme.map-view',
        label: 'Map',
        icon: MapIcon, // React element, e.g. an SVG component
        panel: MapPanel, // React component rendered in the sidebar
        order: 30,
      },
    ],
  }
);
```

## `ActivityBarContribution`

```ts
interface ActivityBarContribution {
  /** Stable panel identifier — must be unique across all extensions. */
  panelId: string;
  /** Tooltip and aria-label shown on the icon button. */
  label: string;
  /** Icon rendered in the activity bar (React element, typically an inline SVG). */
  icon: React.ReactNode;
  /** Sidebar panel component rendered when this item is active. */
  panel: React.ComponentType;
  /**
   * Render order within the dynamic section (lower = higher in the bar).
   * Built-in structural items (Chats, Marketplace) are always first/last.
   * @default 50
   */
  order?: number;
}
```

## Ordering

The activity bar renders in three layers:

| Layer | Items | Order |
|---|---|---|
| Top (fixed) | Chats | Always first |
| Middle (dynamic) | Extension-contributed items | Sorted by `order` ascending (default 50) |
| Bottom (fixed) | Marketplace | Always last |

Use `order` values below 50 to appear near the top of the dynamic section, above 50 to appear near the bottom.

## Hot Loading

Extensions are loaded at startup via `loadInstalledExtensions()` and again immediately after any marketplace install. The `ActivityBar` subscribes to the registry, so a new panel appears without an app restart.

## Global SDK Surface

The extension registry is exposed as `window.__openConduit.extensionRegistry`. TypeScript consumers can reference it via the type declared in `packages/desktop/src/renderer/env.d.ts`:

```ts
declare global {
  interface Window {
    __openConduit?: {
      extensionRegistry: import('@openconduit/core').extensionRegistry;
    };
  }
}
```
