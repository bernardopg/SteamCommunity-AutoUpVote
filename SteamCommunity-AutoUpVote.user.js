// ==UserScript==
// @name         SteamCommunity Auto UpVote
// @namespace    https://github.com/bernardopg/SteamCommunity-AutoUpVote
// @version      1.2.0
// @description  Automatically upvote all posts on your Steam Community Activity Feed
// @author       bernardopg
// @license      MIT
// @icon         https://store.steampowered.com/favicon.ico
// @homepageURL  https://github.com/bernardopg/SteamCommunity-AutoUpVote
// @supportURL   https://github.com/bernardopg/SteamCommunity-AutoUpVote/issues
// @updateURL    https://raw.githubusercontent.com/bernardopg/SteamCommunity-AutoUpVote/main/SteamCommunity-AutoUpVote.user.js
// @downloadURL  https://raw.githubusercontent.com/bernardopg/SteamCommunity-AutoUpVote/main/SteamCommunity-AutoUpVote.user.js
// @match        https://steamcommunity.com/id/*/home
// @match        https://steamcommunity.com/id/*/home/*
// @match        https://steamcommunity.com/id/*/myactivity
// @match        https://steamcommunity.com/id/*/myactivity/*
// @match        https://steamcommunity.com/profiles/*/home
// @match        https://steamcommunity.com/profiles/*/home/*
// @match        https://steamcommunity.com/profiles/*/myactivity
// @match        https://steamcommunity.com/profiles/*/myactivity/*
// @match        https://steamcommunity.com/my/home
// @match        https://steamcommunity.com/my/home/*
// @match        https://steamcommunity.com/my/myactivity
// @match        https://steamcommunity.com/my/myactivity/*
// @grant        none
// @run-at       document-idle
// @compatible   chrome Tampermonkey
// @compatible   firefox Tampermonkey
// @compatible   edge Tampermonkey
// @compatible   opera Tampermonkey
// ==/UserScript==

/*
 * SteamCommunity Auto UpVote
 *
 * Automatically upvotes all posts on your Steam Community Activity Feed.
 * This script uses MutationObserver to detect new posts as they load
 * via infinite scroll and clicks the upvote button on each one.
 *
 * Compatible with:
 * - Tampermonkey (Chrome, Firefox, Edge, Opera)
 * - Violentmonkey
 * - Greasemonkey 4.x
 *
 * Repository: https://github.com/bernardopg/SteamCommunity-AutoUpVote
 * License: MIT
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        // Selectors for upvote buttons (covers old and new Steam UI)
        buttonSelector: 'a[id^="vote_up_"], a[id^="VoteUpBtn_"], button[id^="vote_up_"], button[id^="VoteUpBtn_"], [role="button"][id^="vote_up_"], [role="button"][id^="VoteUpBtn_"]',

        // Classes used by Steam for active/already clicked state
        activeClasses: ['active', 'commentthread_vote_up_active'],

        // Dataset flag used to avoid toggling the same button twice
        processedFlag: 'autoUpvoteProcessed',

        // Dataset flag used while a button has a scheduled click
        pendingFlag: 'autoUpvotePending',

        // Delay between clicks (ms) to mimic human behavior
        clickDelay: 150,

        // Maximum buttons clicked in a single scan
        maxClicksPerBatch: 40,

        // Feed container selectors, ordered from most specific to broadest
        feedContainerSelectors: [
            '#blotter_content',
            '#profile_activity',
            '.profile_comment_area',
            '.blotter_block'
        ],

        // Delay before initial scan (ms)
        initialDelay: 1000,

        // Delay used to debounce scans after DOM mutations (ms)
        mutationDebounceDelay: 500,

        // Delay before checking whether Steam accepted a click (ms)
        postClickStateCheckDelay: 800,

        // Observer setup retry behavior
        observerRetryDelay: 1000,
        maxObserverRetries: 20,

        // Log prefix for console messages
        logPrefix: '[Steam Auto UpVote]'
    };

    /**
     * Logs a message to the console with the script prefix
     * @param {string} message - The message to log
     * @param {string} type - Log type: 'log', 'warn', or 'error'
     */
    function log(message, type = 'log') {
        console[type](`${CONFIG.logPrefix} ${message}`);
    }

    /**
     * Finds the best available feed containers.
     * @returns {Element[]} Feed container elements, if found
     */
    function getFeedContainers() {
        for (const selector of CONFIG.feedContainerSelectors) {
            const containers = Array.from(document.querySelectorAll(selector));
            if (containers.length > 0) {
                return containers;
            }
        }

        return [];
    }

    /**
     * Checks whether Steam currently shows the button as upvoted.
     * @param {Element} btn - Candidate upvote button
     * @returns {boolean} True if the button appears active
     */
    function hasActiveVoteState(btn) {
        const hasActiveClass = CONFIG.activeClasses.some((className) => btn.classList.contains(className));
        const ariaPressed = btn.getAttribute('aria-pressed');

        return hasActiveClass || ariaPressed === 'true';
    }

    /**
     * Checks whether a button is already upvoted or already handled by this script.
     * @param {Element} btn - Candidate upvote button
     * @returns {boolean} True if the item should not be clicked
     */
    function isAlreadyUpvoted(btn) {
        return hasActiveVoteState(btn) || btn.dataset[CONFIG.processedFlag] === 'true';
    }

    /**
     * Checks whether the script can click the button.
     * @param {Element} btn - Candidate upvote button
     * @returns {boolean} True if the button should be clicked
     */
    function shouldClickButton(btn) {
        if (!btn.isConnected || btn.dataset[CONFIG.pendingFlag] === 'true') {
            return false;
        }

        if ('disabled' in btn && btn.disabled) {
            return false;
        }

        return !isAlreadyUpvoted(btn);
    }

    /**
     * Finds all un-clicked upvote buttons and clicks them with staggered delays
     * @returns {number} Number of buttons clicked
     */
    function upvoteVisibleItems() {
        const feedContainers = getFeedContainers();

        if (feedContainers.length === 0) {
            return 0;
        }

        const buttons = new Set();
        feedContainers.forEach((container) => {
            container.querySelectorAll(CONFIG.buttonSelector).forEach((button) => {
                buttons.add(button);
            });
        });

        let clickCount = 0;

        buttons.forEach((btn) => {
            if (clickCount >= CONFIG.maxClicksPerBatch || !shouldClickButton(btn)) {
                return;
            }

            btn.dataset[CONFIG.pendingFlag] = 'true';

            // Staggered delay to prevent rate limiting
            setTimeout(() => {
                if (!btn.isConnected || isAlreadyUpvoted(btn)) {
                    delete btn.dataset[CONFIG.pendingFlag];
                    return;
                }

                try {
                    btn.click();
                    setTimeout(() => {
                        try {
                            if (!btn.isConnected) {
                                return;
                            }

                            if (hasActiveVoteState(btn)) {
                                btn.dataset[CONFIG.processedFlag] = 'true';
                            } else {
                                delete btn.dataset[CONFIG.processedFlag];
                            }
                        } finally {
                            delete btn.dataset[CONFIG.pendingFlag];
                        }
                    }, CONFIG.postClickStateCheckDelay);
                } catch (error) {
                    log(`Failed to click upvote button: ${error.message}`, 'warn');
                    delete btn.dataset[CONFIG.pendingFlag];
                }
            }, clickCount * CONFIG.clickDelay);

            clickCount++;
        });

        return clickCount;
    }

    /**
     * Sets up MutationObserver to watch for new feed items
     */
    function initObserver(retryCount = 0) {
        const targetNodes = getFeedContainers();

        if (targetNodes.length === 0) {
            if (retryCount >= CONFIG.maxObserverRetries) {
                log('Feed container not found; observer was not started', 'warn');
                return;
            }

            setTimeout(() => {
                initObserver(retryCount + 1);
            }, CONFIG.observerRetryDelay);
            return;
        }

        let scanTimer = null;
        const observer = new MutationObserver((mutations) => {
            let hasNewNodes = false;

            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    hasNewNodes = true;
                    break;
                }
            }

            if (hasNewNodes) {
                clearTimeout(scanTimer);
                scanTimer = setTimeout(() => {
                    const count = upvoteVisibleItems();
                    if (count > 0) {
                        log(`Upvoted ${count} new post(s)`);
                    }
                }, CONFIG.mutationDebounceDelay);
            }
        });

        targetNodes.forEach((targetNode) => {
            observer.observe(targetNode, {
                childList: true,
                subtree: true
            });
        });

        log('Observer active - watching for new posts');
    }

    /**
     * Main initialization function
     */
    function init() {
        // Upvote items already visible
        const initialCount = upvoteVisibleItems();
        if (initialCount > 0) {
            log(`Upvoted ${initialCount} existing post(s)`);
        }

        // Start watching for new items
        initObserver();
    }

    // Start the script
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, CONFIG.initialDelay);
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            setTimeout(init, CONFIG.initialDelay);
        });
    }

})();
