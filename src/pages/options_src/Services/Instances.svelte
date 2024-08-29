<script>
  const browser = window.browser || window.chrome

  import Button from "../../components/Button.svelte"
  import AddIcon from "../../icons/AddIcon.svelte"
  import { options, config } from "../stores"
  import PingIcon from "../../icons/PingIcon.svelte"
  import AutoPickIcon from "../../icons/AutoPickIcon.svelte"
  import Row from "../../components/Row.svelte"
  import Input from "../../components/Input.svelte"
  import Label from "../../components/Label.svelte"
  import CloseIcon from "../../icons/CloseIcon.svelte"
  import { onDestroy, onMount } from "svelte"
  import utils from "../../../assets/javascripts/utils"

  export let selectedService
  export let selectedFrontend

  let _options
  let _config

  const unsubscribeOptions = options.subscribe(val => (_options = val))
  const unsubscribeConfig = config.subscribe(val => (_config = val))
  onDestroy(() => {
    unsubscribeOptions()
    unsubscribeConfig()
  })

  let blacklist
  let redirects

  $: serviceConf = _config.services[selectedService]

  let allInstances = []

  $: {
    allInstances = []
    if (_options[selectedFrontend]) allInstances.push(..._options[selectedFrontend])
    if (redirects && redirects[selectedFrontend]) {
      allInstances.push(...redirects[selectedFrontend]["clearnet"])
    }
    allInstances = [...new Set(allInstances)]
  }

  let pingCache
  $: {
    if (pingCache) browser.storage.local.set({ pingCache })
  }

  function isCustomInstance(instance) {
    if (redirects[selectedFrontend]) {
      for (const network in redirects[selectedFrontend]) {
        if (redirects[selectedFrontend][network].includes(instance)) return false
      }
    }
    return true
  }

  async function pingInstances() {
    pingCache = {}
    for (const instance of allInstances) {
      pingCache[instance] = { color: "lightblue", value: "pinging..." }
      const time = await utils.ping(instance)
      pingCache[instance] = colorTime(time)
    }
  }

  async function autoPickInstance() {
    const instances = utils.randomInstances(redirects[selectedFrontend]["clearnet"], 5)
    const myInstancesCache = []
    for (const instance of instances) {
      pingCache[instance] = { color: "lightblue", value: "pinging..." }
      const time = await utils.ping(instance)
      pingCache[instance] = colorTime(time)
      myInstancesCache.push([instance, time])
    }
    myInstancesCache.sort((a, b) => a[1] - b[1])

    _options[selectedFrontend].push(myInstancesCache[0][0])
    options.set(_options)
  }

  function colorTime(time) {
    let value
    let color
    if (time < 5000) {
      value = `${time}ms`
      if (time <= 1000) color = "green"
      else if (time <= 2000) color = "orange"
    } else if (time >= 5000) {
      color = "red"
      if (time == 5000) value = "5000ms+"
      if (time > 5000) value = `Error: ${time - 5000}`
    } else {
      color = "red"
      value = "Server not found"
    }
    return { color, value }
  }

  onMount(async () => {
    blacklist = await utils.getBlacklist(_options)
    redirects = await utils.getList(_options)
    pingCache = await utils.getPingCache()
  })

  let addInstanceValue
  function addInstance() {
    const instance = utils.protocolHost(new URL(addInstanceValue))
    if (!_options[selectedFrontend].includes(instance)) {
      _options[selectedFrontend].push(instance)
      addInstanceValue = ""
      options.set(_options)
    }
  }
</script>

{#if serviceConf.frontends[selectedFrontend].instanceList && redirects && blacklist}
  <hr />

  <div>
    <Button on:click={pingInstances}>
      <PingIcon class="margin margin_{document.body.dir}" />
      {browser.i18n.getMessage("pingInstances") || "Ping Instances"}
    </Button>
    <Button on:click={autoPickInstance}>
      <AutoPickIcon class="margin margin_{document.body.dir}" />
      {browser.i18n.getMessage("autoPickInstance") || "Auto Pick Instance"}
    </Button>
  </div>

  <Row>
    <Label>{browser.i18n.getMessage("addYourFavoriteInstances") || "Add your favorite instances"}</Label>
  </Row>
  <div dir="ltr">
    <Row>
      <Input
        bind:value={addInstanceValue}
        type="url"
        placeholder="https://instance.com"
        aria-label="Add instance input"
        on:keydown={e => e.key === "Enter" && addInstance()}
      />
      <button on:click={addInstance} class="add" aria-label="Add the instance">
        <AddIcon />
      </button>
    </Row>

    {#each _options[selectedFrontend] as instance}
      <Row>
        <span>
          <a href={instance} target="_blank" rel="noopener noreferrer">{instance}</a>
          {#if isCustomInstance(instance)}
            <span style="color:grey">custom</span>
          {/if}
          {#if pingCache && pingCache[instance]}
            <span style="color:{pingCache[instance].color}">{pingCache[instance].value}</span>
          {/if}
        </span>
        <button
          class="add"
          aria-label="Remove Instance"
          on:click={() => {
            const index = _options[selectedFrontend].indexOf(instance)
            if (index > -1) {
              _options[selectedFrontend].splice(index, 1)
              options.set(_options)
            }
          }}
        >
          <CloseIcon />
        </button>
      </Row>
      <hr />
    {/each}

    {#if redirects !== "disabled" && blacklist !== "disabled"}
      {#if redirects[selectedFrontend] && redirects[selectedFrontend]["clearnet"]}
        {#each Object.entries(_config.networks) as [networkName, network]}
          {#if redirects[selectedFrontend] && redirects[selectedFrontend][networkName] && redirects[selectedFrontend][networkName].length > 0}
            <Row></Row>
            <Row><Label>{network.name}</Label></Row>
            <hr />
            {#each redirects[selectedFrontend][networkName] as instance}
              <Row>
                <span>
                  <a href={instance} target="_blank" rel="noopener noreferrer">{instance}</a>
                  {#if blacklist.cloudflare.includes(instance)}
                    <a
                      href="https://libredirect.github.io/docs.html#instances"
                      target="_blank"
                      rel="noopener noreferrer"
                      style="color:red;"
                    >
                      cloudflare
                    </a>
                  {/if}
                  {#if _options[selectedFrontend].includes(instance)}
                    <span style="color:grey">chosen</span>
                  {/if}
                  {#if pingCache && pingCache[instance]}
                    <span style="color:{pingCache[instance].color}">{pingCache[instance].value}</span>
                  {/if}
                </span>
                <button
                  class="add"
                  aria-label="Add instance"
                  on:click={() => {
                    if (_options[selectedFrontend]) {
                      if (!_options[selectedFrontend].includes(instance)) {
                        _options[selectedFrontend].push(instance)
                        options.set(_options)
                      }
                    }
                  }}
                >
                  <AddIcon />
                </button>
              </Row>
              <hr />
            {/each}
          {/if}
        {/each}
      {:else}
        <Row><Label>No instances found.</Label></Row>
      {/if}
    {/if}
  </div>
{/if}

<style>
  .add {
    background-color: transparent;
    border: none;
    color: var(--text);
    padding: 0;
    margin: 0;
    text-decoration: none;
    display: inline-block;
    cursor: pointer;
  }

  a {
    color: var(--text);
    text-decoration: none;
    word-wrap: anywhere;
  }

  a:hover {
    text-decoration: underline;
  }

  :global(.margin) {
    margin-right: 10px;
    margin-left: 0;
  }
  :global(.margin_rtl) {
    margin-right: 0;
    margin-left: 10px;
  }
</style>
