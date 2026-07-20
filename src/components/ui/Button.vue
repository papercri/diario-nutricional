<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent'
    size?: 'xs' | 'sm' | 'md' | 'lg'
    disabled?: boolean
    loading?: boolean
    type?: 'button' | 'submit' | 'reset'
    icon?: string | [string, string]
    iconPosition?: 'start' | 'end'
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    type: 'button',
    iconPosition: 'start',
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="['ds-btn', `ds-btn--${variant}`, `ds-btn--${size}`, { 'ds-btn--loading': loading }]"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="ds-btn__spinner" aria-hidden="true" />
    <font-awesome-icon
      v-else-if="icon && iconPosition === 'start'"
      :icon="icon"
      aria-hidden="true"
    />
    <slot />
    <font-awesome-icon v-if="icon && iconPosition === 'end'" :icon="icon" aria-hidden="true" />
  </button>
</template>

<style scoped>
.ds-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-weight: var(--weight-semibold);
  line-height: var(--leading-normal);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background var(--duration-normal) var(--ease-default),
    box-shadow var(--duration-normal) var(--ease-default),
    transform var(--duration-fast) var(--ease-default),
    opacity var(--duration-normal) var(--ease-default);
  user-select: none;
}
.ds-btn:active {
  transform: scale(0.98);
}
.ds-btn:focus-visible {
  outline: 2px solid var(--clr-primary);
  outline-offset: 2px;
}
.ds-btn:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
  transform: none;
}

/* ── Sizes ── */
.ds-btn--xs {
  font-size: var(--text-xs);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
}
.ds-btn--sm {
  font-size: var(--text-sm);
  padding: 0.375rem 0.75rem;
}
.ds-btn--md {
  font-size: var(--text-sm);
  padding: 0.5rem 1rem;
}
.ds-btn--lg {
  font-size: var(--text-base);
  padding: 0.625rem 1.25rem;
}

/* ── Variants ── */
.ds-btn--primary {
  background: var(--clr-primary);
  color: var(--clr-text-inverse);
  box-shadow: var(--shadow-sm);
}
.ds-btn--primary:hover {
  background: var(--clr-primary-hover);
}
.ds-btn--primary:active {
  background: var(--clr-primary-active);
}

.ds-btn--secondary {
  background: var(--clr-surface-alt);
  color: var(--clr-text-muted);
  border: 1px solid var(--clr-border);
}
.ds-btn--secondary:hover {
  background: var(--clr-border);
}

.ds-btn--ghost {
  background: transparent;
  color: var(--clr-text-muted);
}
.ds-btn--ghost:hover {
  color: var(--clr-accent);
  background: rgba(196, 112, 75, 0.08);
}

.ds-btn--danger {
  background: transparent;
  color: var(--clr-text-faint);
}
.ds-btn--danger:hover {
  color: var(--clr-danger);
  background: var(--clr-danger-light);
}

.ds-btn--accent {
  background: var(--clr-accent);
  color: var(--clr-text-inverse);
  box-shadow: var(--shadow-sm);
}
.ds-btn--accent:hover {
  background: var(--clr-accent-hover);
}

/* ── Loading spinner ── */
.ds-btn--loading {
  pointer-events: none;
}
.ds-btn__spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ds-spin 0.6s linear infinite;
}

@keyframes ds-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ds-btn:active {
    transform: none;
  }
  .ds-btn__spinner {
    animation: none;
  }
}
</style>
