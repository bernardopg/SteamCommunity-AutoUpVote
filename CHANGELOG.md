# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
