---
title: 'How to Connect Claude, ChatGPT or Cursor to Respite (MCP)'
description: 'Step-by-step MCP setup: connect Claude.ai, Claude Code, ChatGPT or Cursor to your Respite account, sign in, allow permissions and disconnect.'
pubDate: 2026-11-03
updatedDate: 2026-11-03
author: 'Respite Team'
answer: 'To connect an AI to Respite, add a custom MCP connector with the address https://respite-api.liveintently.app/mcp. In Claude.ai use Settings, Connectors, Add custom connector; in Claude Code run claude mcp add --transport http respite followed by that address; ChatGPT and Cursor have their own custom connector settings. Then sign in with Google or Apple and allow.'
keyTakeaways:
  - 'The Respite MCP address is https://respite-api.liveintently.app/mcp for every assistant.'
  - 'Claude.ai: Settings, Connectors, Add custom connector. Claude Code: claude mcp add --transport http.'
  - 'ChatGPT and Cursor connect through their own custom MCP connector settings.'
  - 'You sign in with the same Google or Apple account as the app, then allow or deny the permissions.'
  - 'Your AI can read usage, insights, limits, events and progress; if you tick "Also let it make my limits stricter", it can lower limits and add schedules too.'
tags: ['mcp', 'claude', 'chatgpt', 'cursor', 'how to', 'respite plus', 'bring your own ai', 'connector']
heroImage: '/images/blog/connect-claude-chatgpt-cursor-to-respite-mcp.jpg'
heroImageAlt: 'A universal travel adapter where three different plugs meet one acorn-shaped socket with a flip-up cap.'
howToSteps:
  - name: 'Get the Respite address'
    text: 'The address is https://respite-api.liveintently.app/mcp. It is the same for every assistant.'
  - name: 'Add it to your assistant'
    text: 'In Claude.ai, open Settings, then Connectors, then Add custom connector and paste the address. In Claude Code, run claude mcp add --transport http respite https://respite-api.liveintently.app/mcp.'
  - name: 'Sign in'
    text: 'Your assistant opens a browser page. Sign in with the same Google or Apple account you use in the Respite app.'
  - name: 'Review and allow the permissions'
    text: 'Read what the assistant is asking for and choose Allow, or Deny.'
  - name: 'Try it'
    text: 'Ask your assistant how your screen time this week compared with last week. It should call Respite and answer with your numbers.'
faq:
  - question: 'How do I connect Claude to Respite?'
    answer: 'In Claude.ai go to Settings, Connectors, Add custom connector, and enter https://respite-api.liveintently.app/mcp. In Claude Code run claude mcp add --transport http respite https://respite-api.liveintently.app/mcp, then type /mcp to sign in. Sign in with Google or Apple, review the permissions and choose Allow.'
  - question: 'How do I connect ChatGPT to Respite?'
    answer: 'ChatGPT supports custom MCP connectors in its connector or developer-mode settings, depending on your plan and where the feature has rolled out. Add a new connector, give it the Respite address https://respite-api.liveintently.app/mcp, and sign in when asked. Menu names change often, so check OpenAI''s current instructions for the exact path.'
  - question: 'Do I need Respite Plus to connect an AI?'
    answer: 'You need Respite Plus to read your data through an AI. The connection and the account tool also work on a free account, so the assistant can tell you what is needed. The other tools, which read your usage, insights, limits, events and progress, answer with an upgrade message on a free plan.'
  - question: 'How do I disconnect an AI from Respite?'
    answer: 'Remove or disconnect the Respite connector in your AI app''s connector settings, which ends its access. Deleting your Respite account also ends every connection. A Connected AI screen inside the Respite app is arriving in app updates. To change permissions, delete the connector and reconnect with only what you want.'
  - question: 'What can my AI do with Respite today?'
    answer: 'It can read: your account, usage per app or day across devices, insights comparing this period with the last, your limits and schedules, sessions and limit interruptions, and your game progress. If you tick "Also let it make my limits stricter", it can also lower a limit or add a schedule, and undo its own changes; raising or removing limits needs your approval in the app. It cannot change pause messages or rules (planned, not available).'
---

Connecting an AI to Respite takes a couple of minutes and the same few steps in every assistant. This guide covers Claude, ChatGPT and Cursor. For what it is and why, read [bring your own AI to Respite](/blog/bring-your-own-ai-to-respite/) first. Connections read by default, and changing limits is an opt-in. Prefer a single-assistant walkthrough? See [connect Claude to your screen time](/blog/connect-claude-to-screen-time/) or [connect ChatGPT to your phone usage](/blog/connect-chatgpt-to-phone-usage/); the hub is [AI and screen time](/ai/).

## What do I need?

- A Respite account. You will sign in with Google or Apple, the same as in the app.
- [Respite Plus](/blog/respite-plus-whats-included/) to use Respite's tools through an AI.
- An AI assistant that supports remote MCP connectors.
- The Respite address: `https://respite-api.liveintently.app/mcp`

## How do I connect Claude.ai?

1. Open **Settings**, then **Connectors**.
2. Choose **Add custom connector**.
3. Enter the address `https://respite-api.liveintently.app/mcp` and a name such as Respite.
4. Follow the sign-in: choose Google or Apple on the Respite page.
5. Read the permissions and choose **Allow**.

Custom connectors may require a paid Claude plan, and on team plans an owner may need to enable them. Check Anthropic's help for your plan.

## How do I connect Claude Code?

In a terminal:

```
claude mcp add --transport http respite https://respite-api.liveintently.app/mcp
```

Then, inside Claude Code, type `/mcp`, select Respite and sign in when your browser opens.

## How do I connect ChatGPT?

ChatGPT supports custom MCP connectors in its connector settings, in some plans and regions, and sometimes behind a developer-mode switch. Add a new connector, name it Respite, give it the address above, choose OAuth sign-in if asked, and complete the Respite sign-in. The menus change often, so follow OpenAI's current instructions for the exact path on your plan.

## How do I connect Cursor or another assistant?

Add a **remote (HTTP) MCP server** with the same address. The assistant registers itself with Respite and opens your browser to sign in. The same applies to other MCP clients that support remote servers and OAuth.

## What happens when I sign in?

You are taken to a Respite sign-in page, where you choose Google or Apple, the same accounts as in the app. A consent screen then lists what the assistant is asking to do. The permissions are separate:

| Permission | What it covers |
|---|---|
| Read | Your usage, insights and history. Always part of a connection. |
| Also let it make my limits stricter | A checkbox, unticked by default. Lets the AI lower limits and add schedules, which apply at once. Raising or removing a limit and removing a schedule become requests you approve in the app. |

Allow only what you want. If you deny, nothing is connected. Connections made before the checkbox existed stay read-only until you disconnect, reconnect and tick it. Pause messages and custom rules are not available to an AI.

## What can I ask it today?

The assistant has six read tools (your account, usage, insights, limits, events and game progress), plus, if you opted in, `set_limit`, `add_schedule`, `list_changes` and `undo_change`; `remove_limit` and `remove_schedule` always create a request for you. Try:

> How did my screen time this week compare with last week, and which apps changed most?

You should get your numbers back, merged across your synced devices. If the assistant says it needs Respite Plus, that is the free-account response, and it means the connection works. If you did not tick the stricter-limits option, an assistant that claims to have set a limit for you is mistaken; and one that claims to have raised a limit has only made a request you still have to approve. More questions that work are in [30 prompts to ask Claude or ChatGPT about your screen time](/blog/chatgpt-claude-screen-time-prompts/), and the full tool list is on [the AI hub](/ai/).

## How do I disconnect?

Remove the Respite connector in your AI app's connector settings. That ends its access. Deleting your Respite account removes every connection. A Connected AI screen inside the app is arriving in app updates. Your data is only available to the assistant while a connection exists, and what it already received stays in that chat under the provider's policy; see [is it safe to give an AI your screen time data?](/blog/is-it-safe-to-give-ai-your-screen-time-data/)

## Troubleshooting

- **The sign-in page does not load.** Try again in a normal browser window and check you are not blocking cookies for the sign-in page.
- **"This needs Respite Plus."** The tool needs a Plus account; the connection itself is fine.
- **A permission error.** Disconnect and reconnect, and allow the permission the tool names.
- **Wrong account.** Sign in with the account that has your Respite data.

## Next step

Have a go, then see [how to use ChatGPT or Claude to reduce screen time](/blog/use-chatgpt-claude-to-reduce-screen-time/) for prompts to try. New to Respite? [Download it](/download/).

## Related articles

- [AI and screen time: the hub](/ai/)
- [Bring your own AI to Respite](/blog/bring-your-own-ai-to-respite/)
- [How to use ChatGPT or Claude to reduce screen time](/blog/use-chatgpt-claude-to-reduce-screen-time/)
- [Respite Plus: everything that is included](/blog/respite-plus-whats-included/)
