<script>
  let browser = window.browser || window.chrome

  import Checkbox from "../components/RowCheckbox.svelte"
  import RowSelect from "../components/RowSelect.svelte"
  import Row from "../components/Row.svelte"
  import Label from "../components/Label.svelte"
  import Select from "../components/Select.svelte"
  import { options, config } from "../stores"
  import RedirectType from "./RedirectType.svelte"
  import { onDestroy, onMount } from "svelte"
  import Instances from "./Instances.svelte"

  let _options
  let _config

  const unsubscribeOptions = options.subscribe(val => (_options = val))
  const unsubscribeConfig = config.subscribe(val => (_config = val))
  onDestroy(() => {
    unsubscribeOptions()
    unsubscribeConfig()
  })

  let selectedService = "youtube"

  $: serviceConf = _config.services[selectedService]
  $: serviceOptions = _options[selectedService]
</script>

<div>
  <Row>
    <Label>
      Service:
      <a href={serviceConf.url} target="_blank" rel="noopener noreferrer">{serviceConf.url}</a>
    </Label>
    <Select
      value={selectedService}
      values={[
        ...Object.entries(_config.services).map(([serviceId, service]) => {
          return { value: serviceId, name: service.name }
        }),
      ]}
      onChange={e => (selectedService = e.target.options[e.target.options.selectedIndex].value)}
    />
  </Row>

  <hr />

  <Checkbox
    label="Enable"
    checked={serviceOptions.enabled}
    onChange={e => {
      serviceOptions.enabled = e.target.checked
      options.set(_options)
    }}
  />

  <div style={!serviceOptions.enabled && "pointer-events: none;opacity: 0.4;user-select: none;"}>
    <Checkbox
      label="Show in popup"
      checked={_options.popupServices.includes(selectedService)}
      onChange={e => {
        if (e.target.checked && !_options.popupServices.includes(selectedService)) {
          _options.popupServices.push(selectedService)
        } else if (_options.popupServices.includes(selectedService)) {
          const index = _options.popupServices.indexOf(selectedService)
          if (index !== -1) _options.popupServices.splice(index, 1)
        }
        options.set(_options)
      }}
    />

    <Row>
      <Label>
        Frontend:
        <a href={serviceConf.frontends[serviceOptions.frontend].url} target="_blank" rel="noopener noreferrer"
          >{serviceConf.frontends[serviceOptions.frontend].url}</a
        >
      </Label>
      <Select
        value={serviceOptions.frontend}
        values={[
          ...Object.entries(serviceConf.frontends).map(([frontendId, frontend]) => ({
            value: frontendId,
            name: frontend.name,
          })),
        ]}
        onChange={e => {
          serviceOptions.frontend = e.target.options[e.target.options.selectedIndex].value
          options.set(_options)
        }}
      />
    </Row>

    <RedirectType {selectedService} />

    <RowSelect
      label="Unsupported iframes handling"
      value={serviceOptions.unsupportedUrls}
      onChange={e => {
        serviceOptions.unsupportedUrls = e.target.options[e.target.options.selectedIndex].value
        options.set(_options)
      }}
      values={[
        { value: "bypass", name: "Bypass" },
        { value: "block", name: "Block" },
      ]}
    />

    {#if selectedService == "search"}
      <div>
        Set LibRedirect as Default Search Engine. For how to do in chromium browsers, click
        <a href="https://libredirect.github.io/docs.html#search_engine_chromium">here</a>.
      </div>
    {/if}

    <Instances {selectedService} />
  </div>
</div>
