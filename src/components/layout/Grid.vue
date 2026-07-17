<script setup lang="ts">
withDefaults(
  defineProps<{
    columns?: 1 | 2 | 3 | 4
    gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    minItemWidth?: string
    responsive?: boolean
  }>(),
  {
    columns: 2,
    gap: 'md',
    responsive: true,
  },
)
</script>

<template>
  <div
    :class="[
      'ds-grid',
      `ds-grid--gap-${gap}`,
      {
        [`ds-grid--cols-${columns}`]: !responsive && !minItemWidth,
      },
    ]"
    :style="
      minItemWidth
        ? { gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}, 1fr))` }
        : undefined
    "
  >
    <slot />
  </div>
</template>

<style scoped>
.ds-grid {
  display: grid;
  width: 100%;
}

/* ── Gap ── */
.ds-grid--gap-xs {
  gap: var(--space-1);
}
.ds-grid--gap-sm {
  gap: var(--space-2);
}
.ds-grid--gap-md {
  gap: var(--space-4);
}
.ds-grid--gap-lg {
  gap: var(--space-6);
}
.ds-grid--gap-xl {
  gap: var(--space-8);
}

/* ── Static columns (non-responsive) ── */
.ds-grid--cols-1 {
  grid-template-columns: 1fr;
}
.ds-grid--cols-2 {
  grid-template-columns: repeat(2, 1fr);
}
.ds-grid--cols-3 {
  grid-template-columns: repeat(3, 1fr);
}
.ds-grid--cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

/* ── Responsive (default) ── */
@media (max-width: 640px) {
  .ds-grid:not([style]) {
    grid-template-columns: 1fr;
  }
}
</style>
