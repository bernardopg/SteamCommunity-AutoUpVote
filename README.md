# SteamCommunity Auto UpVote

[![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)](SteamCommunity-AutoUpVote.user.js)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Userscript](https://img.shields.io/badge/userscript-Tampermonkey%20%7C%20Violentmonkey-orange.svg)](SteamCommunity-AutoUpVote.user.js)

Automatically upvotes visible posts in your Steam Community Activity Feed and keeps working as new posts load through infinite scroll.

## Install

1. Install a userscript manager:

   | Browser | Recommended manager |
   | --- | --- |
   | Chrome | [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) |
   | Firefox | [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/) or [Violentmonkey](https://addons.mozilla.org/firefox/addon/violentmonkey/) |
   | Edge | [Tampermonkey](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd) |
   | Opera | [Tampermonkey](https://addons.opera.com/extensions/details/tampermonkey-beta/) |

2. Install the script:

   [Install from GitHub](https://raw.githubusercontent.com/bernardopg/SteamCommunity-AutoUpVote/main/SteamCommunity-AutoUpVote.user.js)

3. Confirm the installation in your userscript manager.

Alternative mirror:

[Install from GreasyFork](https://greasyfork.org/scripts/586154-steamcommunity-auto-upvote)

## Features

- Automatically upvotes activity feed posts that are not already active.
- Detects new posts added by Steam's infinite scroll.
- Uses staggered click delays and per-batch limits to reduce rate-limit risk.
- Avoids duplicate clicks while a vote is pending.
- Supports custom profile URLs, SteamID64 profile URLs, and the logged-in `/my` alias.
- Runs with `@grant none` and does not make external requests.

## Supported Pages

| Profile type | Activity feed URLs |
| --- | --- |
| Custom URL | `https://steamcommunity.com/id/yourprofile/home` |
| Custom URL | `https://steamcommunity.com/id/yourprofile/myactivity` |
| SteamID64 | `https://steamcommunity.com/profiles/7656119.../home` |
| SteamID64 | `https://steamcommunity.com/profiles/7656119.../myactivity` |
| Logged-in alias | `https://steamcommunity.com/my/home` |
| Logged-in alias | `https://steamcommunity.com/my/myactivity` |

Trailing slashes and deeper activity-feed paths are also matched.

## Usage

1. Log in to Steam Community.
2. Open one of the supported activity feed pages.
3. The script upvotes visible posts automatically.
4. Scroll down to load more posts; newly loaded posts are handled automatically.

You can confirm it is running from the browser console. Logs are prefixed with:

```text
[Steam Auto UpVote]
```

## How It Works

The script waits for the activity feed, scans only inside the feed container, and finds known Steam upvote button patterns:

```javascript
a[id^="vote_up_"],
a[id^="VoteUpBtn_"],
button[id^="vote_up_"],
button[id^="VoteUpBtn_"],
[role="button"][id^="vote_up_"],
[role="button"][id^="VoteUpBtn_"]
```

Before clicking, it checks whether the button already appears active through known active classes or `aria-pressed="true"`. A `MutationObserver` watches the feed for newly added posts and debounces scans so repeated DOM updates do not trigger stacked click batches.

## Configuration

Advanced users can edit the `CONFIG` object in `SteamCommunity-AutoUpVote.user.js`:

```javascript
const CONFIG = {
    clickDelay: 150,
    maxClicksPerBatch: 40,
    initialDelay: 1000,
    mutationDebounceDelay: 500,
    postClickStateCheckDelay: 800,
};
```

Useful tweaks:

- Increase `clickDelay` if Steam ignores clicks or appears to rate limit you.
- Lower `maxClicksPerBatch` if your feed has many posts loaded at once.
- Add a selector to `feedContainerSelectors` or `buttonSelector` if Steam changes its markup.

## Privacy And Permissions

- No external API calls.
- No data collection.
- No analytics.
- No special userscript permissions (`@grant none`).
- The script only runs on matched `steamcommunity.com` activity feed pages.

## Troubleshooting

### The script does not start

1. Confirm your userscript manager is enabled.
2. Confirm you are logged in to Steam.
3. Confirm the current URL matches one of the supported pages.
4. Open DevTools and check for logs prefixed with `[Steam Auto UpVote]`.

### Posts are not upvoted

Steam may have changed its DOM structure.

1. Inspect an upvote button in browser DevTools.
2. Compare its ID, role, class, and active state with `buttonSelector` and `activeClasses`.
3. Update the selector in `CONFIG`, then reload the page.

### Votes are skipped or delayed

This can happen when many posts load at once or Steam responds slowly. Try increasing `clickDelay` or decreasing `maxClicksPerBatch`.

## Compatibility

| Manager | Status |
| --- | --- |
| Tampermonkey | Supported |
| Violentmonkey | Supported |
| Greasemonkey 4.x | Supported |
| Greasemonkey 3.x | Not supported |

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, testing notes, and pull request guidelines.

## Acknowledgments

- Based on the original concept by [Asbra](https://gist.github.com/Asbra/3126c8737e22392722f5).
- Modern `MutationObserver` approach inspired by [NVHT](https://gist.github.com/NVHT/4d7c0c37bc2175c6a7f70935fa016ce3).

## Disclaimer

This project is not affiliated with Valve or Steam. Use it responsibly and in accordance with Steam's Terms of Service. The authors are not responsible for consequences resulting from use of this script.
