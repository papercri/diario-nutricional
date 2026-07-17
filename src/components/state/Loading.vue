<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    text?: string
  }>(),
  {
    size: 'md',
    text: '',
  },
)
</script>

<template>
  <div class="ds-loading" role="status" aria-live="polite">
    <div :class="['ds-loading__spinner', `ds-loading__spinner--${size}`]" />
    <p v-if="text" class="ds-loading__text">{{ text }}</p>
  </div>
</template>

<style scoped>
.ds-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-8);
}

.ds-loading__spinner {
  border: 3px solid var(--clr-border);
  border-top-color: var(--clr-primary);
  border-radius: 50%;
  animation: ds-spin 0.8s linear infinite;
}

.ds-loading__spinner--sm {
  width: 1.25rem;
  height: 1.25rem;
  border-width: 2px;
}
.ds-loading__spinner--md {
  width: 2rem;
  height: 2rem;
}
.ds-loading__spinner--lg {
  width: 3rem;
  height: 3rem;
  border-width: 4px;
}

.ds-loading__text {
  font-size: var(--text-sm);
  color: var(--clr-text-faint);
  margin: 0;
}

@keyframes ds-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ds-loading__spinner {
    animation: none;
  }
}
</style>
