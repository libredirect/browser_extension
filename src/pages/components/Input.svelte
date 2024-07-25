<script>
  export let value
</script>

<input
  {...$$props}
  bind:value
  on:blur
  on:change
  on:click
  on:contextmenu
  on:focus
  on:keydown
  on:keypress
  on:keyup
  on:mouseover
  on:mouseenter
  on:mouseleave
  on:paste
  on:input
/>

<style>
  input {
    font-weight: bold;
    box-sizing: border-box;
    color: var(--text);
    font-size: 16px;
    padding: 8px;
    background-color: var(--bg-secondary);
    border: none;
    margin: 0;
    width: 400px;
    border-radius: 3px;
    outline-color: var(--active);
  }

  input:focus {
    outline-color: var(--active);
  }
</style>
