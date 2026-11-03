---
title: 'What Is an MCP Server? A Plain-English Guide'
description: 'MCP explained without jargon: what an MCP server is, how Claude or ChatGPT use one, with a screen time example, and what to check before you connect.'
pubDate: 2026-11-03
author: 'Respite Team'
answer: 'An MCP server is a small service that lets an AI assistant such as Claude or ChatGPT use another app''s data and actions, through an open standard called the Model Context Protocol. You add the server to your assistant, sign in, and the assistant can then call the app''s tools when you ask. For example, a screen time server lets your AI read your real usage.'
keyTakeaways:
  - 'MCP (Model Context Protocol) is an open standard for connecting AI assistants to other apps and data.'
  - 'A server offers tools; the assistant (the client) decides when to call them, and you approve the connection.'
  - 'Remote servers use a web address and OAuth sign-in, so there is nothing to install on your computer.'
  - 'Connecting only makes sense if you trust both the server and your assistant''s provider with the data.'
  - 'Respite runs one for screen time: reads by default, optional stricter-limits access, Respite Plus.'
tags: ['mcp', 'what is an mcp server', 'model context protocol', 'ai', 'claude', 'chatgpt', 'explainer', 'bring your own ai']
heroImage: '/images/blog/what-is-an-mcp-server.jpg'
heroImageAlt: 'A cutaway house where a dumbwaiter lifts trays of a chart, clock and sprout up to a chat bubble upstairs.'
faq:
  - question: 'What is an MCP server in simple terms?'
    answer: 'It is a connector between an AI assistant and an app. The server lists the things it can do, such as "get this week''s usage", and the assistant calls them when your question needs them. MCP stands for Model Context Protocol, an open standard, so one server can work with Claude, ChatGPT, Cursor and other assistants that support it.'
  - question: 'Do I need to be a developer to use an MCP server?'
    answer: 'Not for remote servers. You paste a web address into your assistant''s connector settings, sign in with your usual account and allow the permissions. Local servers, which run on your own computer, do need technical setup, but a hosted server such as Respite''s does not. Menus vary by assistant and plan.'
  - question: 'Is an MCP server safe?'
    answer: 'It depends on who runs it and what you allow. A server can only do what its tools and your permissions allow, and a good one is read-only unless you say otherwise. Check who operates it, what data it returns, whether sign-in is by OAuth, and how to disconnect. Only add servers you trust, because their output goes into your chat.'
  - question: 'What is the difference between MCP and an API?'
    answer: 'An API is how software talks to a service, written for developers. MCP is a standard way to describe what a service can do so that an AI can discover and use it without custom code. Many MCP servers sit on top of an ordinary API; MCP adds descriptions, input rules and a common connection method that assistants understand.'
  - question: 'Which AI assistants support MCP?'
    answer: 'Claude (Claude.ai, Claude Desktop and Claude Code), ChatGPT on plans with custom connectors, Cursor and a growing list of other tools support it, though plan availability and menu names change often. Remote servers with OAuth sign-in are the most widely supported kind. Check your assistant''s documentation for the current steps.'
  - question: 'What can an MCP server do for screen time?'
    answer: 'It can let your AI read your real usage, limits and progress, so it can answer questions such as which apps changed most this week or which limit you break most. Respite''s server does this with Respite Plus. If you opt in, it can also make limits stricter; anything looser needs your approval, and every change is logged and can be undone.'
---

If you have seen "MCP" in an AI app's settings and moved on, you are in good company. The name sounds like plumbing, and it is, but it is plumbing that decides whether your AI assistant can only talk or can also look at your actual things. Here is what it means without any of the jargon, with one example you can try.

## What does MCP stand for, and what is it?

MCP is the **Model Context Protocol**, an open standard first published by Anthropic in late 2024 and since adopted well beyond Claude. It describes one thing: a common way for an AI assistant to connect to other software, so the assistant can read information from it and, if you allow, do things in it.

The best-known comparison is a USB port. Before USB, every device needed its own cable and driver. Before MCP, every AI needed its own custom integration with every app. With a shared standard, an app builds one connector and any assistant that speaks the standard can use it.

## What are the pieces?

Three, and it helps to name them:

- **The client** is the AI app you talk to: Claude, ChatGPT, Cursor.
- **The server** is the connector the other app provides. It says "here are the things I can do" and carries them out.
- **Tools** are those things. Each has a name, a description the AI can read, and rules for what it accepts. "Get usage for this date range" is a tool.

When you ask a question, the assistant reads the list of tools, decides whether one helps, calls it, and uses the result in its answer. You do not pick tools; you ask in plain language. Some assistants show you the call so you can see what happened, and some ask permission before write-style actions.

## What is a "remote" MCP server?

Servers come in two kinds:

| | Local server | Remote server |
|---|---|---|
| Where it runs | On your computer | On the provider's servers |
| Setup | Install software, edit a config file | Paste a web address |
| Sign-in | Often an API key you manage | OAuth: you sign in with your normal account |
| Who it suits | Developers | Everyone |

Respite's is remote: `https://respite-api.liveintently.app/mcp`. You add that address, sign in with Google or Apple, allow the permissions, and nothing is installed. OAuth means your password never goes to the AI app; you grant it a limited, revocable pass instead.

## What does an MCP server look like for screen time?

Take Respite, the app this site is about. Respite is, to our knowledge, the first mobile screen time app with a built-in MCP server (November 2026). It offers read tools and, if you opt in, tools that make limits stricter:

- `get_account`: your plan, devices and when the AI connected
- `get_usage`: minutes per app or day, merged across devices
- `get_insights`: this period against the previous one, with limits kept and walk-aways
- `list_limits`: your limits and schedules
- `list_events`: individual sessions and interruptions
- `get_progress`: streak, acorns, quests

You ask Claude, "Which app grew most this week, and what day was my worst?" Claude calls `get_insights`, gets back structured numbers, and writes a plain answer. The read tools only look. If you opted in to stricter limits, the write tools can lower a limit or add a schedule, but never loosen one without your approval. The [AI hub](/ai/) lists what is live and what is coming, and the connect guides cover [Claude](/blog/connect-claude-to-screen-time/) and [ChatGPT](/blog/connect-chatgpt-to-phone-usage/).

## Why would an app offer MCP rather than its own AI?

Because an app's AI is a second-best assistant. It knows your app and nothing else, you pay for it twice if you already have Claude or ChatGPT, and your data goes to yet another company's model. MCP flips that: the assistant you already use and trust comes to the app. This is what we mean by [bring your own AI](/blog/bring-your-own-ai-to-respite/). The trade-off is honest to state: an in-app coach can interrupt you at the moment you tap an app, which a chat assistant cannot, so the two are different tools. [AI screen time coach apps compared](/blog/ai-screen-time-coach-apps-compared/) goes through the difference.

## What are the risks?

MCP gives an AI a reach it did not have, so it deserves the same care as any permission:

- **Data leaves the app.** What a tool returns lands in your conversation, and your assistant's provider handles it under its own policy. Treat it as you would pasting the same data in.
- **Trust the server.** A server's descriptions and results are read by the AI, and a malicious one can try to steer it (this is called prompt injection). Add servers from providers you know.
- **Prefer read-only.** A server that only reads cannot damage anything. If one can change things, look for approvals and a log of changes. Respite's connection reads by default; changing limits is an unticked option, and it only applies stricter changes on its own.
- **Know how to leave.** Find out how to disconnect before you connect.

[Is it safe to give an AI your screen time data?](/blog/is-it-safe-to-give-ai-your-screen-time-data/) applies this checklist to Respite specifically.

## How do I add an MCP server to my assistant?

The pattern is the same everywhere, and only the menus differ:

1. Find the **connectors** (or **apps**, or **MCP**) section in your assistant's settings.
2. Choose to add a **custom** or **remote** server and paste its address.
3. Sign in when the page opens and read the permissions.
4. Switch the connector on in a chat, and ask.

Claude, Cursor and Claude Code differ in the clicks; ChatGPT differs by plan and may require developer mode. If you want the exact Respite steps, use [the Claude guide](/blog/connect-claude-to-screen-time/), [the ChatGPT guide](/blog/connect-chatgpt-to-phone-usage/) or [the all-clients guide](/blog/connect-claude-chatgpt-cursor-to-respite-mcp/).

## What else uses MCP?

Plenty, which is the point. There are servers for code hosts, documents, calendars, databases and time trackers. In the screen time and focus corner, as far as we found in November 2026, there is a desktop website blocker with an MCP server (LockIn MCP), and community-made servers that read Mac Screen Time, RescueTime or ActivityWatch data. Most of those are local or unofficial. [Respite vs LockIn MCP](/blog/respite-vs-lockin-mcp/) compares the two official ones fairly.

## Next step

You do not need to understand MCP to use it, only to know what you are agreeing to. If you want to try it on something low-risk and useful, connect your screen time: [AI and screen time](/ai/) has the overview, and [Respite](/download/) is free to start.

## Related articles

- [AI and screen time: bring your own AI to Respite](/ai/)
- [Is it safe to give an AI your screen time data?](/blog/is-it-safe-to-give-ai-your-screen-time-data/)
- [Bring your own AI to Respite](/blog/bring-your-own-ai-to-respite/)
