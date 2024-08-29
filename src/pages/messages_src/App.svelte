<script>
  const browser = window.browser || window.chrome

  import utils from "../../assets/javascripts/utils.js"
  import { onDestroy } from "svelte"
  import servicesHelper from "../../assets/javascripts/services.js"
  import { onMount } from "svelte"

  import { options, config, page } from "./stores"
  import Button from "../components/Button.svelte"
  import AutoPickIcon from "../icons/AutoPickIcon.svelte"

  let _options
  const unsubscribeOptions = options.subscribe(val => {
    if (val) {
      _options = val
      browser.storage.local.set({ options: val })
    }
  })

  let _config
  const unsubscribeConfig = config.subscribe(val => (_config = val))

  onDestroy(() => {
    unsubscribeOptions()
    unsubscribeConfig()
  })

  onMount(async () => {
    let opts = await utils.getOptions()
    if (!opts) {
      await servicesHelper.initDefaults()
      opts = await utils.getOptions()
    }
    redirects = await utils.getList(opts)
    options.set(opts)
    config.set(await utils.getConfig())
  })

  let _page
  page.subscribe(val => (_page = val))

  let style
  $: if (_options) style = utils.style(_options, window)

  let autoPicking = false
  let redirects

  const params = new URLSearchParams(window.location.search)
  const oldUrl = new URL(params.get("url"))

  async function autoPickInstance() {
    const frontend = params.get("frontend")
    autoPicking = true
    const instances = utils.randomInstances(redirects[frontend]["clearnet"], 5)
    const pings = await Promise.all([...instances.map(async instance => [instance, await utils.ping(instance)])])
    pings.sort((a, b) => a[1] - b[1])
    console.log(pings)
    _options[frontend].push(pings[0][0])
    options.set(_options)
    autoPicking = false
    await redirectUrl()
  }

  async function enableService() {
    const service = await servicesHelper.computeService(oldUrl)
    _options[service].enabled = true
    options.set(_options)
    await redirectUrl()
  }

  async function redirectUrl() {
    const newUrl = await servicesHelper.redirectAsync(oldUrl, "main_frame", null, null, false, true)
    browser.tabs.update({ url: newUrl })
  }
</script>

{#if _options && _config}
  <div class="main" dir="auto" {style}>
    {#if window.location.search.includes("message=disabled")}
      <div>
        <h1>You disabled redirections for this service</h1>
        <Button on:click={enableService}>
          {browser.i18n.getMessage("enable") || "Enable"}
        </Button>
      </div>
    {:else if window.location.search.includes("message=no_instance")}
      <div>
        <h1>You have no instance selected for this frontend</h1>
        <Button on:click={autoPickInstance} disabled={autoPicking}>
          <AutoPickIcon class="margin margin_{document.body.dir}" />
          {browser.i18n.getMessage("autoPickInstance") || "Auto Pick Instance"}
        </Button>
      </div>
    {/if}
  </div>
{:else}
  <p>Loading...</p>
{/if}

<style>
  :global(body) {
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
  }

  div.main {
    height: 100%;
    display: grid;
    grid-template-columns: 800px;
    margin: 0;
    padding-top: 50px;
    justify-content: center;
    font-family: "Inter", sans-serif;
    box-sizing: border-box;
    font-size: 16px;
    background-color: var(--bg-main);
    color: var(--text);
    overflow: scroll;
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
