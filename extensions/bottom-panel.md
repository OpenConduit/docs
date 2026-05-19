# Bottom Panel Contributions

Extensions can add tabs to the **bottom panel** — the resizable drawer at the bottom of the main content area. The contribution system shipped in [issue #18](https://github.com/OpenConduit/core/issues/18).

::: tip Extension platform
Full manifest-based registration is planned for [issue #38](https://github.com/OpenConduit/core/issues/38). Until then, register contributions directly using the TypeScript API below.
:::

## Opening the Panel

- **Keyboard:** `⌘J`
- **Status bar:** click the panel toggle button (bottom-right of the status bar)

The panel height is resizable by dragging the top edge. Height and the active tab are persisted to `localStorage`.

## Quick Start

```ts
import { bottomPanelRegistry } from '@openconduit/core';
import MyTab from './MyTab';

bottomPanelRegistry.register({
  id: 'my-extension.my-tab',
  label: 'My Tab',
  order: 100,
  content: (conversationId) => <MyTab conversationId={conversationId} />,
});
```

Import this file as a **side-effect** so it runs before `BottomPanel` first renders.

## `BottomPanelTab`

```ts
interface BottomPanelTab {
  /** Unique string id — use a namespaced format, e.g. 'my-ext.tab-name' */
  id: string;
  /** Label shown in the tab strip */
  label: string;
  /** Optional icon rendered left of the label (React node) */
  icon?: React.ReactNode;
  /** Sort order — lower numbers appear first. Built-in tabs use 10, 20, 30. */
  order: number;
  /**
   * Tab content.
   * - Pass a `ReactNode` for static content.
   * - Pass a function `(conversationId: string | null) => ReactNode`
   *   to receive the currently active conversation id.
   */
  content: React.ReactNode | ((conversationId: string | null) => React.ReactNode);
}
```

## `bottomPanelRegistry`

```ts
import { bottomPanelRegistry } from '@openconduit/core';

// Register a tab
bottomPanelRegistry.register(tab: BottomPanelTab): void

// Remove a tab by id
bottomPanelRegistry.unregister(id: string): void

// Get a single tab
bottomPanelRegistry.get(id: string): BottomPanelTab | undefined

// Get all tabs sorted by order
bottomPanelRegistry.getAll(): BottomPanelTab[]
```

## Built-in Tabs

| Tab | `id` | `order` | Description |
|---|---|---|---|
| Tool Calls | `tool-calls` | 10 | Log of all MCP tool calls in the active conversation |
| Token Usage | `token-usage` | 20 | Per-message token breakdown with CSV export |
| Debug Console | `debug-console` | 30 | In-app structured log viewer (see [Debug Console](/guide/debug-console)) |

## uiStore Integration

The panel state lives in `useUiStore`:

```ts
const {
  bottomPanelOpen,         // boolean
  setBottomPanelOpen,      // (v: boolean) => void
  toggleBottomPanel,       // () => void
  bottomPanelHeight,       // number (px), default 240
  setBottomPanelHeight,    // (h: number) => void
  bottomPanelActiveTab,    // string — open for extension tab ids
  setBottomPanelActiveTab, // (tab: string) => void
} = useUiStore();
```

To programmatically open the panel on a specific tab:

```ts
import { useUiStore } from '@openconduit/core';

useUiStore.getState().setBottomPanelActiveTab('my-extension.my-tab');
useUiStore.getState().setBottomPanelOpen(true);
```
