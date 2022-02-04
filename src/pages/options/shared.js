var autocompletes = [];

function parseURL(urlString) {
    if (urlString)
        try {
            const url = new URL(urlString);
            if (url.username && url.password)
                return `${url.protocol}//${url.username}:${url.password}@${url.host}`;
            else
                return url.origin;

        } catch (error) {
            console.log(error);
            return "";
        }
    else
        return "";
}

function autocomplete(input, list) {
    let currentFocus;
    input.addEventListener("focus", (e) => {
        showOptions(e, true);
    });
    input.addEventListener("input", (e) => {
        const val = e.target.value;
        if (!val) {
            return false;
        }
        currentFocus = -1;
        showOptions(e);
    });
    input.addEventListener("keydown", function (e) {
        let x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });
    function showOptions(event, showAll = false) {
        let div,
            i,
            val = event.target.value;
        closeAllLists();
        div = document.createElement("div");
        div.setAttribute("id", event.target.id + "autocomplete-list");
        div.setAttribute("class", "autocomplete-items");
        event.target.parentNode.appendChild(div);
        for (i = 0; i < list.length; i++) {
            if (list[i].toLowerCase().indexOf(val.toLowerCase()) > -1) {
                div.appendChild(getItem(list[i], val));
            } else if (showAll) {
                div.appendChild(getItem(list[i], val));
            }
        }
    }
    function getItem(item, val) {
        const div = document.createElement("div");
        const strong = document.createElement("strong");
        strong.textContent = item.substr(0, val.length);
        div.innerText = item.substr(val.length);
        const hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.value = item;
        div.prepend(strong);
        div.appendChild(hiddenInput);
        div.addEventListener("click", function (e) {
            input.value = div.getElementsByTagName("input")[0].value;
            input.dispatchEvent(new Event("input"));
            closeAllLists();
        });
        return div;
    }
    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = x.length - 1;
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        let x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != input) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", (e) => {
        if (!autocompletes.find((element) => element.id === e.target.id)) {
            closeAllLists(e.target);
        }
    });
}

export default {
    autocompletes,
    parseURL,
    autocomplete
}