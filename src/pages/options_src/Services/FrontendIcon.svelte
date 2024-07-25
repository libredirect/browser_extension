<script>
  import { onDestroy } from "svelte"
  export let details
  import { config, options } from "../stores"
  let _options
  let _config

  const unsubscribeOptions = options.subscribe(val => (_options = val))
  const unsubscribeConfig = config.subscribe(val => (_config = val))
  onDestroy(() => {
    unsubscribeOptions()
    unsubscribeConfig()
  })

  let theme
  $: if (_options) {
    if (_options.theme == "dark") {
      theme = "dark"
    } else if (_options.theme == "light") {
      theme = "light"
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      theme = "dark"
    } else {
      theme = "light"
    }
  }

  export let selectedService

  $: imageType = _config.services[selectedService].frontends[details.value].imageType
</script>

{#if imageType}
  {#if imageType == "svgMono"}
    {#if theme == "dark"}
      <img src={`/assets/images/${details.value}-icon-light.svg`} alt={details.label} />
    {:else}
      <img src={`/assets/images/${details.value}-icon.svg`} alt={details.label} />
    {/if}
  {:else}
    <img src={`/assets/images/${details.value}-icon.${imageType}`} alt={details.label} />
  {/if}
{/if}
