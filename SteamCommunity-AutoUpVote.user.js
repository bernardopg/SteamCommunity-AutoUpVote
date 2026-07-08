// ==UserScript==
// @name         SteamCommunity Auto UpVote
// @namespace    https://github.com/bernardopg/SteamCommunity-AutoUpVote
// @version      1.1.0
// @description  Automatically upvote all posts on your Steam Community Activity Feed
// @author       bernardopg
// @license      MIT
// @icon         https://store.steampowered.com/favicon.ico
// @homepageURL  https://github.com/bernardopg/SteamCommunity-AutoUpVote
// @supportURL   https://github.com/bernardopg/SteamCommunity-AutoUpVote/issues
// @updateURL    https://raw.githubusercontent.com/bernardopg/SteamCommunity-AutoUpVote/main/SteamCommunity-AutoUpVote.user.js
// @downloadURL  https://raw.githubusercontent.com/bernardopg/SteamCommunity-AutoUpVote/main/SteamCommunity-AutoUpVote.user.js
// @match        https://steamcommunity.com/id/*/home/*
// @match        https://steamcommunity.com/id/*/myactivity/*
// @match        https://steamcommunity.com/profiles/*/home/*
// @match        https://steamcommunity.com/profiles/*/myactivity/*
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
        buttonSelector: 'a.btn_grey_grey[id^="vote_up_"], a.btn_grey_grey[id^="VoteUpBtn_"]',

        // Class used by Steam for active/already clicked state
        activeClass: 'active',

        // Delay between clicks (ms) to mimic human behavior
        clickDelay: 150,

        // Feed container selector
        feedContainerSelector: '#blotter_content',

        // Delay before initial scan (ms)
        initialDelay: 1000,

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
     * Finds all un-clicked upvote buttons and clicks them with staggered delays
     * @returns {number} Number of buttons clicked
     */
    function upvoteVisibleItems() {
        const buttons = document.querySelectorAll(CONFIG.buttonSelector);
        let clickCount = 0;

        buttons.forEach((btn) => {
            // Only click if not already active and not being processed
            if (!btn.classList.contains(CONFIG.activeClass) && btn.dataset.processing !== 'true') {
                btn.dataset.processing = 'true';

                // Staggered delay to prevent rate limiting
                setTimeout(() => {
                    btn.click();
                    delete btn.dataset.processing;
                }, clickCount * CONFIG.clickDelay);

                clickCount++;
            }
        });

        return clickCount;
    }

    /**
     * Sets up MutationObserver to watch for new feed items
     */
    function initObserver() {
        const targetNode = document.querySelector(CONFIG.feedContainerSelector);

        if (!targetNode) {
            // Feed not loaded yet, retry shortly
            setTimeout(initObserver, 1000);
            return;
        }

        const observer = new MutationObserver((mutations) => {
            let hasNewNodes = false;

            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    hasNewNodes = true;
                    break;
                }
            }

            if (hasNewNodes) {
                // Wait for content to render before clicking
                setTimeout(() => {
                    const count = upvoteVisibleItems();
                    if (count > 0) {
                        log(`Upvoted ${count} new post(s)`);
                    }
                }, 500);
            }
        });

        observer.observe(targetNode, {
            childList: true,
            subtree: true
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
