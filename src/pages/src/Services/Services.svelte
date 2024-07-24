<script>
  import Checkbox from "../components/RowCheckbox.svelte"
  import RowSelect from "../components/RowSelect.svelte"
  import Row from "../components/Row.svelte"
  import Label from "../components/Label.svelte"
  import Select from "../components/Select.svelte"
  import { options, config } from "../stores"
  import RedirectType from "./RedirectType.svelte"
  import { onDestroy } from "svelte"
  import Instances from "./Instances.svelte"
  import SvelteSelect from "svelte-select"
  import ServiceIcon from "./ServiceIcon.svelte"

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
  $: frontendWebsite = serviceConf.frontends[serviceOptions.frontend].url
</script>

<div>
  <Row>
    <Label>
      Service:
      <a href={serviceConf.url} target="_blank" rel="noopener noreferrer">{serviceConf.url}</a>
    </Label>
    <SvelteSelect
      clearable={false}
      class="svelte_select"
      value={selectedService}
      on:change={e => (selectedService = e.detail.value)}
      items={[
        ...Object.entries(_config.services).map(([serviceKey, service]) => {
          return { value: serviceKey, label: service.name }
        }),
      ]}
    >
      <div class="slot" slot="item" let:item>
        <ServiceIcon details={item} />
        {item.label}
      </div>
      <div class="slot" slot="selection" let:selection>
        <ServiceIcon details={selection} />
        {selection.label}
      </div>
    </SvelteSelect>
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
        <a href={frontendWebsite} target="_blank" rel="noopener noreferrer">
          {frontendWebsite}
        </a>
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
      label="Unsupported embeds handling"
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
      <Row>
        <Label>
          Set LibRedirect as Default Search Engine. For how to do in chromium browsers, click
          <a
            href="https://libredirect.github.io/docs.html#search_engine_chromium"
            target="_blank"
            rel="noopener noreferrer"
            >here
          </a>.
        </Label>
      </Row>
    {/if}

    <Instances
      {selectedService}
      selectedFrontend={!serviceConf.frontends[serviceOptions.frontend].desktopApp ||
      serviceOptions.redirectType == "main_frame"
        ? serviceOptions.frontend
        : serviceOptions.embedFrontend}
    />

    <Row></Row>
  </div>
</div>

<style>
  :global(.svelte_select) {
    font-weight: bold;
    --item-padding: 0 10px;
    --border: none;
    --border-hover: none;
    --width: 210px;
    --background: var(--bg-secondary);
    --list-background: var(--bg-secondary);
    --item-active-background: red;
    --item-is-active-bg: grey;
    --item-hover-bg: grey;
    --item-color: var(--text); /*text color*/
  }
  :global(.svelte_select .slot) {
    display: flex;
    justify-content: start;
    align-items: center;
  }

  :global(.svelte_select img, .svelte_select svg) {
    margin-right: 10px;
    height: 26px;
    width: 26px;
    color: var(--text);
  }
</style>
