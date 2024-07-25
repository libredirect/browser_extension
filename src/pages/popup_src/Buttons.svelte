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
  import ServiceIcon from "./components/ServiceIcon.svelte"
  import { onDestroy } from "svelte"
  import servicesHelper from "../../assets/javascripts/services"
  import Checkbox from "../components/Checkbox.svelte"

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
      currentService = await servicesHelper.computeService(url)
    }
  })
</script>

{#if redirect}
  <Row class="row" on:click={() => browser.runtime.sendMessage("redirectTab")}>
    <Label>Redirect</Label>
    <RedirectIcon />
  </Row>
{/if}

{#if switchInstance}
  <Row class="row" on:click={async () => browser.tabs.update({ url: await servicesHelper.switchInstance(url) })}>
    <Label>Switch Instance</Label>
    <SwitchInstanceIcon />
  </Row>
{/if}

{#if redirectToOriginal}
  <Row class="row" on:click={() => servicesHelper.copyRaw(url)}>
    <Label>Copy Original</Label>
    <CopyIcon />
  </Row>
  <Row class="row" on:click={() => browser.runtime.sendMessage("reverseTab")}>
    <Label>Redirect To Original</Label>
    <RedirectToOriginalIcon />
  </Row>
{/if}

<hr />

{#if currentService}
  <Row>
    <div
      style="display: flex;justify-content: space-between;align-items: center;"
      class="row"
      on:keydown={null}
      on:click={() => window.open(browser.runtime.getURL(_config.services[currentService].url), "_blank")}
    >
      <ServiceIcon details={{ value: currentService, label: _config.services[currentService].name }} />
      <Label>{_config.services[currentService].name}</Label>
    </div>
    <div style="display: flex;align-items: center;">
      <Checkbox
        style="margin-right:5px"
        label="Enable"
        checked={_options[currentService].enabled}
        onChange={e => {
          _options[currentService].enabled = e.target.checked
          options.set(_options)
        }}
      />
      <SwitchInstanceIcon
        class="row"
        on:click={async () => browser.tabs.update({ url: await servicesHelper.switchInstance(url, currentService) })}
      />
    </div>
  </Row>
{/if}

<hr />

{#each _options.popupServices as serviceKey}
  {#if currentService !== serviceKey}
    <Row>
      <div
        style="display: flex;align-items: center;"
        class="row"
        on:keydown={null}
        on:click={() => window.open(browser.runtime.getURL(_config.services[serviceKey].url), "_blank")}
      >
        <ServiceIcon details={{ value: serviceKey, label: _config.services[serviceKey].name }} />
        <Label>{_config.services[serviceKey].name}</Label>
      </div>
      <div style="display: flex;align-items: center;">
        <Checkbox
          style="margin-right:5px"
          label="Enable"
          checked={_options[serviceKey].enabled}
          onChange={e => {
            console.log(e.target.checked)
            _options[serviceKey].enabled = e.target.checked
            options.set(_options)
          }}
        />
        <SwitchInstanceIcon
          class="row"
          on:click={async () => browser.tabs.update({ url: await servicesHelper.switchInstance(url, serviceKey) })}
        />
      </div>
    </Row>
  {/if}
{/each}

<hr />

<Row class="row" on:click={() => window.open(browser.runtime.getURL("pages/options/index.html"), "_blank")}>
  <Label>Settings</Label>
  <SettingsIcon />
</Row>

<style>
  :global(.row) {
    transition: 0.1s;
  }
  :global(.row:hover) {
    color: var(--active);
    cursor: pointer;
  }
  :global(.row:active) {
    transform: translateY(1px);
  }

  :global(img, svg) {
    margin-right: 10px;
    height: 26px;
    width: 26px;
    color: var(--text);
  }
</style>
