
function filterInstances(instances) {
  return instances.filter((instance) => !instance.includes(".onion"));
}

function addHttps(instances) {
  return instances.map((item, i) => "https://" + item)
}

function getRandomInstance(instances) {
  console.info(instances.length * Math.random(), "=>", instances.length * Math.random())
  return instances[~~(instances.length * Math.random())];
}

function getInstances() {
  const apiEndpoint = 'https://raw.githubusercontent.com/libredirect/instances/main/data.json';
  let request = new XMLHttpRequest();
  request.open('GET', apiEndpoint, false);
  request.send(null);

  if (request.status === 200) {
    const instances = JSON.parse(request.responseText);
    const list = addHttps(filterInstances(instances.nitter));
    const invidiousRandomPool = addHttps(filterInstances(instances.invidious));
    const bibliogramRandomPool = addHttps(filterInstances(instances.bibliogram));
    const wikilessRandomPool = addHttps(filterInstances(instances.wikiless));
    const scribeRandomPool = addHttps(filterInstances(instances.scribe));
    browser.storage.sync.set({
      list,
      invidiousRandomPool,
      bibliogramRandomPool,
      wikilessRandomPool,
      scribeRandomPool
    });
    return true;
  }
  return false;
}

function debounce(func, wait, immediate) {
  let timeout;
  return () => {
    let context = this,
      args = arguments;
    let later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}

function filterList(oldList) {

  oldList.filter((x) => x.trim() != "");
  let newList = [];
  oldList.forEach((c) => {
    if (!newList.includes(c.trim()))
      newList.push(c.trim());
  });
  newList = newList.filter(validURL)
  return newList;
}

function updateListElement(listElement, list) {
  while (listElement.firstChild)
    listElement.removeChild(listElement.firstChild);
  list.forEach(element => {
    let entry = document.createElement('li');
    entry.appendChild(document.createTextNode(element));
    listElement.appendChild(entry);
  });
}

export default {
  filterInstances,
  getRandomInstance,
  getInstances,
  addHttps,
  debounce,
  validURL,
  filterList,
  updateListElement
};
