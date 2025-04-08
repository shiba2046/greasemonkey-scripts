// ==UserScript==
// @name         律师云学院助手
// @namespace    https://github.com/shiba2046/greasemonkey-scripts
// @version      0.7
// @description  自动刷律协培训课程
// @author       Pengus
// @match        https://lawschool.lawyerpass.com/course/*
// @match        https://lawschool.lawyerpass.com/center/*
// @icon         https://lawschool.lawyerpass.com/assets/images/favicon.ico
// @downloadURL  https://raw.githubusercontent.com/shiba2046/greasemonkey-scripts/main/lawschool-training-tool.js
// @updateURL    https://raw.githubusercontent.com/shiba2046/greasemonkey-scripts/main/lawschool-training-tool.js
// @grant        none
// @license      MIT
// ==/UserScript==

// --- 配置区 ---
const CONFIG = {
    CHECK_INTERVAL_MS: 5000,          // 检查间隔（毫秒）
    COMPLETION_THRESHOLD: 99,          // 完成阈值（百分比）
    ELEMENT_WAIT_TIMEOUT: 10000,       // 等待元素超时时间（毫秒）
    ELEMENT_CHECK_INTERVAL: 500,       // 检查元素间隔（毫秒）
    DEBUG: true                        // 调试模式
};

// --- 工具函数 ---
const $ = {
    // 查找单个元素（同步）
    get: (selector) => document.querySelector(selector),
    
    // 查找多个元素（同步）
    getAll: (selector) => document.querySelectorAll(selector),
    
    // 等待元素出现（异步）
    waitForElement: async (selector, timeout = CONFIG.ELEMENT_WAIT_TIMEOUT) => {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) {
                $.log(`找到元素: ${selector}`);
                return element;
            }
            await new Promise(resolve => setTimeout(resolve, CONFIG.ELEMENT_CHECK_INTERVAL));
        }
        $.log(`等待元素超时: ${selector}`);
        return null;
    },

    // 等待多个元素出现（异步）
    waitForElements: async (selector, timeout = CONFIG.ELEMENT_WAIT_TIMEOUT) => {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                $.log(`找到${elements.length}个元素: ${selector}`);
                return elements;
            }
            await new Promise(resolve => setTimeout(resolve, CONFIG.ELEMENT_CHECK_INTERVAL));
        }
        $.log(`等待元素超时: ${selector}`);
        return [];
    },
    
    // XPath查询
    xpath: (xpath) => document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null).iterateNext(),
    
    // 检查URL是否包含文本
    urlHas: (text) => document.location.href.includes(text),
    
    // 日志输出
    log: (...args) => CONFIG.DEBUG && console.log('[律师云学院助手]', ...args)
};

// --- 视频控制 ---
const VideoControl = {
    // 播放视频
    async play() {
        const playBtn = await $.waitForElement(".prism-play-btn");
        if (playBtn && !$.get(".prism-play-btn.playing")) {
            $.log('开始播放视频');
            playBtn.click();
            return true;
        }
        return false;
    },

    // 处理弹窗
    async handlePopup() {
        const confirmBtn = await $.waitForElement(".ant-modal-confirm-btns > button");
        if (confirmBtn) {
            $.log('关闭弹窗');
            confirmBtn.click();
            await this.play();
            return true;
        }
        return false;
    },

    // 获取进度
    async getProgress() {
        const progressEl = await $.waitForElement('div.name.pull-left > div');
        if (!progressEl) return 0;
        const progress = progressEl.innerText.split('：')[1];
        return parseInt(progress) || 0;
    },

    // 检查完成状态
    async checkCompletion() {
        const progress = await this.getProgress();
        if (progress >= CONFIG.COMPLETION_THRESHOLD) {
            const entranceBtn = await $.waitForElement('.entrance');
            if (entranceBtn) {
                $.log('课程完成，点击下一步');
                entranceBtn.click();
                return true;
            }
        }
        return false;
    },

    // 更新标题
    async updateTitle() {
        const titleEl = await $.waitForElement(".title");
        if (titleEl) {
            const progress = await this.getProgress();
            const courseName = titleEl.textContent.trim().split(' ')[0];
            document.title = `${progress}% - ${courseName}`;
        }
    }
};

// --- 课程列表控制 ---
const CourseList = {
    // 显示统计信息
    async showStats() {
        const username = await $.waitForElement('.username');
        if (!username) return;
        
        const done = (await $.waitForElements('.text-green')).length;
        const notDone = (await $.waitForElements('.text-yellow')).length;
        const total = done + notDone;
        
        const statsHtml = `<br/> 共 ${total} 课，已完成 ${done} 课，未完成 ${notDone} 课`;
        username.innerHTML += statsHtml;
        $.log('更新统计信息:', { total, done, notDone });
    },

    // 查找并开始未完成课程
    async findAndStartCourse() {
        const startBtn = await $.waitForElement("button.issue-btn.issue-default-btn.ng-star-inserted");
        if (startBtn) startBtn.click();

        const progressElements = await $.waitForElements('.progress-num');
        const unfinishedProgress = Array.from(progressElements)
            .find(el => el.innerText === '0%');
            
        if (unfinishedProgress) {
            const courseLink = unfinishedProgress.parentElement.parentElement.querySelector('a');
            if (courseLink) {
                $.log('开始新课程');
                courseLink.click();
                return true;
            }
        }
        return false;
    }
};

// --- 主程序 ---
(function() {
    'use strict';

    // 页面加载完成后的初始化
    window.addEventListener('load', async () => {
        if ($.urlHas('trainPlan')) {
            await CourseList.showStats();
        }
    }, false);

    // 定期检查
    setInterval(async () => {
        try {
            if ($.urlHas('trainPlan')) {
                await CourseList.findAndStartCourse();
            } else if ($.urlHas('course')) {
                await VideoControl.updateTitle();
                await VideoControl.checkCompletion();
                await VideoControl.handlePopup();
                await VideoControl.play();
            }
        } catch (error) {
            $.log('执行出错:', error);
        }
    }, CONFIG.CHECK_INTERVAL_MS);
})();