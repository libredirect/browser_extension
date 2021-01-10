export default class {
  static filterInstances(instances) {
    return instances.filter((instance) => !instance.includes(".onion"));
  }

  static getRandomInstance(instances) {
    return instances[~~(instances.length * Math.random())];
  }
}
