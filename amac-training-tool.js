// ==UserScript==
// @name         基金从业人员远程培训工具
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Prevent the video stop when lost focus
// @author       Pengus
// @match        https://peixun.amac.org.cn/*
// @icon         https://peixun.amac.org.cn/favicon.ico
// @downloadURL  https://github.com/shiba2046/greasemonkey-scripts/blob/main/amac-training-tool.js
// @updateURL    https://github.com/shiba2046/greasemonkey-scripts/blob/main/amac-training-tool.js
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('blur', function() {
        // your code here
        window.onblur = {}
    }, false);

})();