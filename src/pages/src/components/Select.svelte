<script>
  export let values
  export let value
  export let onChange
  export let ariaLabel
</script>

<select  bind:value={value} on:change={onChange} aria-label={ariaLabel} on:change on:contextmenu on:input>
  {#each values as option}
    <option value={option.value}>{option.name}</option>
  {/each}
</select>

<style>
  select {
    font-weight: bold;
    box-sizing: border-box;
    border-style: solid;
    border-color: #767676;
    color: var(--text);
    font-size: 16px;
    padding: 8px;
    background-color: var(--bg-secondary);
    border: none;
    margin: 0;
    max-width: 500px;
    border-radius: 3px;
  }

  select:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
