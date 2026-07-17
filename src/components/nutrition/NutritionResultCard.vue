<script setup lang="ts">
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'

defineProps<{
  mealName: string
  estimatedCalories: number
  confidence: 'low' | 'medium' | 'high'
}>()

const confidenceConfig: Record<string, { label: string; variant: 'warning' | 'info' | 'success' }> =
  {
    low: { label: 'Estimación baja', variant: 'warning' },
    medium: { label: 'Estimación media', variant: 'info' },
    high: { label: 'Estimación alta', variant: 'success' },
  }
</script>

<template>
  <Card variant="elevated" padding="lg">
    <div class="result-card">
      <div class="result-card__header">
        <i class="fa-solid fa-utensils result-card__icon" aria-hidden="true" />
        <h3 class="result-card__meal-name">{{ mealName }}</h3>
      </div>

      <div class="result-card__calories">
        <span class="result-card__calories-value">{{ estimatedCalories }}</span>
        <span class="result-card__calories-unit">kcal</span>
      </div>

      <Badge :variant="confidenceConfig[confidence]?.variant ?? 'default'" size="sm" dot>
        {{ confidenceConfig[confidence]?.label ?? confidence }}
      </Badge>
    </div>
  </Card>
</template>

<style scoped>
.result-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
}

.result-card__header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.result-card__icon {
  font-size: 1.25rem;
  color: var(--clr-accent);
}

.result-card__meal-name {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--clr-text);
  margin: 0;
}

.result-card__calories {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
}

.result-card__calories-value {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--clr-primary);
  line-height: 1;
}

.result-card__calories-unit {
  font-size: var(--text-sm);
  color: var(--clr-text-muted);
  font-weight: var(--weight-medium);
}
</style>
