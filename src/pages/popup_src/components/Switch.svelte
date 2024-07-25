<script>
  let browser = window.browser || window.chrome

  import Checkbox from "../../components/Checkbox.svelte"
  import Label from "../../components/Label.svelte"
  import SwitchInstanceIcon from "../../icons/SwitchInstanceIcon.svelte"
  import Row from "./Row.svelte"
  import ServiceIcon from "./ServiceIcon.svelte"
  import { onDestroy } from "svelte"
  import servicesHelper from "../../../assets/javascripts/services"
  import { options, config } from "../stores"

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
    class="interactive"
    on:keydown={null}
    on:click={() => window.open(browser.runtime.getURL(_config.services[serviceKey].url), "_blank")}
  >
    <ServiceIcon details={{ value: serviceKey, label: _config.services[serviceKey].name }} />
    <Label>{_config.services[serviceKey].name}</Label>
  </div>
  <div>
    <Checkbox
      style="margin-right:5px"
      label="Enable"
      checked={_options[serviceKey].enabled}
      onChange={e => {
        _options[serviceKey].enabled = e.target.checked
        options.set(_options)
      }}
    />
    <SwitchInstanceIcon
      class="interactive"
      on:click={async () => browser.tabs.update({ url: await servicesHelper.switchInstance(url, serviceKey) })}
    />
  </div>
</Row>

<style>
  div {
    display: flex;
    align-items: center;
  }
</style>
