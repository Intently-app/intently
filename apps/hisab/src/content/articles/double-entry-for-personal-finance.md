---
title: "Double-Entry Bookkeeping for Personal Finance, Explained"
description: "Double-entry bookkeeping records where money came from and where it went. Worked examples for salary, credit cards, transfers, loans and foreign currency."
pubDate: 2026-11-09
topic: basics
answer: "Double-entry bookkeeping records every transaction in at least two accounts, so money always leaves one place and arrives in another and the totals balance. For personal finance, it means transfers are never counted as spending, credit card debt is tracked properly, and many mistakes show up by themselves because a wrong entry won't balance."
keyTakeaways:
  - "Every transaction has two sides, and the two sides are always equal."
  - "Debit and credit mean left column and right column. They don't mean good and bad."
  - "It solves problems that simple lists get wrong: transfers, card payments, refunds and money you lend."
  - "You don't have to learn it to benefit. Good software can do it behind a plain sentence."
faq:
  - question: "Do I need double-entry bookkeeping for personal finance?"
    answer: "You don't need to do it by hand. But if you have a credit card, more than one account, or you lend and borrow money, records kept this way stay accurate where a simple list of expenses starts double-counting."
  - question: "What is the difference between single-entry and double-entry?"
    answer: "Single-entry records one line per transaction, usually just an amount and a category, like a list of expenses. Double-entry records both where the money came from and where it went, which is what lets the books check themselves."
  - question: "Is a debit money going out?"
    answer: "Not in bookkeeping. A debit increases an asset or an expense, and a credit increases a liability or income. The everyday meaning on a bank statement is reversed because the statement is written from the bank's point of view: your deposit is money the bank owes you."
  - question: "Does double-entry catch every mistake?"
    answer: "No. It catches entries that don't balance. If you record the right amount in the wrong category, the books still balance. That is why reconciling against your bank statement is still useful."
tags: ["double entry bookkeeping", "personal finance", "debit and credit", "ledger", "bookkeeping basics"]
---

Double-entry bookkeeping is over 500 years old, and the idea fits in one sentence: money doesn't appear or disappear, it moves. So each transaction records where the money came from and where it went.

## The five kinds of account

Everything in a personal ledger sits in one of five groups:

| Group | What it holds | Examples |
|---|---|---|
| Assets | What you have | Bank account, bKash, cash, money owed to you |
| Liabilities | What you owe | Credit card, loan |
| Income | Where money came from | Salary, freelance work |
| Expenses | Where money went | Groceries, rent, transport |
| Equity | The starting point | Opening balances |

Categories like "Groceries" are simply accounts in the expense group. That small idea is what makes the rest work.

## Debit and credit, without the confusion

Debit and credit are the two columns of a ledger. Debit is the left and credit is the right. They don't mean good and bad.

| A debit | A credit |
|---|---|
| Increases an asset or an expense | Increases a liability or income |

Every entry has debits and credits that add up to the same number. That is the balance.

## Worked examples

### You buy lunch from your wallet

| Account | Debit | Credit |
|---|---|---|
| Expenses:Dining out | 640 | |
| Assets:bKash | | 640 |

Your dining expenses went up, and your bKash balance went down.

### Your salary arrives

| Account | Debit | Credit |
|---|---|---|
| Assets:Bank | 80,000 | |
| Income:Salary | | 80,000 |

### You spend on a credit card

| Account | Debit | Credit |
|---|---|---|
| Expenses:Groceries | 3,000 | |
| Liabilities:Credit card | | 3,000 |

The expense is counted now, on the day you bought the food, and your debt went up.

### You pay the credit card bill

| Account | Debit | Credit |
|---|---|---|
| Liabilities:Credit card | 3,000 | |
| Assets:Bank | | 3,000 |

This is where simple lists go wrong. Paying the bill isn't spending, because no expense account is involved. You already counted the groceries. A list of bank withdrawals would count that 3,000 twice, or put it under a meaningless category called "credit card".

### You move money between your own accounts

| Account | Debit | Credit |
|---|---|---|
| Assets:Bank | 5,000 | |
| Assets:bKash | | 5,000 |

It is the same idea. Your total hasn't changed, and your spending report stays clean.

### You lend a friend money

| Account | Debit | Credit |
|---|---|---|
| Assets:Receivable:Rafi | 2,000 | |
| Assets:bKash | | 2,000 |

It isn't an expense, because Rafi owes it back. Your ledger now shows that he does. When he repays, the entry reverses.

### You pay in a foreign currency

A $20 subscription paid from a taka account has two currencies in it. The ledger records the $20 and the exchange rate on that date, so that next year's report still shows what it really cost you then, even after the rate has moved.

## What you get from it

**Transfers stop inflating your spending.** Moving money between accounts never reaches an expense account.

**Net worth comes for free.** Add up assets, subtract liabilities. There is no separate calculation to maintain.

**Many errors can't get in.** An entry whose sides don't match is refused. This doesn't catch everything: the right amount in the wrong category still balances. That is why checking against your statement remains useful.

**Your reports all agree.** Spending, balances and net worth come from the same entries, so they can't drift apart.

## Why it's practical now

The reason most people never kept books like this is the typing. Choosing two accounts for every coffee isn't how anyone wants to spend an evening.

That is the part AI removes. You can say "paid the Amex bill, 42,000 from the bank" and software can work out that this is a liability going down and an asset going down, rather than an expense. You get the accuracy of a ledger, and you never need to look at the columns unless you want to.

## Where Hisab fits

Hisab is built this way underneath, and every entry has to balance before it is saved. You talk to it in plain language, or let [bank and wallet texts](/articles/track-bkash-nagad-spending/) do it. You'd only see debits and credits if you went looking. It is in private testing and isn't open to everyone yet.
