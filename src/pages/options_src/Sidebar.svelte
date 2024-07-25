<script>
  import { page } from "./stores"
  import GeneralIcon from "../icons/GeneralIcon.svelte"
  import ServicesIcon from "../icons/ServicesIcon.svelte"
  import AboutIcon from "../icons/AboutIcon.svelte"
</script>

<div>
  <a href="#general" on:click={() => page.set("general")} style={$page == "general" && "color: var(--active);"}>
    <GeneralIcon style="margin-right: 5px" />
    <span data-localise="__MSG_general__">General</span>
  </a>
  <a href="#services" on:click={() => page.set("services")} style={$page == "services" && "color: var(--active);"}>
    <ServicesIcon style="margin-right: 5px" />
    <span data-localise="__MSG_services__">Services</span>
  </a>
  <a href="https://libredirect.github.io" target="_blank" rel="noopener noreferrer">
    <AboutIcon style="margin-right: 5px" />
    <span data-localise="__MSG_about__">About</span>
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
  }

  a:hover {
    color: var(--active);
  }
</style>
