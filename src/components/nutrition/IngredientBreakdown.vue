<script setup lang="ts">
import type { Ingredient } from '@/types/nutrition'
import Card from '@/components/ui/Card.vue'

defineProps<{
  ingredients: Ingredient[]
}>()
</script>

<template>
  <Card variant="surface" padding="lg">
    <h3 class="ingredient-title">
      <i class="fa-solid fa-list-check" aria-hidden="true" />
      Ingredientes estimados
    </h3>

    <ul class="ingredient-list" role="list">
      <li v-for="(ingredient, index) in ingredients" :key="index" class="ingredient-item">
        <div class="ingredient-item__info">
          <span class="ingredient-item__name">{{ ingredient.name }}</span>
          <span class="ingredient-item__quantity">{{ ingredient.quantity }}</span>
        </div>
        <span class="ingredient-item__calories">{{ ingredient.calories }} kcal</span>
      </li>
    </ul>
  </Card>
</template>

<style scoped>
.ingredient-title {
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

.ingredient-title i {
  color: var(--clr-accent);
}

.ingredient-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.ingredient-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--clr-border-subtle);
}

.ingredient-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.ingredient-item:first-child {
  padding-top: 0;
}

.ingredient-item__info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.ingredient-item__name {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--clr-text);
}

.ingredient-item__quantity {
  font-size: var(--text-xs);
  color: var(--clr-text-faint);
}

.ingredient-item__calories {
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--clr-primary);
  white-space: nowrap;
}
</style>
