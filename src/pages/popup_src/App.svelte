<script>
  const browser = window.browser || window.chrome

  import utils from "../../assets/javascripts/utils.js"
  import { onDestroy } from "svelte"
  import servicesHelper from "../../assets/javascripts/services.js"
  import { onMount } from "svelte"
  import Buttons from "./Buttons.svelte"

  import { options, config, page } from "./stores"

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
    options.set(opts)
    config.set(await utils.getConfig())
  })

  let _page
  page.subscribe(val => (_page = val))

  let style
  $: if (_options) style = utils.style(_options, window)
</script>

{#if _options && _config}
  <div class="main" dir="auto" {style}>
    <Buttons />
  </div>
{:else}
  <p>Loading...</p>
{/if}

<style>
  :global(html, body) {
    min-width: 260px;
    height: min-content;
    min-height: auto;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    margin-top: -20px;
  }

  div {
    font-weight: bold;
    height: 100%;
    margin: 0;
    padding: 10px;
    padding-top: 20px;
    font-family: "Inter", sans-serif;
    font-size: 16px;
    background-color: var(--bg-main);
    color: var(--text);
  }
</style>
