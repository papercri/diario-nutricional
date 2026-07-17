<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string
    title: string
    description?: string
  }>(),
  {
    icon: '',
  },
)
</script>

<template>
  <div class="ds-empty-state">
    <i v-if="icon" :class="icon" class="ds-empty-state__icon" aria-hidden="true" />
    <h3 class="ds-empty-state__title">{{ title }}</h3>
    <p v-if="description" class="ds-empty-state__desc">{{ description }}</p>
    <div v-if="$slots.action" class="ds-empty-state__action">
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped>
.ds-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-12) var(--space-6);
  gap: var(--space-3);
}

.ds-empty-state__icon {
  font-size: 2.5rem;
  color: var(--clr-text-faint);
  margin-bottom: var(--space-2);
}

.ds-empty-state__title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--clr-text-muted);
  margin: 0;
}

.ds-empty-state__desc {
  font-size: var(--text-sm);
  color: var(--clr-text-faint);
  max-width: 20rem;
  margin: 0;
}

.ds-empty-state__action {
  margin-top: var(--space-2);
}
</style>
