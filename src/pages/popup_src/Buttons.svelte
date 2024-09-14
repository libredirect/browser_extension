<script>
  const browser = window.browser || window.chrome

  import Row from "./components/Row.svelte"
  import Label from "../components/Label.svelte"
  import CopyIcon from "../icons/CopyIcon.svelte"
  import RedirectToOriginalIcon from "../icons/RedirectToOriginalIcon.svelte"
  import RedirectIcon from "../icons/RedirectIcon.svelte"
  import SwitchInstanceIcon from "../icons/SwitchInstanceIcon.svelte"
  import SettingsIcon from "../icons/SettingsIcon.svelte"
  import { options, config } from "./stores"
  import { onDestroy } from "svelte"
  import servicesHelper, { computeFrontend } from "../../assets/javascripts/services"
  import Switch from "./components/Switch.svelte"
  import AutoPickIcon from "../icons/AutoPickIcon.svelte"
  import utils from "../../assets/javascripts/utils"

  let _options
  let _config
  let autoPicking = false

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
  let frontend
  let service
  browser.tabs.query({ active: true, currentWindow: true }, async tabs => {
    if (tabs[0].url) {
      url = new URL(tabs[0].url)
      servicesHelper.switchInstance(url).then(r => (switchInstance = r))
      servicesHelper.reverse(url).then(r => (redirectToOriginal = r))
      servicesHelper.redirectAsync(url, "main_frame", null, null, false, true).then(r => (redirect = r))
      servicesHelper.computeService(url).then(r => (currentService = r))
      const computed = servicesHelper.computeFrontend(url)
      if (computed) {
        ;({ service, frontend } = computed)
      }
    }
  })

  async function removeInstance() {
    const i = _options[frontend].findIndex(instance => url.href.startsWith(instance))
    _options[frontend].splice(i, 1)
    options.set(_options)
    const newUrl = await servicesHelper.switchInstance(url, service)
    browser.tabs.update({ url: newUrl })
  }

  async function autoPick() {
    autoPicking = true
    const redirects = await utils.getList(_options)
    const instances = utils.randomInstances(redirects[frontend]["clearnet"], 5)
    const pings = await Promise.all([
      ...instances.map(async instance => {
        return [instance, await utils.ping(instance)]
      }),
    ])
    pings.sort((a, b) => a[1] - b[1])
    _options[frontend].push(pings[0][0])
    options.set(_options)
    autoPicking = false
  }

  async function addAutoPickInstance() {
    await autoPick()
    const newUrl = await servicesHelper.switchInstance(url)
    browser.tabs.update({ url: newUrl })
  }

  async function removeAndAutoPickInstance() {
    const i = _options[frontend].findIndex(instance => url.href.startsWith(instance))
    _options[frontend].splice(i, 1)
    options.set(_options)
    await autoPick()
    const newUrl = await servicesHelper.switchInstance(url, service)
    browser.tabs.update({ url: newUrl })
  }
  $: console.log("autoPicking", autoPicking)
</script>

<div class={document.body.dir}>
  {#if redirect}
    <Row
      class="interactive"
      on:click={() => {
        browser.tabs.query({ active: true, currentWindow: true }, tabs => {
          browser.runtime.sendMessage({ message: "redirect", tabId: tabs[0].id }, () => {
            browser.tabs.update({ url: redirect })
          })
        })
      }}
    >
      <Label>{browser.i18n.getMessage("redirect") || "Redirect"}</Label>
      <RedirectIcon />
    </Row>
  {/if}

  {#if service && frontend}
    {#if _options[frontend].length > 1}
      {#if switchInstance}
        <Row
          class="interactive"
          on:click={async () =>
            browser.tabs.update({ url: switchInstance }, () => {
              window.close()
            })}
        >
          <Label>{browser.i18n.getMessage("switchInstance") || "Switch Instance"}</Label>
          <SwitchInstanceIcon />
        </Row>
      {/if}
      <Row class="interactive" on:click={removeInstance}>
        <Label>
          {browser.i18n.getMessage("remove") || "Remove"}
          +
          {browser.i18n.getMessage("switchInstance") || "Switch Instance"}
        </Label>
        <SwitchInstanceIcon />
      </Row>
    {:else}
      <Row class={"interactive " + (autoPicking ? "disabled" : "")} on:click={removeAndAutoPickInstance}>
        <Label>
          {browser.i18n.getMessage("remove") || "Remove"}
          +
          {browser.i18n.getMessage("autoPickInstance") || "Auto Pick Instance"}
        </Label>
        <AutoPickIcon />
      </Row>
      <Row class={"interactive " + (autoPicking ? "disabled" : "")} on:click={addAutoPickInstance}>
        <Label>
          {browser.i18n.getMessage("autoPickInstance") || "Auto Pick Instance"}
        </Label>
        <AutoPickIcon />
      </Row>
    {/if}
  {/if}

  {#if redirectToOriginal}
    <Row class="interactive" on:click={() => servicesHelper.copyRaw(url)}>
      <Label>{browser.i18n.getMessage("copyOriginal") || "Copy Original"}</Label>
      <CopyIcon />
    </Row>
    <Row
      class="interactive"
      on:click={() => {
        browser.tabs.query({ active: true, currentWindow: true }, tabs => {
          browser.runtime.sendMessage({ message: "reverse", tabId: tabs[0].id }, () => {
            browser.tabs.update({ url: redirectToOriginal })
          })
        })
      }}
    >
      <Label>{browser.i18n.getMessage("redirectToOriginal" || "Redirect to Original")}</Label>
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

  <Row
    class="interactive"
    on:click={() =>
      browser.tabs.create({ url: browser.runtime.getURL("pages/options/index.html") }, () => {
        window.close()
      })}
  >
    <Label>{browser.i18n.getMessage("settings")}</Label>
    <SettingsIcon />
  </Row>
</div>

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

  :global(.disabled) {
    cursor: not-allowed;
    opacity: 0.5;
  }

  :global(.disabled:hover) {
    color: var(--text);
    cursor: not-allowed;
  }

  :global(.disabled:active) {
    transform: none;
  }

  :global(img, svg) {
    margin-right: 5px;
    margin-left: 0;
    height: 26px;
    width: 26px;
    color: var(--text);
  }

  :global(.rtl img, .rtl svg) {
    margin-right: 0;
    margin-left: 5px;
  }
</style>
