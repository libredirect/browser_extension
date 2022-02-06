import youtubeHelper from "../../../assets/javascripts/helpers/youtube/youtube.js";

youtubeHelper.init().then(() => {

    pipedDefaultRedirects = youtubeHelper.getPipedRedirectsChecks();
    pipedCheckListElement.innerHTML =
        [
            '<div>Toggle All<input type="checkbox" id="piped-toogle-all" /></div>',
            ...youtubeHelper.getRedirects().piped.normal.map((x) => `<div>${x}<input type="checkbox" id="${x}" /></div>`),
        ].join('\n<hr>\n');

    calcPipedCheckBoxes();
    document.getElementById('piped-toogle-all').addEventListener("change", (event) => {
        if (event.target.checked)
            pipedDefaultRedirects = [...youtubeHelper.getRedirects().piped.normal];
        else
            pipedDefaultRedirects = [];
        youtubeHelper.setPipedRedirectsChecks(pipedDefaultRedirects);
        calcPipedCheckBoxes();
    });

    for (let element of pipedCheckListElement.getElementsByTagName('input')) {
        if (element.id != 'piped-toogle-all')
            document.getElementById(element.id).addEventListener("change", (event) => {
                if (event.target.checked)
                    pipedDefaultRedirects.push(element.id)
                else {
                    let index = pipedDefaultRedirects.indexOf(element.id);
                    if (index > -1) pipedDefaultRedirects.splice(index, 1);
                }
                youtubeHelper.setPipedRedirectsChecks(pipedDefaultRedirects);
                calcPipedCheckBoxes();
            });
    }

    pipedCustomInstances = youtubeHelper.getPipedCustomRedirects();
    calcPipedCustomInstances();
});


let pipedCustomInstanceInput = document.getElementById("piped-custom-instance");
let pipedCustomInstances = [];

let pipedCheckListElement = document.getElementById("piped-checklist");

let pipedDefaultRedirects;

function calcPipedCheckBoxes() {
    let isTrue = true;
    for (const item of youtubeHelper.getRedirects().piped.normal)
        if (!pipedDefaultRedirects.includes(item)) {
            isTrue = false;
            break;
        }
    for (const element of pipedCheckListElement.getElementsByTagName('input'))
        element.checked = pipedDefaultRedirects.includes(element.id)
    document.getElementById('piped-toogle-all').checked = isTrue;
}

function calcPipedCustomInstances() {
    document.getElementById("piped-custom-checklist").innerHTML =
        pipedCustomInstances.map(
            (x) => `<div>${x}<button class="add" id="clear-${x}">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px"
                            fill="currentColor">
                                <path d="M0 0h24v24H0V0z" fill="none" />
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                            </svg>
                        </button>
                    </div>
                    <hr>`
        ).join('\n');

    for (const item of pipedCustomInstances) {
        document.getElementById(`clear-${item}`).addEventListener("click", () => {
            let index = pipedCustomInstances.indexOf(item);
            if (index > -1) pipedCustomInstances.splice(index, 1);
            youtubeHelper.setPipedCustomRedirects(pipedCustomInstances);
            calcPipedCustomInstances();
        });
    }
}

document.getElementById("custom-piped-instance-form").addEventListener("submit", (event) => {
    event.preventDefault();
    let val = pipedCustomInstanceInput.value
    if (pipedCustomInstanceInput.validity.valid && !youtubeHelper.getRedirects().piped.normal.includes(val)) {
        if (!pipedCustomInstances.includes(val)) {
            pipedCustomInstances.push(val)
            youtubeHelper.setPipedCustomRedirects(pipedCustomInstances);
        }
        calcPipedCustomInstances();
    }
})