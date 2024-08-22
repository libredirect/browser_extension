<script>
  const browser = window.browser || window.chrome

  import Checkbox from "../../components/Checkbox.svelte"
  import Label from "../../components/Label.svelte"
  import SwitchInstanceIcon from "../../icons/SwitchInstanceIcon.svelte"
  import Row from "./Row.svelte"
  import ServiceIcon from "./ServiceIcon.svelte"
  import { onDestroy } from "svelte"
  import servicesHelper from "../../../assets/javascripts/services"
  import { options, config } from "../stores"
  import SettingsIcon from "../../icons/SettingsIcon.svelte"

  let _options
  let _config

  const unsubscribeOptions = options.subscribe(val => (_options = val))
  const unsubscribeConfig = config.subscribe(val => (_config = val))
  onDestroy(() => {
    unsubscribeOptions()
    unsubscribeConfig()
  })

  export let serviceKey
  export let url
</script>

<Row>
  <div
    class="interactive margin margin_{document.body.dir}"
    on:keydown={null}
    on:click={() =>
      browser.tabs.create({ url: browser.runtime.getURL(_config.services[serviceKey].url) }, () => {
        window.close()
      })}
  >
    <ServiceIcon details={{ value: serviceKey, label: _config.services[serviceKey].name }} />
    <Label>{_config.services[serviceKey].name}</Label>
  </div>
  <div>
    <Checkbox
      class="margin margin_{document.body.dir}"
      label="Enable"
      checked={_options[serviceKey].enabled}
      onChange={e => {
        _options[serviceKey].enabled = e.target.checked
        options.set(_options)
      }}
    />
    <SwitchInstanceIcon
      class="interactive"
      on:click={async () =>
        browser.tabs.update({ url: await servicesHelper.switchInstance(url, serviceKey) }, () => {
          window.close()
        })}
    />
    <SettingsIcon
      class="interactive"
      on:click={() =>
        browser.tabs.create({ url: browser.runtime.getURL(`pages/options/index.html#services:${serviceKey}`) }, () => {
          window.close()
        })}
    />
  </div>
</Row>

<style>
  div {
    display: flex;
    align-items: center;
  }

  :global(.margin) {
    margin-right: 5px;
    margin-left: 0;
  }
  :global(.margin_rtl) {
    margin-right: 0;
    margin-left: 5px;
  }
</style>
