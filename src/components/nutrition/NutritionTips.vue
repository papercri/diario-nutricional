<script setup lang="ts">
import Card from '@/components/ui/Card.vue'

defineProps<{
  tips: string[]
}>()
</script>

<template>
  <Card variant="warm" padding="md">
    <h3 class="ds-section-title">
      <font-awesome-icon
        :icon="['fas', 'lightbulb']"
        class="ds-section-title--secondary"
        aria-hidden="true"
      />
      Consejos
    </h3>

    <ul class="ds-list-reset" role="list">
      <li v-for="(tip, index) in tips" :key="index" class="tips-item">
        <font-awesome-icon :icon="['fas', 'check']" class="tips-item__icon" aria-hidden="true" />
        <span class="tips-item__text">{{ tip }}</span>
      </li>
    </ul>
  </Card>
</template>

<style scoped>
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
