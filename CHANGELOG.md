# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-07-08

### Added
- Added safer active-state detection using Steam active classes and `aria-pressed`
- Added per-batch click limits, mutation debouncing, and post-click state checks
- Added feed container fallbacks for Steam activity page variations
- Expanded README with installation, supported URLs, privacy notes, and troubleshooting

### Changed
- Scoped upvote button scans to the detected activity feed container
- Moved local temporary CDP test scripts under ignored `tmp/`
- Expanded `.gitignore` for local test, cache, and browser debug artifacts

## [1.1.1] - 2026-07-08

### Fixed
- Added exact `/home`, `/myactivity`, and `/my/*` URL matches so userscript managers show the script on Steam activity pages without trailing slashes or with the logged-in profile alias
- Prevented duplicate clicks on the same upvote button during repeated MutationObserver scans
- Broadened upvote button detection beyond the legacy `btn_grey_grey` class

## [1.1.0] - 2026-07-08

### Added
- Support for SteamID64 profile URLs (`/profiles/*/home/` and `/profiles/*/myactivity/`)
- Better logging with configurable log prefix
- Detailed comments and documentation

### Changed
- Improved MutationObserver implementation for better reliability
- Added staggered click delays to prevent rate limiting
- Updated metadata block for GreasyFork compatibility

### Fixed
- Fixed issue with buttons not being detected after page reload

## [1.0.0] - 2026-07-08

### Added
- Initial release
- Auto-upvote all posts in activity feed
- MutationObserver for infinite scroll support
- Compatible with Tampermonkey, Violentmonkey, and Greasemonkey 4.x
