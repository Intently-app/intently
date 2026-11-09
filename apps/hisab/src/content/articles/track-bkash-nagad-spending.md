---
title: "How to Track bKash and Nagad Spending Automatically"
description: "The ways to track bKash and Nagad spending without typing it all: reading transaction texts on Android, using statements, and the traps to watch for."
pubDate: 2026-11-09
topic: sms
answer: "The most automatic way to track bKash and Nagad spending is an Android app that reads the transaction texts they send and records each payment. iPhone apps can't read texts, so there you log by hand or work from statements. bKash's app shows 90 days of statements and can produce longer ones, which helps you catch up."
keyTakeaways:
  - "Each bKash or Nagad text already holds the amount, who it went to, the fee and a transaction ID."
  - "A cash out isn't spending. It is your own money moving from the wallet to your pocket."
  - "A good tracker has to ignore one-time codes and failed payments, and count fees separately."
  - "Before granting SMS access, check whether the app sends your messages anywhere."
faq:
  - question: "Is there an app that automatically tracks bKash transactions?"
    answer: "Yes. Several Android apps read transaction texts. Finenzo is an open-source example that lists bKash and Nagad. Support varies, so test any app with your own recent messages before relying on it."
  - question: "How far back can I see my bKash transactions?"
    answer: "bKash says its app's statement option shows the last 90 days. You can request a summarized statement covering up to 12 months, or a detailed one covering up to 6 months, within the last 12 months."
  - question: "Can an iPhone app read bKash SMS?"
    answer: "No. iPhone apps can't read your text messages. The closest thing is a Shortcuts automation that runs when a matching message arrives and passes it to an app that supports it."
  - question: "Is it safe to give an app SMS permission?"
    answer: "The permission can expose all your texts, including one-time codes, so choose carefully. Prefer an app that processes messages on your phone and doesn't upload them. Read our guide to what the permission allows before you grant it."
tags: ["bkash expense tracker", "nagad expense tracker", "track bkash spending", "mobile wallet tracker", "bangladesh budget app", "sms expense tracker"]
---

If your money moves through bKash or Nagad, you are already getting a receipt for almost every payment: the text message. The question is how to turn those messages into something you can add up.

## Method 1: Let an Android app read the texts

This is the closest thing to automatic. An app with SMS permission watches for messages from bKash, Nagad and your banks, pulls out the details and records a transaction.

A typical payment text looks something like this (made-up example):

> Payment Tk 540.00 to Corner Bazar successful. Fee Tk 0.00. Balance Tk 1,300.67. TrxID 9K7A6B5C4F at 07/11/2026 14:32

That one line contains everything a ledger needs:

| Part of the text | What it becomes |
|---|---|
| Payment | The kind of transaction, and that money went out |
| Tk 540.00 | The amount and currency |
| Corner Bazar | Who it went to |
| Fee Tk 0.00 | A separate cost, if it isn't zero |
| TrxID 9K7A6B5C4F | A unique reference, so it is never counted twice |
| 07/11/2026 14:32 | The date |

Android restricts this permission, and [Google Play only allows it under a reviewed exception](/articles/sms-expense-tracker-permissions/), so it is worth understanding before you say yes.

## What a good tracker has to get right

Reading the amount is the easy part. The details below are where wallet trackers go wrong, so test any app against them.

**Fees.** A send money of Tk 500 with a Tk 5 fee cost you Tk 505. The fee belongs on its own line, or your balance will drift by a few taka every week.

**Cash out and cash in.** Taking Tk 1,000 out at an agent isn't spending. You moved money from one place you own to another. If the app counts it as an expense, you will count that money again when you spend the cash. Look for a way to record it as a transfer, and check that the fee is kept separately.

**Send money isn't always spending.** Sending your sister Tk 500 might be a gift, or a loan, or your share of the rent. A text can't tell you which. You will need to say, at least the first time.

**Messages that aren't transactions.** One-time codes, offers and failed payments arrive from the same sender. "Payment of Tk 540.00 failed due to insufficient balance" must not become an expense.

**Bangla digits.** Some messages use Bangla numerals, such as ১,০০০.০০. An app built only for Latin digits will skip them or read them wrong.

**The same message twice.** If an app reads your history and also catches new messages, it needs the transaction ID or a fingerprint so that nothing doubles.

## Method 2: Work from statements

bKash's own [statement option](https://www.bkash.com/en/customer-service/category/self-services/e-statement) covers the last 90 days in the app. You can request a summarized statement for up to 12 months, or a detailed one for up to 6 months, within the last 12 months.

Nagad's [app listing](https://apps.apple.com/gb/app/nagad/id1471844924) describes detailed transaction history and a monthly summary. We couldn't confirm how far back it goes, so check the app.

Statements are useful for catching up when you start, or for checking your records against the wallet. Going through one line by line each month is tedious, but an AI assistant can help: upload it and ask for totals by category, using the [check we describe here](/articles/can-chatgpt-track-your-spending/).

## Method 3: Log by hand

Some people prefer this. An app like [Pocket Clear](https://pocketclear.app/blog/expense-tracker-bangladesh.html) deliberately doesn't connect to bKash, Nagad or read your messages at all. You enter what you spent.

It takes a little effort each day, and that effort is also the benefit, since you notice each payment. It is the only option that asks for no permissions.

## On iPhone

iPhone apps can't read your texts, so an SMS tracker can't work the way it does on Android. Your options are manual entry, statements, or a Shortcuts automation that runs when a matching message arrives and passes it to an app that supports that.

## Getting started on Android

1. Choose an app and read what it says about where your messages go.
2. Turn on SMS reading and let it read recent history.
3. Compare a week of its entries against your bKash or Nagad app's statement.
4. Check the traps above: a cash out, a fee, a failed payment.
5. If it gets those right, leave it running and review the entries once a week.

Among apps that list wallet support, [Finenzo](https://github.com/shafisma/Finenzo) is open source, so its handling of your messages can be inspected. We haven't tested it ourselves.

## Where Hisab fits

Hisab's Android app reads transaction texts on your phone and keeps the text there. Only the details of a payment are sent to your ledger. It recognizes formats from bKash, Nagad, Rocket, Upay and 35 other services, though those were written from typical messages and are still being checked against real ones. It is in private testing and isn't open to everyone yet.
