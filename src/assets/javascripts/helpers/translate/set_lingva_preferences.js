window.browser = window.browser || window.chrome;

browser.storage.local.get(
    [
        "lingva_chakra-ui-color-mode",
        "lingva_isauto",
        "lingva_source",
        "lingva_target",
    ],
    r => {
        if (r['lingva_chakra-ui-color-mode'] !== undefined) localStorage.setItem('chakra-ui-color-mode', r['lingva_chakra-ui-color-mode']);
        if (r.lingva_isauto !== undefined) localStorage.setItem('isauto', r.lingva_isauto);
        console.log('r.lingva_isauto', r.lingva_isauto, localStorage.getItem('isauto'))
        if (r.lingva_source !== undefined) localStorage.setItem('source', r.lingva_source);
        if (r.lingva_target !== undefined) localStorage.setItem('target', r.lingva_target);

        window.close();
    }
)
