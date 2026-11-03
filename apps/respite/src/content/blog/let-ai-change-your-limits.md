---
title: 'Let Your AI Change Your Limits: Approval, Log and Undo'
description: 'How letting Claude or ChatGPT change your screen time limits works in Respite: stricter changes apply at once, loosening needs your approval, with a change log and undo.'
pubDate: 2026-11-03
draft: false
author: 'Respite Team'
answer: 'With Respite Plus you can let Claude, ChatGPT or Cursor make your screen time limits stricter. It is opt-in: on Respite''s approval page you tick "Also let it make my limits stricter". Lowering a limit or adding a schedule then applies at once and syncs to your devices. Raising or removing a limit, or removing a schedule, never applies on its own: it becomes a request you approve in the Respite app. Every change is logged and can be undone.'
keyTakeaways:
  - 'Write access is opt-in: tick "Also let it make my limits stricter" when you connect. It is unticked by default.'
  - 'Lowering a limit or adding a schedule applies at once and syncs to your devices.'
  - 'Raising or removing a limit, or removing a schedule, becomes a request you approve in the app; requests expire after 7 days.'
  - 'Every AI change is logged for 90 days, and an AI can undo its own changes.'
  - 'The in-app Connected AI screen for approvals is arriving in app updates; until then you change limits yourself in the app.'
tags: ['let ai set limits', 'ai agent control phone limits', 'let claude set app limits', 'mcp', 'approval', 'undo', 'bring your own ai']
heroImage: '/images/blog/let-ai-change-your-limits.jpg'
heroImageAlt: 'A ratchet knob that turns freely one way and is held by an orange latch the other, with a curling log ribbon.'
faq:
  - question: 'Can Claude or ChatGPT set my app limits?'
    answer: 'Yes, to make them stricter, if you opt in. When you connect, tick "Also let it make my limits stricter" on Respite''s approval page. Then your AI can lower a per-app daily limit or add a schedule, and it applies at once. It cannot loosen anything on its own: raising or removing a limit and removing a schedule become requests you approve in the Respite app. It needs Respite Plus.'
  - question: 'Why does loosening a limit need approval?'
    answer: 'Because the risk is asymmetric. If an AI makes a limit stricter, the worst outcome is that you are blocked sooner than you wanted, which you can reverse. If it loosens one, it could undo the very protection you set up, perhaps at 11 pm. Requiring your approval keeps that decision with you.'
  - question: 'Can I undo what an AI changed?'
    answer: 'Yes. Every change is logged with which AI made it, what changed, the before and after, and the reason the AI gave, and the log is kept for 90 days. An AI can undo its own changes with undo_change, and you can ask it to list them with list_changes.'
  - question: 'How do I let my AI make changes if I connected it earlier?'
    answer: 'Connections made before this update stay read-only. Disconnect Respite in your AI app''s connector settings, add it again, and tick "Also let it make my limits stricter" on the approval page.'
  - question: 'Where do I approve requests?'
    answer: 'In the Connected AI screen in the Respite app, which is arriving in app updates and has not shipped yet. Until it reaches your app, nothing loosens on its own, and you change limits yourself in the app. Requests expire after 7 days.'
---

## What can an AI change?

With Respite Plus, your own AI can make your limits stricter. Once you opt in, it can lower a per-app daily limit, add a schedule, list what it changed and undo its own changes. The question is how to make that safe, and the design answers it with a few rules.

## How do I turn it on?

It is opt-in. When you [connect Claude](/blog/connect-claude-to-screen-time/), [ChatGPT](/blog/connect-chatgpt-to-phone-usage/) or Cursor, Respite's approval page shows a checkbox, "Also let it make my limits stricter". It is unticked by default, so a plain connection can only read. Connections made before this update stay read-only until you disconnect, reconnect and tick it. See the [connection guide for all clients](/blog/connect-claude-chatgpt-cursor-to-respite-mcp/).

## What can I ask?

- "Lower my Instagram limit to 20 minutes on weekdays."
- "Add a schedule that blocks TikTok and YouTube 10pm to 7am."
- "Show me what you changed this week."
- "Undo the last change you made."

## Rule 1: tightening applies immediately

When your AI makes your phone stricter, such as lowering Instagram from 60 minutes to 40 or adding a bedtime schedule, the change takes effect at once and syncs to your devices. A stricter limit cannot hurt you the way a looser one can, and making you wait for approval on something that helps you would be friction in the wrong place.

## Rule 2: loosening needs your approval

If your AI wants to make something weaker, such as raising a limit, removing a limit or removing a schedule, it does not happen on its own. It becomes a request that you approve in the Respite app's Connected AI screen, and it expires after 7 days. The protection you set up when you were calm should not be undone by a chat at midnight, even a polite one.

The Connected AI screen is arriving in app updates and has not shipped yet. Until it reaches your app, nothing loosens on its own, and you change limits yourself in the app.

## Rule 3: every change is logged and can be undone

Each change is logged: which AI made it, what changed, the before and after, and the reason the AI gave. The log is kept for 90 days, and an AI can undo its own changes. An AI can make at most 30 changes per connection per hour.

## What can an AI still not do?

It cannot change your pause or intervention messages or your custom rules (planned, not available), write usage history, earn or spend acorns, or block apps outside your limits and schedules. Respite still runs no AI of its own and trains nothing on your data.

## Which tools does it use?

`set_limit`, `add_schedule`, `remove_limit`, `remove_schedule`, `list_changes` and `undo_change`, alongside the read tools. The full list is on [AI and screen time](/ai/).

## Related articles

- [AI and screen time: bring your own AI to Respite](/ai/)
- [Is it safe to give an AI your screen time data?](/blog/is-it-safe-to-give-ai-your-screen-time-data/)
- [Bring your own AI to Respite](/blog/bring-your-own-ai-to-respite/)
