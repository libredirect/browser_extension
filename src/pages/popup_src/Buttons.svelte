<script>
  let browser = window.browser || window.chrome

  import Row from "./components/Row.svelte"
  import Label from "../components/Label.svelte"
  import CopyIcon from "../icons/CopyIcon.svelte"
  import RedirectToOriginalIcon from "../icons/RedirectToOriginalIcon.svelte"
  import RedirectIcon from "../icons/RedirectIcon.svelte"
  import SwitchInstanceIcon from "../icons/SwitchInstanceIcon.svelte"
  import SettingsIcon from "../icons/SettingsIcon.svelte"
  import { options, config } from "./stores"
  import { onDestroy } from "svelte"
  import servicesHelper from "../../assets/javascripts/services"
  import Switch from "./components/Switch.svelte"

  let _options
  let _config

  const unsubscribeOptions = options.subscribe(val => (_options = val))
  const unsubscribeConfig = config.subscribe(val => (_config = val))
  onDestroy(() => {
    unsubscribeOptions()
    unsubscribeConfig()
  })

  let url
  let switchInstance
  let redirectToOriginal
  let redirect
  let currentService
  browser.tabs.query({ active: true, currentWindow: true }, async tabs => {
    if (tabs[0].url) {
      url = new URL(tabs[0].url)
      servicesHelper.switchInstance(url).then(r => (switchInstance = r))
      servicesHelper.reverse(url).then(r => (redirectToOriginal = r))
      servicesHelper.redirectAsync(url, "main_frame", null, true).then(r => (redirect = r))
      servicesHelper.computeService(url).then(r => (currentService = r))
    }
  })
</script>

{#if redirect}
  <Row class="interactive" on:click={() => browser.runtime.sendMessage("redirectTab")}>
    <Label>Redirect</Label>
    <RedirectIcon />
  </Row>
{/if}

{#if switchInstance}
  <Row
    class="interactive"
    on:click={async () => browser.tabs.update({ url: await servicesHelper.switchInstance(url) })}
  >
    <Label>Switch Instance</Label>
    <SwitchInstanceIcon />
  </Row>
{/if}

{#if redirectToOriginal}
  <Row class="interactive" on:click={() => servicesHelper.copyRaw(url)}>
    <Label>Copy Original</Label>
    <CopyIcon />
  </Row>
  <Row class="interactive" on:click={() => browser.runtime.sendMessage("reverseTab")}>
    <Label>Redirect To Original</Label>
    <RedirectToOriginalIcon />
  </Row>
{/if}

{#if redirect || switchInstance || redirectToOriginal}
  <hr />
{/if}

{#if currentService}
  <Switch serviceKey={currentService} {url} />
  <hr />
{/if}

{#each _options.popupServices as serviceKey}
  {#if currentService !== serviceKey}
    <Switch {serviceKey} {url} />
  {/if}
{/each}

<hr />

<Row class="interactive" on:click={() => window.open(browser.runtime.getURL("pages/options/index.html"), "_blank")}>
  <Label>Settings</Label>
  <SettingsIcon />
</Row>

<style>
  :global(.interactive) {
    transition: 0.1s;
  }
  :global(.interactive:hover) {
    color: var(--active);
    cursor: pointer;
  }
  :global(.interactive:active) {
    transform: translateY(1px);
  }

  :global(img, svg) {
    margin-right: 10px;
    height: 26px;
    width: 26px;
    color: var(--text);
  }
</style>
