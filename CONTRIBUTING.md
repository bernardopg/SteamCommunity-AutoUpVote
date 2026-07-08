# Contributing to SteamCommunity Auto UpVote

Thank you for your interest in contributing! This document provides guidelines and information for contributors.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the [existing issues](https://github.com/bernardopg/SteamCommunity-AutoUpVote/issues) to avoid duplicates.

When creating a bug report, please include:

- **Clear and descriptive title**
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Browser and userscript manager** version
- **Steam Community URL** where the issue occurs
- **Console logs** if available

### Suggesting Features

Feature suggestions are welcome! Please open an issue with:

- **Clear description** of the feature
- **Use case** - why this feature would be useful
- **Possible implementation** ideas (if any)

### Pull Requests

1. Fork the repository
2. Create your feature branch from `main`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Development

### Prerequisites

- A userscript manager (Tampermonkey recommended)
- Basic knowledge of JavaScript and DOM manipulation
- Understanding of Steam Community's HTML structure

### Setup

1. Fork and clone the repository
2. Open the `.user.js` file in your text editor
3. Enable "Allow access to file URLs" in your userscript manager settings
4. Load the script locally in your userscript manager

### Code Style

- Use `'use strict';` at the beginning of the IIFE
- Follow [MDN JavaScript Guidelines](https://developer.mozilla.org/en-US/docs/MDN/Guidelines/Code_guidelines/JavaScript)
- Add comments for complex logic
- Keep the code readable and maintainable

### Testing

1. Install the script locally
2. Navigate to your Steam Community Activity Feed
3. Verify the script upvotes posts correctly
4. Test with different scenarios:
   - Empty feed
   - Feed with many posts
   - Infinite scroll behavior
   - Page reload

### Commit Messages

Use clear and descriptive commit messages:

- `feat: Add support for custom delay configuration`
- `fix: Fix button detection after Steam UI update`
- `docs: Update installation instructions`
- `refactor: Improve MutationObserver implementation`

## Steam Community Considerations

### Button Selectors

Steam may update their UI at any time. If the script stops working:

1. Inspect the upvote button in browser DevTools
2. Update the `buttonSelector` in `CONFIG` if needed
3. Submit a PR with the fix

### Rate Limiting

The script uses staggered delays to avoid triggering Steam's rate limiting. If you experience issues:

- Increase the `clickDelay` value in `CONFIG`
- Add additional delays if needed

## Questions?

If you have questions about contributing, feel free to open an issue or reach out to the maintainers.
