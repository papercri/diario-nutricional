<script setup lang="ts">
defineProps<{
  title?: string
  message: string
  retryable?: boolean
}>()

defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="ds-error-state" role="alert">
    <div class="ds-error-state__icon" aria-hidden="true">!</div>
    <h3 class="ds-error-state__title">{{ title ?? 'Algo salió mal' }}</h3>
    <p class="ds-error-state__message">{{ message }}</p>
    <button v-if="retryable" class="ds-error-state__retry" @click="$emit('retry')">
      Reintentar
    </button>
  </div>
</template>

<style scoped>
.ds-error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-10) var(--space-6);
  gap: var(--space-3);
}

.ds-error-state__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--clr-danger-light);
  color: var(--clr-danger);
  font-weight: var(--weight-bold);
  font-size: var(--text-lg);
}

.ds-error-state__title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--clr-text);
  margin: 0;
}

.ds-error-state__message {
  font-size: var(--text-sm);
  color: var(--clr-text-muted);
  max-width: 20rem;
  margin: 0;
}

.ds-error-state__retry {
  margin-top: var(--space-2);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--clr-primary);
  background: var(--clr-primary-faint);
  border: 1px solid var(--clr-primary-light);
  border-radius: var(--radius-md);
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background var(--duration-normal) var(--ease-default);
}
.ds-error-state__retry:hover {
  background: var(--clr-primary-light);
}
</style>
