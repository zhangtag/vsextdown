// ==UserScript==
// @name         VSIX Download Link
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  添加 VSIX 扩展下载链接
// @author       https://blog.kfcai.cn
// @match        *://marketplace.visualstudio.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 创建延时函数确保元素加载完成
    const waitForElement = (selector) => {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
 
            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });
 
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    };
 
    // 主执行函数
    async function main() {
        try {
            // 等待关键元素加载
            const identifierElem = await waitForElement('#unique-identifier');
            const versionElem = await waitForElement('#version');
            const targetUl = await waitForElement('.ux-section-resources ul');
 
            // 提取信息
            const identifier = identifierElem.nextElementSibling.innerText.split('.');
            const version = versionElem.nextElementSibling.innerText;
 
            // 构建下载链接
            const vsix_url = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${identifier[0]}/vsextensions/${identifier[1]}/${version}/vspackage`;
            
            // 添加下载按钮
            targetUl.insertAdjacentHTML('beforeend', `<li><a href="${vsix_url}" style="color:#0078d4;font-weight:bold;">⬇️ VSIX 下载</a></li>`);
            
            // 在控制台输出（可选）
            console.log('VSIX 下载地址已添加:', vsix_url);
        } catch (error) {
            console.error('脚本执行出错:', error);
        }
    }
 
    // 启动主函数
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();
