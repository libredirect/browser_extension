<span>
  <slot></slot>
</span>

<style>
  span {
    font-size: 18px;
  }

  span :global(a) {
    color: var(--text);
    text-decoration: none;
  }

  span :global(a:hover) {
    text-decoration: underline;
  }
</style>
