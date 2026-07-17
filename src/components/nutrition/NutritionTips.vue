<script setup lang="ts">
import Card from '@/components/ui/Card.vue'

defineProps<{
  tips: string[]
}>()
</script>

<template>
  <Card variant="warm" padding="lg">
    <h3 class="tips-title">
      <i class="fa-solid fa-lightbulb" aria-hidden="true" />
      Consejos de bienestar
    </h3>

    <ul class="tips-list" role="list">
      <li v-for="(tip, index) in tips" :key="index" class="tips-item">
        <i class="fa-solid fa-check tips-item__icon" aria-hidden="true" />
        <span class="tips-item__text">{{ tip }}</span>
      </li>
    </ul>
  </Card>
</template>

<style scoped>
.tips-title {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--clr-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  gap: 0.75rem;
}

.tips-item {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
}

.tips-item__icon {
  font-size: 0.625rem;
  color: var(--clr-primary);
  margin-top: 0.375rem;
  flex-shrink: 0;
}

.tips-item__text {
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  color: var(--clr-text);
}
</style>
