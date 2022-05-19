window.browser = window.browser || window.chrome;

browser.storage.local.set(
    {
        ['lingva_lingva_chakra-ui-color-mode']: localStorage.getItem('chakra-ui-color-mode'),
        lingva_lingva_isauto: localStorage.getItem('isauto'),
        lingva_lingva_source: localStorage.getItem('source'),
        lingva_lingva_target: localStorage.getItem('target'),
    }
)
