---
title: 'Respite vs LockIn MCP (2026): Phone or Desktop AI?'
description: 'Both let Claude or ChatGPT connect over MCP. LockIn blocks sites on your computer; Respite reads your phone and browser usage. A fair comparison.'
pubDate: 2026-11-03
author: 'Respite Team'
answer: 'LockIn MCP and Respite both let your own AI, such as Claude or ChatGPT, connect over MCP, but they do different jobs. LockIn is a desktop website blocker your AI can switch on and off. Respite is a mobile screen time app whose connector lets your AI read your usage, limits and progress on Android, iPhone and Chrome. Respite reads by default and, if you opt in, can make limits and schedules stricter; LockIn can switch blocking on and off.'
keyTakeaways:
  - 'LockIn MCP: desktop-centric blocking that your AI controls (block, focus mode, temporary unblock).'
  - 'Respite: mobile and browser usage that your AI reads (usage, insights, limits, events, progress).'
  - 'LockIn switches blocking on and off; Respite''s connector reads by default and, if you opt in, makes limits stricter at once; anything looser waits for your approval.'
  - 'They are complementary: one guards your computer, the other helps you understand your phone.'
  - 'Respite makes no claim to be the only screen time product with MCP, only, to our knowledge, the first mobile one.'
tags: ['lockin mcp', 'comparison', 'mcp', 'rescuetime mcp', 'activitywatch mcp', 'ai', 'respite vs lockin']
heroImage: '/images/blog/respite-vs-lockin-mcp.jpg'
heroImageAlt: 'One glowing plug splits into two cables: one flicks a switch on a monitor, one lights an open phone-shaped book.'
faq:
  - question: 'What is LockIn MCP?'
    answer: 'LockIn MCP is a website blocker built around the Model Context Protocol. Your own assistant, such as Claude, ChatGPT or Cursor, can call tools like block_domains, enter_focus_mode, temporarily_unblock_domains and get_block_status. Blocking works at the hosts-file level, fully on macOS and via the hosts file on Linux and Windows, with a Chrome extension add-on.'
  - question: 'Is there a LockIn MCP alternative for iPhone or Android?'
    answer: 'Respite is a mobile option, with a different job. Its MCP connector lets your own AI read your usage, limits and progress across Android, iPhone and Chrome, and, if you opt in, make limits stricter by lowering a limit or adding a schedule. Anything looser needs your approval in the app. It does not do ad hoc website blocking; if you need your AI to block things on request, LockIn does that on desktop.'
  - question: 'Is Respite the first screen time app with MCP?'
    answer: 'To our knowledge, Respite is the first mobile screen time app with a built-in MCP server, as of November 2026. It is not the first screen time or blocking product with MCP: LockIn MCP, a desktop blocker, came earlier, and community MCP servers read Mac Screen Time, RescueTime or ActivityWatch data.'
  - question: 'Is there an official RescueTime MCP server?'
    answer: 'We did not find one in November 2026. Community-made RescueTime MCP servers exist, some run locally with your API key and some hosted by third parties, but they are not from RescueTime. ActivityWatch has a similar community MCP server that needs ActivityWatch running on your computer. Check the project pages for current status.'
  - question: 'Can I use LockIn and Respite together?'
    answer: 'Yes, and it is a sensible split. Use LockIn on your computer, where blocking by hosts file is strong, and Respite on your phone and browser for a pause, limits, streaks and an AI that can read your usage. You can add both as connectors in the same Claude or ChatGPT account and ask about either.'
  - question: 'Which is cheaper, LockIn MCP or Respite?'
    answer: 'LockIn lists $2.99 a month, $29.99 a year and $59.99 lifetime. Respite is free to use; Respite Plus, which is needed for the AI connector, is $4.99 a month, $29.99 a year or $59.99 lifetime at the time of writing, with store prices varying by country. You also pay for your own AI plan in both cases.'
---

Search for "screen time MCP" in late 2026 and two real products show up, plus some hobby projects. They are both about letting your own AI assistant take part in how you spend your attention, and they could hardly be more different in what they do. Here is a fair look at each, because the right answer for many people is "both".

We make Respite, so read this with that in mind. Facts about LockIn MCP come from its own site and its public listing, accessed November 2026, and are linked at the end.

## What is LockIn MCP?

LockIn MCP is a website blocker designed from the start to be driven by an AI assistant. You connect your own Claude, ChatGPT, Cursor or Poke over MCP (with OAuth sign-in for the web clients), and the assistant calls tools such as `block_domains`, `enter_focus_mode`, `temporarily_unblock_domains` and `get_block_status`. Blocking happens in the computer's hosts file, which holds up through restarts and private windows. It is full-featured on macOS, works on Linux and Windows through the hosts file, and has a Chrome extension as an add-on. It also offers task-aware blocking, where the page's address and a short excerpt are sent to its server for a relevance check. It lists $2.99 a month, $29.99 a year, or $59.99 lifetime, with a trial.

In short: **your AI becomes the person who flips the blocker on and off**, mostly on a computer.

## What is Respite's MCP connector?

Respite is a screen time app for Android, iPhone and Chrome. With Respite Plus you can connect Claude, ChatGPT or Cursor over MCP, sign in with Google or Apple, and let the assistant call read tools (`get_account`, `get_usage`, `get_insights`, `list_limits`, `list_events` and `get_progress`) and, if you opt in, tools that make limits stricter (`set_limit`, `add_schedule`) plus `list_changes`, `undo_change`, `remove_limit` and `remove_schedule`. It can tell you which apps grew this week, which limits you break, whether you walk away when paused at a limit, and how your streak is going. Respite is, to our knowledge, the first mobile screen time app with a built-in MCP server (November 2026). The [hub](/ai/) has the details.

In short: **your AI becomes your analyst**, for the phone and browser. It changes nothing unless you opt in. If you do, tightening a limit applies at once, loosening needs your approval in the Respite app (arriving in app updates), and every change is logged and can be undone. See [letting your AI change your limits](/blog/let-ai-change-your-limits/).

## How do they compare?

| | LockIn MCP | Respite |
|---|---|---|
| Main job | Block websites on a computer | Pause, limit and track apps and sites; AI reads your usage |
| What your AI can do | Block, start focus mode, temporarily unblock, check status | Read usage, insights, limits, events and progress; with opt-in, lower limits and add schedules |
| Can the AI change things today? | Yes | Only to make limits stricter, and only if you opt in |
| Platforms | macOS full; Windows and Linux via hosts file; Chrome add-on | Android, iPhone, Chrome |
| Strength | Strong blocking that survives restarts | Mobile usage across devices, pause and game layer |
| MCP sign-in | OAuth for Claude web, ChatGPT, Cursor, Poke | OAuth with Google or Apple; Claude, ChatGPT, Cursor |
| Price (at the time of writing) | $2.99 a month, $29.99 a year, $59.99 lifetime | Free; Plus $4.99 a month for the connector |
| Data sent for relevance checks | Task-aware blocking sends page address and a short excerpt | Nothing to a Respite AI; tool results go to your AI provider |

## Where does LockIn MCP win?

- **It can act.** Asking Claude to block a list of sites for two hours and having it happen is a real capability, and Respite does not do that: its AI can make limits and schedules stricter at once, and anything looser waits for your approval in the app.
- **Desktop strength.** Hosts-file blocking is much harder to wander around than a browser extension alone.
- **Price.** It costs less than Respite Plus.
- **Task-aware focus.** Letting the AI decide what is relevant to your task is a neat use of an LLM, with the trade-off noted above.

## Where does Respite win?

- **Your phone.** Most of the scrolling happens there, and LockIn is centred on the desktop.
- **Usage data.** Respite measures what you do across devices, so the AI can answer questions about your habits, not only operate a blocker.
- **A pause and a free game layer** (acorns, quests, streaks) that work without any AI.
- **Free to start**, with an account optional until you want sync.

## Is Respite the only one? Is LockIn?

Neither. LockIn MCP calls itself "the only blocker with native MCP", which is a vendor claim we would not repeat as fact, and we do not claim to be the only screen time app with MCP either. Beyond the two of us, we found unofficial MCP servers that read Mac Screen Time data locally, and community servers for RescueTime (we did not find an official one) and ActivityWatch. Those are local or third-party, and they read computer activity. What we can honestly say is narrower: to our knowledge, Respite is the first **mobile** screen time app with a built-in MCP server, as of November 2026. We re-check this regularly.

## How do the privacy models differ?

They are different in kind. LockIn's blocking runs on your own computer, and its task-aware mode, when you use it, sends the address of the page and a short excerpt to its server for a relevance check; its MCP calls tell your AI what is blocked. With Respite, nothing goes to a Respite AI because there is none: your AI asks Respite for your synced usage, limits and progress, and the answers become part of your chat with your AI provider under that provider's policy. Neither is "private" in an absolute sense; both move some information to a service you choose to connect. Read each product's policy, and see [is it safe to give an AI your screen time data?](/blog/is-it-safe-to-give-ai-your-screen-time-data/) for how we think about it.

## Should I use both?

If your day has both a laptop and a phone, probably. A workable split:

1. **Computer:** LockIn, or any strong site blocker, for deep-work sessions your AI can start.
2. **Phone and browser:** Respite for a pause before the apps that eat your evenings, and for the data.
3. **Weekly:** ask your AI, connected to Respite, "how did my week go against my limits?" and use the answer to adjust.

Both can be added as connectors in the same Claude or ChatGPT account. [Claude](/blog/connect-claude-to-screen-time/) and [ChatGPT](/blog/connect-chatgpt-to-phone-usage/) have step-by-step guides for Respite.

## What if I just want a blocker, with no AI?

Then you do not need either. See [best app blockers](/blog/best-app-blocker/) for the plain options, and [Respite vs Freedom](/blog/respite-vs-freedom/) for cross-device blocking. The AI part is a bonus, not a requirement.

## Sources (accessed 3 November 2026)

- LockIn MCP: [lockinmcp.com](https://www.lockinmcp.com/), its [PulseMCP listing](https://www.pulsemcp.com/servers/devsrodrigo-lockin)
- Mac Screen Time MCP servers: [nichtlegacy/screentime](https://github.com/nichtlegacy/screentime), [AgentDank/screentime-mcp](https://github.com/AgentDank/screentime-mcp)
- RescueTime MCP search: [PulseMCP](https://www.pulsemcp.com/servers?q=rescuetime)
- ActivityWatch MCP: [8bitgentleman/activitywatch-mcp-server](https://github.com/8bitgentleman/activitywatch-mcp-server)
- Official MCP registry search for "screen time": [registry.modelcontextprotocol.io](https://registry.modelcontextprotocol.io/v0/servers?search=screen%20time)

## Next step

Want your phone's numbers in front of your AI? [Download Respite](/download/) and read [AI and screen time](/ai/).

## Related articles

- [AI and screen time: bring your own AI to Respite](/ai/)
- [Best AI app blockers and screen time apps (2026)](/blog/best-ai-app-blockers-screen-time-apps-2026/)
- [What is an MCP server?](/blog/what-is-an-mcp-server/)
