<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?:
      'default' | 'primary' | 'accent' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
    size?: 'xs' | 'sm' | 'md'
    dot?: boolean
  }>(),
  {
    variant: 'default',
    size: 'sm',
    dot: false,
  },
)
</script>

<template>
  <span
    :class="['ds-badge', `ds-badge--${variant}`, `ds-badge--${size}`, { 'ds-badge--dot': dot }]"
  >
    <span v-if="dot" class="ds-badge__dot" aria-hidden="true" />
    <slot />
  </span>
</template>

<style scoped>
.ds-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-family: var(--font-display);
  font-weight: var(--weight-semibold);
  line-height: var(--leading-none);
  white-space: nowrap;
  border-radius: var(--radius-full);
}

/* ── Sizes ── */
.ds-badge--xs {
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
.ds-badge--sm {
  font-size: var(--text-xs);
  padding: 0.15rem 0.5rem;
  letter-spacing: 0.01em;
}
.ds-badge--md {
  font-size: var(--text-sm);
  padding: 0.25rem 0.625rem;
}

/* ── Variants ── */
.ds-badge--default {
  background: var(--clr-surface-alt);
  color: var(--clr-text-muted);
}
.ds-badge--primary {
  background: var(--clr-primary-light);
  color: var(--clr-primary);
}
.ds-badge--accent {
  background: var(--clr-accent-light);
  color: var(--clr-accent);
}
.ds-badge--secondary {
  background: var(--clr-secondary-light);
  color: var(--clr-secondary-hover);
}
.ds-badge--success {
  background: var(--clr-success-light);
  color: var(--clr-success);
}
.ds-badge--warning {
  background: var(--clr-warning-light);
  color: var(--clr-secondary-hover);
}
.ds-badge--danger {
  background: var(--clr-danger-light);
  color: var(--clr-danger);
}
.ds-badge--info {
  background: var(--clr-info-light);
  color: var(--clr-info);
}

/* ── Dot indicator ── */
.ds-badge__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}
</style>
