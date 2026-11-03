---
title: 'How to Connect ChatGPT to Your Phone Usage (Respite)'
description: 'Add Respite to ChatGPT as a custom MCP connector, sign in once, and ask ChatGPT about your real screen time. Setup, limits and what it can do today.'
pubDate: 2026-11-03
author: 'Respite Team'
answer: 'To connect ChatGPT to your phone usage, add Respite as a custom MCP connector using the address https://respite-api.liveintently.app/mcp, choose OAuth sign-in, then sign in with Google or Apple and allow read access. Custom connectors sit behind ChatGPT''s connector or developer-mode settings, depending on your plan, so follow OpenAI''s current steps for the exact menus. It needs Respite Plus.'
keyTakeaways:
  - 'ChatGPT can read your screen time only after you add Respite as a custom MCP connector.'
  - 'The address is https://respite-api.liveintently.app/mcp, with OAuth sign-in using Google or Apple.'
  - 'ChatGPT''s menus for custom connectors change often and depend on plan and workspace settings.'
  - 'Respite''s tools are read-only today, and reading your data needs Respite Plus.'
  - 'Asking ChatGPT to block AI websites is a different thing: that is not what this connector does.'
tags: ['chatgpt', 'mcp', 'connect chatgpt to screen time', 'phone usage', 'how to', 'respite plus', 'bring your own ai']
heroImage: '/blog-digital-wellbeing-alternatives.jpg'
howToSteps:
  - name: 'Check your ChatGPT plan and settings'
    text: 'Custom MCP connectors are available on some ChatGPT plans and may need developer mode, or an admin to allow them in a workspace. Check OpenAI''s current documentation for your plan.'
  - name: 'Open the connector settings and create a connector'
    text: 'In ChatGPT''s settings find the connectors (or apps) section, enable developer mode if your plan requires it, and choose to create a new connector.'
  - name: 'Enter the Respite details'
    text: 'Name it Respite, enter the MCP server URL https://respite-api.liveintently.app/mcp, and choose OAuth as the authentication method if asked.'
  - name: 'Sign in and allow'
    text: 'ChatGPT opens a Respite sign-in page. Choose Google or Apple, the same account as in the app, and allow read access.'
  - name: 'Enable it in a chat and ask'
    text: 'Start a chat, switch the Respite connector on, and ask: How did my screen time this week compare with last week?'
faq:
  - question: 'Can ChatGPT see my phone usage?'
    answer: 'Not by default. ChatGPT cannot read your phone, and it will tell you so. With Respite Plus you can add Respite to ChatGPT as a custom MCP connector, sign in and allow read access, after which ChatGPT can fetch your synced usage, insights and limits when you ask. Without that connection it only knows what you paste in.'
  - question: 'How do I add an MCP server to ChatGPT?'
    answer: 'In ChatGPT''s settings, open the connectors or apps section, enable developer mode if your plan needs it, and create a connector with the server URL. For Respite the URL is https://respite-api.liveintently.app/mcp and the authentication is OAuth. Menu names and plan availability change often, so check OpenAI''s documentation for the current steps.'
  - question: 'Why can''t I find custom connectors in ChatGPT?'
    answer: 'Custom MCP connectors are not offered on every plan or in every workspace, and OpenAI has renamed and moved the settings more than once. Look for developer mode under the connectors or apps settings, and on a team plan ask an admin to allow it. If it still is not there, Claude or Cursor can connect to Respite today.'
  - question: 'Is there a ChatGPT app blocker that stops me opening apps?'
    answer: 'ChatGPT itself cannot block apps on your phone. Searches for a ChatGPT app blocker usually mean either blocking ChatGPT, which an ordinary app blocker can do, or letting an AI control blocking. Respite''s connector lets ChatGPT read your usage and limits; tools that let an AI change limits are planned but not live.'
  - question: 'Does ChatGPT keep my Respite data?'
    answer: 'Whatever a tool returns becomes part of your ChatGPT conversation, so OpenAI handles it under its own terms and your data-controls settings, such as chat history and training options. Respite runs no AI on your data and only responds to the calls ChatGPT makes. You can turn off history, delete the chat or disconnect the connector.'
  - question: 'How do I disconnect ChatGPT from Respite?'
    answer: 'Open the connector in ChatGPT''s settings and disconnect or delete it, which ends its access. Deleting your Respite account also ends every connection. A Connected AI screen inside the Respite app, iPhone first, is planned but is not available yet.'
---

ChatGPT can talk about screen time all day, but it has never seen yours. Ask it how much you scroll and it will say it cannot know. Give it a bridge to your real numbers and the conversation changes from generic advice to "your Thursdays are the problem, and it is Instagram after 10 pm". This guide is that bridge, for ChatGPT.

One honest caveat first: ChatGPT's custom connector screens are the part of this setup that changes most. OpenAI has renamed and moved them more than once, they depend on your plan and workspace, and we cannot test every account type. So this guide gives you the exact values to enter and describes the steps in general terms. Where the menus differ from what you see, [OpenAI's documentation](https://developers.openai.com/apps-sdk/) is the authority on the clicks; this page is the authority on the Respite side.

## What do you need?

- **Respite Plus** on an account you can sign in to with Google or Apple. Reading your data through an AI is a [Plus feature](/blog/respite-plus-whats-included/).
- **Synced data.** At least one device signed in and syncing, or there is nothing to read.
- **A ChatGPT plan and workspace that allow custom MCP connectors.** This is the variable part. Developer mode, where required, is a switch in the connector or app settings. On Business, Enterprise or Edu workspaces an admin may need to allow it.
- **These values:**
  - Name: `Respite`
  - MCP server URL: `https://respite-api.liveintently.app/mcp`
  - Authentication: OAuth (no API key; Respite registers ChatGPT itself)

## How do I add Respite to ChatGPT?

1. In ChatGPT, open **Settings** and find the section for **connectors** (some versions say **apps**).
2. If your plan requires it, turn on **developer mode** in that section's advanced settings. Read the warning: developer mode lets ChatGPT call tools you add yourself, which is exactly what you want here and is also why you should only add servers you trust.
3. Choose to **create** a new connector or app.
4. Enter the name and the URL above. Choose **OAuth** when it asks how to authenticate.
5. Save. ChatGPT sends you to a Respite page: choose **Google** or **Apple**, review the permission, and choose **Allow**.
6. Open a new chat, use the tools or connectors menu to switch **Respite** on for that conversation, and ask your first question.

If you get stuck at step 2 because developer mode or custom connectors do not exist for your account, you have two options: ask your workspace admin, or connect a different assistant. [Claude connects to Respite in about two minutes](/blog/connect-claude-to-screen-time/), and Cursor and other MCP clients work too, as described in [the all-clients guide](/blog/connect-claude-chatgpt-cursor-to-respite-mcp/).

## What can ChatGPT do with Respite today?

Read. ChatGPT can call these tools, and picks which for each question:

| Tool | What ChatGPT gets |
|---|---|
| `get_account` | Your plan, devices and when this connection was made. Works on a free account. |
| `get_usage` | Minutes per app or per day for up to 92 days, merged across your devices. |
| `get_insights` | This period against the last: top apps, busiest day, limits kept, walk-aways, baseline. |
| `list_limits` | Your per-app limits and schedules. |
| `list_events` | Sessions, or the moments Respite interrupted you at a limit and what you chose. |
| `get_progress` | Acorns, XP, streak, freezes, quests and league tier. |

Everything is read-only. ChatGPT cannot change a limit, schedule or setting today. If it says it has, check the app: it has not.

## What should I ask first?

A broad question to see it work:

> Use my Respite data. How did my screen time this week compare with last week, which apps changed most, and which day was my worst?

Then something specific to you:

> Look at my limits and my usage together. Which limit am I closest to always breaking, and what would a realistic limit be instead?

> When Respite paused me at a limit, how often did I walk away? Which app do I give in to most?

ChatGPT tends to answer in confident paragraphs. Ask it to show the numbers it used ("list the tool results you based this on") so you can check, and remember it is advice on top of your data, not a verdict. The [prompt library](/blog/chatgpt-claude-screen-time-prompts/) has thirty more, including ones that work without any connector.

## Is this the same as a ChatGPT app blocker?

No, and it is worth being clear because the search results blur it. People who type "ChatGPT app blocker" want one of two things:

- **To block ChatGPT itself** (or other AI sites) because they use it too much. Any app blocker or website blocker can do that, including Respite's pause on a chosen app or site.
- **To have an AI manage their blocking.** That is the idea behind letting an AI change your limits. Respite's connector does not do this yet: tightening a limit applying at once while loosening needs your approval on your phone is the planned design, and it is not live. The status is tracked on [the AI hub](/ai/).

What the connector does today is the part that comes first anyway: letting an assistant understand your real habits.

## What happens to my data in ChatGPT?

Whatever a Respite tool returns is placed in your conversation, so it is processed by OpenAI under its own terms and your account's data controls (chat history, training and memory options). Check those settings before you connect, especially if you would rather your usage not be used for training. Respite runs no AI on your data, trains nothing on it, and answers only the calls ChatGPT makes, for the permission you allowed. [Is it safe to give an AI your screen time data?](/blog/is-it-safe-to-give-ai-your-screen-time-data/) goes through this in detail.

## Troubleshooting

- **No place to add a connector.** Plan, region or workspace restrictions. See above for the Claude alternative.
- **ChatGPT answers without calling Respite.** Switch the connector on in the chat and say "use my Respite data".
- **"This needs Respite Plus."** Upgrade in the Respite app, then ask again.
- **A permission error.** Disconnect the connector, add it again and allow read access.
- **The numbers look low.** Check sync. `get_account` lists your devices and when each was last seen, so ask ChatGPT to run it.

## How do I disconnect?

Open the connector in ChatGPT's settings and disconnect or delete it. That ends its access. Deleting your Respite account ends every connection. A Connected AI screen in the app is planned for iPhone first and does not exist yet.

## Next step

Add the connector, ask the broad question above, and pick one limit to change. Not on Respite yet? [Download it](/download/). For the bigger picture, see [AI and screen time](/ai/).

## Related articles

- [How to connect Claude to your screen time](/blog/connect-claude-to-screen-time/)
- [30 prompts to ask Claude or ChatGPT about your screen time](/blog/chatgpt-claude-screen-time-prompts/)
- [Can ChatGPT help you reduce screen time?](/blog/use-chatgpt-claude-to-reduce-screen-time/)
