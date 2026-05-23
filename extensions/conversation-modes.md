# Conversation Mode Contributions

Extensions can register **conversation modes** that replace the default single-model send pipeline for a given conversation. When a conversation's `conversationModeId` is set to a registered mode's `id`, the host hands the entire send lifecycle to the mode's `onSend` handler instead of proceeding with the standard routing → stream path.

This is the foundation for first-party features like **Multi-Persona** and **Background Assistant**, and allows extensions to implement their own routing strategies, fan-out patterns, or agent loops.

## Registration

```ts
window.__openConduit.extensionRegistry.registerExtension(
  { id: 'acme.multi-send', name: 'Multi Send', version: '1.0.0' },
  {
    conversationModes: [
      {
        id: 'acme.multi-send.mode',
        label: 'Multi-Send',
        icon: LayersIcon,
        async onSend({ conversationId, request, userMessage }) {
          // Fan the request out to two models in parallel
          await Promise.all([
            window.__openConduit.services.chat.send({
              ...request,
              model: 'gpt-4o',
            }),
            window.__openConduit.services.chat.send({
              ...request,
              providerId: 'anthropic',
              model: 'claude-opus-4-5',
            }),
          ]);
        },
      },
    ],
  }
);
```

## `ConversationModeContribution` Interface

```ts
interface SendContext {
  /** ID of the active conversation. */
  conversationId: string;
  /** The fully-built ChatRequest (after beforeSend hooks and routing). */
  request: ChatRequest;
  /** The raw user message string before it was added to the history. */
  userMessage: string;
}

interface ConversationModeContribution {
  /** Unique identifier. Stored in `Conversation.conversationModeId`. */
  id: string;
  /** Short human-readable label (used in UI selectors). */
  label: string;
  /** Optional React component icon (16×16). */
  icon?: React.ComponentType;
  /**
   * Called instead of the default send pipeline when this mode is active.
   * The extension is responsible for:
   * - Adding any placeholder assistant messages to the conversation store
   * - Calling `service.chat.send()` (one or more times)
   * - Handling errors
   * The host will NOT call `setIsStreaming(true)` or add placeholder messages.
   */
  onSend: (ctx: SendContext) => Promise<void>;
}
```

## Activating a Mode

Set `conversationModeId` on the conversation you want to switch:

```ts
const { updateConversation } = window.__openConduit.stores.conversations.getState();
updateConversation(conversationId, { conversationModeId: 'acme.multi-send.mode' });
```

To return to the default pipeline, set it to `undefined` or `null`.

## Lifecycle

When a message is sent in a conversation with an active mode:

1. The user message and any attachments are added to the store as usual.
2. `beforeSend` hooks run and the request is built.
3. Routing evaluation runs (the routed `request` is passed to `onSend`).
4. **The host calls `mode.onSend(ctx)` and returns early** — `setIsStreaming`, placeholder messages, and IPC listeners are the mode's responsibility.
5. The IPC streaming listeners (`ai:stream-chunk`, `ai:stream-end`, `ai:stream-error`) are still active — any call to `service.chat.send()` inside `onSend` will trigger them normally.

## Built-in Modes

| Mode ID | Extension | Notes |
|---|---|---|
| `openconduit.compare.mode` | Compare Models | Fan-out to all selected models (planned) |
| `openconduit.persona.mode` | Multi-Persona | Each persona takes a turn (planned) |

## Notes

- Modes are deduped by `id`. Registering the same id twice silently skips the second.
- If `onSend` throws, the error is caught and logged via `debugConsole.error`. The conversation remains unlocked.
- The `request` passed to `onSend` has already been transformed by `beforeSend` hooks and routing — it is safe to pass directly to `service.chat.send()`.
