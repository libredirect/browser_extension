<script>
  const browser = window.browser || window.chrome

  import url from "./url"
  import GeneralIcon from "../icons/GeneralIcon.svelte"
  import ServicesIcon from "../icons/ServicesIcon.svelte"
  import AboutIcon from "../icons/AboutIcon.svelte"
</script>

<div>
  <a href="#general" style={$url.hash == "#general" && "color: var(--active);"}>
    <GeneralIcon class="margin margin_{document.body.dir}" />
    {browser.i18n.getMessage("general") || "General"}
  </a>
  <a href="#services" style={$url.hash == "#services" && "color: var(--active);"}>
    <ServicesIcon class="margin margin_{document.body.dir}" />
    {browser.i18n.getMessage("services") || "Services"}
  </a>
  <a href="https://libredirect.github.io" target="_blank" rel="noopener noreferrer">
    <AboutIcon class="margin margin_{document.body.dir}" />
    {browser.i18n.getMessage("about") || "About"}
  </a>
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    margin: 0 20px;
  }

  a {
    display: flex;
    align-items: center;
    font-size: 18px;
    text-decoration: none;
    color: var(--text);
    transition: 0.1s;
    margin: 10px;
    min-width: max-content;
  }

  a:hover {
    color: var(--active);
  }

  @media (max-width: 1250px) {
    div {
      flex-direction: row;
      justify-content: center;
      margin: 0;
    }
  }

  @media (max-width: 715px) {
    a {
      margin: 5px;
    }
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
