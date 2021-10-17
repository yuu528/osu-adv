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

    var runCount = 0;
    waitForKeyElements('.value-display__value', () => {
        // User page
        if(/^\/users\/.+/.test(location.pathname)) {
            // Add "Show world/country ranking around user" feature
            var elemList = Array.from(document.getElementsByClassName('value-display__value')).filter(elm => elm.offsetHeight != 0 && /^#[0-9,]+$/.test(elm.innerText));
            // Wait for page loading
            if(elemList.length == 2 && runCount == 0) {
                runCount++;
                [
                    ['world', 'https://osu.ppy.sh/rankings/osu/performance?'],
                    ['country', document.getElementsByClassName('profile-info__flag--country')[0].href]
                ].forEach((data, key) => {
                    var rankDiv = elemList[key].children[0];
                    var rank = parseInt(rankDiv.innerText.replace(/[#,]/g, ''));
                    if(rank <= 10000) {
                        let rankPage = Math.ceil(rank / 50);
                        let newA = document.createElement('a');
                        newA.setAttribute('href', data[1] + '&page=' + rankPage);
                        newA.style.color = '#fff';
                        newA.innerText = rankDiv.innerText;
                        rankDiv.innerText = '';
                        rankDiv.appendChild(newA);
                        rankDiv.setAttribute('data-html-title', 'Show ' + data[0] + ' ranking page around this user');
                        rankDiv.setAttribute('data-hasqtip', 'qtip-1');
                        rankDiv.setAttribute('aria-describedby', 'qtip-1');
                    }
                });
            }
        }
    }, false);
})();
