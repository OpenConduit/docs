# View Contributions

Extensions can contribute UI into three layout regions of the main window:

| Contribution key | Layout region | When shown |
|---|---|---|
| [`mainViews`](#main-views) | Primary content pane (replaces chat) | `uiStore.setActiveMainViewId(id)` |
| [`splitPaneViews`](#split-pane-views) | Right split pane | `uiStore.openSplitPane({ type: id, payload })` |
| [`secondarySidebarPanels`](#secondary-sidebar-panels) | Far-right secondary sidebar tabs | user clicks the contributed tab |

---

## Main Views

A **main view** replaces `ChatArea` in the primary content pane. Only one main view can be active at a time. Setting the id to `null` returns to the default chat view.

The built-in Compare Models feature is implemented as a main view with id `openconduit.compare.view`.

### Registration

```ts
window.__openConduit.extensionRegistry.registerExtension(
  { id: 'acme.my-extension', name: 'My Extension', version: '1.0.0' },
  {
    mainViews: [
      {
        id: 'acme.my-extension.dashboard',
        component: DashboardView,
      },
    ],
    // Typically paired with a command that activates the view:
    commands: [
      {
        id: 'acme.my-extension.openDashboard',
        label: 'Open Dashboard',
        action() {
          window.__openConduit.stores.ui.getState().setActiveMainViewId(
            'acme.my-extension.dashboard'
          );
        },
      },
    ],
  }
);
```

### Closing the view

Your component is responsible for offering a way back to chat. Call `setActiveMainViewId(null)` to return:

```tsx
import { useUiStore } from '@openconduit/core';

function DashboardView() {
  const setActiveMainViewId = useUiStore((s) => s.setActiveMainViewId);
  return (
    <div>
      <button onClick={() => setActiveMainViewId(null)}>← Back to chat</button>
      {/* ... */}
    </div>
  );
}
```

### `MainViewContribution`

```ts
interface MainViewContribution {
  /** Stable view identifier — must be unique across all extensions. */
  id: string;
  /** Component rendered in the primary content pane when this view is active. */
  component: React.ComponentType;
}
```

### `uiStore` integration

| Method / field | Description |
|---|---|
| `activeMainViewId: string \| null` | Current active main view id, or `null` for default chat. |
| `setActiveMainViewId(id)` | Activate a view by id, or pass `null` to return to chat. |

---

## Split Pane Views

A **split pane view** renders in the collapsible right split pane alongside chat. The `payload` string lets you pass data to the component (e.g. a conversation id, file path, or serialized state).

### Registration

```ts
window.__openConduit.extensionRegistry.registerExtension(
  { id: 'acme.my-extension', name: 'My Extension', version: '1.0.0' },
  {
    splitPaneViews: [
      {
        id: 'acme.my-extension.preview',
        component: PreviewPane,
      },
    ],
  }
);
```

### Opening the pane

```ts
const { openSplitPane } = window.__openConduit.stores.ui.getState();

openSplitPane({
  type: 'acme.my-extension.preview',
  payload: JSON.stringify({ fileId: '123' }),
});
```

Or from a React component using the `useUiStore` hook:

```tsx
import { useUiStore } from '@openconduit/core';

function MyButton() {
  const openSplitPane = useUiStore((s) => s.openSplitPane);
  return (
    <button
      onClick={() =>
        openSplitPane({ type: 'acme.my-extension.preview', payload: 'file-123' })
      }
    >
      Open Preview
    </button>
  );
}
```

### Component props

```tsx
function PreviewPane({ payload, onClose }: { payload: string; onClose: () => void }) {
  return (
    <div>
      <button onClick={onClose}>Close</button>
      <p>Payload: {payload}</p>
    </div>
  );
}
```

### `SplitPaneViewContribution`

```ts
interface SplitPaneViewContribution {
  /** Stable view identifier — must be unique across all extensions. */
  id: string;
  /**
   * Component rendered in the split pane.
   * Receives `payload` (the string passed to `openSplitPane`) and `onClose`.
   */
  component: React.ComponentType<{ payload: string; onClose: () => void }>;
}
```

### `uiStore` integration

| Method / field | Description |
|---|---|
| `splitPaneContent: { type: string; payload: string } \| null` | Currently displayed split pane content, or `null`. |
| `openSplitPane(content)` | Open the split pane with the given `type` and `payload`. |
| `closeSplitPane()` | Close the split pane and clear content. |

---

## Secondary Sidebar Panels

A **secondary sidebar panel** adds a tab to the far-right panel (the panel that contains the built-in Context, Outline, and Related tabs). Extension tabs appear after the built-in tabs, sorted by `order`.

### Registration

```ts
window.__openConduit.extensionRegistry.registerExtension(
  { id: 'acme.my-extension', name: 'My Extension', version: '1.0.0' },
  {
    secondarySidebarPanels: [
      {
        id: 'acme.my-extension.info',
        label: 'Info',
        component: InfoPanel,
        order: 10,
      },
    ],
  }
);
```

### Component

The component receives no props. Use hooks to access application state:

```tsx
import { useConversationStore } from '@openconduit/core';

function InfoPanel() {
  const activeId = useConversationStore((s) => s.activeConversationId);
  return <div>Active conversation: {activeId ?? 'none'}</div>;
}
```

### `SecondarySidebarPanelContribution`

```ts
interface SecondarySidebarPanelContribution {
  /** Stable panel identifier — must be unique across all extensions. */
  id: string;
  /** Label shown on the tab strip button. */
  label: string;
  /** Component rendered when this tab is selected. */
  component: React.ComponentType;
  /**
   * Render order within the extension section.
   * Built-in tabs (Context, Outline, Related) are always first.
   * @default 50
   */
  order?: number;
}
```

### `uiStore` integration

| Method / field | Description |
|---|---|
| `secondarySidebarPanel: string` | Id of the currently selected tab. |
| `setSecondarySidebarPanel(id)` | Programmatically select a tab by id. |
| `secondarySidebarOpen: boolean` | Whether the secondary sidebar is visible. |
| `setSecondarySidebarOpen(v)` | Show or hide the secondary sidebar. |

### Opening the secondary sidebar

The secondary sidebar must be open for a panel to be visible. Open it alongside selecting the tab:

```ts
const { setSecondarySidebarOpen, setSecondarySidebarPanel } =
  window.__openConduit.stores.ui.getState();

setSecondarySidebarPanel('acme.my-extension.info');
setSecondarySidebarOpen(true);
```
