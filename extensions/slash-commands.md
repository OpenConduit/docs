# Slash Commands

Slash commands let users trigger actions directly from the chat input by typing `/` followed by a command name. As the user types, an autocomplete dropdown appears with matching commands. Pressing **Enter** or **Tab** executes the selected command.

Extensions can contribute their own slash commands using the `slashCommandRegistry` — they appear alongside the built-in commands in the same autocomplete.

## Quick Start

```ts
import { slashCommandRegistry } from '@openconduit/core';

slashCommandRegistry.register({
  trigger: 'greet',
  description: 'Insert a greeting into the chat',
  execute: (_args, ctx) => {
    ctx.setContent('Hello! How can I help you today?');
  },
});
```

Typing `/greet` in the chat input and pressing **Enter** will replace the input with the greeting text.

To remove the command (e.g. on extension deactivation):

```ts
slashCommandRegistry.unregister('greet');
```

## Via Manifest `contributes`

Commands can also be declared in the extension manifest's `contributes` field and are registered automatically before `activate` is called:

```ts
window.__openConduit.extensionRegistry.registerExtension(
  { id: 'acme.my-extension', name: 'My Extension', version: '1.0.0' },
  {
    slashCommands: [
      {
        trigger: 'greet',
        description: 'Insert a greeting',
        execute: () => 'Hello! How can I help you today?',
      },
    ],
  }
);
```

## `SlashCommand` Interface

```ts
interface SlashCommand {
  /**
   * The trigger word typed after the slash — lowercase, no spaces.
   * e.g. 'clear' matches /clear.
   */
  trigger: string;

  /** Short description shown in the autocomplete dropdown. */
  description: string;

  /** Optional grouping label ('chat' | 'navigation' | 'context' | 'custom' | string). */
  category?: string;

  /** Optional icon rendered in the dropdown (React element). */
  icon?: React.ReactNode;

  /**
   * Called when the user selects this command.
   *
   * - Return a string to place in the textarea after execution (e.g. for
   *   commands that scaffold further input like `/system `).
   * - Return void / undefined to clear the textarea.
   * - May be async.
   */
  execute: (args: string, context: SlashCommandContext) => void | string | Promise<void | string>;
}
```

## `SlashCommandContext`

```ts
interface SlashCommandContext {
  /** The active conversation ID, or null if none. */
  conversationId: string | null;

  /** Replace the textarea content. Pass '' to clear it. */
  setContent: (text: string) => void;

  /** Chat-level callbacks injected by InputBar. */
  chat?: {
    /** Clear all messages in the current conversation. */
    clear?: () => void;
    /** AI-summarize and compact the current conversation. */
    compact?: () => void;
    /** Trim oldest messages to reduce context usage. */
    trim?: () => void;
    /** Open the folder picker for agent context. */
    pickFolder?: () => Promise<void>;
  };
}
```

### `args`

The `args` string contains any text the user typed after the trigger word and a space — e.g. typing `/system You are a helpful assistant` passes `'You are a helpful assistant'` as `args`. For zero-argument commands `args` will be an empty string.

## `slashCommandRegistry` API

| Method | Description |
|---|---|
| `register(cmd)` | Register a slash command. Re-registering the same `trigger` is a no-op. |
| `unregister(trigger)` | Remove a command by trigger word. |
| `getAll()` | All registered commands in registration order. |
| `getMatching(prefix)` | Commands whose trigger starts with `prefix` (case-insensitive). Empty prefix returns all. |

## Built-in Slash Commands

Built-in commands are registered in `src/commands/coreSlashContributions.ts` at startup.

| Command | Category | Description |
|---|---|---|
| `/new` | navigation | Start a new conversation |
| `/clear` | chat | Clear all messages in this conversation |
| `/summarize` | context | AI summarizes the chat and replaces all messages |
| `/compact` | context | Alias for `/summarize` |
| `/trim` | context | Remove oldest messages to free up context window space |
| `/folder` | context | Set a project folder for agent context |
| `/settings` | navigation | Open settings |
| `/system` | chat | Scaffold a system prompt — type your prompt after `/system` |

## User Experience

- Typing `/` (or `/wo` to filter) in the chat input opens the autocomplete dropdown.
- **↑ / ↓** navigates the list.
- **Enter** or **Tab** confirms the highlighted command.
- **Escape** dismisses the dropdown without executing.
- Clicking a row in the dropdown executes the command.

The dropdown only appears when the `/trigger` text is at the very end of the input (with no other content after it), so it never interrupts mid-sentence typing.

## Example: Command with Arguments

```ts
slashCommandRegistry.register({
  trigger: 'translate',
  description: 'Translate the next message — type your text after /translate',
  category: 'custom',
  execute: (args, ctx) => {
    if (args) {
      // args was provided inline — send as a translation request
      ctx.setContent(`Please translate the following text to English:\n\n${args}`);
    } else {
      // No args yet — leave a prompt in the textarea for the user to complete
      return '/translate ';
    }
  },
});
```

Typing `/translate` and pressing Enter leaves `/translate ` in the textarea with the cursor at the end, ready for the user to type their text.

## Example: Side-effect Command

```ts
import { slashCommandRegistry } from '@openconduit/core';
import { useConversationStore } from '@openconduit/core';

slashCommandRegistry.register({
  trigger: 'export',
  description: 'Export this conversation as Markdown',
  category: 'custom',
  execute: (_args, ctx) => {
    if (!ctx.conversationId) return;
    const conv = useConversationStore.getState().conversations.find(
      (c) => c.id === ctx.conversationId,
    );
    if (!conv) return;
    const md = conv.messages
      .map((m) => `**${m.role}:** ${m.content}`)
      .join('\n\n');
    navigator.clipboard.writeText(md);
  },
});
```
