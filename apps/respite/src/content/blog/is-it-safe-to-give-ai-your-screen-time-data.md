---
title: 'Is It Safe to Give an AI Your Screen Time Data?'
description: 'What actually reaches Claude or ChatGPT when you connect screen time, who handles it, how permissions and disconnecting work, and what to check first.'
pubDate: 2026-11-03
author: 'Respite Team'
answer: 'It is low-risk compared with messages or photos, but not nothing. When you connect screen time to an AI, whatever the tools return becomes part of your chat, so the AI provider handles it under its own policy. With Respite, the AI sees only synced data, only after you allow it, can only read unless you opt in to letting it make your limits stricter, and loses access when you disconnect. Respite runs no AI and trains nothing.'
keyTakeaways:
  - 'Anything a tool returns goes into your chat, so your AI provider''s policy and your settings there apply.'
  - 'Respite''s connection reads by default; changing limits is opt-in, and only stricter changes apply on their own. It needs Respite Plus and your sign-in.'
  - 'Respite runs no AI on your data and does not train models on it.'
  - 'Disconnect in your AI app''s connector settings; deleting your Respite account ends every connection.'
  - 'Check your chatbot''s history and training settings before you connect, not after.'
tags: ['privacy', 'ai', 'mcp', 'screen time data', 'claude', 'chatgpt', 'is it safe', 'bring your own ai']
heroImage: '/blog-digital-wellbeing-alternatives.jpg'
faq:
  - question: 'Is it safe to give an AI my screen time data?'
    answer: 'For most people the risk is modest: usage minutes and app names reveal habits, not messages or photos. But habits are personal. Once data enters a chat, the AI provider processes it under its own terms. Connect only to an assistant whose privacy settings you have checked, share the minimum, and know how to disconnect.'
  - question: 'What data does Respite send to Claude or ChatGPT?'
    answer: 'Only what the AI asks for through Respite''s read tools, and only for the permission you allowed: your account details (plan, devices), usage minutes per app or day, insights, limits and schedules, sessions and limit interruptions, and game progress. Data that never synced from a device is not available. Nothing is sent until the AI makes a call.'
  - question: 'Does Respite train AI on my data?'
    answer: 'No. Respite runs no AI model on your data and does not use it to train models. The thinking happens in the assistant you chose, on its provider''s systems, under its policy. Respite only answers the calls your connected assistant makes. You can disconnect any time, which ends the assistant''s access.'
  - question: 'Can the AI change my limits or settings?'
    answer: 'Only if you opt in. By default a connected AI can only read. On the approval page you can tick "Also let it make my limits stricter"; then it can lower a limit or add a schedule, and that applies at once. Raising or removing a limit, or removing a schedule, never applies on its own: it becomes a request you approve in the Respite app, and until the Connected AI screen reaches your app you change limits yourself. Every change is logged, and the AI can undo its own.'
  - question: 'How do I stop an AI seeing my screen time?'
    answer: 'Disconnect or remove the Respite connector in your AI app''s connector settings. That ends its access immediately. Deleting your Respite account also ends every connection. You can also turn off sync on your devices to stop new data reaching the account. A Connected AI screen inside the Respite app is arriving in app updates.'
  - question: 'Do ChatGPT and Claude store my screen time data?'
    answer: 'Conversations are stored according to each provider''s policy and your settings, such as chat history, memory and training options. Because tool results are part of the conversation, they are stored the same way. Check those settings before connecting, and delete the chat or turn history off if you do not want the data kept.'
---

The honest answer to this question is "it depends on what you hand over, to whom, and what you can take back". Screen time data is not the most sensitive thing on your phone, but it is not trivial either: it says when you are awake, what you reach for when you are low, and how your week really goes. Before you let any assistant read it, here is what actually happens, so you can decide.

## What counts as screen time data?

In Respite's case, the data an AI can reach through its tools is:

- **Account basics:** your plan, your devices' names and platforms, and when the AI was connected. Respite shows your email to you in the account tool, so an AI can see which account it is talking to.
- **Usage:** minutes per app or per day, opens and longest session where a device recorded them, merged across devices.
- **Insights:** this period against the last, your busiest day, limits kept, how often you walked away from a limit prompt.
- **Limits and schedules:** the per-app limits and blocking schedules you set.
- **Events:** individual sessions, and the moments Respite interrupted you at a limit, with what you chose.
- **Game progress:** acorns, streak, quests, your league tier (never other people).

Two limits matter. First, **only synced data** is reachable: what stays on a device that does not sync is not. Second, apps appear by name only where Respite has matched them to a known app; otherwise they appear under a platform key. On iPhone, app names stay on the device by default (Apple's Screen Time keeps them private), and the name is saved to your account only if you match an app for cross-device sync.

## Where does the data go?

Here is the part people miss. Respite does not "send your data to an AI". Your assistant asks Respite a question through a tool, Respite returns the answer, and that answer is placed into your conversation with Claude, ChatGPT or Cursor. From that moment it is part of that chat.

That means three parties are involved, in this order:

1. **You**, who connects the assistant and allows the permission.
2. **Respite**, which authenticates the connection, checks your plan and permission, and returns only what the tool asks for.
3. **Your AI provider** (Anthropic, OpenAI, Cursor, or whoever runs your client), which processes the conversation under its own terms and your settings.

Respite runs no AI of its own on your data and does not train models on it. The provider's handling is the provider's policy, so read it, and set your chat history, memory and training options to what you are comfortable with before you connect.

## How are permissions handled?

Connection uses OAuth, the same pattern as "Sign in with Google" for apps. The AI never sees your password. It receives a limited pass tied to your account and to the permissions you approved on a consent screen. Respite defines separate permissions (read; limits; the messages shown at a limit; custom rules). Reading is always part of a connection. Changing limits is a separate, unticked-by-default choice ("Also let it make my limits stricter") that only allows making them stricter. Connections made before that option existed stay read-only until you reconnect and tick it.

If a tool needs a permission you did not grant, it returns an error that tells the AI to ask you to reconnect, instead of returning data. If you are not on Respite Plus, every tool except the account check returns an upgrade message. The consent screen is the moment to decide: if you do not like what it asks for, deny.

## Can the AI change anything?

Only if you opt in. By default every tool reads, so the worst case of a mistaken or manipulated assistant is that it reads and repeats your usage. If you tick "Also let it make my limits stricter", it can also lower a limit or add a schedule, and nothing else: it cannot change pause messages or rules, write usage history, earn or spend acorns, or block apps outside your limits and schedules.

The safeguards are: **tightening** (a lower limit, a new schedule) applies immediately, because it can only make your phone stricter; **loosening** (raising or removing a limit, removing a schedule) never applies on its own and becomes a request you approve in the app, expiring after 7 days; every change is logged for 90 days with which AI did it, what changed and the reason it gave; and an AI is limited to 30 changes per connection per hour. The approval screen is arriving in app updates, so until then you change limits yourself. See [the guide to letting your AI change your limits](/blog/let-ai-change-your-limits/).

## What are the real risks?

Being concrete, in rough order of likelihood:

1. **Provider retention.** Your usage sits in a chat that your provider stores. If you would not paste a week of your habits into a chatbot, do not connect. Delete the conversation, or switch history off, if you want it gone.
2. **Over-sharing by default.** A connected assistant can call tools on any question, including ones you did not mean to be about your phone. Switch the connector off in chats where you do not want it, and leave the stricter-limits option unticked unless you want it.
3. **Prompt injection.** Text in a web page or a document that your assistant reads can try to make it call tools. Respite's tools read by default and can only make limits stricter if you opt in, which limits the damage to disclosure inside your own chat and a stricter limit you can reverse, but it is another reason to keep unrelated browsing out of a chat where Respite is on.
4. **An old connection forgotten.** Connectors linger. Review your connectors every few months.
5. **Wrong conclusions.** Not a privacy risk, but a real one: an AI can explain your habits confidently and wrongly. Treat explanations as hypotheses.

## How do I check a screen time app's privacy claims?

Whatever the app, do the same four things:

- **Read the App Store privacy label** and the Play Data safety section. They are the developer's own declaration, and anything that contradicts the marketing deserves a question. For example, as of November 2026 the App Store listing of one AI coach app describes on-device handling while its privacy label lists data linked to the user's identity. That may well be explainable; the point is to read both.
- **Ask where the AI runs.** In-app AI coaches send what you tell them, and often your usage, to the maker's AI provider. With bring your own AI, the provider is the one you already chose.
- **Look for scoped, revocable access.** OAuth with named permissions beats an API key pasted into a field.
- **Find the disconnect and deletion routes first.** Our policies are at [iPhone](/privacy/), [Android](/privacy/android/) and [Chrome](/privacy/chrome/), and for the general approach see [privacy-first screen time tracking](/blog/privacy-first-screen-time-tracking/).

## How do I disconnect?

In your AI app, open the connector settings and disconnect or delete Respite: in Claude.ai or Claude Desktop that is Settings, Connectors; in ChatGPT it is the connector or app you created; in Claude Code it is `claude mcp remove respite`. That ends access. Deleting your Respite account ends every connection at once. A Connected AI screen in the Respite app, iPhone first, is arriving in app updates.

## A sensible checklist before you connect

- Check your chatbot's history, memory and training settings.
- Decide whether you want the connector on in every chat or just when you ask.
- Read the consent screen and allow only what you need.
- Know the disconnect route.
- Keep health or relationship details out of the same chat.

If that all sounds fine, [connect Claude](/blog/connect-claude-to-screen-time/) or [ChatGPT](/blog/connect-chatgpt-to-phone-usage/). If not, you can still use an AI for screen time by pasting totals, as in [the prompt library](/blog/chatgpt-claude-screen-time-prompts/), or skip AI entirely: Respite works without it.

## Next step

The overview of what the connection does and does not do is on [the AI hub](/ai/). To use Respite itself, [download it](/download/).

## Related articles

- [AI and screen time: bring your own AI to Respite](/ai/)
- [What is an MCP server?](/blog/what-is-an-mcp-server/)
- [Privacy-first screen time tracking](/blog/privacy-first-screen-time-tracking/)
