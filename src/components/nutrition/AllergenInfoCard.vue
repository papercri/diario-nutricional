<script setup lang="ts">
import Card from '@/components/ui/Card.vue'
import type { AllergenType } from '@/types/nutrition'

defineProps<{
  allergens: AllergenType[]
}>()

const ALLERGEN_MAP: Record<AllergenType, { label: string; icon: [string, string] }> = {
  gluten: { label: 'Gluten', icon: ['fas', 'bread-slice'] },
  milk: { label: 'Lácteos', icon: ['fas', 'glass-water'] },
  eggs: { label: 'Huevo', icon: ['fas', 'egg'] },
  peanuts: { label: 'Cacahuetes', icon: ['fas', 'bowl-food'] },
  tree_nuts: { label: 'Frutos secos', icon: ['fas', 'bowl-food'] },
  soy: { label: 'Soja', icon: ['fas', 'leaf'] },
  fish: { label: 'Pescado', icon: ['fas', 'fish'] },
  shellfish: { label: 'Marisco', icon: ['fas', 'shrimp'] },
  sesame: { label: 'Sésamo', icon: ['fas', 'droplet'] },
  mustard: { label: 'Mostaza', icon: ['fas', 'droplet'] },
  celery: { label: 'Apio', icon: ['fas', 'carrot'] },
  lupin: { label: 'Altramuces', icon: ['fas', 'seedling'] },
}
</script>

<template>
  <Card variant="elevated" padding="md">
    <div class="allergen-card">
      <div class="allergen-card__section">
        <h4 class="allergen-card__title">
          <font-awesome-icon :icon="['fas', 'triangle-exclamation']" aria-hidden="true" />
          Alérgenos
        </h4>
        <div v-if="allergens.length > 0" class="allergen-card__list">
          <span
            v-for="allergen in allergens"
            :key="allergen"
            class="allergen-card__item"
          >
            <font-awesome-icon
              :icon="ALLERGEN_MAP[allergen].icon"
              aria-hidden="true"
              class="allergen-card__item-icon"
            />
            {{ ALLERGEN_MAP[allergen].label }}
          </span>
        </div>
        <p v-else class="allergen-card__empty">No se detectaron alérgenos principales</p>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.allergen-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.allergen-card__section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.allergen-card__title {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--clr-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.allergen-card__list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.allergen-card__item {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  background: var(--clr-accent-light);
  color: var(--clr-accent);
}

.allergen-card__item-icon {
  font-size: 0.7rem;
}

.allergen-card__empty {
  font-size: var(--text-xs);
  color: var(--clr-text-faint);
  margin: 0;
}
</style>
