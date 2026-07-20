<script setup lang="ts">
import type { Ingredient } from '@/types/nutrition'
import Card from '@/components/ui/Card.vue'

defineProps<{
  ingredients: Ingredient[]
}>()
</script>

<template>
  <Card variant="surface" padding="md">
    <h3 class="ds-section-title">
      <font-awesome-icon :icon="['fas', 'list-check']" class="ds-section-title--accent" aria-hidden="true" />
      Ingredientes
    </h3>

    <ul class="ds-list-reset" role="list">
      <li v-for="(ingredient, index) in ingredients" :key="index" class="ingredient-item">
        <span class="ingredient-item__name">{{ ingredient.name }}</span>
        <span class="ingredient-item__meta">
          {{ ingredient.quantity }} · {{ ingredient.calories }} kcal
        </span>
      </li>
    </ul>
  </Card>
</template>

<style scoped>
.ingredient-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.375rem 0;
  border-bottom: 1px solid var(--clr-border-subtle);
}

.ingredient-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.ingredient-item:first-child {
  padding-top: 0;
}

.ingredient-item__name {
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  color: var(--clr-text);
}

.ingredient-item__meta {
  font-size: 0.625rem;
  color: var(--clr-text-faint);
  white-space: nowrap;
}
</style>
