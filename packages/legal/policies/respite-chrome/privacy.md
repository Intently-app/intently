---
title: Privacy Policy for Respite for Chrome
updated: 2026-11-03
---

> **Updated 3 November 2026.** This version adds connecting an AI app that you choose (optional, Respite Plus) and corrects and completes earlier wording, including analytics and crash reports, sign-in options, sync across devices, purchases, and rewards, friends and leagues. The changes are also listed on [What's new](/whats-new/).

Respite: Screen Time Control is the browser extension of Respite, for Chrome and other
Chromium browsers. The [iPhone app](/privacy/) and the [Android app](/privacy/android/) have
their own policies.

**Developer:** MD Sadakat Hussain Fahad, publishing as Intently ·
**Contact:** [support@liveintently.app](mailto:support@liveintently.app)

Respite is a browser extension that pauses you before the websites you choose and
shows you how much time you spend on them. Everything it records stays in your
browser, on your device, unless you sign in to sync it or choose to share anonymous
usage statistics.

## The short version

- You don't need an account. Without one, nothing leaves your device except the
  usage statistics you can choose to share.
- Signing in, with Google or Apple, is optional. It syncs your goals, daily totals per
  site, journey progress and, if you join them, leagues and friends to our server.
  What syncs is listed below.
- Optional, with Respite Plus: you can connect an AI app that you choose so it can read your
  Respite data, including the daily totals this browser has synced. Nothing is shared until you
  approve it, and the AI provider's own privacy policy then applies to what it receives. See
  [Connecting an AI app](#connecting-an-ai-app-optional-respite-plus).
- Usage statistics are off until you switch on "Share anonymous usage statistics"
  (You → More settings).
- It records time only for the sites you add to it.
- You can export everything Respite has stored, or delete it all, and delete your
  account if you made one.
- Removing the extension deletes everything it stored.

## What Respite stores, and where

All of this is kept in your browser's extension storage on this device.

| What | Why |
|---|---|
| The sites you chose and the daily limit for each | To know where to pause and what your goals are |
| Sessions on those sites: start, end, and active time by hour | Today's progress, streaks and the Stats page |
| How you responded to each pause (went back, continued, snoozed, how long you took, whether the timing was good) | To learn which kinds of pause help you, and when |
| Why a pause was shown or held back (a short log, kept 90 days) | So Respite's timing can be explained and checked |
| Your answers to the optional ten questions | To choose which pauses to try first |
| Streaks, streak freezes and daily totals | Goals and progress |
| How many Shorts, Reels or TikTok videos you watched today, and the ids of the ones already counted (only if you switch that limit on; today's only) | To hold you to the daily number you chose, counting each video once |
| Your first-week progress and which one-time notes you have already seen | So the quest and the celebrations on the Today page are shown once |
| Reminder settings, and which reminders were shown and when (kept 90 days) | To keep to three reminders a day and never show the same one twice |
| Your settings | Theme, pause length and so on |

Respite keeps sessions, daily totals and pause responses for 90 days, then deletes
them. Your sites, limits, streaks and settings are kept until you remove the
extension.

## What Respite can see, and what it does with it

**The address of the tab you are viewing.** Respite needs it to tell whether you
are on one of your sites. If you are not, nothing is recorded. To make "go back"
work, Respite remembers the last few pages of each open tab in the browser's
memory; that list is never written to disk and is gone when the browser closes.

**Whether you are at the computer.** Respite asks the browser whether the device
is idle or locked so that time away is not counted.

**The pages of your chosen sites.** Respite draws its pause, its lock and its
Shorts/Reels block on top of those pages. It does not read what is on them, with
one narrow exception: if you switch on the video limit for TikTok, a small script
runs on TikTok and notes when another video starts playing (the video's id, nothing
else), because TikTok's feed shows every video under one address. It runs on no
other site and is removed when you switch that limit off.

**Pages of a site you have locked.** If you switch on locking for a site, then once its
daily limit is used up the browser itself refuses to load that site's pages until
midnight, and Respite shows its own lock page instead. The rules that do this name only
the sites you chose to lock, stay in your browser, and are removed when the lock ends.
Respite does not use them to block ads, trackers or anything else.

**Your browsing history, once, if you allow it.** During setup you can let Respite
estimate where your last seven days went. It asks the browser only about a fixed
list of popular sites (YouTube, Instagram, Reddit and similar), counts visit times
on this device, shows you the estimate, and then gives the permission back. The
estimate is not saved. You can skip this step.

## Account and sync (optional)

You don't need an account. Without one, everything above stays in this browser and
Respite talks to no server of ours.

If you sign in (You → Account and devices), Respite backs up your goals and keeps them
the same on your phone and your other browsers.

**Signing in.** You can sign in with Google or with Apple, in a window from Google or
Apple that Respite opens through the browser. We receive your email address (with Apple
it can be a private relay address if you choose "Hide My Email") and an account id from
that provider, and your name and profile photo if the provider shares them. Respite
never sees your password. We keep the sign-in sessions of your devices as one-way hashed
tokens and, for Apple, a token we keep only so we can revoke Respite's access to your Apple ID
when you delete your account.

**What syncs to our server while you are signed in:**

- Your sites and their goals: each site's address (for example `example.com`) and the name
  shown for it, or the matching phone app's id when Respite knows it, the daily limit, how
  it is held to it (pause, lock, Shorts/Reels limit), and your streaks. To find the matching
  phone app, Respite sends the site's address to our app catalogue.
- Settings that are shared between your devices.
- A daily total for each of your sites for the last 14 days: minutes, number of visits,
  pauses shown and the longest visit. Not individual visits, not pages, and nothing about
  sites you haven't added.
- Your blocking schedules, if you make any: a schedule's name, days, times and which sites
  it covers.
- This browser as a device on your account: a name ("Chrome on macOS" unless you rename
  it), the platform and when it last synced.

**What comes back.** Your goals from your other devices, and, if you have Respite Plus
(bought in the phone app; there is no purchase in the extension), your other devices'
daily totals so you can see them together and, if you choose, count them toward your
limits. Without Plus, one device syncs. Our server learns whether you have Plus from
RevenueCat, which manages purchases for the phone apps, and keeps only when Plus ends and
which store and product it came from.

**Journey.** While you are signed in, the acorns you earn for days kept, quests, shop
items, streak freezes and badges are kept on our server, so they are the same on every
device. Respite sends the days you kept and the actions that earn or spend acorns.

**Leagues and friends.** These use a display name you choose. Respite may suggest one
from your sign-in name, and nobody sees it until you save it. Other people in your weekly league,
and friends you accept, see that name, your outfit, your streak, how many days you kept
this week, your acorns this week and the time you saved. They never see your sites, your
limits, your email or your devices. You can hide yourself from leagues at any time, and
remove a friend or report a name. Friends are added only with a code you share.

**Where it is kept.** On our server, run on Cloudflare (Cloudflare, Inc.), reached over
HTTPS. Google and Apple handle sign-in only. We don't sell this data, use it for
advertising, or share it with anyone else unless the law requires it, apart from the
two cases below: other Respite users, for the league and friends details above, and an AI
provider that you choose to connect.

**Emails.** We email the address on your account only about your account: a link to confirm
a deletion you asked for on our website, a notice when a new sign-in method is added, and a
notice when two accounts of yours are merged. We send no marketing.

**Signing out** (You → Account and devices, or Delete everything) leaves your synced data on
the account so you can sign in again. **Delete account** (You → Account and devices)
removes your account and everything synced to it, from every device, including game
progress, friends, league seats and AI connections. It doesn't cancel a subscription; do
that in the App Store or Google Play. Things you delete while signed in are kept on our
server as a marker for 90 days, so your other devices learn about it, and then removed.

## Connecting an AI app (optional, Respite Plus)

You can let an AI assistant that you choose, such as Claude, ChatGPT or Cursor, read your
Respite data, so you can ask it things like "which site took most of my week?". This uses an
open standard called MCP. It is **off until you set it up**, you do it from the AI app (not
from the extension), and it needs **Respite Plus** and a Respite account.

**How it works.** You add Respite's address in your AI app. The AI app opens a Respite page in
your browser, where you sign in to your Respite account (with Google or Apple). The page shows
which AI app is asking and what it will be able to do. **Nothing is connected until you tap
Allow.** If you tap Deny, nothing is shared.

**What the AI can read** once you allow it, and only while you have Respite Plus:

- Your account email, whether you have Plus, and your devices (name, platform, last seen).
  This also works without Plus.
- **Time in apps and websites**, in minutes, by app or site, by day and by device, across all
  the devices you sync, with the names of the apps and sites, how often you opened them and
  how often your limit alert showed. For this browser that is the daily totals listed above
  for the sites you added.
- **Insights** that Respite calculates from that: totals, averages, top sites and apps, your
  busiest day, time-of-day patterns, days within your limits, how often you walked away from
  a pause, and your first-week baseline.
- **Your limits and schedules:** per-site and per-app limits, locks, how each pause is shown,
  streaks, blocking schedules (name, days, times and sites or apps) and your other synced
  settings.
- **Sessions and pauses** that your phones synced: when you used an app and what Respite
  showed you at a limit and what you chose. This browser doesn't sync individual visits.
- **Your game progress:** acorns, level, streak, streak freezes, today's quests, items you
  own, recent acorn entries, and your own weekly league tier and rank. Never other people.

**Today the AI can only read.** Respite's tools can't change your limits, schedules, pause
messages or rules, and can't earn or spend acorns for you. Respite's approval page may list
permissions to see and change limits, pause messages and rules; no tool uses them yet. Before
we add tools that make changes, we'll update this policy.

**Where the data goes.** When your AI app uses Respite's tools, the answers are sent to that AI
provider so it can read them and reply to you. From then on the provider handles that data
under **its own privacy policy and terms**, for example how long it keeps your chats and
whether it uses them to train models. **We don't control that. We don't choose which AI you
connect, and no AI provider pays us.** Read your AI provider's policy and settings before you
connect.

**What Respite does not do.** Respite doesn't run an AI of its own on your data, doesn't send
your data to an AI provider on its own, and doesn't use your data to train AI models. We don't
keep a copy of what your AI asked or was told; we keep only the facts about the connection
below.

**What we store about a connection:**

- the AI app's name and the web addresses it registered to receive your approval;
- which permissions you allowed, when you connected, when it was last used, and when it was
  disconnected;
- the access and refresh tokens it uses, saved only as one-way hashes. Access tokens last one
  hour. Refresh tokens last 30 days and are replaced each time they are used;
- short-lived set-up records: a one-time code (60 seconds) and a record of your pending
  approval (10 minutes), tied to your browser with a short-lived cookie. The cookie only makes
  sure that the person who started the request is the person who approves it.

**Disconnecting.** Remove Respite from your AI app's connections. If your AI app tells us
when you remove it, access ends at once and its tokens are deleted. Otherwise its access
token expires within an hour and its refresh token stops working 30 days after it was last used. Respite doesn't yet list your connections
in the extension or the phone apps. If you can't disconnect from your AI app, email us and
we'll end the connection. A disconnected connection leaves a record of its name, permissions
and dates until you delete your account. **Deleting your account removes all your AI
connections.**

## Usage statistics (off unless you switch them on)

Respite can send anonymous statistics about how it is used, to help improve it. This is
off when you install Respite and stays off until you switch on "Share anonymous usage
statistics" in You → More settings. On Firefox, the browser asks you as well. You can switch it off
again at any time, here or in Firefox's own add-on settings.

**While it is off:** nothing is collected for sending, nothing is sent, and no identifier
exists. If you are not signed in either, Respite makes no network requests.

**While it is on, Respite sends:**

- What happened inside Respite, as counts and choices: a pause was shown, you went back or
  continued and how long that took, a lock or a Shorts/Reels block was shown, a goal was met
  or missed, a streak grew or ended, a setting was changed, which Respite page was opened,
  a reminder was shown or clicked.
- A summary of each day from the day you switched it on: minutes and sessions per tracked
  site, your limit, and how many pauses you had. Earlier days are never sent.
- A few broad facts about your setup, in buckets: how long you have had Respite, how many
  sites you track, light or heavy use and how often you kept to your limits over the last
  seven days, your most-used tracked site (named only if it is a well-known one), your
  streak, your pause mode, whether strict mode and reminders are on, and which permissions
  Respite has.
- A random id made when you switch statistics on. It is not linked to you, your Respite
  account, your browser account or anything else, and it is deleted when you switch statistics off. Switching
  them on again makes a new one.

**How sites are named.** A well-known site from Respite's built-in list (YouTube,
Instagram and similar) is named. Any other site, including every address you typed in
yourself, is sent only as "other". Its address never leaves your device.

**Never sent:** addresses of pages, page content, what you type, your answers to the ten
questions, or your browsing on sites you have not added.

**Where it goes.** To Google Analytics (Google LLC), directly from your browser, over
HTTPS, marked as not for ad personalisation. Google receives your IP address as part of
any connection; Respite does not send it as data and does not use Google's advertising
features. Statistics are sent in small batches about a minute after they happen.

**Switching it off** sends one last message saying so, then deletes the id and anything
not yet sent. What was already sent cannot be recalled from here; it carries only the
random id, which no longer exists on your device.

The full list of events and their fields is in the extension's source code.

## What Respite does not do

- It does not send anything anywhere unless you sign in or switch on usage statistics.
- It does not record sites you have not added.
- It does not read page content, forms, passwords or messages.
- It does not sell data, show ads or build a profile of you.
- It does not run an AI on your data. An AI app sees your data only if you connect it, as
  described above.

## Permissions

| Permission | Used for |
|---|---|
| Access to websites | Showing the pause on the sites you choose, whichever they are |
| Tabs, web navigation | Knowing which site the tab you are viewing is on |
| Scripting | Putting the pause, the lock or the Shorts/Reels block on the page; the video counter on TikTok when you switch its limit on |
| Block content on pages (declarativeNetRequestWithHostAccess) | Refusing to load a site you have locked once its daily limit is used up. Used for nothing else, and only on sites Respite already has access to |
| Idle | Not counting time when you are away |
| Alarms | Timekeeping while the browser is open, and the midnight rollover |
| Storage, unlimited storage | Keeping your data on this device |
| Identity | Opening the Google or Apple sign-in window when you choose to sign in. Not used otherwise, and it gives Respite no access to your browser's own Google account |
| History (optional) | The one-time seven-day estimate during setup |
| Notifications (optional) | Reminders, asked for only when you switch them on in Settings and handed back when you switch them off |

## Your data: a copy, or gone

**Export.** You → More settings → Your data → Export saves everything Respite has stored in this
browser as one file on your device (JSON, readable in any text editor). Nothing is
uploaded. The file does not include the short in-memory list of recently open pages
used for "go back", which is never stored.

**Delete.** You → More settings → Your data → Delete everything removes your sites, limits,
history, streaks, answers and settings from this browser, takes down anything Respite
had set up because of them (locks, reminders, the video counter), hands back the
optional permissions, and starts Respite over as if newly installed. If usage
statistics were on, the random id and anything not yet sent are deleted without
sending anything. If you are signed in, it signs this browser out; your synced data
stays on your account until you delete the account. This cannot be undone.

Remove a single site on the Sites page to stop tracking it. Removing the extension
from your browser also deletes everything Respite stored.

## Children

Respite is not directed at children under 13. Without an account it collects no
personal information from anyone.

## Changes

If a later version changes what can leave your device, this policy will be updated
first, and anything new will be off until you switch it on or sign in.

## Contact

Questions or problems: [support@liveintently.app](mailto:support@liveintently.app)
