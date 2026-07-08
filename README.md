# SteamCommunity Auto UpVote

A Tampermonkey/Greasemonkey userscript that automatically upvotes all posts on your Steam Community Activity Feed.

## Features

- Automatically upvotes all posts in your activity feed
- Works with infinite scroll (detects new posts as they load)
- Staggered click delays to mimic human behavior
- Compatible with both old and new Steam UI
- Works with custom URLs and SteamID64 profile URLs

## Installation

### Prerequisites

You need a userscript manager installed in your browser:

| Browser | Userscript Manager |
|---------|-------------------|
| Chrome | [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) |
| Firefox | [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/) or [Violentmonkey](https://addons.mozilla.org/firefox/addon/violentmonkey/) |
| Edge | [Tampermonkey](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd) |
| Opera | [Tampermonkey](https://addons.opera.com/extensions/details/tampermonkey-beta/) |

### Install Script

1. Click the link below to install the script:

   **[Install SteamCommunity Auto UpVote](https://raw.githubusercontent.com/bernardopg/SteamCommunity-AutoUpVote/main/SteamCommunity-AutoUpVote.user.js)**

2. Your userscript manager will prompt you to confirm installation
3. Click "Install" or "Confirm"

### Alternative Installation (GreasyFork)

The script is also available on GreasyFork:

**[Install from GreasyFork](https://greasyfork.org/en/scripts/XXXXX-steamcommunity-autoupvote)**

## Usage

1. Navigate to your Steam Community Activity Feed:
   - `https://steamcommunity.com/id/yourprofile/home/`
   - Or: `https://steamcommunity.com/id/yourprofile/myactivity/`
2. The script will automatically upvote all visible posts
3. As you scroll down and new posts load, they will also be upvoted automatically

## How It Works

The script uses `MutationObserver` to detect new content in the activity feed. When new posts are added via infinite scroll, it:

1. Finds all upvote buttons with the selector `a.btn_grey_grey[id^="vote_up_"], a.btn_grey_grey[id^="VoteUpBtn_"]`
2. Checks if the button is not already active (clicked)
3. Clicks the button with a staggered delay to avoid rate limiting

## Configuration

You can modify the following constants in the script:

```javascript
const CONFIG = {
    clickDelay: 150,              // Delay between clicks (ms)
    initialDelay: 1000,           // Delay before initial scan (ms)
    feedContainerSelector: '#blotter_content',  // Feed container
};
```

## Troubleshooting

### Script not working?

1. Make sure you are logged into Steam
2. Make sure you are on your activity feed page (`/home/` or `/myactivity/`)
3. Check if Steam has changed their button selectors (update the `buttonSelector` in CONFIG)
4. Check the browser console for error messages

### Posts not being upvoted?

Steam may have updated their UI. If the script stops working:
1. Open browser developer tools (F12)
2. Inspect an upvote button
3. Update the `buttonSelector` in the script if the class or ID format has changed

## Compatibility

- ✅ Tampermonkey (Chrome, Firefox, Edge, Opera)
- ✅ Violentmonkey
- ✅ Greasemonkey 4.x
- ❌ Greasemonkey 3.x (legacy, not supported)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Based on the original concept by [Asbra](https://gist.github.com/Asbra/3126c8737e22392722f5)
- Modern implementation using MutationObserver inspired by [NVHT](https://gist.github.com/NVHT/4d7c0c37bc2175c6a7f70935fa016ce3)
- Thanks to the Steam Community for providing the activity feed

## Disclaimer

This script is provided as-is. Use it responsibly and in accordance with Steam's Terms of Service. The authors are not responsible for any consequences resulting from the use of this script.
