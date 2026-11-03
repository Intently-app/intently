---
title: Privacy Policy for Respite (Android)
updated: 2026-11-03
---

> **Updated 3 November 2026.** This version adds connecting an AI app that you choose (optional, Respite Plus), including letting it make your limits stricter, and corrects and completes earlier wording, including analytics and crash reports, sign-in options, sync across devices, purchases, and rewards, friends and leagues. The changes are also listed on [What's new](/whats-new/).

Respite helps you notice and cut back on compulsive app use by showing a short
pause before the apps you choose. This policy explains what the Android app collects, why, and
where it goes. The [Chrome extension](/privacy/chrome/) has its own policy, and so does the iPhone and
iPad app ([Respite for iPhone](/privacy/)).

**Developer:** MD Sadakat Hussain Fahad, publishing as Intently ·
**Contact:** [support@liveintently.app](mailto:support@liveintently.app)

## The short version

- Your app-usage history is tracked and stored **on your phone**. You don't need an account to use
  Respite.
- If you **sign in** (with Google or Apple), your goals, usage and settings are saved to our
  server so you can restore them and use Respite on more than one device (more than one device
  needs Respite Plus). Your game progress, friends and leagues use the same account.
- The app sends **anonymous analytics events** and **crash reports** to Google Firebase. They are
  on until you turn them off in You › Help and about › Share usage and crash data.
- **Optional, Respite Plus:** you can connect an **AI app that you choose** so it can read your Respite data and, if you allow it, make your limits stricter. Nothing is shared until you approve it, and the AI provider's own privacy policy
  then applies to what it receives. See
  [Connecting an AI app](#connecting-an-ai-app-optional-respite-plus).
- We don't show ads and we don't sell your data.

## What stays on your phone

Respite keeps this in its private storage on your device:

- **Which apps (and websites) you chose to track** and the limits and goals you set.
- **Usage sessions:** when you opened a tracked app, for how long, and how you responded to each
  pause (went back, continued, snoozed).
- **Daily statistics, streaks and achievements** built from those sessions.
- **Settings and preferences.**

Usage sessions, daily statistics and events older than 90 days are deleted automatically from the
phone. Uninstalling Respite deletes everything stored on the phone.

## Information that leaves your phone

### If you sign in (optional)

You can sign in with **Google** or **Apple**. We then receive your **email address**, the
**account identifier** from that provider and your **name** and profile photo address if the
provider shares them (with Apple you can choose "Hide My Email", which gives us a private relay address). We never see your password. We also keep the sign-in sessions of your devices as one-way hashed tokens, a record of
each device on your account (its name, platform, app version and when it was last seen), and, for
Apple, a token we keep only so we can revoke Respite's access to your Apple ID when you delete
your account.

#### Google user data

If you choose **Sign in with Google**, Respite asks Google only for the basic sign-in scopes
(`openid`, `email` and `profile`). It requests no other access to your Google account: not Gmail,
Drive, Contacts, Calendar or any other Google service.

- **What we receive:** your Google account ID, your email address and whether Google has
  verified it, your name, and the address of your Google profile photo.
- **How we use it:** only to create and sign you in to your Respite account, to keep the same
  account across your devices, to show which account you are signed in with and to send you emails
  about your account (for example to confirm a deletion request).
- **Where it is stored:** with your account on our server on Cloudflare, encrypted in transit
  and at rest. The Google sign-in token itself is checked once and not kept.
- **Sharing:** we don't sell Google user data, share it with anyone other than the service
  providers that run Respite for us (listed under Sharing), use it for advertising, or use it to
  train AI or machine-learning models. If you connect an AI app (below), that is a transfer you
  start yourself.
- **Retention and deletion:** it is kept until you delete your account (in the app under
  Account, or at [respite.liveintently.app/delete-account](/delete-account/)), and is then
  deleted. You can also remove Respite's access at any time at
  [myaccount.google.com/permissions](https://myaccount.google.com/permissions).

Respite's use and transfer of information received from Google APIs adheres to the
[Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy),
including the Limited Use requirements.

### What is saved to your account

While you are signed in and sync is on, Respite uploads to our server:

- **Your goals and streaks:** the limit for each tracked app or website, whether it locks, Reels
  and Shorts blocking, how the pause is shown, streaks and recovery progress.
- **Usage:** your usage sessions (start, end, minutes), daily minutes per app, how often the limit
  alert was shown, and your pause results (what the pause was, what you chose and how long you
  took).
- **Your baseline and settings**, including blocking schedules (a schedule's name, days, times and
  which apps it covers).

**App names and websites.** Apps are identified by their **Android package name** (for example
`com.instagram.android`), or by an ID from our app catalogue once it knows the app, so the same
app can be recognised on your iPhone and in Chrome. A website you limit is identified by its
domain (for example `example.com`). Each goal also carries the **name** your phone shows for the
app (for example "Instagram"). Respite looks apps up in the catalogue by sending it the package
name. Categories you track (such as "Social") are not uploaded.

When you have **Respite Plus**, your other devices' data (for example, your minutes on iPhone or in
Chrome) is stored on our server and shown on all your signed-in devices. Without Plus, one device
syncs, which is enough to back up and restore.

Our server runs on **Cloudflare** (Workers and D1 database). Data is encrypted in transit
(HTTPS) and at rest by Cloudflare.

Once a day while you are signed in, Respite also sends a small **community statistic** for each
finished day: whether you stayed under your goal, and the minutes you saved. It is linked to your
account on our server, only used to show anonymous totals across Respite users, and shown only
when at least 20 people have contributed.

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

### Purchases (RevenueCat and Google Play)

Respite Plus is bought through Google Play. We use **RevenueCat** to manage the purchase.
RevenueCat receives your purchase information from Google Play, your Respite account ID (or an
anonymous ID if you aren't signed in) and basic device details, and tells Respite whether Plus is
active. Our server asks RevenueCat the same question and keeps only the result: when Plus ends,
the store and the product. Google Play handles your payment; we never see your card.

### Emails

We email the address on your account only about your account: a link to confirm a deletion you
asked for on our website, a notice when a new sign-in method is added to your account, and a
notice when two accounts of yours are merged. We send no marketing. Emails go out through
Cloudflare's email service.

### Analytics (Google Firebase Analytics)

Respite sends usage events to Firebase Analytics, such as when a pause is shown, what you chose,
when you finish onboarding, when the Respite Plus screen is opened and which features you use. It
also sends a once-a-day summary of each tracked app (minutes, limit and pause counts) and broad
buckets about your setup, such as how long you have had Respite, how many apps you track, light or
heavy use, streak length, which settings and permissions are on, and which sign-in method you use
(not your email or name). Events are tied to a random app-instance ID, not your name or email, and
include basic device information (model, Android version, country from your IP). When an event is
about a tracked app, it names the app if it is one of a fixed list of widely used apps (for
example Instagram or YouTube); any other app is reported only by its category (such as "game" or
"social"). Analytics is not collected from development builds.

This is **on by default**. You can turn it off at any time in **You › Help and about › Share
usage and crash data**; that also turns off crash reports. We use it to fix bugs and improve
Respite, not for advertising.

### Crash reports (Firebase Crashlytics)

If Respite crashes, a crash report (the error, the code location, device model and Android version,
and a random installation ID) is sent to Firebase Crashlytics, unless you turned off "Share usage
and crash data".

### App updates and messages (Firebase Remote Config and Cloud Messaging)

Respite checks Firebase Remote Config for app-update and feature settings, and can receive push
messages through Firebase Cloud Messaging. These use a device token, not your personal data.

## Connecting an AI app (optional, Respite Plus)

You can let an AI assistant that you choose, such as Claude, ChatGPT or Cursor, read your Respite
data, so you can ask it things like "which app took most of my week?". This uses an open standard
called MCP. It is **off until you set it up**, you do it from the AI app, and it needs
**Respite Plus**.

**How it works.** You add Respite's address in your AI app. The AI app opens a Respite page in
your browser, where you sign in to your Respite account (with Google or Apple). The page shows
which AI app is asking and what it will be able to do. **Nothing is connected until you tap
Allow.** If you tap Deny, nothing is shared.

**What the AI can read** once you allow it, and only while you have Respite Plus:

- Your account email, whether you have Plus, and your devices (name, platform, last seen). This
  also works without Plus.
- **Time in apps and websites**, in minutes, by app, by day and by device, across all the devices
  you sync, with the names of the apps and websites, how often you opened them and how often your
  limit alert showed.
- **Insights** that Respite calculates from that: totals, averages, top apps, your busiest day,
  time-of-day patterns, days within your limits, how often you walked away from a pause, and your
  first-week baseline.
- **Your limits and schedules:** per-app limits, locks, Reels and Shorts blocking, how each pause
  is shown, streaks, blocking schedules (name, days, times and apps) and your other synced
  settings.
- **Sessions and pauses:** when you used an app (start, end, minutes) and what Respite showed you
  at a limit and what you chose.
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

- **Usage access** (`PACKAGE_USAGE_STATS`): to see which app is in the foreground and for how
  long, so Respite can pause before tracked apps and count your time. It never reads what you do
  inside an app.
- **Display over other apps** (`SYSTEM_ALERT_WINDOW`): to show the pause and timer screens.
- **Accessibility service (optional):** it is used in two ways, and only if you turn it on.
  If you turn on Reels and Shorts blocking, it reads the on-screen layout of the supported apps
  (such as Instagram and YouTube) to recognise the short-video feed and cover it. If you limit a
  website, it also reads the address bar of the supported browsers (such as Chrome, Firefox,
  Samsung Internet, Edge, Brave, Opera and DuckDuckGo) to tell which site you are on, and notes a
  visit only when the site is one you chose. It reads nothing else on the page, keeps nothing it
  reads, and sends nothing it reads off the phone. The time you spend on the sites you chose is
  recorded like app time.
- **Foreground service, notifications, wake lock, start at boot:** to keep monitoring running
  and show its required notification.
- **See installed apps** (`QUERY_ALL_PACKAGES`): to list your apps so you can choose which to
  track.
- **Ignore battery optimisation (asked only when you tap it):** so Android doesn't stop
  monitoring.
- **Internet:** for sign-in, sync, analytics, crash reports and update checks.
- **Vibrate:** for gentle haptic feedback.

## Sharing

We don't sell or rent your data, and we don't share it for advertising. Your data reaches only:

- **Service providers acting on our behalf:** Google (Firebase Analytics, Crashlytics, Remote
  Config, Cloud Messaging, Google Sign-In and Google Play), Apple (Sign in with Apple, only if you
  choose it), RevenueCat (purchases) and Cloudflare (our server and email).
- **Other Respite users,** only the league and friends details above, if you choose a display name.
- **An AI provider that you choose,** if you connect an AI app. That is a transfer you start and
  direct, to a recipient you pick. We don't choose it for you.

We may also disclose information if the law requires it.

## Retention and deletion

- On the phone: usage sessions, daily statistics and events after 90 days; everything when you
  uninstall.
- Your account on our server: until you delete it. You can delete it in the app (Account), which
  deletes it immediately, or at [respite.liveintently.app/delete-account](/delete-account/),
  where we email a link that you confirm within 24 hours. Either way we delete your account and
  everything stored with it (synced data, game progress, friends, league seats, AI connections and
  tokens), and revoke Respite's access to your Apple ID if you used Apple.
- Things you delete while signed in (for example a goal) are kept on the server as a marker for 90
  days, so your other devices learn about it, and then removed. Raw event logs uploaded by older
  versions of the app are deleted after 30 days.
- Signing out stops syncing but keeps your data until you delete the account.
- Firebase keeps analytics and crash data according to the retention set in our Firebase project.
  It carries random IDs, not your name or email, and deleting your account doesn't remove it.
- RevenueCat and Google Play keep purchase records under their own policies. Deleting your Respite
  account doesn't cancel a subscription; do that in Google Play.

## Your rights

Depending on where you live (for example under the GDPR or CCPA) you can ask to access, correct,
export or delete your data, or object to its processing. Email
[support@liveintently.app](mailto:support@liveintently.app) and we'll reply within 30 days.

## Children

Respite is not directed at children under 13 and we don't knowingly collect their data. If you
believe a child has given us data, contact us and we'll delete it.

## Changes

We'll post any change here with a new date and a short note at the top, and list significant changes on [What's new](/whats-new/). Where the app can show it, we'll also tell you in the app.
