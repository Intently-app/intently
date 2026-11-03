---
title: 'Let Your AI Change Your Limits: Approval, Log and Undo'
description: 'How letting Claude or ChatGPT change your screen time limits will work in Respite: tighten at once, loosen with your approval, with a change log and undo.'
pubDate: 2026-11-03
draft: true
author: 'Respite Team'
answer: 'Letting an AI change your screen time limits is planned for Respite and is not live yet. The design is that an AI can tighten a limit or schedule immediately, because that only makes your phone stricter, but loosening one needs your approval on the phone. Every change goes into a change log, and you can undo it.'
keyTakeaways:
  - 'Today Respite''s AI connection is read-only; changing limits is planned, not live.'
  - 'Tightening a limit or schedule applies at once; loosening waits for your approval on the phone.'
  - 'A change log records what an AI changed, and undo reverses it.'
  - 'A Connected AI screen in the app (iPhone first) will show and remove connections.'
  - 'Separate permissions mean you can allow reading without allowing changes.'
tags: ['let ai set limits', 'ai agent control phone limits', 'let claude set app limits', 'mcp', 'approval', 'undo', 'bring your own ai']
heroImage: '/blog-digital-wellbeing-alternatives.jpg'
faq:
  - question: 'Can Claude or ChatGPT set my app limits?'
    answer: 'Not yet. Respite''s tools are read-only today, so a connected AI can read your usage and limits but not change them. Tools that let an AI change limits and schedules are planned, with a rule that tightening applies immediately and loosening needs your approval on your phone. We will update this page when they ship.'
  - question: 'Why does loosening a limit need approval?'
    answer: 'Because the risk is asymmetric. If an AI makes a limit stricter, the worst outcome is that you are blocked sooner than you wanted, which you can reverse. If it loosens one, it could undo the very protection you set up, perhaps at 11 pm. Requiring your approval on the phone keeps the decision with you.'
  - question: 'Can I undo what an AI changed?'
    answer: 'That is the plan. Each change an AI makes will be recorded in a change log with what changed, when and which AI did it, and you will be able to undo it. This is not live yet. Until it ships, no AI can change your limits, so there is nothing to undo.'
  - question: 'Will I be able to allow reading but not changing?'
    answer: 'Yes. Respite already defines separate permissions: reading usage and history, and distinct permissions for limits, the messages shown at a limit, and custom rules. A connected AI gets only what you approve on the consent screen, and a tool that needs a permission you did not grant returns an error instead of acting.'
---

<!-- DRAFT: publish only when the write tools ship. The text below is the planned design, written in the future tense on purpose. To go live: remove draft: true, switch the answer, keyTakeaways and body to the present tense, set pubDate, flip the /ai/ "Coming" rows to "Live", update bring-your-own-ai-to-respite and the connect posts, add a changelog entry in src/data/changelog.ts, and add this URL to public/llms.txt. -->

## What is planned?

Respite's AI connection today only reads. The next stage lets your own AI change things: raise or lower a daily limit, add a schedule, or turn one off. The question is how to make that safe, and the design answers it with three rules.

## Rule 1: tightening applies immediately

If an AI makes your phone stricter, such as lowering Instagram from 60 minutes to 40 or extending a bedtime schedule, the change takes effect at once. The reasoning is that a stricter limit cannot hurt you in the way a looser one can, and making you wait for approval on something that helps you would just be friction in the wrong place.

## Rule 2: loosening needs approval on your phone

If an AI wants to make something weaker, such as raising a limit, shortening a schedule or turning one off, it does not happen until you approve it on your phone. The protection you set up when you were calm should not be undone by a chat at midnight, even a polite one.

## Rule 3: every change is logged and can be undone

Each change will go in a log that records what changed, when, and which AI did it. Undo reverses it. An in-app Connected AI screen, iPhone first, will list your connections and let you remove them.

## How will permissions work?

Permissions are separate. Reading usage is its own permission; changing limits and schedules, the messages shown at a limit, and custom rules are others. You can let an AI read without letting it change anything, and you can disconnect it at any time from your AI app.

## What can I do today?

Read. [Connect Claude](/blog/connect-claude-to-screen-time/) or [ChatGPT](/blog/connect-chatgpt-to-phone-usage/) and ask which limits to change, then change them yourself. See [AI and screen time](/ai/) for the current state.

## Related articles

- [AI and screen time: bring your own AI to Respite](/ai/)
- [Is it safe to give an AI your screen time data?](/blog/is-it-safe-to-give-ai-your-screen-time-data/)
