// ==UserScript==
// @name         基金从业人员远程培训工具
// @namespace    https://github.com/shiba2046/greasemonkey-scripts
// @version      0.4
// @description  Prevent the video stop when lost focus
// @author       Pengus
// @match        https://peixun.amac.org.cn/*
// @icon         https://peixun.amac.org.cn/favicon.ico
// @downloadURL  https://raw.githubusercontent.com/shiba2046/greasemonkey-scripts/main/amac-training-tool.js
// @updateURL    https://raw.githubusercontent.com/shiba2046/greasemonkey-scripts/main/amac-training-tool.js
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('blur', function() {
        window.onblur = {}
    }, false);

})();