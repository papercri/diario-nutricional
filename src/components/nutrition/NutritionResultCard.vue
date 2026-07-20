<script setup lang="ts">
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'

defineProps<{
  mealName: string
  estimatedCalories: number
  isVegan?: boolean
  isVegetarian?: boolean
}>()

defineEmits<{
  addToDaily: []
}>()

</script>

<template>
  <Card variant="elevated" padding="md">
    <div class="result-card">
      <div class="result-card__main">
        <div class="result-card__info">
          <div class="result-card__header">
            <font-awesome-icon :icon="['fas', 'utensils']" class="result-card__icon" aria-hidden="true" />
            <h3 class="result-card__meal-name">{{ mealName }}</h3>
            <span v-if="isVegan" class="result-card__diet-badge result-card__diet-badge--vegan" title="Vegano" aria-label="Vegano">
              <font-awesome-icon :icon="['fas', 'seedling']" aria-hidden="true" />
              Vegano
            </span>
            <span v-else-if="isVegetarian" class="result-card__diet-badge result-card__diet-badge--vegetarian" title="Vegetariano" aria-label="Vegetariano">
              <font-awesome-icon :icon="['fas', 'leaf']" aria-hidden="true" />
              Veggie
            </span>
          </div>
          <div class="result-card__calories">
            <span class="result-card__calories-value">{{ estimatedCalories }}</span>
            <span class="result-card__calories-unit">kcal</span>
          </div>
        </div>
        <Button variant="accent" size="sm" :icon="['fas', 'plus']" @click="$emit('addToDaily')">
          Añadir
        </Button>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.result-card__main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.result-card__info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.result-card__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.result-card__icon {
  font-size: var(--text-sm);
  color: var(--clr-accent);
  flex-shrink: 0;
}

.result-card__meal-name {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--clr-text);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.result-card__diet-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-full);
  font-size: 0.65rem;
  font-weight: var(--weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  flex-shrink: 0;
  white-space: nowrap;
}

.result-card__diet-badge--vegan {
  background: var(--clr-success-light);
  color: var(--clr-success);
}

.result-card__diet-badge--vegetarian {
  background: var(--clr-primary-light);
  color: var(--clr-primary);
}

.result-card__calories {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
}

.result-card__calories-value {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--clr-primary);
  line-height: 1;
}

.result-card__calories-unit {
  font-size: var(--text-xs);
  color: var(--clr-text-muted);
  font-weight: var(--weight-medium);
}
</style>
