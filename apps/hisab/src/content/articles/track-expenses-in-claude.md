---
title: "How to Track Expenses in Claude: 3 Ways That Work"
description: "Track spending in Claude with a chat, a spreadsheet or a finance connector. What each one remembers, where it breaks, and how to add a connector."
pubDate: 2026-11-09
topic: ai
answer: "You can track expenses in Claude three ways: keep a running list in a chat or Project, have Claude maintain a spreadsheet, or add a finance connector so Claude writes to a real ledger. Only a connector gives every chat the same up-to-date records. Claude allows custom connectors on every plan, with one on the Free plan."
keyTakeaways:
  - "A chat is fine for a trip or a week, but it is not a record you can total with confidence months later."
  - "A spreadsheet gives you a file you own, at the cost of moving that file around every time it changes."
  - "A connector lets Claude read and write the same records from any chat, including on your phone once it has been added."
  - "Connectors are added on the web or desktop, under Customize and then Connectors."
faq:
  - question: "Can Claude remember my expenses between chats?"
    answer: "Claude's memory features are built to recall context and preferences, not to hold a complete list of transactions you can total. For records you will rely on, keep them somewhere built for it: a file you upload, or a service connected through a connector."
  - question: "Does Claude's Free plan support finance connectors?"
    answer: "Yes. Anthropic's help center says custom connectors are available on Free, Pro, Max, Team and Enterprise plans, and that Free users are limited to one custom connector."
  - question: "Can I add a connector from the Claude mobile app?"
    answer: "No. According to Anthropic, the mobile app can use connectors that were already added on the web or desktop, but new ones can't be added from mobile."
  - question: "Will Claude do the math correctly?"
    answer: "Don't rely on a model adding up a long list from memory. Ask it to calculate with code if that is available to you, or use a connector where the service does the sums and Claude only reports the result."
tags: ["track expenses in claude", "claude expense tracker", "claude connector", "mcp", "ai budgeting"]
---

Most people start the same way. You tell Claude you spent 400 on groceries and ask it to keep track. It says it will, and for that conversation it does. Then you want a total for the month, in a different chat, on a different day, and the question becomes where those numbers actually live.

That is what separates the three methods below. Each one stores your spending in a different place.

## Method 1: Keep a running list in a chat or Project

Pick one conversation, or create a Project, and use it only for spending. Start with something like this:

> Keep a list of my expenses in this chat. For each one, record the date, amount, what it was and how I paid. When I ask for a total, show the list you are adding up.

**It works for:** a trip, a shared dinner, or a week when you want to notice where money goes.

**It breaks when:** the list gets long or spreads across chats. The records are just text in a conversation, so nothing checks that a line wasn't missed or read wrong. Asking Claude to show the list it is adding up lets you catch that, but you are now the checker.

## Method 2: Have Claude maintain a spreadsheet

Ask Claude to create a CSV or Excel file with columns for date, amount, category, account and notes. When you have new expenses, upload the latest file, say what changed, and download the new version. You can also upload a bank statement and ask Claude to clean it into the same columns.

**It works for:** people who want a file they own and who are happy doing this weekly at a computer.

**It breaks when:** you are on your phone at the till, or you end up with four copies named "final". The file only stays right if you always start from the newest one.

## Method 3: Add a finance connector

A connector links Claude to an outside service using MCP, an open standard for giving AI apps tools. A finance connector lets Claude log a transaction or run a report against records that live in that service, so every chat sees the same numbers. If you want the fuller explanation, read [what an MCP server for personal finance is](/articles/what-is-an-mcp-server-for-finance/).

Anthropic's [guide to custom connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) describes the setup. On the Free, Pro or Max plans it goes like this:

1. Open Claude on the web or desktop, then go to **Customize** and **Connectors**.
2. Choose **Add custom connector** and paste the service's connector address.
3. Select **Connect**, then sign in to that service in the window that opens.
4. Approve what Claude is allowed to do. A well-built service lets you choose.

A few limits are worth knowing. Free accounts can add one custom connector. On Team and Enterprise, an owner adds it and members connect individually. The mobile app can use a connector once it has been added, but can't add one. Claude reaches the service from Anthropic's cloud, so the service has to be on the internet rather than only on your computer.

Once it is connected, you talk normally:

- "Coffee 180 taka and a taxi 320, both from bKash."
- "I paid the Amex bill, 42,000 from my bank account."
- "What did I spend on eating out this month compared with last month?"
- "That taxi was yesterday, not today."

**It works for:** anyone who wants this to last longer than a month, and who wants to log something the moment it happens.

**It breaks when:** the service is badly designed. A connector that can do anything your AI decides is a risk, so read [what to check before connecting an AI to your finances](/articles/is-it-safe-to-connect-ai-to-your-money/) first.

## How the three compare

| | Chat or Project | Spreadsheet | Finance connector |
|---|---|---|---|
| Where the records live | In the conversation | In a file you keep | In the connected service |
| Available from any chat | No | Only if you upload it | Yes |
| Logging from your phone | Yes | Awkward | Yes, once added |
| Who adds up the totals | The model, unless it uses code | Spreadsheet formulas | The service |
| Setup | None | A few minutes | A few minutes and an account |

## Which should you choose?

If you only want to understand one week of spending, use a chat. If you want a file and enjoy keeping it, use a spreadsheet. If you want records you can still trust next year, use a connector, and spend your effort choosing a good one. We compare the options in [AI expense trackers compared](/articles/best-ai-expense-trackers/).

## Where Hisab fits

Hisab is a connector built around that third method. Claude logs each entry as a balanced double-entry transaction, and Hisab does the arithmetic, so the totals don't depend on the model. It is in private testing and isn't open to everyone yet.
