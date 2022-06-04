window.browser = window.browser || window.chrome;

browser.storage.local.set(
    {
        ['lingva_chakra-ui-color-mode']: localStorage.getItem('chakra-ui-color-mode'),
        lingva_isauto: localStorage.getItem('isauto'),
        lingva_source: localStorage.getItem('source'),
        lingva_target: localStorage.getItem('target'),
    }
)

console.log(localStorage.getItem('target'));