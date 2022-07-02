// ==UserScript==
// @name         律师云学院助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://lawschool.lawyerpass.com/course/*
// @match        https://lawschool.lawyerpass.com/center/*
// @icon         https://lawschool.lawyerpass.com/assets/images/favicon.ico
// @downloadURL  https://github.com/shiba2046/greasemonkey-scripts/blob/main/lawschool-training-tool.js
// @updateURL    https://github.com/shiba2046/greasemonkey-scripts/blob/main/lawschool-training-tool.js
// @grant        none
// ==/UserScript==

function play() {
    if (document.querySelector(".prism-play-btn.playing") === null) {
        document.querySelector(".prism-play-btn").click()
    }
}

function checkBlock() {
    let btn = document.querySelector(".ant-modal-confirm-btns > button")
    if ( btn !== null ) {
        btn.click();
        play();
    }
}

function check100Percent() {
    var xpath = "//div[contains(., '学习情况：100%')]";
    if (document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null ).iterateNext() !== null) {
        document.querySelector('.entrance').click();
    }
}


(function() {
    'use strict';

    // Your code here...
    var title = document.querySelector(".title")
    if (title !== null) {
        document.title = title.textContent.trim().split(' ')[0];
    }

    setInterval(function(){

        if (document.location.href.indexOf('trainPlan') != -1) {
            document.querySelectorAll('a.text-yellow')[0].click();
        }

        // Check 100%
        if (document.location.href.indexOf('course') != -1) {
            check100Percent();
            checkBlock();
            play();
        }

    },10000);
})();