---
title: Privacy Policy for Respite
updated: 2026-11-03
---

> **Updated 3 November 2026.** This version adds connecting an AI app that you choose (optional, Respite Plus), including letting it make your limits stricter, and corrects and completes earlier wording, including analytics and crash reports, sign-in options, sync across devices, purchases, and rewards, friends and leagues. The changes are also listed on [What's new](/whats-new/).

Respite helps you notice and cut back on compulsive app use by
showing a short pause before the apps you choose. This policy explains what the iPhone and iPad
app collects, why, and where it goes. The [Android app](/privacy/android/) and the
[Chrome extension](/privacy/chrome/) have their own policies.

**Developer:** MD Sadakat Hussain Fahad, publishing as Intently ·
**Contact:** [support@liveintently.app](mailto:support@liveintently.app)

## The short version

- Respite works through Apple's **Screen Time** framework. Apple doesn't tell Respite which apps
  you picked or what you do in them, and Respite can't read their names from Screen Time.
- Your history is stored **on your device**. You don't need an account to use Respite.
- If you **sign in** (with Apple or Google), your goals, minutes, pause answers and settings are
  saved to our server, so you can restore them on a new device. With Respite Plus they also sync
  across your devices. Your game progress, friends and leagues use the same account.
- Respite sends **anonymous usage and crash data** to Google Firebase. It is on until you turn it
  off in You › Help and about › Share usage and crash data.
- **Optional, Respite Plus:** you can connect an **AI app that you choose** so it can read your Respite data and, if you allow it, make your limits stricter. Nothing is shared until you approve it, and the AI provider's own privacy policy
  then applies to what it receives. See
  [Connecting an AI app](#connecting-an-ai-app-optional-respite-plus).
- We don't show ads and we don't sell your data.

## How Respite sees your app use

When you allow Screen Time access, you pick apps, websites or categories in Apple's own picker.
Respite receives an opaque, encrypted token for each one, not its name or address; the system
draws the name and icon for Respite inside the app only. Apple tells Respite when you pass time
thresholds in those apps (for example "15 minutes today"), which is how Respite counts your
minutes and decides when to pause or lock an app. Respite never sees what you do inside an app or
which pages you visit on a website you limit.

## What stays on your device

- **The apps you chose** (as Screen Time tokens) and the limits, locks, schedules and settings you
  set.
- **Daily minutes** per chosen app, and how you answered each pause (left, continued, snoozed)
  and whether you rated its timing.
- **Streaks, achievements, your wellbeing score** and your answers to the optional "Smart timing"
  questions, plus what Respite learned about which kind of pause helps you.

This stays in Respite's private storage and its shared App Group storage (used by Respite's Screen
Time extensions and widget). Deleting Respite deletes it. Respite's Screen Time extensions make no
network requests of their own.

## Information that leaves your device

### If you sign in (optional)

You can sign in with **Apple** or **Google**.

- **Apple** shares an **account identifier** and your **email address**, which can be a private
  relay address if you choose "Hide My Email". Respite doesn't ask Apple for your name. Apple also
  gives us a token that we keep only so we can revoke Respite's access to your Apple ID when you
  delete your account.
- **Google** shares your account ID, your email address, your name and the address of your profile
  photo. Respite asks Google only for the basic sign-in scopes (`openid`, `email` and `profile`).
  The Google sign-in token is checked once and not kept.

We never see your password. We keep the sign-in sessions of your devices as one-way hashed
tokens, plus a record of each device on your account: its name (you can rename it), platform,
app version and when it was last seen.

### What is saved to your account

While you are signed in, Respite saves this to our server:

- **Your goals and streaks:** the daily limit, whether it locks, how the pause is shown, streaks
  and recovery progress.
- **Daily minutes per app, and your pause answers:** the time and day, what the pause was and what
  you chose, and the timing rating if you gave one.
- **Your settings**, such as theme, reminders and blocking schedules (a schedule's name, days,
  times and which apps it covers).
- **Your Screen Time selection and shield settings** for this iPhone. These are Apple's opaque
  tokens, which only this iPhone can use.
- **Your first-week baseline** and other progress that Respite calculates.

**App names.** Apps are identified by a random ID that Respite creates, or by Apple's encrypted
token. Respite never reads an app's name from Screen Time and does not upload one on its own.
There is one exception: if you **match an iPhone app to a named app** (for example, to count your
Instagram time together with your Android phone), the name of that app from our app catalogue is
saved with the match, and the app is then identified by its catalogue ID from then on. Your
minutes in it, on every device, are recorded under that ID.

When you have **Respite Plus**, your other devices' data (for example, your minutes on Android or
in Chrome) is stored on our server and shown on all your signed-in devices. Without Plus, one
device syncs, which is enough to back up and restore. Backups happen when you sign in and then
regularly while you use Respite.

Our server runs on **Cloudflare** (Workers and D1 database). Data is encrypted in transit
(HTTPS) and at rest by Cloudflare.

### Rewards, friends and leagues (optional, need an account)

Signed in, you earn **acorns** and experience for days you keep your limits and for daily quests,
and you can buy items such as outfits and streak freezes. Our server keeps a ledger of this and
decides what you earn, using the daily minutes saved to your account.

**Leagues and friends** use a **display name** that you choose. Respite may suggest one from your
sign-in name, and nobody sees it until you save it. Names pass a word filter. You need a name to
join a league.

- Your weekly league has up to 30 people. Friends are people you add with a code or link that you
  share.
- Other people in your league, and your friends, see your display name, your outfit, your streak
  (counted up to 30 days), the number of days you kept your limits this week, your acorns this
  week, your rank, and the time you saved (rounded to 10 minutes). They never see your apps,
  limits, minutes per app, email address or devices.
- You can **hide yourself from leagues** at any time (friends can still see you), remove a
  friend, or **report** a name. A report stores who reported, who was reported and the name as
  reported, so we can review it. A reported name shows to others as a placeholder.
- Your invite code is random. The invite page shows only the code that is in its address.

### Analytics and crash reports (Google Firebase)

Respite sends anonymous usage events and crash reports to **Google Firebase** (Analytics and
Crashlytics). This is **on by default** and you can turn it off at any time in **You › Help and
about › Share usage and crash data**. Turning it off stops events, user properties and crash
reports.

- **Events:** which screens you use, when a pause or lock is shown, how you answer, onboarding
  steps, goals set, when the Respite Plus screen is opened, and similar counts. A once-a-day
  summary lists minutes, limit and pause counts per chosen app.
- **App names are never sent.** Apps appear only as a random ID that Respite made, not a name.
- **Properties:** broad buckets such as how long you have had Respite, how many apps you track,
  light or heavy use, streak length, which settings are on and which sign-in method you use (not
  your email or name).
- **Technical data:** Firebase receives basic device information (model, iOS version, country
  from your IP address) and a random app-instance ID. Crash reports also carry a random
  installation ID that Respite creates. If you are signed in, that ID is also kept in your
  account settings, so it survives a restore.

We use this only to fix bugs and improve Respite. It isn't used for advertising.

### Purchases (RevenueCat)

Respite Plus is bought through the App Store. We use **RevenueCat** to manage the purchase.
RevenueCat receives your purchase information from Apple, your Respite account ID (or an
anonymous ID if you aren't signed in) and basic device details, and tells Respite whether Plus is
active. Our server asks RevenueCat the same question and keeps only the result: when Plus ends,
the store and the product. Apple handles your payment; we never see your card.

### Emails

We email the address on your account only about your account: a link to confirm a deletion you
asked for on our website, a notice when a new sign-in method is added to your account, and a
notice when two accounts of yours are merged. We send no marketing. Emails go out through
Cloudflare's email service.

## Connecting an AI app (optional, Respite Plus)

You can let an AI assistant that you choose, such as Claude, ChatGPT or Cursor, read your Respite
data, so you can ask it things like "which app took most of my week?". This uses an open standard
called MCP. It is **off until you set it up**, you do it from the AI app, and it needs
**Respite Plus**.

**How it works.** You add Respite's address in your AI app. The AI app opens a Respite page in
your browser, where you sign in to your Respite account (with Apple or Google). The page shows
which AI app is asking and what it will be able to do. **Nothing is connected until you tap
Allow.** If you tap Deny, nothing is shared.

**What the AI can read** once you allow it, and only while you have Respite Plus:

- Your account email, whether you have Plus, and your devices (name, platform, last seen). This
  also works without Plus.
- **Time in apps and websites**, in minutes, by app, by day and by device, across all the devices
  you sync, with the names of the apps and websites, how often you opened them and how often your
  limit alert showed. An iPhone app you haven't matched to a named app appears only as "Unnamed
  iPhone app" with a short code.
- **Insights** that Respite calculates from that: totals, averages, top apps, your busiest day,
  time-of-day patterns, days within your limits, how often you walked away from a pause, and your
  first-week baseline.
- **Your limits and schedules:** per-app limits, locks, how each pause is shown, streaks,
  blocking schedules (name, days, times and apps) and your other synced settings.
- **Sessions and pauses:** when you used an app (start, end, minutes) and what Respite showed you
  at a limit and what you chose, including any timing rating you gave.
- **Your game progress:** acorns, level, streak, streak freezes, today's quests, items you own,
  recent acorn entries, and your own weekly league tier and rank. Never other people.

**What the AI can change, if you allow it.** On the approval page you choose whether the AI may
also manage your limits. With that permission it can add a daily limit for an app, lower a
limit, or add a blocking schedule. These take effect at once and sync to your devices like a
change you made yourself. **It can't loosen anything on its own:** raising or removing a limit,
or removing a schedule, becomes a request that waits for you to approve it in Respite and
expires after 7 days. An AI can undo changes it made, and you can approve, reject or undo AI
changes in Respite's Connected AI screen as it arrives in app updates; until then you can change
any limit yourself. A connection can make at most 30 changes an hour. An AI can't change pause
messages or rules, write your usage history, or earn or spend acorns. The approval page may list
permissions for pause messages and rules; no tool uses them yet, and we'll update this policy
before that changes.

**Where the data goes.** When your AI app uses Respite's tools, the answers are sent to that AI
provider so it can read them and reply to you. From then on the provider handles that data under
**its own privacy policy and terms**, for example how long it keeps your chats and whether it
uses them to train models. **We don't control that. We don't choose which AI you connect, and no
AI provider pays us.** Read your AI provider's policy and settings before you connect.

**What Respite does not do.** Respite doesn't run an AI of its own on your data, doesn't send your
data to an AI provider on its own, and doesn't use your data to train AI models. We don't keep a
copy of what your AI asked or was told; we keep only the facts about the connection below.

**What we store about a connection:**

- the AI app's name and the web addresses it registered to receive your approval;
- a log of each change an AI made or asked for: which connection, the app or schedule affected
  (including the app's name), the value before and after, the short reason the AI gave (up to
  280 characters, written by the AI), and when it was made, approved, rejected or undone.
  Entries are deleted 90 days after they were made, and all of them when you delete your
  account;
- which permissions you allowed, when you connected, when it was last used, and when it was
  disconnected;
- the access and refresh tokens it uses, saved only as one-way hashes. Access tokens last one
  hour. Refresh tokens last 30 days and are replaced each time they are used;
- short-lived set-up records: a one-time code (60 seconds) and a record of your pending approval
  (10 minutes), tied to your browser with a short-lived cookie. The cookie only makes sure that
  the person who started the request is the person who approves it.

**Disconnecting.** Remove Respite from your AI app's connections. If your AI app tells us
when you remove it, access ends at once and its tokens are deleted. Otherwise its access
token expires within an hour and its refresh token stops working 30 days after it was last used. Respite doesn't yet list your connections in
the app. If you can't disconnect from your AI app, email us and we'll end the connection. A
disconnected connection leaves a record of its name, permissions and dates (and its change log entries until they are 90 days old) until you delete your
account. **Deleting your account removes all your AI connections.**

## Permissions and why Respite needs them

- **Screen Time:** to pause and lock the apps and websites you choose and count your time in them,
  as above.
- **Notifications (optional):** for daily reminders, your goals summary and the lock-override
  prompt.

## Sharing

We don't sell or rent your data, and we don't share it for advertising. Your data reaches only:

- **Service providers acting on our behalf:** Apple (Sign in with Apple and the App Store, only if
  you choose them), Google (Sign in with Google, only if you choose it, and Firebase Analytics and
  Crashlytics), RevenueCat (purchases) and Cloudflare (our server and email).
- **Other Respite users,** only the league and friends details above, if you choose a display name.
- **An AI provider that you choose,** if you connect an AI app. That is a transfer you start and
  direct, to a recipient you pick. We don't choose it for you.

We may also disclose information if the law requires it.

## Retention and deletion

- On your device: until you delete Respite.
- Your account on our server: until you delete it. In the app, go to **You › Account and devices
  › Manage account › Delete account**. This immediately deletes your account and everything stored
  with it on our server (backups, sync data, game progress, friends, league seats, AI connections
  and tokens) and revokes Respite's access to your Apple ID. Data on your device is kept. You can
  also ask at [respite.liveintently.app/delete-account](/delete-account/), where we email a link
  that you confirm within 24 hours.
- Things you delete while signed in (for example a goal) are kept on the server as a marker for 90
  days, so your other devices learn about it, and then removed.
- Signing out stops syncing but keeps your data until you delete the account.
- Firebase keeps analytics and crash data according to the retention set in our Firebase project.
  It carries random IDs, not your name or email, and deleting your account doesn't remove it.
- RevenueCat and Apple keep purchase records under their own policies. Deleting your Respite
  account doesn't cancel a subscription; do that in your Apple ID settings.

## Your rights

Depending on where you live (for example under the GDPR or CCPA) you can ask to access, correct,
export or delete your data, or object to its processing. Email
[support@liveintently.app](mailto:support@liveintently.app) and we'll reply within 30 days.

## Children

Respite is not directed at children under 13 and we don't knowingly collect their data. If you
believe a child has given us data, contact us and we'll delete it.

## Changes

We'll post any change here with a new date and a short note at the top, and list significant changes on [What's new](/whats-new/). Where the app can show it, we'll also tell you in the app.
