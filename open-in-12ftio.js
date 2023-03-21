// ==UserScript==
// @name         Open in 12ft.io
// @namespace    https://github.com/shiba2046/greasemonkey-scripts/open-in-12ftio.js
// @version      0.1
// @description  try to take over the world!
// @author       shiba2046
// @match        *.medium.com/*
// @match        *towardsdatascience.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=medium.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Check if the user wants to open the article in 12ft
    const shouldOpenIn12ft = confirm('Open this article in 12ft?');

    if (shouldOpenIn12ft) {
        const newUrl = "https://12ft.io/proxy?q="+encodeURIComponent(window.location)
        window.location.replace(newUrl);
    }

    // Call main function when page loads

})();
