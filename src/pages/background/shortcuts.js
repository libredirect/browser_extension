"use strict";

window.browser = window.browser || window.chrome;

document.addEventListener('keydown',
    e => {
        if (e.code === 'KeyL' && e.shiftKey && e.altKey)
            browser.runtime.sendMessage({
                function: "changeInstance",
                url: window.location.href,
            });
    }
)