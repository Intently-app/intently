# Store privacy forms checklist (Respite)

Prepared 2026-11-03 from the code, alongside the privacy policy update of the same date
(`packages/legal/policies/respite*/privacy.md`). Code read: intently-api `feat/mcp-read`, iOS tag
v2.0.1, Android tag v2.0.2, extension v2.0.6.

**Everything below is for the owner to confirm. It is a reading of the code, not legal advice, and
none of the store consoles were opened.** Where a form's exact wording or categories may have
changed, check the live form. Items marked CONFIRM need a decision or a look at a console setting
that code cannot show.

## What changed that the forms must reflect

1. **Sync v2 and accounts** (all platforms): goals, daily minutes, sessions and pauses (phones),
   settings, schedules, device records, tied to an account with an email address.
2. **Names and domains do get uploaded in some cases:** Android uploads package names, domains of
   limited websites and the phone's name for each app; Chrome uploads the domains of added sites;
   iPhone uploads a catalogue app name only if the user matches an app across devices.
3. **Game layer and social:** acorn ledger, display name, friends, weekly leagues, reports.
4. **RevenueCat** for purchases (all phones); server mirrors the entitlement.
5. **Analytics and crash reports on iPhone** (Firebase, on by default, opt-out). The old iPhone
   policy said there were none.
6. **Bring your own AI (MCP):** on the user's request, an AI provider they choose receives data
   the tools return. Needs Respite Plus.

## 1. Google Play, Data safety (Android app)

Account and basics: the app collects data; data is encrypted in transit (HTTPS); users can request
deletion (in-app Account screen and https://respite.liveintently.app/delete-account/). Sign-in
methods are Google and Apple only. Facebook login no longer exists in the app, so drop it from
any answer that mentions it.

| Play data type | Collected? | Where it comes from | Purpose | Optional? |
|---|---|---|---|---|
| Personal info: Name | Yes (signed in) | Google/Apple profile; display name for leagues | Account, app functionality | Yes (sign-in is optional) |
| Personal info: Email address | Yes (signed in) | Google/Apple | Account, app functionality, account emails | Yes |
| Personal info: User IDs | Yes | Account ID, device ID, Firebase app-instance ID, Crashlytics anonymous ID | Functionality, analytics | Analytics: yes (toggle) |
| Photos: profile photo | CONFIRM | Only the Google profile photo address is stored, not an image | Account | Yes |
| App activity: App interactions | Yes | Firebase events; pause answers synced to the account | Analytics, functionality | Analytics: yes (toggle) |
| App activity: Installed apps | CONFIRM, likely yes | Package names of apps you track are uploaded when signed in (not the full installed list) | App functionality | Yes |
| App activity: Other user-generated content | CONFIRM | League display name | App functionality | Yes |
| Web browsing: Web browsing history | CONFIRM, likely yes | Domains of limited websites read from the browser address bar and synced as `WEB:<domain>`; nothing else on the page is read | App functionality | Yes (only if the user limits a website and signs in) |
| Financial info: Purchase history | Yes | Plus entitlement (RevenueCat, mirrored on our server); payment itself is Google Play's | App functionality | Yes |
| App info and performance: Crash logs, Diagnostics | Yes | Crashlytics | Analytics | Yes (toggle) |
| Device or other IDs | Yes | Firebase app-instance ID, push token (FCM), device ID for sync | Functionality, analytics | Partly |
| Location: Approximate location | CONFIRM | Firebase derives country from IP | Analytics | Yes (toggle) |

Not collected by code: precise location, contacts, messages, photos/videos (as files), audio,
calendar, health, files.

Sharing (Play counts only transfers to third parties other than service providers):
- Cloudflare, RevenueCat, Firebase/Google, Apple sign-in: service providers acting for us. Not
  "sharing" under Play's definition. CONFIRM your reading.
- **AI connection:** the AI provider receives data only when the user connects an AI app and it
  asks. Play excludes transfers the user initiates and reasonably expects. Two readings, owner to
  choose: (a) treat it as user-initiated and not declare sharing, keeping the prominent
  description in the policy; (b) be conservative and declare App activity, Web browsing history,
  Email, and Purchase history as shared with "AI provider chosen by the user", purpose App
  functionality. Note the approval happens on a web page, not inside the Android app, which is a
  reason to lean to (b) until the owner is comfortable.
- Other Respite users see a league display name, outfit, streak, acorns this week, time saved
  (rounded) on the user's own choice. Treat as user-initiated, not a third party.

Tracking: no ads, no ad SDK, no sale. CONFIRM in the Firebase console that Google signals / ad
personalisation linking is off.

## 2. Apple App Privacy (iPhone and iPad app)

Check against `App/Resources/PrivacyInfo.xcprivacy` in v2.0.1, which already lists linked, not
tracking: Email Address, User ID, Product Interaction, Other Usage Data, Name, Device ID, Purchase
History, Other User Content, Crash Data, Other Diagnostic Data. The App Store Connect label must
match it. CONFIRM what the label says today; if it still says "Data Not Collected" it is wrong.

| Apple data type | Collected | Linked to user | Tracking | Purposes |
|---|---|---|---|---|
| Contact info: Email address | Yes | Yes | No | App functionality |
| Contact info: Name | Yes (Google sign-in; Apple sign-in asks email only) | Yes | No | App functionality |
| Identifiers: User ID | Yes | Yes | No | App functionality, analytics |
| Identifiers: Device ID | Yes (device ID for sync, random IDs) | Yes | No | App functionality, analytics |
| Usage data: Product interaction | Yes | Yes (random ID that is also kept in account settings) | No | Analytics, functionality |
| Usage data: Other usage data | Yes (daily minutes per app, pause answers) | Yes | No | App functionality |
| Purchases: Purchase history | Yes | Yes | No | App functionality |
| User content: Other user content | Yes (league display name) | Yes | No | App functionality |
| Diagnostics: Crash data, Other diagnostic data | Yes | Yes | No | Analytics, functionality |
| Browsing history | No on iPhone (Screen Time gives opaque tokens, not addresses) | | | |
| Location | CONFIRM (Firebase uses IP-derived country) | | | |

Notes:
- Firebase is a third-party SDK that collects data in the app; its data belongs on the label.
- Tracking = No relies on no ad SDK, no data broker use and no linking with other companies' data
  for ads. CONFIRM Google signals is off in Firebase. No App Tracking Transparency prompt exists.
- **AI connection:** the iPhone app does not send data to an AI provider; the user's AI app asks
  our server after the user approves on a web page. CONFIRM whether Apple's App Review Guidelines
  on disclosing and getting permission for sharing personal data with third-party AI (5.1.1 and
  5.1.2) apply to this flow, and whether a short in-app note in the app is wise. There is no in-app
  UI for the feature today.
- Privacy policy URL: https://respite.liveintently.app/privacy/

## 3. Chrome Web Store, Privacy practices tab

- **Single purpose:** show a pause before websites the user chooses and track time on them.
- **Permission justifications** (fill each): `tabs` and `webNavigation` (know which site a tab is
  on), `scripting` (draw the pause, lock and Shorts/Reels block; TikTok video counter when the user
  switches it on), `idle` (do not count time away), `alarms` (timekeeping, midnight rollover),
  `storage` and `unlimitedStorage` (local history), `identity` (Google/Apple sign-in window),
  `declarativeNetRequestWithHostAccess` (refuse to load a site the user locked after its limit),
  host permission `<all_urls>` (the user can choose any site), optional `history` (one-time
  7-day estimate, then given back) and optional `notifications`. `unlimitedStorage` is new in the
  policy's permission table; check the dashboard text mentions it.
- **Remote code:** none declared by the code reviewed. CONFIRM in the build.
- **Data usage disclosures** (tick what applies when the user signs in or opts in):
  - Personally identifiable information: yes (email, name, profile photo address, account ID).
  - Authentication information: yes (sign-in session tokens are held by the extension).
  - Web history: yes (domains of sites the user added, with minutes and visits; the history
    permission is used once on-device and not saved).
  - User activity: yes (how the user responds to pauses; anonymous usage statistics only if the
    user switches them on, off by default).
  - Website content: no, apart from the TikTok video id counter, which is not sent anywhere.
  - Location, health, financial, personal communications: no.
- **Certifications:** not sold; not used or transferred for purposes unrelated to the single
  purpose; not used for creditworthiness or lending. The AI connection is a transfer the user
  starts and approves to a recipient they choose, to provide a feature they asked for. CONFIRM this
  fits the Limited Use rules, and that the dashboard question about transfers to third parties is
  answered consistently with the policy.
- **Privacy policy URL:** https://respite.liveintently.app/privacy/chrome/

## Top action items for the owner

1. **Apple App Privacy:** the iPhone app ships Firebase Analytics and Crashlytics (on by default),
   RevenueCat, accounts and sync. Make the label match `PrivacyInfo.xcprivacy` and the new policy.
2. **Google Play Data safety:** add web browsing history, installed apps (tracked package names),
   purchase history, user IDs, crash/diagnostics; remove any Facebook login mention; decide how
   to treat the user-initiated AI transfer (a or b above).
3. **Fix in-app and server strings that now overstate or understate:** Android and iPhone Help
   say "No app names" for shared analytics (Android sends names of about 40 widely used apps);
   the MCP consent page says "You can disconnect it any time in the Respite app" (no such
   screen yet) and by default lists four permissions, three of which have no tools yet; the
   website's `src/content.ts` says "App names never leave your iPhone".
4. **Chrome Web Store Privacy practices tab:** update the data disclosures, the permission
   justifications (include `unlimitedStorage`) and the privacy policy URL.
5. **Policy change notice:** the policy promises an in-app notice for significant changes. This
   change is significant (new analytics disclosure on iPhone, AI sharing). Android has an FCM
   service; no in-app notice mechanism was found on iPhone or in the extension. Decide how to
   announce (release notes, a one-time sheet, or an email), or change the promise.
