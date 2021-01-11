function filterInstances(instances) {
  return instances.filter((instance) => !instance.includes(".onion"));
}

function getRandomInstance(instances) {
  return instances[~~(instances.length * Math.random())];
}

export default {
  filterInstances,
  getRandomInstance,
};
