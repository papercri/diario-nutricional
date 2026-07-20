<script setup lang="ts">
import Card from '@/components/ui/Card.vue'

defineProps<{
  tips: string[]
}>()
</script>

<template>
  <Card variant="warm" padding="md">
    <h3 class="tips-title">
      <font-awesome-icon :icon="['fas', 'lightbulb']" aria-hidden="true" />
      Consejos
    </h3>

    <ul class="tips-list" role="list">
      <li v-for="(tip, index) in tips" :key="index" class="tips-item">
        <font-awesome-icon :icon="['fas', 'check']" class="tips-item__icon" aria-hidden="true" />
        <span class="tips-item__text">{{ tip }}</span>
      </li>
    </ul>
  </Card>
</template>

<style scoped>
.tips-title {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--clr-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.tips-title i {
  color: var(--clr-secondary);
}

.tips-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.tips-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.tips-item__icon {
  font-size: 0.5rem;
  color: var(--clr-primary);
  margin-top: 0.25rem;
  flex-shrink: 0;
}

.tips-item__text {
  font-size: var(--text-xs);
  line-height: var(--leading-normal);
  color: var(--clr-text);
}
</style>
