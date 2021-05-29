function filterInstances(instances) {
  return instances.filter((instance) => !instance.includes(".onion"));
}

function getRandomInstance(instances) {
  return instances[~~(instances.length * Math.random())];
}

async function getRandomOnlineInstance(instances) {
  const shuffledInstances = instances.sort((a,b) => 0.5-Math.random())

  for(let ins of shuffledInstances) {
    try {
      const res = await fetch(ins, {
        redirect: 'follow'
      })
      console.log(res)
      if(res.status >= 200 && res.status < 300) {
        // instance seems healthy!
        return ins
      } else {
        console.warn(`Instance ${ins} seems offline (status code: ${res.status}). we try another one`)
      }
    } catch(err) {
      console.warn(`Instance ${ins} seems offline. we try another one`)
    }
  }

  // everything offline? -> unlikely
  // rather respond with any entry instead of breaking the functionality
  return shuffledInstances[0]
}


export default {
  filterInstances,
  getRandomInstance,
  getRandomOnlineInstance
};
