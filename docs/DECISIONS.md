# Decisions and details

The longer write-ups behind the README: every decision, how each inconsistency in the design was resolved, what is mocked versus what production would need, the Android bug story and how the web version is deployed.

## Decisions and why

- **Coins as the unlock flow.** The brief allows coins, subscription or an ad. Coins show the most interesting states in one flow: not enough balance, a top-up, then the unlock. It is also the model I have shipped before (coin purchase and top-up on StoreKit and Google Play Billing in a previous app).
- **Expo, not bare React Native.** It runs on the web and in Expo Go, so a reviewer can open it in seconds. In production I would use bare React Native (New Architecture) and expect most of this code to move across unchanged.
- **SDK 57, not 58.** The store version of Expo Go only supports 57.
- **Redux Toolkit thunks hold the purchase and unlock logic.** Components only show state and dispatch actions. That keeps the money logic in one testable place.
- **Tests cover the logic only** (60 tests: lock state, unlocks, purchase, membership, rewards, persistence, Discover and Library helpers, data checks). There are no UI tests. For a mock-up the risk is in the rules about money and access, not in the layout, and logic tests are cheap to keep correct. A production app would add component and end-to-end tests.
- **Dimmed artwork, not blur.** A blur rendered as a plain dark overlay on a phone, so locked episodes show the artwork dimmed.
- **Episodes last their listed length.** The 10 second clip loops, and the progress bar, the time label and the end-of-episode event use the listed duration. This keeps the UI honest (3:12 means 3:12) at the cost of a long wait before the lock unless you drag the bar.
- **The lock opens on a tap.** The next episode appears locked at the end of episode 3; the sheet opens when the user taps the Unlock card. An automatic pop-up fought with swiping through locked episodes.
- **No swipe-to-close in the player.** iPhone has the back gesture, Android has the system back.
- **Everything that costs something asks first.** Coin unlocks, the membership, the season purchase, cancelling and resetting all use a confirmation bottom sheet, so a stray tap cannot spend coins.

### Design inconsistencies and how each was resolved

The design file disagrees with itself in several places. I picked one answer each and kept it in one place in the code.

| Issue in the design | Decision |
|---|---|
| Episode price 85 coins (recharge frame) vs 10 coins (lock sheet); season 150 coins | 85 coins per episode, 1200 coins per season, defined once in `src/data/coinPacks.ts`. With 15 starting coins, the recharge path is always reached |
| Season banner "Unlock Full Season EUR 9.99" | Kept as designed: a second, mocked real-money purchase that unlocks the season without touching the coin balance (in production a store purchase) |
| Membership: "VIP EUR 4.99 per week" vs "Premium $9.99 per month" | One product, "Premium Membership", EUR 9.99 per month. No "best deal" claim, no "no ads" claim (there are no ads) |
| Currency: EUR in most frames, $ in the lock sheet | EUR everywhere |
| Lock at episode 12 / episode 5 / first locked is 4 on the detail page | 3 free episodes everywhere, first locked episode is 4. Sheets read the episode number from the data |
| Mixed German and English UI | Both languages, English by default. All UI text is in two locale files. Series titles stay as the German content titles |
| Heart tab labelled "Romance" | "Favourites" |
| "App Store Pay" (not a real name, iOS only) | Neutral "Secure checkout" |
| "canceled" | "cancelled" (UK spelling) |
| Player shows "The Billionaire's Secret", which is nowhere else | The player uses the series you came from |
| Cast differs between frames | One cast for The CEO's Secret Life; other series have no cast section |
| Poster says 2 min per episode but listed episodes are about 3 to 4 min | Durations are derived from minutes per episode, so nothing contradicts |
| App is called LoveFlix in the design, the company is DramaFlash | Left as is: no login screen, and the header shows only the logo |

Text and typos inside the design images are left exactly as supplied (for example the hero art reads "A LOVE FORBIDEN" and its title differs from the series name). The images were only resized and converted to WebP, never retouched.

## Mocked vs production

| Here | In production |
|---|---|
| `purchaseCoins` waits 1 second, then credits the pack | StoreKit 2 and Google Play Billing consumables, with the app finishing the transaction only after the server confirms it |
| The app credits coins itself | Server-side receipt validation (App Store Server API, Google Play Developer API) before crediting; restore and refund handling |
| The balance and unlocks live in the app, saved on the device | A server-owned wallet and entitlements, so the balance cannot be edited and follows the user across devices |
| Premium is a flag with a fake renewal date | An auto-renewing subscription owned by the store, with server notifications for renewals, cancellations and refunds; the app opens the store's manage-subscription page |
| The season banner is a mocked purchase | A non-consumable or a subscription product, validated on the server |
| 17 short clips, generated from the artwork, bundled and looped | HLS streaming with adaptive bitrate, preloading the next episode, caching, DRM if the content owners need it |
| No sound | Start muted with a tap-to-unmute button (browsers block autoplay with sound) |
| No analytics | Events for lock shown, sheet opened, pack chosen, purchase started, purchase completed, purchase failed, unlock, Maybe Later; dashboards on lock-to-purchase conversion |
| Fixed prices in the data file | Store-localised prices from the store, remote config for coin costs |
| Static catalogue | A content API, with push notifications for new episodes and A/B testing of prices and sheet layouts |

## The Android progress bar bug

on Android, dragging the progress bar could turn into a swipe to another episode, and sometimes left the player stuck, because the vertical list can take a touch away from a child as soon as the finger leaves the horizontal line. It did not show on web, on iPhone, or with a perfectly horizontal drag on the emulator. What did not work: rebuilding the gesture on every render, React Native responder events, and switching the list's scrolling off during a drag. What worked: using the gesture-handler `FlatList` so the list and the bar negotiate in one gesture system, and building the bar's gesture once with callbacks that never change.

## Deployment

The web version is a static export (`npx expo export --platform web`) published to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`. The workflow runs the type check and the tests first, so a broken build is not published. GitHub Pages serves the site under `/dramaflash-mockup`, so `app.config.js` adds the Expo `baseUrl` only when the deploy build sets `EXPO_BASE_URL` (locally it stays unset). The build also copies `index.html` to `404.html`, so a deep link or a reload opens the right screen.
