# Message Badge Contributions

Extensions can attach **badges** to individual messages via `contributes.messageBadges`. Badges are rendered as compact pills in the message metadata row below each `MessageBubble`.

A typical use-case is the Background Assistant extension annotating messages with a secondary model's response count, or a Git Sync extension stamping messages that triggered an auto-commit.

## Registration

```ts
window.__openConduit.extensionRegistry.registerExtension(
  { id: 'acme.background-assistant', name: 'Background Assistant', version: '1.0.0' },
  {
    messageBadges: [
      {
        id: 'acme.background-assistant.badge',
        render(message) {
          const count = getShadowResponseCount(message.id);
          if (count === 0) return null;
          return {
            count,
            content: (
              <span className="flex items-center gap-1">
                <BotIcon className="w-3 h-3" />
                background
              </span>
            ),
          };
        },
      },
    ],
  }
);
```

## `MessageBadgeContribution` Interface

```ts
interface MessageBadgeContribution {
  /** Unique identifier for this badge type. */
  id: string;
  /**
   * Called once per message render. Return `null` to show nothing for that
   * message; return an object to render a pill.
   */
  render: (message: Message) => { count: number; content: React.ReactNode } | null;
}
```

### Return value

| Field | Type | Description |
|---|---|---|
| `count` | `number` | Numeric annotation shown after the content (e.g. `3`). Pass `0` to hide the number. |
| `content` | `React.ReactNode` | Badge content — typically an icon + short label. Keep it to 1–2 words. |

## Rendering

Badges are rendered as `inline-flex` pills (`bg-slate-700`, `rounded-full`, `text-[10px]`) in the metadata row beneath each message. Multiple badges from different extensions stack horizontally.

The host passes the full `Message` object — your `render` function is responsible for deciding whether this message is relevant to your extension (e.g. by checking `message.id` against your own store).

## Notes

- Badges are deduped by `id`. Registering the same id twice has no effect.
- The `render` function is called on every message in the visible list on each render cycle — keep it fast. Do not perform async work inside `render`; read from a synchronous Zustand store instead.
- If `render` throws, the badge is silently skipped for that message.
