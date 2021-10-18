// ==UserScript==
// @name         osu!adv
// @namespace    https://yuu-g.net/
// @version      0.3.1
// @description  Add new features to osu! website.
// @author       Yuu528
// @match        https://osu.ppy.sh/*
// @icon         https://www.google.com/s2/favicons?domain=osu.ppy.sh
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    var mainFunc = () => {
        console.log(location.pathname);
        var runCount;
        if(/^\/users\//.test(location.pathname)) { // User page
            runCount = 0;
            waitForKeyElements('.value-display__value', () => {
                // Add "Show world/country ranking around user" feature
                var elemList = Array.from(document.getElementsByClassName('value-display__value')).filter(elm => elm.offsetHeight != 0 && /^#[0-9,]+$/.test(elm.innerText));
                // Wait for page loading
                if(elemList.length == 2 && runCount == 0) {
                    runCount++;
                    console.log(runCount);
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
                            rankDiv.setAttribute('title', 'Show ' + data[0] + ' ranking page around this user');
                        }
                    });
                }
            });
        } else if(/^\/beatmapsets\//.test(location.pathname)) {
            runCount = 0;
            waitForKeyElements('.beatmapset-stats__row--advanced', () => {
                // 'search on' feature
                if(runCount == 0) {
                    runCount++;
                    let afterStatDiv = document.getElementsByClassName('beatmapset-stats__row--advanced')[0];
                    var newDiv = afterStatDiv.cloneNode(true);
                    let bgUrl = document.getElementsByClassName('beatmapset-header__content')[0].style.backgroundImage.replace(/^url\(\"([^"]+)\"\)$/, '$1');
                    let elemList = document.getElementsByClassName('beatmapset-header__details-text-link')
                    let songTitle = elemList[0].innerText;
                    let artistName = elemList[1].innerText;
                    afterStatDiv.before(newDiv);
                    newDiv.children[0].children[0].innerHTML = '';
                    [
                        ['Google - Background', 'https://images.google.com/searchbyimage?image_url=%s', bgUrl, 'background', 'Google Image Search'],
                        ['Ascii2D - Background', 'https://ascii2d.net/search/url/%s?type=color', bgUrl, 'background', 'Ascii2D Image Search'],
                        ['Google - Title', 'https://google.com/search?q=%s', songTitle, 'title', 'Google'],
                        ['YouTube - Title', 'https://youtube.com/results?search_query=%s', songTitle, 'title', 'YouTube'],
                        ['Google - Artist', 'https://google.com/search?q=%s', artistName, 'artist', 'Google']
                    ].forEach(data => {
                        let newTr = document.createElement('tr');
                        let newTh = document.createElement('th');
                        let newTd = document.createElement('td');
                        let newA = document.createElement('a');
                        newTh.classList.add('fas', 'fa-search');
                        newTd.classList.add('beatmap-stats-table__label');
                        newA.setAttribute('title', 'Search ' + data[3] + ' on ' + data[4]);
                        newA.setAttribute('href', data[1].replace('%s', data[2]));
                        newA.style.color = '#fff';
                        newA.innerText = data[0];
                        newTd.appendChild(newA);
                        newTr.appendChild(newTh);
                        newTr.appendChild(newTd);
                        newDiv.children[0].children[0].appendChild(newTr);
                    });
                }
            });
        }
    };

    window.addEventListener('load', mainFunc);
    document.addEventListener('turbolinks:load', mainFunc);
})();
