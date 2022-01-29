
function filterInstances(instances) {
  let filtered = instances.filter((instance) => !instance.includes(".onion"));
  let result = filtered.map((item, i) => "https://" + item)
  return result;
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
    const nitterRandomPool = filterInstances(instances.twitter).join(',');
    const invidiousRandomPool = filterInstances(instances.youtube).join(',');
    const bibliogramRandomPool = filterInstances(instances.instagram).join(',');
    browser.storage.sync.set({ nitterRandomPool, invidiousRandomPool, bibliogramRandomPool });
    return true;
  }
  return false;
}

export default {
  filterInstances,
  getRandomInstance,
  getInstances,
};
