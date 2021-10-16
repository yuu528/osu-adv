// ==UserScript==
// @name         osu!adv
// @namespace    https://yuu-g.net/
// @version      0.1
// @description  Add new features to osu! website.
// @author       Yuu528
// @match        https://osu.ppy.sh/*
// @icon         https://www.google.com/s2/favicons?domain=osu.ppy.sh
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function() {
    'use strict';

    waitForKeyElements('.value-display__value', () => {
        // User page
        if(/^\/users\/\d+$/.test(location.pathname)) {
            // Add "Show country ranking around me" feature
            var countryRankUrl = document.getElementsByClassName('profile-info__flag--country')[0].href;
            var countryRankDiv = Array.from(document.getElementsByClassName('value-display__value')).filter(elm => elm.offsetHeight != 0 && /^#[0-9,]+$/.test(elm.innerText))[1].children[0];
            var countryRank = parseInt(countryRankDiv.innerText.replace(/[#,]/g, ''));
            console.log(countryRankDiv);
            if(countryRank <= 10000) {
                let rankPage = Math.ceil(countryRank / 50);
                let newA = document.createElement('a');
                newA.setAttribute('href', countryRankUrl + '&page=' + rankPage);
                newA.style.color = '#fff';
                newA.innerText = countryRankDiv.innerText;
                countryRankDiv.innerText = '';
                countryRankDiv.appendChild(newA);
                countryRankDiv.setAttribute('data-html-title', 'Show country ranking around me');
                countryRankDiv.setAttribute('data-hasqtip', 'qtip-1');
                countryRankDiv.setAttribute('aria-describedby', 'qtip-1');
            }
        }
    }, false);
})();