const params = new Proxy(
    new URLSearchParams(window.location.search),
    { get: (searchParams, prop) => searchParams.get(prop) }
);

let number = document.getElementById("number");
setTimeout(() => number.innerHTML = '1', 1000);
setTimeout(
    () => {
        number.innerHTML = '0'
        if (!isCanceled) window.location = params.url;
    },
    2000
);

let isCanceled = false;
document.getElementById("cancel").addEventListener("click", () => {
    isCanceled = true;
    document.getElementById("message").innerHTML = browser.i18n.getMessage('redirectionCanceled');
})
