---
title: "Can ChatGPT Track Your Spending? What Works in 2026"
description: "ChatGPT can analyze your spending, but how depends on where you live and your plan. What Finances does, what works outside the US, and the connector limits."
pubDate: 2026-11-09
topic: ai
answer: "Yes, with limits. In the US, ChatGPT's Finances feature can read bank data through Plaid, but it is read-only and US-only. Elsewhere you can upload statements and ask for an analysis, which is useful but doesn't keep running records. Third-party finance connectors exist, though ChatGPT restricts which plans can add them and which can write."
keyTakeaways:
  - "Finances in ChatGPT reads accounts through Plaid. It can't move money, and it is only available in the US."
  - "Uploading a CSV statement works anywhere and gives a good one-off analysis, but each upload stands alone."
  - "Connectors that can write entries have been limited to business plans, so check your plan before choosing one."
  - "If you need to log cash, wallets or spending your bank doesn't report, you need something that accepts entries."
faq:
  - question: "Is Finances in ChatGPT available outside the United States?"
    answer: "Not as of November 2026. Reports on its rollout describe it as US-only, and we found no announced plan for other countries."
  - question: "Can ChatGPT move money from my bank account?"
    answer: "The Finances feature is read-only. Reporting on the launch says it can't move money or see full account numbers."
  - question: "Can I add a personal finance connector to ChatGPT Plus?"
    answer: "It depends on the current rules, which have been changing. Setup pages from finance connector makers, citing OpenAI's help center, say write-capable connectors are in beta on Business, Enterprise and Edu, that Pro is read-only, and that Free and Go can't add custom connectors. Plus wasn't clearly listed. Check OpenAI's help center for your plan."
  - question: "What file should I upload for the best analysis?"
    answer: "A CSV export if your bank offers one. Rows and columns are easier to read accurately than a PDF. If you only have a PDF, ask ChatGPT to list every row it found and compare the total with your statement before trusting the analysis."
tags: ["chatgpt expense tracker", "chatgpt finances", "track spending with chatgpt", "chatgpt budget", "plaid"]
---

ChatGPT is good at looking at money you have already spent. Whether it can keep track of your spending over time depends on three things: where you live, which plan you are on, and whether your spending shows up in a bank feed at all.

## If you are in the US: Finances in ChatGPT

OpenAI [previewed personal finance tools in May 2026](https://decrypt.co/368039/chatgpt-see-bank-account-what-actually-means), starting with US Pro users. You link accounts through Plaid and ask questions about balances, transactions, investments and liabilities. By October, [reports said it was reaching the US Free plan too](https://mixed-news.com/en/?p=35285), although free users may not all see it yet.

What matters for tracking is that the feature only reads. It can't move money. It also shows you what your bank reports, which leaves gaps:

- Cash spending never appears.
- Money you lent a friend looks like an ordinary payment.
- A category is only as good as the merchant name the bank sent.

For a US household whose spending mostly runs through linked accounts and cards, that may be all you need.

## If you are anywhere else: upload a statement

Outside the US, the most reliable approach is to export a statement and upload it. Use CSV if your bank offers it, because rows and columns are easier to read accurately than a PDF. Then ask for the work and for a way to check it:

> Here is my bank statement for October. List every transaction with a category. Then give me totals by category, and show that they add up to the statement's total. Tell me about any row you weren't sure how to read.

The last sentence does the most work. A total that doesn't match your statement tells you something was missed.

This works in any country and on any plan that accepts files. Its limit is that each upload stands alone. Comparing this month with the last six means uploading all six, and any correction you made to a category last time is gone.

## Keeping running records in a chat

You can also tell ChatGPT what you spend as you go, and ask it to keep a list in one conversation. That is fine for a holiday. It is the same trap as [tracking expenses in a Claude chat](/articles/track-expenses-in-claude/): the records are only text in a conversation, and nothing checks them.

## Using a finance connector with ChatGPT

Connectors let an AI app read and write records in another service. This is where ChatGPT differs from Claude, and where the rules have changed most.

According to the setup pages of two finance connectors, [AI Money](https://www.ai-money.app/features/claude-chatgpt-connector/) and [MyFinance MCP](https://myfinance-mcp.com/), both citing OpenAI's documentation at the time of writing:

| ChatGPT plan | Custom finance connector |
|---|---|
| Free and Go | Can't add custom connectors |
| Plus | Not clearly listed |
| Pro | Read-only |
| Business, Enterprise and Edu | Write-capable connectors, in beta |

MyFinance MCP also notes that ChatGPT needs Developer mode for this, on the web only. Rules like these change often, so check [OpenAI's help center](https://help.openai.com) for your plan before you commit to anything.

In practice, if you are on a personal ChatGPT plan and want an AI that logs entries for you, your options are narrower than on Claude, where [every plan can add a custom connector](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).

## What ChatGPT isn't doing in any of these

An analysis isn't a set of books. A set of books has a few properties a chat answer doesn't:

- Each transaction is stored once and can be corrected in one place.
- A transfer between your own accounts isn't counted as spending.
- Credit card purchases are counted when you buy, and paying the bill isn't counted a second time.
- Totals come from arithmetic rather than from reading text.

Those are the reasons [double-entry bookkeeping](/articles/double-entry-for-personal-finance/) exists. You don't need to learn it, but you do want whatever holds your numbers to follow it.

## What to use

- **In the US, with most spending on linked accounts:** try Finances in ChatGPT.
- **Outside the US, for a one-off look:** upload a CSV and ask for the check above.
- **For running records that include cash and wallets:** use something that accepts entries, and connect it to an AI app whose plan allows that.

## Where Hisab fits

Hisab connects to AI apps over MCP, and it accepts entries from cash, wallets and bank texts with no bank login. We have tested it with Claude. ChatGPT uses the same standard, but we haven't finished checking it, and the plan limits above would apply. Hisab is in private testing and isn't open to everyone yet.
