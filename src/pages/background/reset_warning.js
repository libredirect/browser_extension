let params = new URLSearchParams(location.search);

const resultString = JSON.stringify(
    JSON.parse(params.get('data')),
    null,
    '  '
);

let exportSettingsElement = document.getElementById("export-settings");
exportSettingsElement.href = 'data:application/json;base64,' + btoa(resultString);
exportSettingsElement.download = 'libredirect-settings.json';
