
function filterInstances(instances) {
  return instances.filter((instance) => !instance.includes(".onion"));
}

function addHttps(instances) {
  return instances.map((item, i) => "https://" + item)
}

function getRandomInstance(instances) {
  return instances[~~(instances.length * Math.random())];
}

function getInstances() {
  const apiEndpoint = 'https://raw.githubusercontent.com/libredirect/instances/main/data.json';
  let request = new XMLHttpRequest();
  request.open('GET', apiEndpoint, false);
  request.send(null);

  if (request.status === 200) {
    const instances = JSON.parse(request.responseText);
    const nitterRandomPool = addHttps(filterInstances(instances.twitter)).join(',');
    const invidiousRandomPool = addHttps(filterInstances(instances.youtube)).join(',');
    const bibliogramRandomPool = addHttps(filterInstances(instances.instagram)).join(',');
    browser.storage.sync.set({ nitterRandomPool, invidiousRandomPool, bibliogramRandomPool });
    return true;
  }
  return false;
}

export default {
  filterInstances,
  getRandomInstance,
  getInstances,
  addHttps,
};
