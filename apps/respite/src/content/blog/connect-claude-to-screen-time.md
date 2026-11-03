---
title: 'How to Connect Claude to Your Screen Time (Respite)'
description: 'Connect Claude.ai, Claude Desktop or Claude Code to your real phone usage with Respite''s MCP server, then ask about your limits, habits and progress.'
pubDate: 2026-11-03
author: 'Respite Team'
answer: 'To connect Claude to your screen time, add Respite as a custom connector with the address https://respite-api.liveintently.app/mcp. In Claude.ai or Claude Desktop use Settings, Connectors, Add custom connector; in Claude Code run claude mcp add --transport http respite followed by the address. Sign in with Google or Apple, allow read access, and ask. It needs Respite Plus.'
keyTakeaways:
  - 'Claude cannot see your phone by itself: you add Respite as a custom connector and sign in once.'
  - 'Claude.ai and Claude Desktop use Settings, Connectors; Claude Code uses one claude mcp add command.'
  - 'Respite''s tools are read-only: Claude can read usage, insights, limits, events and progress, not change them.'
  - 'Reading your data needs Respite Plus; the account check works on a free account.'
  - 'Disconnect any time from Claude''s connector settings.'
tags: ['claude', 'mcp', 'connect claude to screen time', 'screen time', 'how to', 'respite plus', 'bring your own ai']
heroImage: '/blog-digital-wellbeing-alternatives.jpg'
howToSteps:
  - name: 'Check what you need'
    text: 'A Respite account with Respite Plus, synced from at least one device, and a Claude plan that allows custom connectors.'
  - name: 'Add Respite as a connector'
    text: 'In Claude.ai or Claude Desktop open Settings, then Connectors, then Add custom connector. Name it Respite and enter https://respite-api.liveintently.app/mcp. In Claude Code run claude mcp add --transport http respite https://respite-api.liveintently.app/mcp.'
  - name: 'Sign in and allow'
    text: 'Claude opens a Respite page. Sign in with the Google or Apple account you use in the app, read the permission and choose Allow.'
  - name: 'Turn the connector on in a chat'
    text: 'In Claude.ai or Claude Desktop, open the connectors menu in the chat box and make sure Respite is switched on. In Claude Code, type /mcp to check it is connected.'
  - name: 'Ask a question'
    text: 'Try: How did my screen time this week compare with last week, and which apps changed most? Claude should call Respite and answer with your numbers.'
faq:
  - question: 'Can Claude see my screen time?'
    answer: 'Only after you connect it. Claude has no access to your phone or to Respite by default. When you add Respite as a custom connector, sign in and allow read access, Claude can fetch your synced usage, insights, limits and progress when you ask. It cannot change anything, and it loses access when you disconnect.'
  - question: 'How do I connect Claude to my iPhone screen time?'
    answer: 'Install Respite on your iPhone, turn on sync with a Respite Plus account, then add Respite to Claude as a custom connector. Claude reads what your iPhone syncs to your Respite account. It does not read Apple Screen Time directly, and apps are shown by name only where Respite has matched them.'
  - question: 'Does Claude Desktop need a config file for Respite?'
    answer: 'No. Respite is a remote MCP server, so in Claude Desktop you add it under Settings, Connectors, Add custom connector, the same as on Claude.ai. The claude_desktop_config.json file is for local servers that run on your computer. Check Anthropic''s documentation if your version looks different.'
  - question: 'Is Respite''s connector read-only?'
    answer: 'Yes. Today every Respite tool only reads: your account, usage, insights, limits and schedules, sessions and interventions, and game progress. Claude cannot change a limit or schedule. Tools that change settings are planned, with tightening applied at once and loosening needing your approval on the phone.'
  - question: 'Why does Claude say it needs Respite Plus?'
    answer: 'Reading your data through an AI is a Respite Plus feature. The account tool works on a free account so the connection can tell you what is missing, and the other tools answer with an upgrade message. Upgrade inside the Respite app, then ask again; you do not need to reconnect.'
  - question: 'How do I disconnect Claude from Respite?'
    answer: 'In Claude.ai or Claude Desktop open Settings, Connectors, find Respite and disconnect or remove it. In Claude Code run claude mcp remove respite. That ends Claude''s access. Deleting your Respite account also ends every connection. A Connected AI screen inside the Respite app is planned but not available yet.'
---

Claude is good at the kind of question a screen time dashboard makes you work for. "Why do my Thursdays fall apart?" is a thirty-second conversation if the assistant can see your numbers, and a twenty-minute squint at charts if it cannot. This guide connects Claude to your real Respite data, step by step, and shows what to ask once it is in place.

Respite is, to our knowledge, the first mobile screen time app with a built-in MCP server (November 2026), so there is no other app to compare setup steps with. The short version is below; the details, including the parts that go wrong, follow.

## What do you need before you start?

- **A Respite account on Respite Plus.** Reading your data through an AI is a [Plus feature](/blog/respite-plus-whats-included/). You sign in with Google or Apple, the same as in the app.
- **At least one synced device.** Claude reads what your devices sync to your account. If you have never turned on sync, there is nothing to read yet. Android, iPhone and the browser all sync once you are signed in.
- **A Claude plan that allows custom connectors.** This varies by plan, and on team plans an owner may need to switch custom connectors on. Check Anthropic's help for your plan.
- **The Respite address:** `https://respite-api.liveintently.app/mcp`

If MCP is a new word, [what an MCP server is, in plain English](/blog/what-is-an-mcp-server/) takes five minutes. You do not need it to follow the steps.

## How do I connect Claude.ai or Claude Desktop?

Claude.ai (in the browser) and Claude Desktop use the same screen for remote servers.

1. Open **Settings**, then **Connectors**.
2. Choose **Add custom connector**.
3. Name it `Respite` and paste `https://respite-api.liveintently.app/mcp`. Leave any advanced fields empty: Respite registers Claude automatically.
4. Choose **Add**, then **Connect**. A Respite sign-in page opens.
5. Sign in with Google or Apple, read the permission, and choose **Allow**.
6. Start a chat. In the connectors menu next to the message box, make sure **Respite** is switched on for this conversation.

A note for Claude Desktop users who have set up MCP servers before: remote servers like Respite are added in the Connectors screen, not in the `claude_desktop_config.json` file. That file is for local servers that run on your own computer. Respite runs on our side, so there is nothing to install.

Connectors you add on the web or desktop also appear in Claude's mobile apps on most plans, but that can change, so treat it as something to try rather than a promise.

## How do I connect Claude Code?

Claude Code is Anthropic's coding assistant for the terminal. It speaks MCP over HTTP:

```
claude mcp add --transport http respite https://respite-api.liveintently.app/mcp
```

Add `--scope user` if you want Respite available in every project rather than just the current one. Then start Claude Code, type `/mcp`, select **respite** and choose to authenticate. Your browser opens the same Respite sign-in page. When it says you are connected, you can ask about your screen time from inside the terminal, which is a surprisingly natural place to do a weekly review if you already live there.

## What happens when I sign in?

You land on a Respite page, choose Google or Apple, and see a consent screen. Today it asks for one thing: read access to your usage, insights and history. Respite splits access into separate permissions (read; limits; the messages shown at a limit; custom rules), and only the first is used by tools that exist today. Permissions for changing things arrive with the tools that need them, and you will be asked again when they do.

You can deny. If you do, nothing is connected. If you allow and later change your mind, disconnect in Claude and nothing more can be read.

## What can Claude read?

These are the tools Claude sees. Claude chooses between them; you just ask.

| Tool | What it gives Claude |
|---|---|
| `get_account` | Your plan, your devices and when Claude was connected. Works on a free account. |
| `get_usage` | Minutes per app or per day for up to 92 days, merged across your devices, with opens and longest session where recorded. |
| `get_insights` | A period compared with the one before: top apps, busiest and lightest day, limits kept, walk-aways, your first-week baseline. |
| `list_limits` | Your per-app daily limits and blocking schedules. |
| `list_events` | Individual sessions, or the moments Respite interrupted you at a limit and what you chose. |
| `get_progress` | Acorns, XP, streak, streak freezes, quests and your league tier. Never other people. |

Two resources, `respite://today` and `respite://week`, hold ready-made summaries. Everything is read-only. If a device did not record something, the answer leaves it out rather than inventing it, and Claude is told to say so.

## What should I ask first?

Start with one broad question, then narrow:

> How did my screen time this week compare with last week? Which three apps changed most, and on which days?

Claude should call `get_insights`, then maybe `get_usage` for the days. Then try the questions that dashboards bury:

- "Did I stay inside my limits? Which limit do I break most, and is it a particular weekday?"
- "When Respite paused me, how often did I walk away? Which app am I worst at?"
- "Compare my Android and my iPhone for the last two weeks."
- "Look at my limits and schedules. Which look too loose compared with what I actually do?"
- "I want my evenings back. Based on my data, what is the one change most likely to help?"

More of these are in [30 prompts to ask Claude or ChatGPT about your screen time](/blog/chatgpt-claude-screen-time-prompts/). Claude gives you advice, not changes: if it suggests a new limit, you set it in the app.

## What does it not do yet?

Be clear-eyed about this, because other guides will not be:

- **It cannot change limits or schedules.** Every tool is read-only. We are building tools where an AI can change settings: tightening applies immediately, loosening waits for your approval on the phone, and a change log lets you undo. They are not live, so a Claude that says it set a limit for you is mistaken. See [the status of letting AI change your limits](/ai/).
- **It sees synced data only.** An app you limit on a device that does not sync will not appear.
- **Times of day need care.** Some timestamps are stored in UTC and Claude may need telling your time zone. Say "I am in London" and it will adjust.
- **It is as good as its prompt.** Claude can be confidently wrong about causes. Treat "why" answers as hypotheses.

## What are the privacy implications?

When Claude calls a Respite tool, the result becomes part of your conversation, so Anthropic processes it under its own terms and your account's data settings. Respite runs no AI of its own and trains nothing on your data; it only answers the calls Claude makes, for the permission you allowed. The full picture, including what is and is not sent, is in [is it safe to give an AI your screen time data?](/blog/is-it-safe-to-give-ai-your-screen-time-data/)

## Troubleshooting

- **Claude does not mention Respite.** Check the connector is switched on in this chat, and say "use my Respite data" in your question.
- **"This needs Respite Plus."** The connection is fine; the plan is not. Upgrade in the app, then ask again.
- **"Does not have the permission."** Disconnect and reconnect, and allow read access.
- **Empty or small numbers.** Check sync is on and the device has synced recently. `get_account` shows each device and when it was last seen.
- **The sign-in page will not load.** Use a normal browser window and allow cookies for the sign-in page.

## Next step

Connect, ask the broad question above, and set one limit based on the answer. [Download Respite](/download/) if you do not have it yet, and see [the hub for AI and screen time](/ai/) for the whole picture.

## Related articles

- [AI and screen time: bring your own AI to Respite](/ai/)
- [How to connect ChatGPT to your phone usage](/blog/connect-chatgpt-to-phone-usage/)
- [How to connect Claude, ChatGPT or Cursor to Respite](/blog/connect-claude-chatgpt-cursor-to-respite-mcp/)
