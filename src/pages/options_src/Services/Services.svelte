<script>
  const browser = window.browser || window.chrome

  import url from "../url"
  import Row from "../../components/Row.svelte"
  import Label from "../../components/Label.svelte"
  import Select from "../../components/Select.svelte"
  import { options, config } from "../stores"
  import RedirectType from "./RedirectType.svelte"
  import { onDestroy } from "svelte"
  import Instances from "./Instances.svelte"
  import SvelteSelect from "svelte-select"
  import ServiceIcon from "./ServiceIcon.svelte"
  import FrontendIcon from "./FrontendIcon.svelte"
  import Checkbox from "../../components/Checkbox.svelte"

  let _options
  let _config

  const unsubscribeOptions = options.subscribe(val => (_options = val))
  const unsubscribeConfig = config.subscribe(val => (_config = val))
  onDestroy(() => {
    unsubscribeOptions()
    unsubscribeConfig()
  })
  let selectedService = $url.hash.startsWith("#services:") ? $url.hash.split(":")[1] : "youtube"
  let hideServiceSelection = false
  let hideFrontendSelection = false
  $: serviceConf = _config.services[selectedService]
  $: serviceOptions = _options[selectedService]
  $: frontendWebsite = serviceConf.frontends[serviceOptions.frontend].url
  $: servicesEntries = Object.entries(_config.services)
  $: frontendEntries = Object.entries(serviceConf.frontends)
</script>

<div>
  <Row>
    <Label>
      <a href={serviceConf.url} style="text-decoration: underline;" target="_blank" rel="noopener noreferrer">
        {browser.i18n.getMessage("service") || "Service"}
      </a>
    </Label>
    <div dir="ltr" on:click={() => (hideServiceSelection = true)} on:keydown={null}>
      <SvelteSelect
        clearable={false}
        class="svelte_select"
        value={selectedService}
        showChevron
        on:change={e => {
          selectedService = e.detail.value
          window.location.hash = `services:${e.detail.value}`
          hideServiceSelection = false
        }}
        on:pointerup={() => (hideServiceSelection = false)}
        on:focus={() => (hideServiceSelection = true)}
        on:blur={() => (hideServiceSelection = false)}
        items={[
          ...servicesEntries.map(([serviceKey, service]) => {
            return { value: serviceKey, label: service.name }
          }),
        ]}
      >
        <div class={"slot " + (!_options[item.value].enabled && "disabled")} slot="item" let:item>
          <ServiceIcon details={item} />
          {item.label}
        </div>
        <div
          class={"slot " + (!_options[selection.value].enabled && !hideServiceSelection && "disabled")}
          slot="selection"
          let:selection
        >
          {#if !hideServiceSelection}
            <ServiceIcon details={selection} />
            {selection.label}
          {:else}
            {browser.i18n.getMessage("searchService") || "Search Service"}
          {/if}
        </div>
        <div style="font-size: 10px;" slot="chevron-icon">🮦</div>
      </SvelteSelect>
    </div>
  </Row>

  <hr />

  <Row>
    <Label>{browser.i18n.getMessage("enable") || "Enable"}</Label>
    <Checkbox
      checked={serviceOptions.enabled}
      onChange={e => {
        serviceOptions.enabled = e.target.checked
        options.set(_options)
      }}
    />
  </Row>

  <div style={!serviceOptions.enabled && "pointer-events: none;opacity: 0.4;user-select: none;"}>
    <Row>
      <Label>{browser.i18n.getMessage("showInPopup") || "Show in popup"}</Label>
      <Checkbox
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
    </Row>

    <Row>
      <Label>
        <a href={frontendWebsite} style="text-decoration: underline;" target="_blank" rel="noopener noreferrer">
          {browser.i18n.getMessage("frontend") || "Frontend"}
        </a>
      </Label>
      <div dir="ltr" on:click={() => (hideFrontendSelection = true)} on:keydown={null}>
        <SvelteSelect
          clearable={false}
          dir="ltr"
          class="svelte_select"
          value={serviceOptions.frontend}
          showChevron
          on:change={e => {
            serviceOptions.frontend = e.detail.value
            options.set(_options)
            hideFrontendSelection = false
          }}
          on:pointerup={() => (hideServiceSelection = false)}
          on:focus={() => (hideFrontendSelection = true)}
          on:blur={() => (hideFrontendSelection = false)}
          items={[
            ...frontendEntries.map(([frontendId, frontend]) => ({
              value: frontendId,
              label: frontend.name,
            })),
          ]}
        >
          <div class="slot" slot="item" let:item>
            <FrontendIcon details={item} {selectedService} />
            {item.label}
          </div>
          <div class="slot" slot="selection" let:selection>
            {#if !hideFrontendSelection}
              <FrontendIcon details={selection} {selectedService} />
              {selection.label}
            {:else}
              {browser.i18n.getMessage("search_frontend") || "Search Frontend"}
            {/if}
          </div>
          <div style="font-size: 10px;" slot="chevron-icon">🮦</div>
        </SvelteSelect>
      </div>
    </Row>

    <RedirectType {selectedService} />

    <Row>
      <Label>{browser.i18n.getMessage("unsupportedIframesHandling") || "Unsupported embeds handling"}</Label>
      <Select
        value={serviceOptions.unsupportedUrls}
        onChange={e => {
          serviceOptions.unsupportedUrls = e.target.options[e.target.options.selectedIndex].value
          options.set(_options)
        }}
        values={[
          { value: "bypass", name: browser.i18n.getMessage("bypass") || "Bypass" },
          { value: "block", name: browser.i18n.getMessage("block") || "Block" },
        ]}
      />
    </Row>

    <div style={_options.redirectOnlyInIncognito && "pointer-events: none;opacity: 0.4;user-select: none;"}>
      <Row>
        <Label>{browser.i18n.getMessage("redirectOnlyInIncognito") || "Redirect Only in Incognito"}</Label>
        <Checkbox
          checked={serviceOptions.redirectOnlyInIncognito}
          onChange={e => {
            serviceOptions.redirectOnlyInIncognito = e.target.checked
            options.set(_options)
          }}
        />
      </Row>
    </div>

    {#if selectedService == "search"}
      <Row>
        <Label>{browser.i18n.getMessage("redirectGoogle") || "Redirect Google"}</Label>
        <Checkbox
          checked={serviceOptions.redirectGoogle}
          onChange={e => {
            serviceOptions.redirectGoogle = e.target.checked
            options.set(_options)
          }}
        />
      </Row>
      <Row>
        <Label>
          {@html browser.i18n.getMessage("searchHint") ||
            `Set LibRedirect as Default Search Engine. For how to do in chromium browsers, click
          <a
            href="https://libredirect.github.io/docs.html#search_engine_chromium"
            target="_blank"
            rel="noopener noreferrer"
            >here
          </a>.`}
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
    --border-focused: none;
    --width: 210px;
    --background: var(--bg-secondary);
    --list-background: var(--bg-secondary);
    --item-is-active-bg: grey;
    --item-hover-bg: grey;
    --item-is-active-color: var(--text);
    --list-max-height: 400px;
    --padding: 0 0 0 10px;
    --item-color: var(--text);
  }
  :global(.svelte_select .slot) {
    display: flex;
    justify-content: start;
    align-items: center;
  }

  :global(.svelte_select img, .svelte_select svg) {
    margin-right: 10px;
    margin-left: 0;
    height: 26px;
    width: 26px;
    color: var(--text);
  }

  :global(.svelte_select .disabled) {
    opacity: 0.4;
  }
</style>
