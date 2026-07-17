<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'default' | 'elevated' | 'warm' | 'surface'
    padding?: 'none' | 'sm' | 'md' | 'lg'
    interactive?: boolean
  }>(),
  {
    variant: 'default',
    padding: 'md',
    interactive: false,
  },
)
</script>

<template>
  <div
    :class="[
      'ds-card',
      `ds-card--${variant}`,
      `ds-card--pad-${padding}`,
      { 'ds-card--interactive': interactive },
    ]"
  >
    <slot />
  </div>
</template>

<style scoped>
.ds-card {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
  transition:
    box-shadow var(--duration-normal) var(--ease-default),
    transform var(--duration-normal) var(--ease-default);
}

/* ── Variants ── */
.ds-card--elevated {
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
}
.ds-card--elevated:hover {
  box-shadow: var(--shadow-lg);
}

.ds-card--warm {
  background: var(--clr-primary-light);
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

.ds-card--surface {
  background: var(--clr-surface-alt);
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xs);
}

/* ── Interactive ── */
.ds-card--interactive {
  cursor: pointer;
}
.ds-card--interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* ── Padding ── */
.ds-card--pad-none {
  padding: 0;
}
.ds-card--pad-sm {
  padding: var(--space-3);
}
.ds-card--pad-md {
  padding: var(--space-5);
}
.ds-card--pad-lg {
  padding: var(--space-7);
}
</style>
