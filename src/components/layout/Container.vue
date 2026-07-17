<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    padding?: boolean
    centered?: boolean
  }>(),
  {
    size: 'md',
    padding: true,
    centered: true,
  },
)
</script>

<template>
  <div
    :class="[
      'ds-container',
      `ds-container--${size}`,
      {
        'ds-container--pad': padding,
        'ds-container--centered': centered,
      },
    ]"
  >
    <slot />
  </div>
</template>

<style scoped>
.ds-container {
  width: 100%;
}

.ds-container--centered {
  margin-left: auto;
  margin-right: auto;
}

/* ── Max widths ── */
.ds-container--sm {
  max-width: 32rem;
}
.ds-container--md {
  max-width: 42rem;
}
.ds-container--lg {
  max-width: 56rem;
}
.ds-container--xl {
  max-width: 72rem;
}
.ds-container--full {
  max-width: 100%;
}

/* ── Padding ── */
.ds-container--pad {
  padding-left: var(--space-4);
  padding-right: var(--space-4);
}

@media (min-width: 640px) {
  .ds-container--pad {
    padding-left: var(--space-6);
    padding-right: var(--space-6);
  }
}

@media (min-width: 1024px) {
  .ds-container--pad {
    padding-left: var(--space-8);
    padding-right: var(--space-8);
  }
}
</style>
