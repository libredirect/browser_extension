
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
    const nitterRandomPool = addHttps(filterInstances(instances.nitter));
    const invidiousRandomPool = addHttps(filterInstances(instances.invidious));
    const bibliogramRandomPool = addHttps(filterInstances(instances.bibliogram));
    const wikilessRandomPool = addHttps(filterInstances(instances.wikiless));
    const scribeRandomPool = addHttps(filterInstances(instances.scribe));
    browser.storage.sync.set({
      nitterRandomPool,
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

export default {
  filterInstances,
  getRandomInstance,
  getInstances,
  addHttps,
  debounce
};
