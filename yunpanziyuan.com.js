// ==UserScript==
// @name         云盘资源网链接清理
// @namespace    https://github.dev/shiba2046/greasemonkey-scripts
// @version      0.1
// @description  清洁外链
// @author       Pengus
// @match        https://greasyfork.org/zh-CN/script_versions/new
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @match        https://*.yunpanziyuan.com/*
// ==/UserScript==

function clean_urls()
{
    let urls= document.querySelectorAll("a[rel='external nofollow']");
    urls.forEach(url => fix_url(url))

}

function fix_url(url)
{
    url.href = url.firstChild.textContent
}

(function() {
    'use strict';
    // Your code here...
    clean_urls();


})();