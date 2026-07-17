<script setup lang="ts">
withDefaults(
  defineProps<{
    direction?: 'row' | 'column'
    gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    align?: 'start' | 'center' | 'end' | 'stretch'
    justify?: 'start' | 'center' | 'end' | 'between'
    wrap?: boolean
  }>(),
  {
    direction: 'column',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
    wrap: false,
  },
)
</script>

<template>
  <div
    :class="[
      'ds-stack',
      `ds-stack--${direction}`,
      `ds-stack--gap-${gap}`,
      `ds-stack--align-${align}`,
      `ds-stack--justify-${justify}`,
      { 'ds-stack--wrap': wrap },
    ]"
  >
    <slot />
  </div>
</template>

<style scoped>
.ds-stack {
  display: flex;
}

/* ── Direction ── */
.ds-stack--column {
  flex-direction: column;
}
.ds-stack--row {
  flex-direction: row;
}

/* ── Gap ── */
.ds-stack--gap-xs {
  gap: var(--space-1);
}
.ds-stack--gap-sm {
  gap: var(--space-2);
}
.ds-stack--gap-md {
  gap: var(--space-4);
}
.ds-stack--gap-lg {
  gap: var(--space-6);
}
.ds-stack--gap-xl {
  gap: var(--space-8);
}

/* ── Alignment ── */
.ds-stack--align-start {
  align-items: flex-start;
}
.ds-stack--align-center {
  align-items: center;
}
.ds-stack--align-end {
  align-items: flex-end;
}
.ds-stack--align-stretch {
  align-items: stretch;
}

/* ── Justify ── */
.ds-stack--justify-start {
  justify-content: flex-start;
}
.ds-stack--justify-center {
  justify-content: center;
}
.ds-stack--justify-end {
  justify-content: flex-end;
}
.ds-stack--justify-between {
  justify-content: space-between;
}

/* ── Wrap ── */
.ds-stack--wrap {
  flex-wrap: wrap;
}
</style>
